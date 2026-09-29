import Navbar from "@/components/Navbar";
import BookDemoForm from "@/components/BookDemoForm";
import Link from "next/link";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  Building2,
  Headphones,
  HelpCircle,
  MessageSquare
} from "lucide-react";

export const metadata = {
  title: "Contact Us & Schedule Walkthrough | Waves Platform",
  description: "Get in touch with Waves Technologies. Schedule a personalized 1-on-1 walkthrough of Waves ERP, School Suite, Health Suite, or Pharmacy POS.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col antialiased">
      <Navbar />

      <main className="flex-1 w-full overflow-hidden">
        
        {/* ========================================================================= */}
        {/* 1. CONTACT HERO SECTION                                                  */}
        {/* ========================================================================= */}
        <section className="w-full bg-white border-b border-[#e6e9f0]" style={{ padding: "80px 5% 100px" }}>
          <div className="w-full max-w-[1280px] mx-auto text-center">
            <div className="zw-label mx-auto mb-4">
              <span>Global Sales &amp; Support Headquarters</span>
            </div>

            <h1 className="text-[42px] sm:text-[50px] lg:text-[56px] font-medium text-black tracking-[-1px] leading-[1.15] max-w-4xl mx-auto">
              We&apos;re Here to Help Your Institution <br />
              <span className="text-[#226eb4]">Operate with Total Clarity</span>
            </h1>

            <div className="w-14 border-t border-black mx-auto mt-5 mb-5" />

            <p className="text-base sm:text-lg text-[#404040] leading-relaxed max-w-2xl mx-auto">
              Whether you are evaluating Waves ERP for a single clinic or deploying School Suite across 20 campuses, our solution architects are ready to assist.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. DIRECT DEPARTMENT HOTLINES & REGIONAL HUBS                            */}
        {/* ========================================================================= */}
        <section className="w-full bg-[#f8f9fa] border-b border-[#e6e9f0]" style={{ padding: "80px 5%" }}>
          <div className="w-full max-w-[1280px] mx-auto">
            
            <div className="grid md:grid-cols-3 gap-6">
              
              <div className="bg-white p-6 sm:p-7 rounded-xl border border-[#e6e9f0] shadow-xs hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#226eb4] flex items-center justify-center mb-4">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-black">Sales &amp; Enterprise Demos</h3>
                <p className="text-xs text-[#7d7d7d] mt-1 mb-3">Speak with a product specialist for tailored pricing</p>
                <a href="tel:+919876543210" className="text-sm font-bold text-[#226eb4] hover:underline block">
                  +91 98765 43210
                </a>
                <p className="text-[11px] text-[#888888] mt-1">Mon – Sat, 9:00 AM – 8:00 PM IST</p>
              </div>

              <div className="bg-white p-6 sm:p-7 rounded-xl border border-[#e6e9f0] shadow-xs hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Headphones className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-black">Priority Customer Support</h3>
                <p className="text-xs text-[#7d7d7d] mt-1 mb-3">Direct assistance for active schools &amp; hospitals</p>
                <a href="mailto:support@wavesplatform.in" className="text-sm font-bold text-emerald-700 hover:underline block">
                  support@wavesplatform.in
                </a>
                <p className="text-[11px] text-[#888888] mt-1">24/7/365 Emergency P1 Hotline</p>
              </div>

              <div className="bg-white p-6 sm:p-7 rounded-xl border border-[#e6e9f0] shadow-xs hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-black">Partnerships &amp; Resellers</h3>
                <p className="text-xs text-[#7d7d7d] mt-1 mb-3">Join our certified implementation partner network</p>
                <a href="mailto:partners@wavesplatform.in" className="text-sm font-bold text-purple-700 hover:underline block">
                  partners@wavesplatform.in
                </a>
                <p className="text-[11px] text-[#888888] mt-1">Regional franchise &amp; reseller inquiries</p>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. MAIN FORM & WALKTHROUGH DETAILS                                        */}
        {/* ========================================================================= */}
        <section className="w-full bg-white border-b border-[#e6e9f0]" style={{ padding: "80px 5%" }}>
          <div className="w-full max-w-[1280px] mx-auto">
            
            <div className="grid lg:grid-cols-12 gap-12 items-start">
              
              {/* Left Column */}
              <div className="lg:col-span-5 space-y-6">
                
                <div className="bg-[#f8f9fa] rounded-xl border border-[#e6e9f0] p-7">
                  <div className="zw-label mb-3">
                    <span>Pilot Overview</span>
                  </div>
                  <h2 className="text-xl font-bold text-black mt-2 mb-4">
                    What to Expect During Your Demo
                  </h2>
                  <ul className="space-y-4 text-xs sm:text-sm text-[#444444]">
                    <li className="flex items-start space-x-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-black block">Live Tailored Sandbox</span>
                        We configure a working demonstration with your specific school classes, OPD specialties, or pharmacy inventory.
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-black block">Free Legacy Migration Audit</span>
                        Our data engineers review your current Tally, Marg, Busy, or Excel files for rapid 24-hour transition.
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-black block">14-Day Zero-Risk Trial</span>
                        Full access for your teachers, nurses, or billing cashiers before any commercial commitment.
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl border border-[#e6e9f0] p-7 space-y-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#7d7d7d]">
                    REGIONAL INDIA OFFICES
                  </h3>
                  
                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 text-[#226eb4] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-black">Engineering &amp; R&amp;D Headquarters</p>
                        <p className="text-[#404040] text-xs">Waves Technologies Pvt Ltd &bull; Electronic City Phase I, Bengaluru, Karnataka 560100</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 text-[#226eb4] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-black">North India Commercial Center</p>
                        <p className="text-[#404040] text-xs">Cyber City, DLF Phase II, Gurugram, Haryana 122002</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 text-[#226eb4] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-black">Regional Implementation Hub</p>
                        <p className="text-[#404040] text-xs">Vibhuti Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Lead Form */}
              <div className="lg:col-span-7">
                <BookDemoForm />
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full bg-[#f8f9fa] py-8 border-t border-[#e6e9f0]">
        <div className="w-full max-w-[1280px] mx-auto px-[5%] flex flex-col lg:flex-row items-center justify-between text-xs text-[#7d7d7d] gap-6 lg:gap-4">
          <p className="text-center lg:text-left">&copy; {new Date().getFullYear()} Waves Technologies. All rights reserved.</p>
          <div className="flex flex-wrap justify-center lg:justify-end items-center gap-4 lg:gap-6">
            <Link href="/school-erp" className="hover:text-black transition">School Suite</Link>
            <Link href="/hospital-erp" className="hover:text-black transition">Health Suite</Link>
            <Link href="/pharmacy-pos" className="hover:text-black transition">Pharmacy POS</Link>
            <Link href="/erp" className="hover:text-black transition">Waves ERP</Link>
            <Link href="/pricing" className="hover:text-black transition">Pricing</Link>
            <Link href="/signup" className="text-[#e42525] font-bold hover:underline">Get Started Free &gt;</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
