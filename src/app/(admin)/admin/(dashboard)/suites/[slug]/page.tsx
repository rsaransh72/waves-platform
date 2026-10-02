import { createServerSupabaseClient } from "@/lib/supabase-server";
import { SuiteEditorRoute } from "@/components/admin/SuiteEditorRoute";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function EditSuitePage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createServerSupabaseClient();
  const { slug } = await params;
  
  let suite = null;

  if (slug !== "new") {
    const { data, error } = await supabase
      .from("suites")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      notFound();
    }
    suite = data;
  }

  return <SuiteEditorRoute initialData={suite} isNew={slug === "new"} />;
}
