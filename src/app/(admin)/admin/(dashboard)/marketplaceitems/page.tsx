import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Plus } from "lucide-react";
import Link from "next/link";
import { MarketplaceItemList } from "@/components/admin/MarketplaceItemList";

export const revalidate = 0; // Disable cache for admin panel

export default async function MarketplaceItemsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: marketplaceitems, error } = await supabase
    .from("marketplaceitems")
    .select("id, title, slug, category, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching marketplaceitems:", error);
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">MarketplaceItems</h1>
          <p className="text-sm font-medium text-slate-500">Manage your software marketplaceitems and applications.</p>
        </div>
        <Link 
          href="/admin/marketplaceitems/new"
          className="inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Create MarketplaceItem
        </Link>
      </div>

      <MarketplaceItemList initialMarketplaceItems={marketplaceitems || []} />
    </div>
  );
}
