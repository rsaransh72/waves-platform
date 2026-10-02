import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";
import LeadForm from "@/components/site/LeadForm";
import PricingPlans from "@/components/site/PricingPlans";
import { productHref } from "@/lib/product-routes";
import type { Product } from "@/lib/site-content";

// The pages of a product's mini-site. All content comes from Admin → Products.

function SectionHeading({ title, intro }: { title: string; intro?: string | null }) {
  return (
    <div className="mb-10">
      <h2 className="text-[26px] sm:text-[32px] font-medium text-black tracking-[-1px]">{title}</h2>
      {intro && <p className="mt-2 text-[15px] text-[#555] max-w-2xl">{intro}</p>}
    </div>
  );
}

function PageTitle({ product, title, intro }: { product: Product; title: string; intro?: string | null }) {
  return (
    <section className="w-full bg-white border-b border-[#e6e9f0] px-6 pt-12 pb-10 lg:px-[5%] lg:pt-[64px]">
      <div className="max-w-[1280px] mx-auto">
        <p className="text-[13px] font-bold uppercase tracking-wider text-[#226eb4]">{product.title}</p>
        <h1 className="mt-2 text-[30px] sm:text-[40px] font-normal text-[#111111] tracking-tight leading-[1.15]">{title}</h1>
        <div className="w-[50px] border-t-[3px] border-[#e42525] mt-5 mb-5" />
        {intro && <p className="text-[16px] text-[#444] leading-[1.7] max-w-2xl">{intro}</p>}
      </div>
    </section>
  );
}

function FeatureGrid({ features }: { features: Product["features"] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature) => (
        <div key={feature.title} className="bg-white border border-[#e6e9f0] rounded-xl p-6">
          <CheckCircle2 className="w-5 h-5 text-[#0066cc] mb-4" />
          <h3 className="text-[17px] font-semibold text-[#111]">{feature.title}</h3>
          {feature.desc && <p className="mt-2 text-[14px] text-[#555] leading-[1.7]">{feature.desc}</p>}
        </div>
      ))}
    </div>
  );
}

function UseCases({ useCases }: { useCases: Product["use_cases"] }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {useCases.map((useCase) => (
        <div key={useCase.title} className="border-l-[3px] border-[#e42525] pl-5">
          <h3 className="text-[17px] font-semibold text-[#111]">{useCase.title}</h3>
          {useCase.desc && <p className="mt-2 text-[15px] text-[#555] leading-[1.7]">{useCase.desc}</p>}
        </div>
      ))}
    </div>
  );
}

function DemoBand({ product }: { product: Product }) {
  return (
    <section className="w-full bg-[#226eb4] px-6 py-14 lg:px-[5%]">
      <div className="max-w-[900px] mx-auto text-center">
        <h2 className="text-[26px] sm:text-[32px] font-medium text-white tracking-[-1px]">See {product.title} on your own workflow</h2>
        <p className="mt-3 text-[15px] text-white/85">A short call and a live walkthrough, with no commitment.</p>
        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={productHref(product.slug, "demo")} className="bg-white text-[#226eb4] px-8 py-3.5 text-[14px] font-bold uppercase tracking-wider rounded-[3px] hover:bg-gray-50">Request a demo</Link>
          <Link href={productHref(product.slug, "pricing")} className="border border-white/50 text-white px-8 py-3.5 text-[14px] font-bold uppercase tracking-wider rounded-[3px] hover:bg-white/10">See pricing</Link>
        </div>
      </div>
    </section>
  );
}

