import Link from "next/link";
import {
  CalendarCheck,
  ChevronRight,
  GraduationCap,
  Headphones,
  IndianRupee,
  Layers,
  PhoneCall,
  Presentation,
  Rocket,
  ShieldCheck,
  UserCog,
  Wrench,
} from "lucide-react";
import SitePage from "@/components/site/SitePage";
import LeadForm from "@/components/site/LeadForm";
import ContactDetails from "@/components/site/ContactDetails";
import { getPublishedProducts, getPublishedServices, getSiteSettings, productHref } from "@/lib/site-content";

export const revalidate = 0;

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: `${settings.company_name} | Software for schools and institutions`,
    description: settings.tagline || "Cloud software for running your institution: students, attendance, exams, fees and staff in one place.",
  };
}

// How a new customer gets from the website to a working account. Each step is a real
// stage in Admin → Leads and client onboarding.
const PROCESS = [
  { icon: CalendarCheck, title: "Request a demo", desc: "Send the form below. Your request reaches our team immediately and we call you back to fix a time." },
  { icon: Presentation, title: "See it on your workflow", desc: "We walk you through the product live and answer questions about your fees, classes and staff." },
  { icon: Wrench, title: "We set up your account", desc: "We create your institution's workspace, your administrator receives an email invitation, and we help you load your data." },
  { icon: Rocket, title: "Go live", desc: "Your administrator invites teachers and office staff, each with access matched to their role." },
];

