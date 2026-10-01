"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { requirePlatformAdmin } from "@/lib/supabase-server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export type ActionResult = { error?: string; message?: string };

const MEMBER_ROLES = ["admin", "teacher", "staff"] as const;
const SUBSCRIPTION_STATUSES = ["active", "trialing", "past_due", "canceled"] as const;
const PAYMENT_METHODS = ["bank_transfer", "upi", "cheque", "cash", "card", "other"] as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Admin = Awaited<ReturnType<typeof requirePlatformAdmin>>;

// Wraps every action so failures come back as a message the UI can show,
// instead of a thrown error that production builds replace with a generic one.
async function asAdmin(organizationId: string, work: (admin: Admin) => Promise<ActionResult | void>): Promise<ActionResult> {
  try {
    const admin = await requirePlatformAdmin();
    const result = await work(admin);
    revalidatePath(`/admin/organizations/${organizationId}`);
    return result ?? {};
  } catch (error) {
    console.error("Client management action failed:", error);
    return { error: error instanceof Error ? error.message : "The action could not be completed." };
  }
}

async function siteOrigin() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

function parseDate(value: string, label: string) {
  const date = new Date(`${value}T12:00:00.000Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(date.getTime())) throw new Error(`Enter a valid ${label}.`);
  return date;
}

function parseAmount(value: number, label: string, allowZero = true) {
  if (!Number.isFinite(value) || value < 0 || (!allowZero && value === 0)) throw new Error(`Enter a valid ${label}.`);
  return Math.round(value * 100) / 100;
}

async function logMemberEvent(admin: Admin, organizationId: string, action: string, details: Record<string, unknown>) {
  await admin.supabase.from("audit_logs").insert([{
    action,
    resource_type: "organization_members",
    organization_id: organizationId,
    actor_id: admin.user.id,
    actor_email: admin.user.email,
    details,
  }]);
}

async function getOrganization(admin: Admin, organizationId: string) {
  const { data, error } = await admin.supabase
    .from("organizations")
    .select("id, name, type, status")
    .eq("id", organizationId)
    .single();
  if (error || !data) throw new Error("Client not found.");
  return data;
}

export async function setClientStatus(organizationId: string, status: "active" | "suspended"): Promise<ActionResult> {
  return asAdmin(organizationId, async ({ supabase }) => {
    if (status !== "active" && status !== "suspended") throw new Error("Unsupported status.");
    const { error } = await supabase.from("organizations").update({ status }).eq("id", organizationId);
    if (error) throw error;
    return { message: status === "suspended" ? "Client suspended. Their users can no longer sign in to the product." : "Client reactivated." };
  });
}

export async function saveSubscription(organizationId: string, input: {
  id?: string;
  planName: string;
  amount: number;
  status: string;
  termEnd: string;
}): Promise<ActionResult> {
  return asAdmin(organizationId, async (admin) => {
    const planName = input.planName.trim();
    if (!planName || planName.length > 100) throw new Error("Enter a plan name of at most 100 characters.");
    if (!SUBSCRIPTION_STATUSES.includes(input.status as typeof SUBSCRIPTION_STATUSES[number])) throw new Error("Choose a subscription status.");
    const fields = {
      plan_name: planName,
      amount: parseAmount(input.amount, "annual amount"),
      status: input.status,
      next_billing_date: parseDate(input.termEnd, "term end date").toISOString(),
    };

    if (input.id) {
      const { error } = await admin.supabase.from("subscriptions").update(fields).eq("id", input.id).eq("organization_id", organizationId);
      if (error) throw error;
      return { message: "Subscription updated." };
    }

    const organization = await getOrganization(admin, organizationId);
    const { error } = await admin.supabase.from("subscriptions").insert({
      ...fields,
      organization_id: organizationId,
      organization_name: organization.name,
    });
    if (error) throw error;
    return { message: "Subscription created." };
  });
}

export async function renewSubscription(organizationId: string, subscriptionId: string, years: number, createInvoice: boolean): Promise<ActionResult> {
  return asAdmin(organizationId, async (admin) => {
    if (![1, 2, 3].includes(years)) throw new Error("Choose a renewal period of 1 to 3 years.");
    const { data: subscription, error } = await admin.supabase
      .from("subscriptions")
      .select("*")
      .eq("id", subscriptionId)
      .eq("organization_id", organizationId)
      .single();
    if (error || !subscription) throw new Error("Subscription not found.");

    // A lapsed term restarts from today rather than back-dating the renewal.
    const currentEnd = subscription.next_billing_date ? new Date(subscription.next_billing_date) : new Date();
    const newEnd = new Date(Math.max(currentEnd.getTime(), Date.now()));
    newEnd.setUTCFullYear(newEnd.getUTCFullYear() + years);

    const { error: updateError } = await admin.supabase
      .from("subscriptions")
      .update({ next_billing_date: newEnd.toISOString(), status: "active", reminder_sent_at: null })
      .eq("id", subscriptionId);
    if (updateError) throw updateError;

    const { error: organizationError } = await admin.supabase
      .from("organizations")
      .update({ status: "active" })
      .eq("id", organizationId)
      .in("status", ["suspended", "trial"]);
    if (organizationError) throw organizationError;

    if (createInvoice && Number(subscription.amount) > 0) {
      const dueDate = new Date();
      dueDate.setUTCDate(dueDate.getUTCDate() + 7);
      const { error: invoiceError } = await admin.supabase.from("invoices").insert({
        organization_id: organizationId,
        organization_name: subscription.organization_name,
        subscription_id: subscriptionId,
        amount: Number(subscription.amount) * years,
        status: "pending",
        due_date: dueDate.toISOString(),
        description: `${subscription.plan_name} renewal, ${years} year${years > 1 ? "s" : ""} (term ends ${newEnd.toISOString().slice(0, 10)})`,
      });
      if (invoiceError) {
        return { error: `Term renewed to ${newEnd.toISOString().slice(0, 10)}, but the invoice could not be created: ${invoiceError.message}` };
      }
      return { message: "Term renewed and a pending renewal invoice was created." };
    }
    return { message: "Term renewed." };
  });
}

export async function createInvoice(organizationId: string, input: {
  amount: number;
  dueDate: string;
  description: string;
  subscriptionId?: string;
}): Promise<ActionResult> {
  return asAdmin(organizationId, async (admin) => {
    const organization = await getOrganization(admin, organizationId);
    const description = input.description.trim();
    if (!description || description.length > 300) throw new Error("Enter a description of at most 300 characters.");
    const { error } = await admin.supabase.from("invoices").insert({
      organization_id: organizationId,
      organization_name: organization.name,
      subscription_id: input.subscriptionId || null,
      amount: parseAmount(input.amount, "invoice amount", false),
      status: "pending",
      due_date: parseDate(input.dueDate, "due date").toISOString(),
      description,
    });
    if (error) throw error;
    return { message: "Invoice created." };
  });
}

export async function recordInvoicePayment(organizationId: string, invoiceId: string, input: {
  method: string;
  reference: string;
  paidOn: string;
}): Promise<ActionResult> {
  return asAdmin(organizationId, async ({ supabase }) => {
    if (!PAYMENT_METHODS.includes(input.method as typeof PAYMENT_METHODS[number])) throw new Error("Choose a payment method.");
    const { data, error } = await supabase
      .from("invoices")
      .update({
        status: "paid",
        paid_at: parseDate(input.paidOn, "payment date").toISOString(),
        payment_method: input.method,
        payment_reference: input.reference.trim() || null,
      })
      .eq("id", invoiceId)
      .eq("organization_id", organizationId)
      .neq("status", "paid")
      .select("id");
    if (error) throw error;
    if (!data?.length) throw new Error("Invoice not found or already paid.");
    return { message: "Payment recorded." };
  });
}

export async function inviteClientUser(organizationId: string, emailInput: string, role: string): Promise<ActionResult> {
  return asAdmin(organizationId, async (admin) => {
    const email = emailInput.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(email)) throw new Error("Enter a valid email address.");
    if (!MEMBER_ROLES.includes(role as typeof MEMBER_ROLES[number])) throw new Error("Choose a role.");
    const organization = await getOrganization(admin, organizationId);

    const authAdmin = createSupabaseAdminClient();
    const { data: invitation, error: inviteError } = await authAdmin.auth.admin.inviteUserByEmail(email, {
      data: { organization_id: organizationId, organization_type: organization.type, organization_name: organization.name },
      redirectTo: `${await siteOrigin()}/school/accept-invite`,
    });
    if (inviteError) {
      if (inviteError.code === "email_exists" || /already been registered/i.test(inviteError.message)) {
        throw new Error("That email already has an account. Each account can belong to one client only.");
      }
      throw inviteError;
    }

    const { error: memberError } = await admin.supabase.from("organization_members").insert({
      organization_id: organizationId,
      user_id: invitation.user.id,
      role,
    });
    if (memberError) {
      await authAdmin.auth.admin.deleteUser(invitation.user.id);
      throw memberError.code === "23505" ? new Error("That user already belongs to this client.") : memberError;
    }

    await logMemberEvent(admin, organizationId, "member.invited", { email, role, user_id: invitation.user.id });
    return { message: `Invitation sent to ${email}.` };
  });
}

async function getMemberEmail(organizationId: string, admin: Admin, userId: string) {
  const { data: membership, error } = await admin.supabase
    .from("organization_members")
    .select("user_id, role")
    .eq("organization_id", organizationId)
    .eq("user_id", userId)
    .single();
  if (error || !membership) throw new Error("User is not a member of this client.");

  const { data, error: userError } = await createSupabaseAdminClient().auth.admin.getUserById(userId);
  if (userError || !data.user?.email) throw new Error("The user's account could not be found.");
  return { membership, user: data.user, email: data.user.email };
}

export async function resendClientInvite(organizationId: string, userId: string): Promise<ActionResult> {
  return asAdmin(organizationId, async (admin) => {
    const { user, email } = await getMemberEmail(organizationId, admin, userId);
    if (user.email_confirmed_at) throw new Error("This user has already accepted the invitation. Send a password reset instead.");
    const organization = await getOrganization(admin, organizationId);
    const { error } = await createSupabaseAdminClient().auth.admin.inviteUserByEmail(email, {
      data: { organization_id: organizationId, organization_type: organization.type, organization_name: organization.name },
      redirectTo: `${await siteOrigin()}/school/accept-invite`,
    });
    if (error) throw error;
    await logMemberEvent(admin, organizationId, "member.invite_resent", { email, user_id: userId });
    return { message: `Invitation re-sent to ${email}.` };
  });
}

export async function sendClientPasswordReset(organizationId: string, userId: string): Promise<ActionResult> {
  return asAdmin(organizationId, async (admin) => {
    const { email } = await getMemberEmail(organizationId, admin, userId);
    const { error } = await admin.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${await siteOrigin()}/account/reset-password`,
    });
    if (error) throw error;
    await logMemberEvent(admin, organizationId, "member.password_reset_sent", { email, user_id: userId });
    return { message: `Password reset email sent to ${email}.` };
  });
}

