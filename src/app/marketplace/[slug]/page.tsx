import CatalogDetailPage, { catalogMetadata } from "@/components/site/CatalogDetailPage";

// Cached for a minute; admin edits clear it at once (refreshPublicSite).
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return catalogMetadata("marketplaceitems", slug);
}

export default async function CatalogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CatalogDetailPage table="marketplaceitems" slug={slug} />;
}
