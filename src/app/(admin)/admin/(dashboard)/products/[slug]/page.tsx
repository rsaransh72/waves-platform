import { createServerSupabaseClient } from "@/lib/supabase-server";
import { ProductEditorRoute } from "@/components/admin/ProductEditorRoute";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createServerSupabaseClient();
  const { slug } = await params;
  
  let product = null;

  if (slug !== "new") {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      notFound();
    }
    product = data;
  }

  return <ProductEditorRoute initialData={product} isNew={slug === "new"} />;
}
