import { AutomationList } from "@/components/admin/AutomationList";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function AutomationsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: rules } = await supabase
    .from("automation_rules")
    .select("*")
    .order("created_at", { ascending: false });

  return <AutomationList initialData={rules || []} />;
}
