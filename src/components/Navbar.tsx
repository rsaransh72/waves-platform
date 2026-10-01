import { supabase } from "@/lib/supabase";
import ClientNavbar from "./ClientNavbar";

export const revalidate = 0; // Ensure navbar always fetches fresh products

export default async function Navbar({ requestDemoHref = "/book-demo" }: { requestDemoHref?: string }) {
  // Fetch the main navigation links
  const { data: menuData } = await supabase
    .from("menus")
    .select("*")
    .eq("name", "Main Navbar")
    .single();

  const menuItems = menuData?.items?.length
    ? menuData.items
    : [
        { label: "School ERP", href: "/school-erp" },
        { label: "Services", href: "/services" },
        { label: "Pricing", href: "/pricing" },
      ];

  // Fetch published products to populate the mega menu
  const { data: products } = await supabase
    .from("products")
    .select("title, slug, subtitle, category, color")
    .eq("status", "published");

  // Fetch published suites
  const { data: suites } = await supabase
    .from("suites")
    .select("title, slug, subtitle, category, color, tagline")
    .eq("status", "published");

  // Fetch published marketplace items
  const { data: marketplace } = await supabase
    .from("marketplaceitems")
    .select("title, slug, subtitle, category, color, tagline")
    .eq("status", "published");

  return <ClientNavbar
    requestDemoHref={requestDemoHref}
    dynamicMenuItems={menuItems} 
    dynamicProducts={products || []} 
    dynamicSuites={suites || []}
    dynamicMarketplace={marketplace || []}
  />;
}
