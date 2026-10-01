import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

type Subscription = {
  id: string;
  organization_id: string;
  organization_name: string;
  plan_name: string;
  status: string;
  next_billing_date: string | null;
  reminder_sent_at: string | null;
  organizations: { email: string | null; status: string } | null;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let adminClient;
  try {
    adminClient = createSupabaseAdminClient();
  } catch (error) {
    console.error("Subscription lifecycle job is not configured:", error);
    return NextResponse.json({ error: "Subscription lifecycle job is not configured." }, { status: 503 });
  }

  const now = new Date();
  const reminderCutoff = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const { data, error } = await adminClient
    .from("subscriptions")
    .select("id, organization_id, organization_name, plan_name, status, next_billing_date, reminder_sent_at, organizations(email, status)")
    .in("status", ["active", "trialing", "past_due"]);

  if (error) {
    console.error("Subscription lifecycle query failed:", error);
    return NextResponse.json({ error: "Could not load subscription terms. Apply the subscription lifecycle migration." }, { status: 503 });
  }

  let remindersSent = 0;
  let organizationsSuspended = 0;
  const failures: string[] = [];
  const subscriptions = (data ?? []) as unknown as Subscription[];

  for (const subscription of subscriptions) {
    if (!subscription.next_billing_date) continue;
    const termEnd = new Date(subscription.next_billing_date);

    if (termEnd <= now) {
      const hasUnexpiredSubscription = subscriptions.some((candidate) =>
        candidate.id !== subscription.id
        && candidate.organization_id === subscription.organization_id
        && ["active", "trialing"].includes(candidate.status)
        && candidate.next_billing_date !== null
        && new Date(candidate.next_billing_date) > now
      );
      const { error: subscriptionError } = await adminClient
        .from("subscriptions")
        .update({ status: "past_due" })
        .eq("id", subscription.id)
        .in("status", ["active", "trialing"]);
      if (subscriptionError) failures.push(`${subscription.id}: subscription expiry update failed`);
      if (hasUnexpiredSubscription) continue;

      const { data: suspendedOrganization, error: organizationError } = await adminClient
        .from("organizations")
        .update({ status: "suspended" })
        .eq("id", subscription.organization_id)
        .in("status", ["active", "trial"])
        .select("id")
        .maybeSingle();
      if (organizationError) failures.push(`${subscription.id}: organization suspension failed`);
      else if (suspendedOrganization) organizationsSuspended += 1;
      continue;
    }

    if (termEnd > reminderCutoff || subscription.reminder_sent_at) continue;
    const email = subscription.organizations?.email;
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    if (!email || !apiKey || !from) {
      failures.push(`${subscription.id}: recipient or Resend configuration is missing`);
      continue;
    }

    const schoolName = escapeHtml(subscription.organization_name);
    const planName = escapeHtml(subscription.plan_name);
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from,
        to: email,
        subject: `Subscription renewal due in 7 days: ${subscription.organization_name}`,
        html: `<p>Hello ${schoolName},</p><p>Your ${planName} subscription is due to end on ${termEnd.toLocaleDateString("en-US", { timeZone: "UTC" })}.</p><p>Please contact your Waves account representative to renew and avoid interruption to your service.</p>`,
      }),
    });
    if (!response.ok) {
      failures.push(`${subscription.id}: reminder delivery failed (${response.status})`);
      continue;
    }

    const { error: reminderError } = await adminClient
      .from("subscriptions")
      .update({ reminder_sent_at: now.toISOString() })
      .eq("id", subscription.id)
      .is("reminder_sent_at", null);
    if (reminderError) failures.push(`${subscription.id}: reminder delivery was not recorded`);
    else remindersSent += 1;
  }

  return NextResponse.json({
    remindersSent,
    organizationsSuspended,
    failures,
    ranAt: now.toISOString(),
  }, { status: failures.length ? 500 : 200 });
}