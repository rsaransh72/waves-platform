import Link from "next/link";
import Navbar from "@/components/Navbar";
import SchoolDashboardDemo from "@/components/SchoolDashboardDemo";
import BookDemoForm from "@/components/BookDemoForm";
import { CheckCircle2, ChevronRight, BookOpen, Clock, ShieldCheck, Users } from "lucide-react";

export const metadata = {
  title: "School Suite | Waves",
  description: "Comprehensive school management system with smart attendance, grading, and parent communication.",
};

export default function SchoolErpPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar />

      <main className="flex-1 w-full">
        
        {/* ========================================================================= */}
        {/* 1. PRODUCT HERO SECTION — Clean Zoho Inner Page Pattern                  */}
        {/* ========================================================================= */}
        <section className="w-full bg-white border-b border-[#e6e9f0] px-6 py-12 lg:px-[5%] lg:pt-[100px] lg:pb-[80px]">
          <div className="max-w-[1280px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              
              {/* Left Column: Typography */}
              <div className="lg:w-1/2">
                <div className="zw-label mb-6">
                  <span className="!text-[#226eb4]">WAVES SCHOOL SUITE</span>
                </div>
                
                <h1 className="text-[46px] lg:text-[54px] font-medium text-black tracking-[-1.5px] leading-[1.1] mb-6">
                  The smart OS for modern institutions.
                </h1>

                <p className="text-[18px] text-[#404040] leading-[1.7] max-w-xl mb-10">
                  Automate student admissions, fee collection, and parent communication with an AI-powered academic LMS built for scale.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <Link href="/signup" className="zw-cta-main">
                    START 14-DAY FREE TRIAL
                  </Link>
                  <Link href="#demo" className="zw-cta-outlined flex items-center gap-2">
                    BOOK A DEMO <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                
                <div className="mt-8 flex items-center gap-2 text-[13px] text-[#707070] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>No credit card required. Cancel anytime.</span>
                </div>
              </div>

              {/* Right Column: Clean UI Vector (Pure CSS) */}
              <div className="lg:w-1/2 w-full pt-8 lg:pt-0 overflow-hidden relative" style={{ minHeight: "300px" }}>
                <div className="absolute inset-0 lg:static transform scale-[0.45] sm:scale-[0.6] lg:scale-100 origin-top-left lg:origin-center w-[800px] lg:w-full">
                  <div className="transform lg:-rotate-y-12 lg:rotate-x-12 perspective-1000">
                    <div className="shadow-2xl shadow-[#226eb4]/20 rounded-xl">
                      <SchoolDashboardDemo />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. CORE FEATURES GRID                                                     */}
        {/* ========================================================================= */}
        <section className="w-full bg-[#f8f9fa] px-6 py-16 lg:px-[5%] lg:py-[100px]">
          <div className="max-w-[1280px] mx-auto">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-[36px] font-medium text-black tracking-tight mb-4">
                Everything you need to run your school.
              </h2>
              <p className="text-[17px] text-[#404040] leading-[1.7]">
                Replace disconnected tools with a single, unified suite that brings administration, teachers, and parents onto one platform.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
              
              {/* Feature 1 */}
              <div>
                <div className="w-12 h-12 bg-blue-50 text-[#226eb4] flex items-center justify-center rounded-lg mb-6">
                  <Clock className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h3 className="text-[20px] font-medium text-black mb-3">Smart Attendance</h3>
                <p className="text-[15px] text-[#404040] leading-[1.7]">
                  RFID gate integration and biometric facial recognition instantly logs student entry and sends automated WhatsApp alerts to parents.
                </p>
              </div>

              {/* Feature 2 */}
              <div>
                <div className="w-12 h-12 bg-blue-50 text-[#226eb4] flex items-center justify-center rounded-lg mb-6">
                  <BookOpen className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h3 className="text-[20px] font-medium text-black mb-3">Academic LMS</h3>
                <p className="text-[15px] text-[#404040] leading-[1.7]">
                  CBSE/ICSE compliant grade books, term planning, and automated report card generation with 1-click PDF exports.
                </p>
              </div>

              {/* Feature 3 */}
              <div>
                <div className="w-12 h-12 bg-blue-50 text-[#226eb4] flex items-center justify-center rounded-lg mb-6">
                  <Users className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h3 className="text-[20px] font-medium text-black mb-3">Parent Portal</h3>
                <p className="text-[15px] text-[#404040] leading-[1.7]">
                  A dedicated mobile-friendly portal for parents to pay fees online, track bus GPS, and communicate with teachers.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. LIVE ENTERPRISE DEMO BOOKING FORM                                       */}
        {/* ========================================================================= */}
        <section id="demo" className="w-full bg-[#f8f9fa] py-16 sm:py-24 border-t border-[#e6e9f0]">
          <div className="w-full max-w-[1280px] mx-auto px-[5%]">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <span className="waves-mono-tag">
                  <span className="waves-mono-tag-dot" />
                  ENTERPRISE CONSULTATION
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-black tracking-tight leading-tight">
                  Schedule an executive demo <br />
                  built around your school.
                </h2>
                <div className="w-11 h-[2px] bg-[#226eb4]" />
                <p className="text-base text-[#404040] leading-relaxed">
                  Our education specialists will model your class structure, grading system, and fee collection workflows during a live 30-minute working session.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center space-x-3 text-sm text-[#333333]">
                    <CheckCircle2 className="w-4 h-4 text-[#226eb4] shrink-0" />
                    <span>Free student data migration assistance</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-[#333333]">
                    <CheckCircle2 className="w-4 h-4 text-[#226eb4] shrink-0" />
                    <span>Dedicated account manager & on-site implementation</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-[#333333]">
                    <CheckCircle2 className="w-4 h-4 text-[#226eb4] shrink-0" />
                    <span>Custom API endpoints for biometric device integrations</span>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <div className="lg:col-span-6 bg-white border border-[#e2e8f0] rounded-xl p-6 sm:p-10 shadow-sm">
                <BookDemoForm />
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full bg-white py-8 border-t border-[#e2e8f0]">
        <div className="w-full max-w-[1280px] mx-auto px-[5%] flex flex-col lg:flex-row items-center justify-between text-xs text-[#7d7d7d] gap-6 lg:gap-4">
          <p className="text-center lg:text-left">&copy; {new Date().getFullYear()} Waves Technologies. All rights reserved.</p>
          <div className="flex flex-wrap justify-center lg:justify-end items-center gap-4 lg:gap-6">
            <Link href="/school-erp" className="hover:text-black transition">School Suite</Link>
            <Link href="/hospital-erp" className="hover:text-black transition">Health Suite</Link>
            <Link href="/pharmacy-pos" className="hover:text-black transition">Pharmacy POS</Link>
            <Link href="/pricing" className="hover:text-black transition">Pricing</Link>
            <Link href="/signup" className="text-[#e42525] font-bold hover:underline">Get Started Free &gt;</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
