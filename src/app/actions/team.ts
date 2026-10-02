"use server";

import { revalidatePath } from "next/cache";
import { requirePlatformAdmin } from "@/lib/supabase-server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { siteOrigin } from "@/lib/site-origin";
import { friendlyAuthEmailError } from "@/lib/client-members";

export type TeamActionResult = { error?: string; message?: string };

// Only these roles grant access to the admin console (see is_platform_admin()).
const TEAM_ROLES = ["superadmin", "admin"] as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Admin = Awaited<ReturnType<typeof requirePlatformAdmin>>;

async function run(work: (admin: Admin) => Promise<string>): Promise<TeamActionResult> {
  try {
    const admin = await requirePlatformAdmin();
    const message = await work(admin);
    revalidatePath("/admin/users");
    return { message };
  } catch (error) {
    console.error("Team action failed:", error);
    const message = typeof error === "object" && error !== null && "message" in error ? String((error as { message: unknown }).message) : "The action could not be completed.";
    return { error: message };
  }
}

async function logTeamEvent(admin: Admin, action: string, details: Record<string, unknown>) {
  await admin.supabase.from("audit_logs").insert([{ action, resource_type: "team_members", actor_id: admin.user.id, actor_email: admin.user.email, details }]);
}

async function getMember(admin: Admin, memberId: string) {
  const { data, error } = await admin.supabase.from("team_members").select("id, name, email, role, status").eq("id", memberId).single();
  if (error || !data) throw new Error("Team member not found.");
  return data;
}

async function activeSuperadmins(admin: Admin) {
  const { count } = await admin.supabase.from("team_members").select("id", { count: "exact", head: true }).eq("role", "superadmin").eq("status", "active");
  return count ?? 0;
}

function assertNotSelf(admin: Admin, email: string, action: string) {
  if (email.toLowerCase() === admin.user.email?.toLowerCase()) throw new Error(`You cannot ${action} your own account. Ask another super administrator.`);
}

// Adds someone to the platform team and emails them an invitation to set a password.
export async function inviteTeamMember(input: { name: string; email: string; role: string }) {
  return run(async (admin) => {
    const name = input.name.trim().slice(0, 120);
    const email = input.email.trim().toLowerCase();
    if (!name) throw new Error("Enter the person's name.");
    if (!EMAIL_PATTERN.test(email)) throw new Error("Enter a valid email address.");
    if (!TEAM_ROLES.includes(input.role as typeof TEAM_ROLES[number])) throw new Error("Choose a role.");

    const { error } = await admin.supabase.from("team_members").insert({ name, email, role: input.role, status: "active" });
    if (error) throw error.code === "23505" ? new Error("That email is already on the platform team.") : error;

    const { error: inviteError } = await createSupabaseAdminClient().auth.admin.inviteUserByEmail(email, {
      data: { full_name: name },
      redirectTo: `${await siteOrigin()}/account/reset-password`,
    });
    const alreadyRegistered = inviteError && (inviteError.code === "email_exists" || /already been registered/i.test(inviteError.message));
    if (inviteError && !alreadyRegistered) {
      await admin.supabase.from("team_members").delete().eq("email", email);
      throw friendlyAuthEmailError(inviteError) ?? inviteError;
    }
    await logTeamEvent(admin, "team.invited", { email, role: input.role });
    return alreadyRegistered
      ? `${email} already has an account and can now sign in to the admin console.`
      : `Invitation sent to ${email}.`;
  });
}

export async function sendTeamPasswordReset(memberId: string) {
  return run(async (admin) => {
    const member = await getMember(admin, memberId);
    const { error } = await createSupabaseAdminClient().auth.resetPasswordForEmail(member.email, { redirectTo: `${await siteOrigin()}/account/reset-password` });
    if (error) throw friendlyAuthEmailError(error) ?? error;
    return `Password reset email sent to ${member.email}.`;
  });
}

export async function updateTeamMember(memberId: string, input: { role?: string; status?: string }) {
  return run(async (admin) => {
    const member = await getMember(admin, memberId);
    assertNotSelf(admin, member.email, "change");
    if (input.role && !TEAM_ROLES.includes(input.role as typeof TEAM_ROLES[number])) throw new Error("Choose a role.");
    if (input.status && !["active", "suspended"].includes(input.status)) throw new Error("Choose a status.");
    const losesSuperadmin = member.role === "superadmin" && member.status === "active" && (input.role === "admin" || input.status === "suspended");
    if (losesSuperadmin && await activeSuperadmins(admin) <= 1) throw new Error("There must always be at least one active super administrator.");

    const { error } = await admin.supabase.from("team_members").update(input).eq("id", memberId);
    if (error) throw error;
    return input.status === "suspended" ? `${member.email} can no longer sign in to the admin console.` : `${member.email} updated.`;
  });
}

export async function removeTeamMember(memberId: string) {
  return run(async (admin) => {
    const member = await getMember(admin, memberId);
    assertNotSelf(admin, member.email, "remove");
    if (member.role === "superadmin" && member.status === "active" && await activeSuperadmins(admin) <= 1) {
      throw new Error("There must always be at least one active super administrator.");
    }
    const { error } = await admin.supabase.from("team_members").delete().eq("id", memberId);
    if (error) throw error;
    await logTeamEvent(admin, "team.removed", { email: member.email });
    return `${member.email} removed from the platform team.`;
  });
}
