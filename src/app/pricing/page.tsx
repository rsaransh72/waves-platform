"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Check, Info, HelpCircle, ChevronRight, X } from "lucide-react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"yearly" | "monthly">("yearly");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is the difference between All Employee Pricing and Flexible User Pricing?",
      a: "All Employee Pricing is designed for organizations that want to deploy Waves One across their entire workforce, offering a significantly lower per-user cost. Flexible User Pricing allows you to purchase licenses only for specific employees, which is ideal if only a single department needs access to the suite."
    },
    {
      q: "Do I have to purchase a license for employees who do not use a computer?",
      a: "No. For the All Employee Pricing model, you are only required to purchase licenses for employees who require access to a computer or mobile device for their daily work. Factory floor workers, janitorial staff, or offline contract laborers are generally exempt."
    },
    {
      q: "Can I switch from Flexible User to All Employee Pricing later?",
      a: "Yes! If you start with Flexible User Pricing for a specific department and later decide to roll out Waves One across your entire organization, you can transition to the All Employee Pricing model to take advantage of the lower rates."
    },
    {
      q: "Is there a minimum number of users required?",
      a: "For the All Employee model, you must purchase a license for every eligible employee (minimum of 5 employees). For Flexible User Pricing, there is no minimum requirement—you can start with just 1 user."
    },
    {
      q: "Are there any hidden costs for implementation?",
      a: "No. Your subscription includes full access to all 40+ apps. However, if you require dedicated hands-on implementation, customized workflows, or data migration services, we offer optional paid consulting packages through our Enterprise Services team."
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full pt-16">
        
        {/* Header Section */}
        <section className="w-full max-w-4xl mx-auto px-6 text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#111] tracking-tight mb-6">
            Transparent pricing for <br className="hidden sm:block" /> your entire business.
          </h1>
          <p className="text-[17px] text-[#555] leading-relaxed max-w-2xl mx-auto">
            Waves One gives you access to our entire suite of 40+ integrated business applications. Choose the licensing model that best fits your organizational strategy.
          </p>
        </section>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-16">
          <div className="bg-[#f0f2f5] p-1 rounded-full flex items-center relative">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-8 py-2.5 rounded-full text-[14px] font-semibold transition-all relative z-10 ${
                billingCycle === "monthly" ? "bg-white text-black shadow-sm" : "text-[#555] hover:text-[#111]"
              }`}
            >
              Pay Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-8 py-2.5 rounded-full text-[14px] font-semibold transition-all relative z-10 flex items-center gap-2 ${
                billingCycle === "yearly" ? "bg-[#1d4ed8] text-white shadow-md" : "text-[#555] hover:text-[#111]"
              }`}
            >
              Pay Yearly
              {billingCycle !== "yearly" && (
                <span className="bg-[#10b981] text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Save 20%</span>
              )}
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <section className="w-full max-w-6xl mx-auto px-6 mb-24">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            
            {/* All Employee Pricing */}
            <div className="bg-white rounded-2xl border-2 border-[#1d4ed8] shadow-[0_20px_50px_rgba(29,78,216,0.1)] p-8 md:p-10 relative flex flex-col transform hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 bg-[#1d4ed8] text-white text-[12px] font-bold uppercase tracking-widest px-6 py-1.5 rounded-full">
                Best Value
              </div>
              
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#111] mb-3">All Employee Pricing</h2>
                <p className="text-[15px] text-[#666] leading-relaxed">
                  For businesses that want to empower their entire workforce with Waves One. Must purchase a license for every employee.
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-[28px] font-medium text-[#111] relative top-[-8px]">₹</span>
                  <span className="text-[54px] font-extrabold text-[#111] leading-none tracking-tight">
                    {billingCycle === "yearly" ? "1,800" : "2,200"}
                  </span>
                </div>
                <div className="text-[14px] text-[#555] font-medium mt-2">
                  / employee / month
                </div>
                <div className="text-[12px] text-[#888] mt-1">
                  {billingCycle === "yearly" ? "Billed annually" : "Billed monthly"}
                </div>
              </div>

              <Link 
                href="/book-demo"
                className="w-full py-4 bg-[#1d4ed8] hover:bg-[#1e40af] text-white rounded-xl font-bold text-[16px] transition-colors flex justify-center items-center mb-8"
              >
                Request pricing consultation
              </Link>

              <div className="flex-1 bg-[#f9fafb] -mx-8 md:-mx-10 -mb-8 md:-mb-10 p-8 md:p-10 rounded-b-[14px]">
                <h4 className="font-bold text-[#111] text-[15px] mb-4">Includes everything in Waves One:</h4>
                <ul className="space-y-4">
                  {[
                    "Access to all 40+ enterprise apps",
                    "Unlimited data storage pooling",
                    "Enterprise-grade security controls",
                    "24/7 dedicated support via phone & chat",
                    "Free concierge onboarding session"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px] text-[#444]">
                      <Check className="w-5 h-5 text-[#10b981] shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Flexible User Pricing */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-10 flex flex-col transform hover:-translate-y-1 transition-transform duration-300">
              
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#111] mb-3">Flexible User Pricing</h2>
                <p className="text-[15px] text-[#666] leading-relaxed">
                  For businesses that want to purchase Waves One only for specific teams, departments, or individual users.
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-[28px] font-medium text-[#111] relative top-[-8px]">₹</span>
                  <span className="text-[54px] font-extrabold text-[#111] leading-none tracking-tight">
                    {billingCycle === "yearly" ? "4,500" : "5,400"}
                  </span>
                </div>
                <div className="text-[14px] text-[#555] font-medium mt-2">
                  / user / month
                </div>
                <div className="text-[12px] text-[#888] mt-1">
                  {billingCycle === "yearly" ? "Billed annually" : "Billed monthly"}
                </div>
              </div>

              <Link 
                href="/book-demo"
                className="w-full py-4 bg-white border-2 border-[#1d4ed8] text-[#1d4ed8] hover:bg-[#f8faff] rounded-xl font-bold text-[16px] transition-colors flex justify-center items-center mb-8"
              >
                Request pricing consultation
              </Link>

              <div className="flex-1 bg-[#f9fafb] -mx-8 md:-mx-10 -mb-8 md:-mb-10 p-8 md:p-10 rounded-b-[14px]">
                <h4 className="font-bold text-[#111] text-[15px] mb-4">Includes everything in Waves One:</h4>
                <ul className="space-y-4">
                  {[
                    "Access to all 40+ enterprise apps",
                    "Standard data storage allocation",
                    "Advanced administrative controls",
                    "Standard email and chat support",
                    "Self-service onboarding portal"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px] text-[#444]">
                      <Check className="w-5 h-5 text-[#10b981] shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </section>

        {/* Feature Banner */}
        <section className="w-full bg-[#111827] py-16">
          <div className="w-full max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-3">Not ready for the full suite?</h3>
              <p className="text-[#9ca3af] text-[16px]">
                You can also purchase our applications individually or in smaller departmental bundles like CRM Plus or Finance Plus.
              </p>
            </div>
            <Link href="/pricing/individual" className="shrink-0 px-8 py-3.5 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-colors">
              View Individual Pricing
            </Link>
          </div>
        </section>

        {/* FAQs */}
        <section className="w-full max-w-4xl mx-auto px-6 py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#111] mb-4">Frequently Asked Questions</h2>
            <p className="text-[#555] text-[16px]">Have questions about the All Employee pricing model? We have answers.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`border rounded-xl overflow-hidden transition-colors ${openFaq === idx ? "border-[#1d4ed8] bg-[#f8faff]" : "border-[#e5e7eb] bg-white hover:border-[#cbd5e1]"}`}
              >
                <button 
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <span className={`font-bold text-[16px] ${openFaq === idx ? "text-[#1d4ed8]" : "text-[#111]"}`}>
                    {faq.q}
                  </span>
                  <div className={`shrink-0 ml-4 w-6 h-6 flex items-center justify-center rounded-full transition-transform duration-300 ${openFaq === idx ? "rotate-90 bg-[#1d4ed8] text-white" : "bg-[#f1f5f9] text-[#64748b]"}`}>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-[#444] text-[15px] leading-relaxed border-t border-[#1d4ed8]/10 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full bg-[#f8f9fa] py-8 border-t border-[#e6e9f0]">
        <div className="w-full max-w-[1280px] mx-auto px-[5%] flex flex-col lg:flex-row items-center justify-between text-xs text-[#7d7d7d] gap-6 lg:gap-4">
          <p className="text-center lg:text-left">&copy; {new Date().getFullYear()} Waves Technologies. Contact our team for plan and onboarding details.</p>
          <div className="flex flex-wrap justify-center lg:justify-end items-center gap-4 lg:gap-6">
            <Link href="/contact" className="hover:text-black transition">Contact Sales</Link>
            <Link href="/services" className="hover:text-black transition">Find a Partner</Link>
            <Link href="/book-demo" className="text-[#1d4ed8] font-bold hover:underline">Request a Demo</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
