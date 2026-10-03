import { notFound } from "next/navigation";
import { ProductDemo, ProductFaq, ProductFeatures, ProductPricing } from "@/components/site/product/ProductPages";
import { getPublishedProduct, getSiteSettings } from "@/lib/site-content";
import { isProductSection } from "@/lib/product-routes";

// Cached for a minute; admin edits clear it at once (refreshPublicSite).
export const revalidate = 60;

const TITLES = { features: "Features", pricing: "Pricing", faq: "FAQs", demo: "Request a demo" } as const;

export async function generateMetadata({ params }: { params: Promise<{ slug: string; section: string }> }) {
  const { slug, section } = await params;
  const [product, settings] = await Promise.all([getPublishedProduct(slug), getSiteSettings()]);
  if (!product || !isProductSection(section)) return {};
  return { title: `${TITLES[section]} – ${product.title} | ${settings.company_name}` };
}

// /{product}/features, /pricing, /faq and /demo of a product's mini-site.
export default async function ProductSectionPage({ params }: { params: Promise<{ slug: string; section: string }> }) {
  const { slug, section } = await params;
  const product = await getPublishedProduct(slug);
  if (!product || !isProductSection(section)) notFound();

  switch (section) {
    case "features":
      return <ProductFeatures product={product} />;
    case "pricing":
      return <ProductPricing product={product} />;
    case "faq":
      if (product.faqs.length === 0) notFound();
      return <ProductFaq product={product} />;
    case "demo":
      return <ProductDemo product={product} />;
  }
}
