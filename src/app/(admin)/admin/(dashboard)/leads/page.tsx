import { createServerSupabaseClient } from "@/lib/supabase-server";
import { LeadPipeline } from "@/components/admin/LeadPipeline";
import { schoolToday } from "@/lib/school-date";

export const revalidate = 0;

export default async function LeadsPage() {
  const supabase = await createServerSupabaseClient();
  const [{ data: leads, error }, { data: products }] = await Promise.all([
    supabase.from("leads").select("*").order("created_at", { ascending: false }),
    supabase.from("products").select("slug, title, status").order("title"),
  ]);
  if (error) console.error("Error fetching leads:", error);

  return <LeadPipeline leads={leads ?? []} products={products ?? []} today={schoolToday()} />;
}
