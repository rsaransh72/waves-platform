import { createServerSupabaseClient } from "@/lib/supabase-server";
import { LeadList } from "@/components/admin/LeadList";

export const revalidate = 0;

export default async function LeadsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) console.error("Error fetching leads:", error);

  return (
    <LeadList initialData={leads || []} />
  );
}
