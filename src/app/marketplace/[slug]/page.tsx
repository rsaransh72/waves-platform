import CatalogDetailPage, { catalogMetadata } from "@/components/site/CatalogDetailPage";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return catalogMetadata("marketplaceitems", slug);
}

export default async function CatalogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CatalogDetailPage table="marketplaceitems" slug={slug} />;
}
