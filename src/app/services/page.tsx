import { CheckCircle2 } from "lucide-react";
import SitePage from "@/components/site/SitePage";
import PageHero from "@/components/site/PageHero";
import LeadForm from "@/components/site/LeadForm";
import ContactDetails from "@/components/site/ContactDetails";
import { getPublishedProducts, getPublishedServices, getSiteSettings, planPrice } from "@/lib/site-content";
import { formatMoney } from "@/lib/money";

export const revalidate = 0;

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return { title: `Services | ${settings.company_name}` };
}

export default async function ServicesPage() {
  const [settings, services, products] = await Promise.all([getSiteSettings(), getPublishedServices(), getPublishedProducts()]);

  return (
    <SitePage>
      <PageHero
        label="Services"
        title="Setup, training and support from our team"
        intro="Software works best when it is set up properly. These are the services we provide alongside our products."
      />

      {services.length > 0 && (
        <section className="w-full bg-[#f9fafb] px-6 py-14 lg:px-[5%] lg:py-[72px]">
          <div className="max-w-[1280px] mx-auto grid md:grid-cols-2 gap-6">
            {services.map((service) => (
              <article key={service.slug} id={service.slug} className="scroll-mt-24 bg-white border border-[#e6e9f0] rounded-xl p-7">
                <h2 className="text-[22px] font-semibold text-[#111]">{service.title}</h2>
                {service.subtitle && <p className="mt-1 text-[15px] text-[#555]">{service.subtitle}</p>}
                {service.description && <p className="mt-4 text-[15px] text-[#404040] leading-[1.7]">{service.description}</p>}
                {(service.features.length > 0 || service.benefits.length > 0) && (
                  <ul className="mt-5 space-y-2">
                    {[...service.features, ...service.benefits].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[14px] text-[#404040]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {service.pricing.length > 0 && (
                  <div className="mt-6 border-t border-[#e6e9f0] pt-4 space-y-1">
                    {service.pricing.map((plan) => {
                      const price = planPrice(plan);
                      return (
                        <p key={plan.name} className="text-[14px] text-[#111]">
                          <span className="font-semibold">{plan.name}</span>
                          {price !== null && <>: {formatMoney(price)}{plan.period ? ` / ${plan.period}` : ""}</>}
                        </p>
                      );
                    })}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      <section id="consultation" className="w-full bg-white border-t border-[#e6e9f0] px-6 py-14 lg:px-[5%] lg:py-[72px]">
        <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          <div className="lg:w-5/12 space-y-5">
            <h2 className="text-[28px] sm:text-[34px] font-medium text-black tracking-[-1px] leading-tight">Tell us what you need</h2>
            <div className="w-14 border-t border-black" />
            <p className="text-base text-[#404040] leading-[1.8]">
              Data import, staff training or ongoing support: describe your situation and we will agree the scope and cost with you before any work starts.
            </p>
            <ContactDetails settings={settings} />
          </div>
          <div className="lg:w-7/12 w-full">
            <LeadForm inquiryType="consultation" products={products} source="website_services" />
          </div>
        </div>
      </section>
    </SitePage>
  );
}
