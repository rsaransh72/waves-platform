import { createServerSupabaseClient } from "@/lib/supabase-server";
import { PageEditor } from "@/components/admin/PageEditor";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function EditPagePage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createServerSupabaseClient();
  const { slug } = await params;
  
  let page = null;

  if (slug !== "new") {
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      notFound();
    }
    page = data;
  }

  return (
    <PageEditor initialData={page || {}} isNew={slug === "new"} />
  );
}