async function countAdmins(admin: Admin, organizationId: string) {
  const { count, error } = await admin.supabase
    .from("organization_members")
    .select("user_id", { count: "exact", head: true })
    .eq("organization_id", organizationId)
    .in("role", ["owner", "admin"]);
  if (error) throw error;
  return count ?? 0;
}

export async function changeClientUserRole(organizationId: string, userId: string, role: string): Promise<ActionResult> {
  return asAdmin(organizationId, async (admin) => {
    if (!MEMBER_ROLES.includes(role as typeof MEMBER_ROLES[number])) throw new Error("Choose a role.");
    const { membership, email } = await getMemberEmail(organizationId, admin, userId);
    if (["owner", "admin"].includes(membership.role) && role !== "admin" && await countAdmins(admin, organizationId) <= 1) {
      throw new Error("A client must keep at least one administrator.");
    }
    const { error } = await admin.supabase
      .from("organization_members")
      .update({ role })
      .eq("organization_id", organizationId)
      .eq("user_id", userId);
    if (error) throw error;
    await logMemberEvent(admin, organizationId, "member.role_changed", { email, user_id: userId, from: membership.role, to: role });
    return { message: `${email} is now ${role}.` };
  });
}

export async function removeClientUser(organizationId: string, userId: string): Promise<ActionResult> {
  return asAdmin(organizationId, async (admin) => {
    const { membership, email } = await getMemberEmail(organizationId, admin, userId);
    if (["owner", "admin"].includes(membership.role) && await countAdmins(admin, organizationId) <= 1) {
      throw new Error("A client must keep at least one administrator. Add another administrator first.");
    }
    const { error } = await admin.supabase
      .from("organization_members")
      .delete()
      .eq("organization_id", organizationId)
      .eq("user_id", userId);
    if (error) throw error;
    await logMemberEvent(admin, organizationId, "member.removed", { email, user_id: userId, role: membership.role });
    return { message: `${email} no longer has access.` };
  });
}
