import { redirect } from "next/navigation";
import CatalogDetailPage, { catalogMetadata } from "@/components/site/CatalogDetailPage";
import { CORE_PRODUCT_ROUTES } from "@/lib/public-menu";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return catalogMetadata("products", slug);
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Products with a dedicated page (School ERP) live at their own address.
  if (CORE_PRODUCT_ROUTES[slug]) redirect(CORE_PRODUCT_ROUTES[slug]);
  return <CatalogDetailPage table="products" slug={slug} />;
}
