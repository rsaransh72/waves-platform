import Link from "next/link";
import Navbar from "@/components/Navbar";
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
        <section className="w-full bg-white border-b border-[#e6e9f0]" style={{ padding: "100px 5% 80px" }}>
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

              {/* Right Column: Clean UI Vector */}
              <div className="lg:w-1/2 w-full">
                <div className="w-full rounded-[12px] shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-[#e6e9f0] overflow-hidden bg-white p-2">
                  <img 
                    src="/school_ui_vector.jpg" 
                    alt="School Management Dashboard UI" 
                    className="w-full h-auto rounded-[8px]"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. CORE FEATURES GRID                                                     */}
        {/* ========================================================================= */}
        <section className="w-full bg-[#f8f9fa]" style={{ padding: "100px 5%" }}>
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

      </main>
    </div>
  );
}
