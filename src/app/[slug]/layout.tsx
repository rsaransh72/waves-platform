import SitePage from "@/components/site/SitePage";
import ProductNav from "@/components/site/product/ProductNav";
import { getPublishedProduct } from "@/lib/site-content";

// /{slug} is either a product's mini-site or a content page (About, Terms, ...).
// Product pages get the company header, the product's own menu and the footer here;
// content pages render their own frame.
export default async function SlugLayout({ children, params }: { children: React.ReactNode; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getPublishedProduct(slug);
  if (!product) return children;

  return (
    <SitePage>
      <ProductNav slug={product.slug} title={product.title} hasFeatures={product.features.length > 0} hasFaqs={product.faqs.length > 0} />
      {children}
    </SitePage>
  );
}
