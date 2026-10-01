import Link from "next/link";
import SitePage from "@/components/site/SitePage";
import PageHero from "@/components/site/PageHero";
import LeadForm from "@/components/site/LeadForm";
import { getPublishedProducts, getSiteSettings } from "@/lib/site-content";

export const revalidate = 0;

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return { title: `Get started | ${settings.company_name}` };
}

// There is no self-service sign-up: our team opens each account after a call, so
// this page collects an access request that lands in Admin → Leads.
export default async function SignUpPage() {
  const products = await getPublishedProducts();

  return (
    <SitePage>
      <PageHero
        label="Get started"
        title="Open an account for your institution"
        intro="We set up every account with you, so your classes, fees and staff are configured correctly from the first day. Send this request and we will contact you to begin."
      >
        <p className="text-[14px] text-[#555]">
          Already received an invitation email? <Link href="/login" className="text-[#0066cc] font-semibold hover:underline">Sign in here</Link>.
        </p>
      </PageHero>
      <section className="w-full bg-[#f9fafb] px-6 py-14 lg:px-[5%] lg:py-[72px]">
        <div className="max-w-[760px] mx-auto">
          <LeadForm inquiryType="access" products={products} source="website_signup" />
        </div>
      </section>
    </SitePage>
  );
}
