import Link from "next/link";
import { CalendarCheck, LifeBuoy } from "lucide-react";
import SitePage from "@/components/site/SitePage";
import PageHero from "@/components/site/PageHero";
import LeadForm from "@/components/site/LeadForm";
import ContactDetails from "@/components/site/ContactDetails";
import { getPublishedProducts, getSiteSettings } from "@/lib/site-content";

export const revalidate = 0;

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return { title: `Contact | ${settings.company_name}` };
}

export default async function ContactPage() {
  const [settings, products] = await Promise.all([getSiteSettings(), getPublishedProducts()]);

  return (
    <SitePage>
      <PageHero label="Contact" title="Talk to us" intro="Questions about a product, a quote, or your existing account. Send a message and the right person will reply." />
      <section className="w-full bg-white px-6 py-14 lg:px-[5%] lg:py-[72px]">
        <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          <div className="lg:w-5/12 space-y-5 w-full">
            <ContactDetails settings={settings} heading="Reach us directly" />
            <Link href="/book-demo" className="flex items-start gap-3 p-5 rounded-lg border border-[#e6e9f0] hover:border-[#0066cc] transition">
              <CalendarCheck className="w-5 h-5 text-[#e42525] mt-0.5 shrink-0" />
              <span>
                <span className="block text-[15px] font-semibold text-[#111]">Want to see the product?</span>
                <span className="block text-[14px] text-[#555] mt-1">Request a live demo instead.</span>
              </span>
            </Link>
            <Link href="/login" className="flex items-start gap-3 p-5 rounded-lg border border-[#e6e9f0] hover:border-[#0066cc] transition">
              <LifeBuoy className="w-5 h-5 text-[#226eb4] mt-0.5 shrink-0" />
              <span>
                <span className="block text-[15px] font-semibold text-[#111]">Already a customer?</span>
                <span className="block text-[14px] text-[#555] mt-1">
                  Sign in to your account{settings.support_email ? <>, or email <span className="text-[#0066cc]">{settings.support_email}</span> for support</> : ""}.
                </span>
              </span>
            </Link>
          </div>
          <div className="lg:w-7/12 w-full">
            <LeadForm inquiryType="contact" products={products} source="website_contact" />
          </div>
        </div>
      </section>
    </SitePage>
  );
}
