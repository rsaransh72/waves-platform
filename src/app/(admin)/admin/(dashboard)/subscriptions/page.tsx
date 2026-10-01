import { createServerSupabaseClient } from "@/lib/supabase-server";
import { SubscriptionList } from "@/components/admin/SubscriptionList";

export const revalidate = 0;

export default async function SubscriptionsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: subscriptions, error } = await supabase
    .from("subscriptions")
    .select("*, organizations(name, email, type, status)")
    .order("created_at", { ascending: false });

  if (error) console.error("Error fetching subscriptions:", error);

  return <SubscriptionList initialData={subscriptions || []} />;
}
