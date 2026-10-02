import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

// User management for a client organization, shared by the platform admin console
// and a school's own Users & Access page. Callers must authorize the actor for the
// organization before calling; these functions use the service-role key.

export const MEMBER_ROLES = ["admin", "teacher", "staff"] as const;
export type MemberRole = typeof MEMBER_ROLES[number];

export type ClientMember = {
  userId: string;
  role: string;
  email: string | null;
  name: string | null;
  accountStatus: "active" | "invited" | "unknown";
  lastSignInAt: string | null;
};

export type Actor = { id: string; email?: string | null };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function assertRole(role: string): asserts role is MemberRole {
  if (!MEMBER_ROLES.includes(role as MemberRole)) throw new Error("Choose a role.");
}

async function getOrganization(organizationId: string) {
  const { data, error } = await createSupabaseAdminClient()
    .from("organizations")
    .select("id, name, type")
    .eq("id", organizationId)
    .single();
  if (error || !data) throw new Error("Client not found.");
  return data;
}

async function logMemberEvent(organizationId: string, actor: Actor, action: string, details: Record<string, unknown>) {
  const { error } = await createSupabaseAdminClient().from("audit_logs").insert([{
    action,
    resource_type: "organization_members",
    organization_id: organizationId,
    actor_id: actor.id,
    actor_email: actor.email ?? null,
    details,
  }]);
  if (error) console.error("Could not record member audit event:", error);
}

async function getMember(organizationId: string, userId: string) {
  const authAdmin = createSupabaseAdminClient();
  const { data: membership, error } = await authAdmin
    .from("organization_members")
    .select("user_id, role")
    .eq("organization_id", organizationId)
    .eq("user_id", userId)
    .single();
  if (error || !membership) throw new Error("User is not a member of this organization.");

  const { data, error: userError } = await authAdmin.auth.admin.getUserById(userId);
  if (userError || !data.user?.email) throw new Error("The user's account could not be found.");
  return { membership, user: data.user, email: data.user.email };
}

async function countAdmins(organizationId: string) {
  const { count, error } = await createSupabaseAdminClient()
    .from("organization_members")
    .select("user_id", { count: "exact", head: true })
    .eq("organization_id", organizationId)
    .in("role", ["owner", "admin"]);
  if (error) throw error;
  return count ?? 0;
}

export async function listMembers(organizationId: string): Promise<ClientMember[]> {
  const authAdmin = createSupabaseAdminClient();
  const { data: memberships, error } = await authAdmin
    .from("organization_members")
    .select("user_id, role, created_at")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: true });
  if (error) throw error;

  return Promise.all((memberships ?? []).map(async (membership): Promise<ClientMember> => {
    const { data } = await authAdmin.auth.admin.getUserById(membership.user_id);
    const user = data.user;
    const metadata = (user?.user_metadata ?? {}) as Record<string, unknown>;
    const name = [metadata.full_name, metadata.name].find((value) => typeof value === "string" && value.trim()) as string | undefined;
    return {
      userId: membership.user_id,
      role: membership.role,
      email: user?.email ?? null,
      name: name ?? null,
      accountStatus: !user ? "unknown" : user.email_confirmed_at ? "active" : "invited",
      lastSignInAt: user?.last_sign_in_at ?? null,
    };
  }));
}

export async function inviteMember(organizationId: string, emailInput: string, role: string, actor: Actor, origin: string) {
  const email = emailInput.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email)) throw new Error("Enter a valid email address.");
  assertRole(role);
  const organization = await getOrganization(organizationId);

  const authAdmin = createSupabaseAdminClient();
  const { data: invitation, error: inviteError } = await authAdmin.auth.admin.inviteUserByEmail(email, {
    data: { organization_id: organizationId, organization_type: organization.type, organization_name: organization.name },
    redirectTo: `${origin}/school/accept-invite`,
  });
  if (inviteError) {
    if (inviteError.code === "email_exists" || /already been registered/i.test(inviteError.message)) {
      throw new Error("That email already has an account. Each account can belong to one organization only.");
    }
    throw friendlyAuthEmailError(inviteError) ?? inviteError;
  }

  const { error: memberError } = await authAdmin.from("organization_members").insert({
    organization_id: organizationId,
    user_id: invitation.user.id,
    role,
  });
  if (memberError) {
    await authAdmin.auth.admin.deleteUser(invitation.user.id);
    throw memberError.code === "23505" ? new Error("That user already belongs to this organization.") : memberError;
  }

  await logMemberEvent(organizationId, actor, "member.invited", { email, role, user_id: invitation.user.id });
  return `Invitation sent to ${email}.`;
}

