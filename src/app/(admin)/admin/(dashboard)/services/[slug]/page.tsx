import { createServerSupabaseClient } from "@/lib/supabase-server";
import { ServiceEditor } from "@/components/admin/ServiceEditor";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function EditServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createServerSupabaseClient();
  const { slug } = await params;
  
  let service = null;

  if (slug !== "new") {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      notFound();
    }
    service = data;
  }

  return (
    <ServiceEditor initialData={service || {}} isNew={slug === "new"} />
  );
}