export function ProductOverview({ product }: { product: Product }) {
  const highlights = product.features.slice(0, 6);
  return (
    <>
      <section className="w-full bg-white border-b border-[#e6e9f0] px-6 pt-12 pb-14 lg:px-[5%] lg:pt-[80px] lg:pb-[72px]">
        <div className="max-w-[1280px] mx-auto">
          {product.category && <div className="zw-label mb-5"><span>{product.category}</span></div>}
          <h1 className="text-[34px] sm:text-[48px] font-normal text-[#111111] tracking-tight leading-[1.15] max-w-3xl">{product.title}</h1>
          <div className="w-[50px] border-t-[3px] border-[#e42525] mt-6 mb-6" />
          {product.subtitle && <p className="text-[19px] text-[#333] leading-[1.6] max-w-2xl">{product.subtitle}</p>}
          {product.description && product.description !== product.subtitle && <p className="mt-4 text-[16px] text-[#555] leading-[1.7] max-w-2xl">{product.description}</p>}
          {product.target_audience.length > 0 && (
            <p className="mt-5 text-[14px] text-[#555]"><span className="font-semibold text-[#111]">Built for:</span> {product.target_audience.join(", ")}</p>
          )}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href={productHref(product.slug, "demo")} className="bg-[#e42525] hover:bg-[#d11a1a] text-white px-8 py-4 text-[14px] font-bold uppercase tracking-wider rounded-[3px] transition-colors inline-flex items-center justify-center">
              Request a demo <ChevronRight className="w-4 h-4 ml-2" strokeWidth={3} />
            </Link>
            <Link href={productHref(product.slug, "pricing")} className="border border-[#cccccc] hover:border-[#0066cc] text-[#111] px-8 py-4 text-[14px] font-bold uppercase tracking-wider rounded-[3px] transition-colors inline-flex items-center justify-center">
              Pricing
            </Link>
          </div>
        </div>
      </section>

      {highlights.length > 0 && (
        <section className="w-full bg-[#f9fafb] px-6 py-14 lg:px-[5%] lg:py-[72px]">
          <div className="max-w-[1280px] mx-auto">
            <SectionHeading title="What it does" />
            <FeatureGrid features={highlights} />
            {product.features.length > highlights.length && (
              <Link href={productHref(product.slug, "features")} className="mt-8 inline-flex items-center gap-1 text-[#0066cc] text-[13px] font-bold uppercase tracking-wider hover:underline">
                All {product.features.length} features <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </section>
      )}

      {product.use_cases.length > 0 && (
        <section className="w-full bg-white px-6 py-14 lg:px-[5%] lg:py-[72px]">
          <div className="max-w-[1280px] mx-auto">
            <SectionHeading title="Who uses it and how" />
            <UseCases useCases={product.use_cases} />
          </div>
        </section>
      )}

      <DemoBand product={product} />
    </>
  );
}

export function ProductFeatures({ product }: { product: Product }) {
  return (
    <>
      <PageTitle product={product} title="Features" intro={product.subtitle} />
      <section className="w-full bg-[#f9fafb] px-6 py-14 lg:px-[5%] lg:py-[72px]">
        <div className="max-w-[1280px] mx-auto">
          {product.features.length > 0 ? <FeatureGrid features={product.features} /> : <p className="text-[15px] text-[#555]">Feature details are being prepared. Ask us for a demo to see the product.</p>}
        </div>
      </section>
      {product.use_cases.length > 0 && (
        <section className="w-full bg-white px-6 py-14 lg:px-[5%] lg:py-[72px]">
          <div className="max-w-[1280px] mx-auto">
            <SectionHeading title="Who uses it and how" />
            <UseCases useCases={product.use_cases} />
          </div>
        </section>
      )}
      <DemoBand product={product} />
    </>
  );
}

export function ProductPricing({ product }: { product: Product }) {
  return (
    <>
      <PageTitle product={product} title="Pricing" intro="What we charge, agreed in writing before you start." />
      <section className="w-full bg-[#f9fafb] px-6 py-14 lg:px-[5%] lg:py-[72px]">
        <div className="max-w-[1280px] mx-auto">
          <PricingPlans plans={product.pricing} productTitle={product.title} quoteHref="#quote" startHref={productHref(product.slug, "demo")} />
        </div>
      </section>
      <section id="quote" className="scroll-mt-28 w-full bg-white px-6 py-14 lg:px-[5%] lg:py-[72px]">
        <div className="max-w-[760px] mx-auto">
          <LeadForm inquiryType="pricing" products={[product]} defaultProduct={product.slug} source={`website_${product.slug}_pricing`} title={`Get a quote for ${product.title}`} />
        </div>
      </section>
    </>
  );
}

export function ProductFaq({ product }: { product: Product }) {
  return (
    <>
      <PageTitle product={product} title="Frequently asked questions" />
      <section className="w-full bg-white px-6 py-14 lg:px-[5%] lg:py-[72px]">
        <div className="max-w-[800px] mx-auto">
          <div className="divide-y divide-[#e6e9f0] border-y border-[#e6e9f0]">
            {product.faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 text-[16px] font-medium text-[#111]">
                  {faq.question}
                  <ChevronRight className="w-4 h-4 shrink-0 transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-[15px] text-[#555] leading-[1.7] whitespace-pre-line">{faq.answer}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-[15px] text-[#555]">
            Another question? <Link href="/contact" className="text-[#0066cc] font-semibold hover:underline">Send us a message</Link> or <Link href={productHref(product.slug, "demo")} className="text-[#0066cc] font-semibold hover:underline">ask during a demo</Link>.
          </p>
        </div>
      </section>
    </>
  );
}

export function ProductDemo({ product }: { product: Product }) {
  const steps = [
    `We call you on the number you give us to understand your needs and agree a time.`,
    `We show you ${product.title} live, using examples that match how you work.`,
    `If it suits you, we send a quote and set up your account. Nothing is charged before you agree.`,
  ];
  return (
    <>
      <PageTitle product={product} title={`Request a ${product.title} demo`} intro="A short call and a live walkthrough, with no commitment." />
      <section className="w-full bg-white px-6 py-14 lg:px-[5%] lg:py-[72px]">
        <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          <div className="lg:w-5/12 space-y-4">
            <h2 className="text-[22px] font-medium text-black">What happens next</h2>
            <ol className="space-y-4">
              {steps.map((step, index) => (
                <li key={step} className="flex gap-3 text-[15px] text-[#404040] leading-relaxed">
                  <span className="w-7 h-7 shrink-0 rounded-full bg-[#e42525] text-white text-sm font-bold flex items-center justify-center">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:w-7/12 w-full">
            <LeadForm inquiryType="demo" products={[product]} defaultProduct={product.slug} source={`website_${product.slug}_demo`} title={`See ${product.title} in action`} />
          </div>
        </div>
      </section>
    </>
  );
}