// Statements about how the software works, not marketing claims.
const PRINCIPLES = [
  { icon: ShieldCheck, color: "text-[#e42525]", bg: "bg-red-50", title: "Your data stays yours", desc: "Each institution's records are kept separate at the database level. No other customer can see them." },
  { icon: UserCog, color: "text-[#226eb4]", bg: "bg-blue-50", title: "The right access for every role", desc: "Administrators, teachers and office staff each see and change only what their role needs. Teachers never see fees." },
  { icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-50", title: "Made for Indian institutions", desc: "Amounts in rupees, UPI, cheque and NEFT payments, and numbered receipts with the amount in words." },
  { icon: Headphones, color: "text-amber-600", bg: "bg-amber-50", title: "Set up with you, not left to you", desc: "Accounts are opened by our team after a call, so your setup is right from the first day." },
];

export default async function Home() {
  const [settings, products, services] = await Promise.all([getSiteSettings(), getPublishedProducts(), getPublishedServices()]);
  const primaryProduct = products[0];

  return (
    <SitePage>
      {/* Hero */}
      <section className="w-full bg-white px-6 pt-10 pb-16 lg:pt-[100px] lg:pb-[100px]">
        <div className="max-w-[1280px] mx-auto lg:px-[2%]">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center lg:items-start">
            <div className="lg:w-[50%] pt-6 text-center lg:text-left flex flex-col items-center lg:items-start">
              <h1 className="text-[36px] sm:text-[48px] lg:text-[54px] font-normal text-[#111111] tracking-tight leading-[1.15]">
                Run your institution<br />
                from one place, with <span className="font-medium text-[#e42525]">{settings.company_name}</span>.
              </h1>
              <div className="w-[50px] border-t-[3px] border-[#e42525] mt-8 mb-6 mx-auto lg:mx-0" />
              <p className="text-[17px] text-[#444] leading-[1.6] max-w-[480px] mb-10">
                {settings.tagline || "Students, attendance, exams, fees and staff in one secure system, set up for you by our team."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link href="/book-demo" className="bg-[#e42525] hover:bg-[#d11a1a] text-white px-8 py-4 text-[14px] font-bold uppercase tracking-wider rounded-[3px] transition-colors flex items-center justify-center">
                  Request a demo <ChevronRight className="w-4 h-4 ml-2" strokeWidth={3} />
                </Link>
                {primaryProduct && (
                  <Link href={productHref(primaryProduct.slug)} className="border border-[#cccccc] hover:border-[#0066cc] text-[#111] px-8 py-4 text-[14px] font-bold uppercase tracking-wider rounded-[3px] transition-colors flex items-center justify-center">
                    Explore {primaryProduct.title}
                  </Link>
                )}
              </div>
            </div>

            {products.length > 0 && (
              <div className="lg:w-[50%] w-full mt-10 lg:mt-0 relative z-10">
                <div className="bg-white rounded-lg shadow-[0_15px_50px_rgba(0,0,0,0.08)] border border-[#f0f0f0] p-8 lg:p-12 w-full">
                  <div className="flex flex-col items-center mb-8">
                    <h2 className="text-[13px] font-bold text-[#111111] uppercase tracking-[1.5px] mb-3 text-center">Our products</h2>
                    <div className="w-[30px] border-t-[3px] border-[#e42525]" />
                  </div>
                  <div className="flex flex-col gap-0 lg:gap-8">
                    {products.map((product) => {
                      const Icon = product.slug === "school-erp" ? GraduationCap : Layers;
                      return (
                        <Link key={product.slug} href={productHref(product.slug)} className="group flex items-start gap-4 py-5 border-b border-[#f0f0f0] last:border-none lg:p-0">
                          <div className="text-[#0066cc] flex items-center justify-center shrink-0 mt-1">
                            <Icon className="w-8 h-8" strokeWidth={1.5} />
                          </div>
                          <div>
                            <h3 className="text-[17px] font-medium text-[#111] leading-tight mb-2 group-hover:text-[#0066cc] transition-colors">{product.title}</h3>
                            {(product.subtitle || product.description) && (
                              <p className="text-[13px] text-[#666] leading-[1.6]">{product.subtitle || product.description}</p>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="mt-10 text-center">
                    <Link href="/products" className="text-[#0066cc] text-[13px] font-bold uppercase tracking-wider hover:underline flex items-center justify-center gap-1">
                      View product details <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full bg-[#f9fafb] border-t border-[#e6e9f0] px-6 py-14 lg:px-[5%] lg:py-[80px]">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-[26px] sm:text-[34px] font-medium text-black tracking-[-1px] leading-tight">How getting started works</h2>
            <div className="w-[50px] border-t-[3px] border-[#e42525] mx-auto mt-6" />
          </div>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {PROCESS.map(({ icon: Icon, title, desc }, index) => (
              <li key={title} className="bg-white p-6 sm:p-7 rounded-xl border border-[#e6e9f0] shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-full bg-[#e42525] text-white text-sm font-bold flex items-center justify-center">{index + 1}</span>
                  <Icon className="w-5 h-5 text-[#226eb4]" />
                </div>
                <h3 className="text-[16px] font-semibold text-black mb-2">{title}</h3>
                <p className="text-[14px] text-[#555] leading-[1.75]">{desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Principles */}
      <section id="values" className="w-full bg-white border-t border-[#e6e9f0] px-6 py-14 lg:px-[5%] lg:py-[80px]">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
            <h2 className="text-[26px] sm:text-[34px] font-medium text-black tracking-[-1px] leading-tight">What you can rely on</h2>
            <div className="w-[50px] border-t-[3px] border-[#e42525] mx-auto mt-6" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {PRINCIPLES.map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title} className="bg-white p-6 sm:p-7 rounded-xl border border-[#e6e9f0] shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className={`w-10 h-10 rounded-lg ${bg} ${color} flex items-center justify-center mb-5`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-[16px] font-semibold text-black mb-2">{title}</h3>
                <p className="text-[14px] text-[#555] leading-[1.75]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      {services.length > 0 && (
        <section className="w-full bg-[#005fb8] px-6 py-16 lg:px-[5%] lg:py-[80px]">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-10 flex flex-col items-center">
              <h2 className="text-[28px] sm:text-[36px] font-medium text-white tracking-[-1px]">Help when you need it</h2>
              <div className="w-[50px] border-t-2 border-[#4ade80] mx-auto mt-6" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {services.map((service) => (
                <Link key={service.slug} href={`/services#${service.slug}`} className="block rounded-xl border border-white/20 bg-white/5 p-6 hover:bg-white/10 transition">
                  <h3 className="text-[17px] font-semibold text-white">{service.title}</h3>
                  {(service.subtitle || service.description) && <p className="mt-2 text-[14px] text-white/80 leading-relaxed">{service.subtitle || service.description}</p>}
                </Link>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/services" className="inline-block border border-white/30 rounded px-6 py-3 text-white text-[13px] font-bold tracking-wider hover:bg-white/10 transition uppercase">
                All services <ChevronRight className="w-4 h-4 inline-block ml-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Demo request */}
      <section id="demo" className="w-full bg-white border-t border-[#e6e9f0] px-6 py-14 lg:px-[5%] lg:py-[80px]">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
            <div className="lg:w-5/12 space-y-5 lg:sticky lg:top-[80px]">
              <div className="zw-label"><span>Demo</span></div>
              <h2 className="text-[28px] sm:text-[36px] font-medium text-black tracking-[-1px] leading-tight">See it working for your institution</h2>
              <div className="w-14 border-t border-black" />
              <p className="text-base text-[#404040] leading-[1.8]">
                Tell us a little about your institution. We will call you, show you the product live and answer your questions before you decide anything.
              </p>
              <ContactDetails settings={settings} />
              {!settings.phone && !settings.sales_email && (
                <p className="flex items-center gap-2 text-sm text-[#404040]"><PhoneCall className="w-4 h-4 text-[#777]" /> We will call you on the number you give us.</p>
              )}
            </div>
            <div className="lg:w-7/12">
              <LeadForm inquiryType="demo" products={products} source="website_home" />
            </div>
          </div>
        </div>
      </section>
    </SitePage>
  );
}
