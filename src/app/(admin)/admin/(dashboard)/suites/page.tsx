import { createServerSupabaseClient } from "@/lib/supabase-server";
import { SuiteList } from "@/components/admin/SuiteList";

export const revalidate = 0; // Disable cache for admin panel

export default async function SuitesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: suites, error } = await supabase
    .from("suites")
    .select("id, title, slug, category, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching suites:", error);
  }

  return <SuiteList initialSuites={suites || []} />;
}
