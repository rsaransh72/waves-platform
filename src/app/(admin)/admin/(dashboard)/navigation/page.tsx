import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NavigationEditor } from "@/components/admin/NavigationEditor";
import { buildPublicMenuPathSet } from "@/lib/public-menu";

export const revalidate = 0; // Always fetch fresh data

export default async function NavigationPage() {
  const supabase = await createServerSupabaseClient();
  const [menuResult, productsResult, suitesResult, marketplaceResult] = await Promise.all([
    supabase.from("menus").select("*").order("created_at", { ascending: true }),
    supabase.from("products").select("slug").eq("status", "published"),
    supabase.from("suites").select("slug").eq("status", "published"),
    supabase.from("marketplaceitems").select("slug").eq("status", "published"),
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
  })].sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Navigation Editor</h1>
        <p className="text-sm font-medium text-slate-500">Manage the top navigation bar of your public website.</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <NavigationEditor initialMenu={mainNavbar} validPaths={validPaths} />
      </div>
    </div>
  );
}
