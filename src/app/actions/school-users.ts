"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { changeMemberRole, inviteMember, removeMember, resendInvite, sendPasswordReset } from "@/lib/client-members";
import { siteOrigin } from "@/lib/site-origin";

export type SchoolActionResult = { error?: string; message?: string };

// Resolves the caller's school from their own session, so a school administrator can
// only ever manage users of the school they belong to.
async function asSchoolAdmin(work: (context: { organizationId: string; actor: { id: string; email?: string | null } }) => Promise<string>): Promise<SchoolActionResult> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Your session has ended. Sign in again.");
    const [{ data: organizationId }, { data: role }] = await Promise.all([
      supabase.rpc("get_auth_organization_id"),
      supabase.rpc("get_auth_school_role"),
    ]);
    if (!organizationId || role !== "admin") throw new Error("Only school administrators can manage users.");

    const message = await work({ organizationId, actor: { id: user.id, email: user.email } });
    revalidatePath("/school/users");
    return { message };
  } catch (error) {
    console.error("School user action failed:", error);
    return { error: error instanceof Error ? error.message : "The action could not be completed." };
  }
}

function assertNotSelf(actorId: string, userId: string, action: string) {
  if (actorId === userId) throw new Error(`You cannot ${action} your own account. Ask another administrator.`);
}

export async function inviteSchoolUser(email: string, role: string) {
  return asSchoolAdmin(async ({ organizationId, actor }) => inviteMember(organizationId, email, role, actor, await siteOrigin()));
}

export async function resendSchoolInvite(userId: string) {
  return asSchoolAdmin(async ({ organizationId, actor }) => resendInvite(organizationId, userId, actor, await siteOrigin()));
}

export async function sendSchoolPasswordReset(userId: string) {
  return asSchoolAdmin(async ({ organizationId, actor }) => sendPasswordReset(organizationId, userId, actor, await siteOrigin()));
}

export async function changeSchoolUserRole(userId: string, role: string) {
  return asSchoolAdmin(async ({ organizationId, actor }) => {
    assertNotSelf(actor.id, userId, "change the role of");
    return changeMemberRole(organizationId, userId, role, actor);
  });
}

export async function removeSchoolUser(userId: string) {
  return asSchoolAdmin(async ({ organizationId, actor }) => {
    assertNotSelf(actor.id, userId, "remove");
    return removeMember(organizationId, userId, actor);
  });
}
