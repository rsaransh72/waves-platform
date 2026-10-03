import Link from "next/link";
import SitePage from "@/components/site/SitePage";
import PageHero from "@/components/site/PageHero";
import PricingPlans from "@/components/site/PricingPlans";
import LeadForm from "@/components/site/LeadForm";
import { getPublishedProduct, getPublishedProducts, getSiteSettings, planPrice, productHref } from "@/lib/site-content";

// Cached for a minute; admin edits clear it at once (refreshPublicSite).
export const revalidate = 60;

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return { title: `Pricing | ${settings.company_name}` };
}

export default async function PricingPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const [{ product: requestedProduct }, summaries] = await Promise.all([searchParams, getPublishedProducts()]);
  const products = (await Promise.all(summaries.map((summary) => getPublishedProduct(summary.slug)))).filter((product) => product !== null);
  // Promise published figures only when at least one plan actually has a ₹ price.
  const hasPrices = products.some((product) => product.pricing.some((plan) => planPrice(plan) !== null));

  return (
    <SitePage>
      <PageHero
        label="Pricing"
        title="Simple pricing, agreed before you start"
        intro={hasPrices
          ? "Every plan below is what we actually charge. Where a price depends on your organization, ask for a quote and we will send one in writing."
          : "The price depends on the number of students and the modules you use. Tell us about your school and we will send you a written quote."}
      />

      {products.map((product) => (
        <section key={product.slug} className="w-full bg-[#f9fafb] border-b border-[#e6e9f0] px-6 py-14 lg:px-[5%] lg:py-[72px]">
          <div className="max-w-[1280px] mx-auto">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
              <div>
                <h2 className="text-[26px] sm:text-[32px] font-medium text-black tracking-[-1px]">{product.title}</h2>
                {product.subtitle && <p className="mt-2 text-[15px] text-[#555] max-w-2xl">{product.subtitle}</p>}
              </div>
              <Link href={productHref(product.slug)} className="text-[#0066cc] text-[13px] font-bold uppercase tracking-wider hover:underline">About {product.title}</Link>
            </div>
            <PricingPlans plans={product.pricing} productTitle={product.title} quoteHref={`/pricing?product=${product.slug}#quote`} startHref={productHref(product.slug, "demo")} />
          </div>
        </section>
      ))}

      <section id="quote" className="scroll-mt-20 w-full bg-white px-6 py-14 lg:px-[5%] lg:py-[72px]">
        <div className="max-w-[760px] mx-auto">
          <LeadForm
            inquiryType="pricing"
            products={summaries}
            defaultProduct={summaries.some((item) => item.slug === requestedProduct) ? requestedProduct : ""}
            source="website_pricing"
          />
        </div>
      </section>
    </SitePage>
  );
}
