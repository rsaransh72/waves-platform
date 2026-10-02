import { createServerSupabaseClient } from "@/lib/supabase-server";
import { SubscriptionList } from "@/components/admin/SubscriptionList";

export const revalidate = 0;

function currentTime() {
  return Date.now();
}

export default async function SubscriptionsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: subscriptions, error } = await supabase
    .from("subscriptions")
    .select("id, organization_id, organization_name, plan_name, amount, status, next_billing_date, organizations(name, status)")
    .order("next_billing_date", { ascending: true });

  if (error) console.error("Error fetching subscriptions:", error);

  return <SubscriptionList initialData={(subscriptions ?? []) as never} now={currentTime()} />;
}
