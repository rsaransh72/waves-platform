import { createServerSupabaseClient } from "@/lib/supabase-server";
import { MarketplaceItemEditor } from "@/components/admin/MarketplaceItemEditor";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function EditMarketplaceItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createServerSupabaseClient();
  const { slug } = await params;
  
  let marketplaceitem = null;

  if (slug !== "new") {
    const { data, error } = await supabase
      .from("marketplaceitems")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      notFound();
    }
    marketplaceitem = data;
  }

  return (
    <MarketplaceItemEditor initialData={marketplaceitem} isNew={slug === "new"} />
  );
}
