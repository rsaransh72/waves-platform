import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NavigationEditor } from "@/components/admin/NavigationEditor";
import { buildPublicMenuPathSet } from "@/lib/public-menu";
import { getPublishedPages } from "@/lib/site-content";

export const revalidate = 0; // Always fetch fresh data

export default async function NavigationPage() {
  const supabase = await createServerSupabaseClient();
  const [menuResult, productsResult, suitesResult, marketplaceResult, pages] = await Promise.all([
    supabase.from("menus").select("*").order("created_at", { ascending: true }),
    supabase.from("products").select("slug").eq("status", "published"),
    supabase.from("suites").select("slug").eq("status", "published"),
    supabase.from("marketplaceitems").select("slug").eq("status", "published"),
    getPublishedPages(),
  ]);
  const { data: menus, error } = menuResult;

  if (error) {
    console.error("Error fetching menus:", error);
  }

  // Find the main navbar, or pass null to create it
  const mainNavbar = menus?.find((m) => m.name === "Main Navbar") || null;
  const validPaths = [...buildPublicMenuPathSet({
    products: productsResult.data || [],
    suites: suitesResult.data || [],
    marketplace: marketplaceResult.data || [],
    pages,
  })].sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Website menu</h1>
        <p className="text-sm font-medium text-slate-500">Links in the top bar of your public website, after Products. Only pages that exist and have content can be linked; a page added in Pages appears in the list once it has content.</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <NavigationEditor initialMenu={mainNavbar} validPaths={validPaths} />
      </div>
    </div>
  );
}
