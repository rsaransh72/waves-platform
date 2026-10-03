import { supabase } from "@/lib/supabase";
import { getPublishedPages, getPublishedProducts, getSiteSettings } from "@/lib/site-content";
import { buildPublicMenuPathSet, sanitizeMenuItems } from "@/lib/public-menu";
import ClientNavbar from "./ClientNavbar";

// Cached for a minute; admin edits clear it at once (refreshPublicSite).
export const revalidate = 60;

const DEFAULT_MENU = [
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export default async function Navbar({ requestDemoHref = "/book-demo" }: { requestDemoHref?: string }) {
  const [{ data: menuData }, products, pages, { data: suites }, { data: marketplace }, settings] = await Promise.all([
    supabase.from("menus").select("items").eq("name", "Main Navbar").maybeSingle(),
    getPublishedProducts(),
    getPublishedPages(),
    supabase.from("suites").select("title, slug, subtitle").eq("status", "published"),
    supabase.from("marketplaceitems").select("title, slug, subtitle").eq("status", "published"),
    getSiteSettings(),
  ]);

  // Menu links are kept only when the page they point to exists and is published.
  const validPaths = buildPublicMenuPathSet({ products, suites: suites ?? [], marketplace: marketplace ?? [], pages });
  const configuredItems = Array.isArray(menuData?.items) ? menuData.items : [];
  const menuItems = sanitizeMenuItems(configuredItems.length ? configuredItems : DEFAULT_MENU, validPaths)
    .filter((item) => item.href !== "/products");

  return (
    <ClientNavbar
      requestDemoHref={requestDemoHref}
      companyName={settings.company_name}
      menuItems={menuItems}
      products={products.map((product) => ({ slug: product.slug, title: product.title, subtitle: product.subtitle, category: product.category }))}
      suites={suites ?? []}
      marketplace={marketplace ?? []}
    />
  );
}
