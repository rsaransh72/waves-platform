import { createServerSupabaseClient } from "@/lib/supabase-server";
import { ProductList } from "@/components/admin/ProductList";

export const revalidate = 0; // Disable cache for admin panel

export default async function ProductsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("id, title, slug, category, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
  }

  return <ProductList initialProducts={products || []} />;
}
