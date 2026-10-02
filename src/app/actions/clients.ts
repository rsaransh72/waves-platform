"use server";

import { revalidatePath } from "next/cache";
import { requirePlatformAdmin } from "@/lib/supabase-server";
import { changeMemberRole, inviteMember, removeMember, resendInvite, sendPasswordReset } from "@/lib/client-members";
import { siteOrigin } from "@/lib/site-origin";
import { amountError } from "@/lib/india";

export type ActionResult = { error?: string; message?: string };

const SUBSCRIPTION_STATUSES = ["active", "trialing", "past_due", "canceled"] as const;
const PAYMENT_METHODS = ["bank_transfer", "upi", "cheque", "cash", "card", "other"] as const;

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

function parseDate(value: string, label: string) {
  const date = new Date(`${value}T12:00:00.000Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(date.getTime())) throw new Error(`Enter a valid ${label}.`);
  return date;
}

function parseAmount(value: number, label: string, allowZero = true) {
  const problem = Number.isFinite(value) ? amountError(String(Math.round(value * 100) / 100), { allowZero }) : "Enter the amount in rupees.";
  if (problem) throw new Error(`${label[0].toUpperCase()}${label.slice(1)}: ${problem}`);
  return Math.round(value * 100) / 100;
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
        payment_reference: input.reference.trim().slice(0, 100) || null,
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

export async function inviteClientUser(organizationId: string, email: string, role: string): Promise<ActionResult> {
  return asAdmin(organizationId, async ({ user }) => ({ message: await inviteMember(organizationId, email, role, user, await siteOrigin()) }));
}

export async function resendClientInvite(organizationId: string, userId: string): Promise<ActionResult> {
  return asAdmin(organizationId, async ({ user }) => ({ message: await resendInvite(organizationId, userId, user, await siteOrigin()) }));
}

export async function sendClientPasswordReset(organizationId: string, userId: string): Promise<ActionResult> {
  return asAdmin(organizationId, async ({ user }) => ({ message: await sendPasswordReset(organizationId, userId, user, await siteOrigin()) }));
}

export async function changeClientUserRole(organizationId: string, userId: string, role: string): Promise<ActionResult> {
  return asAdmin(organizationId, async ({ user }) => ({ message: await changeMemberRole(organizationId, userId, role, user) }));
}

export async function removeClientUser(organizationId: string, userId: string): Promise<ActionResult> {
  return asAdmin(organizationId, async ({ user }) => ({ message: await removeMember(organizationId, userId, user) }));
}