export async function resendInvite(organizationId: string, userId: string, actor: Actor, origin: string) {
  const { user, email } = await getMember(organizationId, userId);
  if (user.email_confirmed_at) throw new Error("This user has already accepted the invitation. Send a password reset instead.");
  const organization = await getOrganization(organizationId);
  const { error } = await createSupabaseAdminClient().auth.admin.inviteUserByEmail(email, {
    data: { organization_id: organizationId, organization_type: organization.type, organization_name: organization.name },
    redirectTo: `${origin}/school/accept-invite`,
  });
  if (error) throw friendlyAuthEmailError(error) ?? error;
  await logMemberEvent(organizationId, actor, "member.invite_resent", { email, user_id: userId });
  return `Invitation re-sent to ${email}.`;
}

export async function sendPasswordReset(organizationId: string, userId: string, actor: Actor, origin: string) {
  const { email } = await getMember(organizationId, userId);
  const { error } = await createSupabaseAdminClient().auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/account/reset-password`,
  });
  if (error) throw friendlyAuthEmailError(error) ?? error;
  await logMemberEvent(organizationId, actor, "member.password_reset_sent", { email, user_id: userId });
  return `Password reset email sent to ${email}.`;
}

export async function changeMemberRole(organizationId: string, userId: string, role: string, actor: Actor) {
  assertRole(role);
  const { membership, email } = await getMember(organizationId, userId);
  if (["owner", "admin"].includes(membership.role) && role !== "admin" && await countAdmins(organizationId) <= 1) {
    throw new Error("An organization must keep at least one administrator.");
  }
  const { error } = await createSupabaseAdminClient()
    .from("organization_members")
    .update({ role })
    .eq("organization_id", organizationId)
    .eq("user_id", userId);
  if (error) throw error;
  await logMemberEvent(organizationId, actor, "member.role_changed", { email, user_id: userId, from: membership.role, to: role });
  return `${email} is now ${role}.`;
}

export async function removeMember(organizationId: string, userId: string, actor: Actor) {
  const { membership, email } = await getMember(organizationId, userId);
  if (["owner", "admin"].includes(membership.role) && await countAdmins(organizationId) <= 1) {
    throw new Error("An organization must keep at least one administrator. Add another administrator first.");
  }
  const { error } = await createSupabaseAdminClient()
    .from("organization_members")
    .delete()
    .eq("organization_id", organizationId)
    .eq("user_id", userId);
  if (error) throw error;
  await logMemberEvent(organizationId, actor, "member.removed", { email, user_id: userId, role: membership.role });
  return `${email} no longer has access.`;
}

// Supabase's built-in mailer sends only a few emails per hour; say so plainly instead
// of a generic failure, and point to the fix (custom SMTP in Supabase Auth settings).
export function friendlyAuthEmailError(error: unknown): Error | null {
  const code = typeof error === "object" && error !== null && "code" in error ? String((error as { code?: unknown }).code) : "";
  const status = typeof error === "object" && error !== null && "status" in error ? Number((error as { status?: unknown }).status) : 0;
  if (code === "over_email_send_rate_limit" || status === 429) {
    return new Error("The email could not be sent: the hourly email limit was reached. Try again later, or connect your own email provider (SMTP) in Supabase → Authentication → Emails to remove the limit.");
  }
  return null;
}
