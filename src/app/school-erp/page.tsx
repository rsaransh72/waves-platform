import CatalogDetailPage, { catalogMetadata } from "@/components/site/CatalogDetailPage";

export const revalidate = 0;

// Content comes from Admin → Products → School ERP.
export async function generateMetadata() {
  return catalogMetadata("products", "school-erp");
}

export default function SchoolErpPage() {
  return <CatalogDetailPage table="products" slug="school-erp" />;
}
