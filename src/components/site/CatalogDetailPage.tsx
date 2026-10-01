import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ChevronRight } from "lucide-react";
import SitePage from "@/components/site/SitePage";
import LeadForm from "@/components/site/LeadForm";
import PricingPlans from "@/components/site/PricingPlans";
import { getPublishedCatalogItem, getPublishedProducts, getSiteSettings, type CatalogTable } from "@/lib/site-content";

export async function catalogMetadata(table: CatalogTable, slug: string) {
  const [item, settings] = await Promise.all([getPublishedCatalogItem(table, slug), getSiteSettings()]);
  if (!item) return { title: `Not found | ${settings.company_name}` };
  return {
    title: item.seo_title || `${item.title} | ${settings.company_name}`,
    description: item.seo_description || item.subtitle || undefined,
  };
}

// Detail page for a product, suite or marketplace entry, built only from what is
// entered in the admin console. Sections without content are not rendered.
export default async function CatalogDetailPage({ table, slug }: { table: CatalogTable; slug: string }) {
  const [item, products] = await Promise.all([getPublishedCatalogItem(table, slug), getPublishedProducts()]);
  if (!item) notFound();

  const isProduct = table === "products";

  return (
    <SitePage>
      <section className="w-full bg-white border-b border-[#e6e9f0] px-6 pt-12 pb-14 lg:px-[5%] lg:pt-[80px] lg:pb-[72px]">
        <div className="max-w-[1280px] mx-auto">
          {item.category && <div className="zw-label mb-5"><span>{item.category}</span></div>}
          <h1 className="text-[34px] sm:text-[48px] font-normal text-[#111111] tracking-tight leading-[1.15] max-w-3xl">{item.title}</h1>
          <div className="w-[50px] border-t-[3px] border-[#e42525] mt-6 mb-6" />
          {item.subtitle && <p className="text-[19px] text-[#333] leading-[1.6] max-w-2xl">{item.subtitle}</p>}
          {item.description && item.description !== item.subtitle && <p className="mt-4 text-[16px] text-[#555] leading-[1.7] max-w-2xl">{item.description}</p>}
          {item.target_audience.length > 0 && (
            <p className="mt-5 text-[14px] text-[#555]"><span className="font-semibold text-[#111]">Built for:</span> {item.target_audience.join(", ")}</p>
          )}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href={`#demo`} className="bg-[#e42525] hover:bg-[#d11a1a] text-white px-8 py-4 text-[14px] font-bold uppercase tracking-wider rounded-[3px] transition-colors inline-flex items-center justify-center">
              Request a demo <ChevronRight className="w-4 h-4 ml-2" strokeWidth={3} />
            </Link>
            <Link href="#pricing" className="border border-[#cccccc] hover:border-[#0066cc] text-[#111] px-8 py-4 text-[14px] font-bold uppercase tracking-wider rounded-[3px] transition-colors inline-flex items-center justify-center">
              Pricing
            </Link>
          </div>
        </div>
      </section>

      {item.features.length > 0 && (
        <section className="w-full bg-[#f9fafb] px-6 py-14 lg:px-[5%] lg:py-[72px]">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="text-[26px] sm:text-[32px] font-medium text-black tracking-[-1px] mb-10">What it does</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {item.features.map((feature) => (
                <div key={feature.title} className="bg-white border border-[#e6e9f0] rounded-xl p-6">
                  <CheckCircle2 className="w-5 h-5 text-[#0066cc] mb-4" />
                  <h3 className="text-[17px] font-semibold text-[#111]">{feature.title}</h3>
                  {feature.desc && <p className="mt-2 text-[14px] text-[#555] leading-[1.7]">{feature.desc}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {item.use_cases.length > 0 && (
        <section className="w-full bg-white px-6 py-14 lg:px-[5%] lg:py-[72px]">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="text-[26px] sm:text-[32px] font-medium text-black tracking-[-1px] mb-10">Who uses it and how</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {item.use_cases.map((useCase) => (
                <div key={useCase.title} className="border-l-[3px] border-[#e42525] pl-5">
                  <h3 className="text-[17px] font-semibold text-[#111]">{useCase.title}</h3>
                  {useCase.desc && <p className="mt-2 text-[15px] text-[#555] leading-[1.7]">{useCase.desc}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="pricing" className="scroll-mt-20 w-full bg-[#f9fafb] border-t border-[#e6e9f0] px-6 py-14 lg:px-[5%] lg:py-[72px]">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-[26px] sm:text-[32px] font-medium text-black tracking-[-1px] mb-10 text-center">Pricing</h2>
          <PricingPlans plans={item.pricing} productSlug={item.slug} productTitle={item.title} />
        </div>
      </section>

      {item.faqs.length > 0 && (
        <section className="w-full bg-white px-6 py-14 lg:px-[5%] lg:py-[72px]">
          <div className="max-w-[800px] mx-auto">
            <h2 className="text-[26px] sm:text-[32px] font-medium text-black tracking-[-1px] mb-8">Questions</h2>
            <div className="divide-y divide-[#e6e9f0] border-y border-[#e6e9f0]">
              {item.faqs.map((faq) => (
                <details key={faq.question} className="group py-5">
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-4 text-[16px] font-medium text-[#111]">
                    {faq.question}
                    <ChevronRight className="w-4 h-4 shrink-0 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-[15px] text-[#555] leading-[1.7] whitespace-pre-line">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="demo" className="scroll-mt-20 w-full bg-white border-t border-[#e6e9f0] px-6 py-14 lg:px-[5%] lg:py-[72px]">
        <div className="max-w-[760px] mx-auto">
          <LeadForm
            inquiryType="demo"
            products={products}
            defaultProduct={isProduct ? item.slug : ""}
            source={`website_${table}_${item.slug}`}
            title={`See ${item.title} in action`}
          />
        </div>
      </section>
    </SitePage>
  );
}
