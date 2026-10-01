import SitePage from "@/components/site/SitePage";
import PageHero from "@/components/site/PageHero";
import LeadForm from "@/components/site/LeadForm";
import ContactDetails from "@/components/site/ContactDetails";
import { getPublishedProducts, getSiteSettings } from "@/lib/site-content";

export const revalidate = 0;

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return { title: `Request a demo | ${settings.company_name}` };
}

const STEPS = [
  "We call you on the number you give us to understand your needs and agree a time.",
  "We show you the product live, using examples that match how your organization works.",
  "If it suits you, we send a quote and set up your account. Nothing is charged before you agree.",
];

export default async function BookDemoPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const [{ product }, settings, products] = await Promise.all([searchParams, getSiteSettings(), getPublishedProducts()]);

  return (
    <SitePage>
      <PageHero label="Demo" title="Request a live demo" intro="A short call and a walkthrough on your own workflow, with no commitment." />
      <section className="w-full bg-white px-6 py-14 lg:px-[5%] lg:py-[72px]">
        <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          <div className="lg:w-5/12 space-y-6">
            <h2 className="text-[22px] font-medium text-black">What happens next</h2>
            <ol className="space-y-4">
              {STEPS.map((step, index) => (
                <li key={step} className="flex gap-3 text-[15px] text-[#404040] leading-relaxed">
                  <span className="w-7 h-7 shrink-0 rounded-full bg-[#e42525] text-white text-sm font-bold flex items-center justify-center">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <ContactDetails settings={settings} />
          </div>
          <div className="lg:w-7/12 w-full">
            <LeadForm inquiryType="demo" products={products} defaultProduct={products.some((item) => item.slug === product) ? product : ""} source="website_book_demo" />
          </div>
        </div>
      </section>
    </SitePage>
  );
}
