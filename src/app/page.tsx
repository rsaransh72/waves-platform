import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import BookDemoForm from "@/components/BookDemoForm";
import { 
  GraduationCap, 
  Hospital, 
  Store, 
  Users, 
  Receipt, 
  UserCheck, 
  Database, 
  Headphones, 
  Cpu, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  PhoneCall,
  Sparkles,
  Layers,
  ArrowRight,
  ChevronRight,
  Globe
} from "lucide-react";

export const metadata = {
  title: "Waves | Cloud Software Suite for Institutions & Businesses",
  description: "A unique and powerful cloud management software suite designed for schools, hospitals, and pharmacies of all sizes, built by a team that values your data privacy.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar />

      <main className="flex-1 w-full">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION — Exact Zoho Homepage Pattern                            */}
        {/* ========================================================================= */}
        <section className="w-full bg-white px-6 pt-10 pb-16 lg:pt-[100px] lg:pb-[100px]">
          <div className="max-w-[1280px] mx-auto lg:px-[2%]">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center lg:items-start">
              
              {/* Left Column: Typography + CTA */}
              <div className="lg:w-[50%] pt-6 text-center lg:text-left flex flex-col items-center lg:items-start">
                
                <h1 className="text-[36px] sm:text-[48px] lg:text-[54px] font-normal text-[#111111] tracking-tight leading-[1.15]">
                  Your institutional<br/>
                  operations,<br/>
                  powered by <span className="font-medium text-[#e42525]">Waves</span>.
                </h1>

                {/* Zoho-style divider line */}
                <div className="w-[50px] border-t-[3px] border-[#e42525] mt-8 mb-6 mx-auto lg:mx-0" />

                <p className="text-[17px] text-[#444] leading-[1.6] max-w-[480px] mb-10">
                  A unique and powerful cloud management software suite designed for schools, healthcare clinics, and retail pharmacies of all sizes, built by a company that{" "}
                  <Link href="#values" className="text-[#0066cc] hover:underline">
                    values your data privacy
                  </Link>
                  .
                </p>

                <Link href="/school-erp" className="bg-[#e42525] hover:bg-[#d11a1a] text-white px-8 py-4 text-[14px] font-bold uppercase tracking-wider rounded-[3px] transition-colors flex items-center justify-center w-full sm:w-auto">
                  EXPLORE SCHOOL ERP <ChevronRight className="w-4 h-4 ml-2" strokeWidth={3} />
                </Link>
              </div>

              {/* Right Column: Featured Apps Grid (Zoho Style) */}
              <div className="lg:w-[50%] w-full mt-10 lg:mt-0 relative z-10">
                <div className="bg-white rounded-lg shadow-[0_15px_50px_rgba(0,0,0,0.08)] border border-[#f0f0f0] p-8 lg:p-12 w-full">
                  <div className="flex flex-col items-center mb-8">
                    <h2 className="text-[13px] font-bold text-[#111111] uppercase tracking-[1.5px] mb-3 text-center">
                      Featured apps
                    </h2>
                    <div className="w-[30px] border-t-[3px] border-[#e42525]" />
                  </div>

                  <div className="flex flex-col gap-0 lg:grid lg:grid-cols-2 lg:gap-x-12 lg:gap-y-10">
                    
                    <Link href="/school-erp" className="group flex items-start gap-4 py-5 border-b border-[#f0f0f0] lg:border-none lg:p-0">
                      <div className="text-[#0066cc] flex items-center justify-center shrink-0 mt-1">
                        <GraduationCap className="w-8 h-8" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-[17px] font-medium text-[#111] leading-tight mb-2 group-hover:text-[#0066cc] transition-colors">
                          Classes
                        </h3>
                        <p className="text-[13px] text-[#666] leading-[1.6]">
                          AI-powered academic LMS with smart attendance.
                        </p>
                      </div>
                    </Link>

                    <Link href="/hospital-erp" className="group flex items-start gap-4 py-5 border-b border-[#f0f0f0] lg:border-none lg:p-0">
                      <div className="text-[#008f52] flex items-center justify-center shrink-0 mt-1">
                        <Hospital className="w-8 h-8" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-[17px] font-medium text-[#111] leading-tight mb-2 group-hover:text-[#008f52] transition-colors">
                          Health
                        </h3>
                        <p className="text-[13px] text-[#666] leading-[1.6]">
                          OPD queue tokens on TV and digital Rx prescriptions.
                        </p>
                      </div>
                    </Link>

                    <Link href="/pharmacy-pos" className="group flex items-start gap-4 py-5 border-b border-[#f0f0f0] lg:border-none lg:p-0">
                      <div className="text-[#d88900] flex items-center justify-center shrink-0 mt-1">
                        <Store className="w-8 h-8" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-[17px] font-medium text-[#111] leading-tight mb-2 group-hover:text-[#d88900] transition-colors">
                          Pharmacy
                        </h3>
                        <p className="text-[13px] text-[#666] leading-[1.6]">
                          3-second barcode billing & batch expiry alerts.
                        </p>
                      </div>
                    </Link>

                    <Link href="/erp" className="group flex items-start gap-4 py-5 border-b border-[#f0f0f0] lg:border-none lg:p-0">
                      <div className="text-[#8445e8] flex items-center justify-center shrink-0 mt-1">
                        <Layers className="w-8 h-8" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-[17px] font-medium text-[#111] leading-tight mb-2 group-hover:text-[#8445e8] transition-colors">
                          Waves ERP
                        </h3>
                        <p className="text-[13px] text-[#666] leading-[1.6]">
                          Unified general ledger, supply chain & e-invoicing.
                        </p>
                      </div>
                    </Link>

                    <Link href="/pricing" className="group flex items-start gap-4 py-5 border-b border-[#f0f0f0] lg:border-none lg:p-0">
                      <div className="text-[#00b3d8] flex items-center justify-center shrink-0 mt-1">
                        <Receipt className="w-8 h-8" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-[17px] font-medium text-[#111] leading-tight mb-2 group-hover:text-[#00b3d8] transition-colors">
                          Books
                        </h3>
                        <p className="text-[13px] text-[#666] leading-[1.6]">
                          GST invoicing, multi-counter cash balancing & audits.
                        </p>
                      </div>
                    </Link>

                  <Link href="/services" className="group flex items-start gap-4 py-5 border-b border-[#f0f0f0] lg:border-none lg:p-0">
                      <div className="text-[#e42525] flex items-center justify-center shrink-0 mt-1">
                        <UserCheck className="w-8 h-8" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-[17px] font-medium text-[#111] leading-tight mb-2 group-hover:text-[#e42525] transition-colors">
                          People
                        </h3>
                        <p className="text-[13px] text-[#666] leading-[1.6]">
                          Biometric check-ins, nursing shifts & automated payroll.
                        </p>
                      </div>
                    </Link>
                  </div>
                  
                  <div className="mt-12 text-center">
                    <Link href="/pricing" className="text-[#0066cc] text-[13px] font-bold uppercase tracking-wider hover:underline flex items-center justify-center gap-1">
                      EXPLORE ALL PRODUCTS <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. PROMO TRAY — Zoho Catalyst + Zia Style                               */}
        {/* ========================================================================= */}
        <section className="w-full mt-16 mb-20 px-6 lg:px-[2%]">
          <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-6">
            
            {/* Promo Card 1: App Builder (Catalyst Style) */}
            <div className="flex-1 bg-gradient-to-br from-[#f4f7fb] to-[#e8f0fe] relative overflow-hidden flex flex-col justify-center py-16 px-8 lg:px-14 rounded-xl shadow-sm border border-[#e6e9f0]">
              
              {/* Abstract Yellow Swoosh Background */}
              <div className="absolute -bottom-24 -right-10 w-[300px] h-[300px] bg-[#ffd900] rounded-full blur-[80px] opacity-40 mix-blend-multiply pointer-events-none"></div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="text-[#8445e8] text-[11px] font-bold tracking-[1.5px] uppercase mb-8 self-start lg:self-auto w-full text-left">
                  App Builder
                </div>
                
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Cpu className="w-6 h-6 text-[#111]" />
                  <span className="text-[20px] font-bold text-[#111] tracking-tight">Waves <span className="font-light">Flow</span></span>
                </div>
                
                <h3 className="text-[24px] sm:text-[32px] font-normal text-[#226eb4] tracking-tight mb-4 leading-tight max-w-[400px]">
                  Build production-ready apps <span className="text-[#e42525]">with AI</span>
                </h3>
                
                <p className="text-[15px] text-[#555] mb-8">
                  Waves Flow: Agent-ready. Full-stack.
                </p>
                
                <Link 
                  href="/services#custom-development"
                  className="px-6 py-2.5 border border-[#226eb4] text-[#226eb4] hover:bg-[#226eb4] hover:text-white rounded-full text-[13px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 w-fit"
                >
                  BUILD WITH AGENTS <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Promo Card 2: Agent Builder (Zia Style) */}
            <div className="flex-1 bg-gradient-to-br from-[#fbf6fc] to-[#f3e8f9] relative overflow-hidden flex flex-col justify-center py-16 px-8 lg:px-14 rounded-xl shadow-sm border border-[#e6e9f0]">
              
              {/* Abstract Pink Swoosh Background */}
              <div className="absolute -top-24 -left-10 w-[300px] h-[300px] bg-[#d8b4fe] rounded-full blur-[80px] opacity-30 mix-blend-multiply pointer-events-none"></div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="text-[#7e22ce] text-[11px] font-bold tracking-[1.5px] uppercase mb-8 self-start lg:self-auto w-full text-left">
                  Agent Builder
                </div>
                
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="w-6 h-6 bg-[#008f52] rounded flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[20px] font-bold text-[#111] tracking-tight">Waves <span className="font-light">AI Agents</span></span>
                </div>
                
                <h3 className="text-[24px] sm:text-[32px] font-normal text-[#111] tracking-tight mb-4 leading-tight max-w-[450px]">
                  Waves Agent Studio—your digital workforce
                </h3>
                
                <p className="text-[15px] text-[#555] mb-8 max-w-[400px]">
                  Build autonomous agents that can qualify leads, resolve tickets, draft emails, and more.
                </p>
                
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <div className="px-3 py-1.5 bg-[#333] text-white rounded text-[11px] font-medium flex items-center gap-1.5">
                    <Globe className="w-3 h-3" /> Google Chrome
                  </div>
                  <Link 
                    href="#demo"
                    className="px-6 py-2.5 border border-[#7e22ce] text-[#7e22ce] hover:bg-[#7e22ce] hover:text-white rounded-full text-[13px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 w-fit"
                  >
                    BUILD WITH AGENTS <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. WAVES ONE — Zoho One Pattern                                          */}
        {/* ========================================================================= */}
        <section className="w-full bg-white border-t border-[#e6e9f0] px-6 py-14 lg:px-[5%] lg:py-[80px]">
          <div className="max-w-[1280px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
              
              <div className="lg:w-7/12 space-y-4 text-center lg:text-left flex flex-col items-center lg:items-start">
                <div className="zw-label mb-2">
                  <span className="!text-[#e42525]">ALL-IN-ONE SUITE</span>
                </div>
                
                <h2 className="text-[30px] sm:text-[42px] lg:text-[48px] font-medium text-black tracking-[-1.5px] leading-[1.1]">
                  Waves One
                </h2>

                <p className="text-[15px] sm:text-[17px] text-[#404040] leading-[1.75] max-w-lg">
                  <span className="font-semibold text-black">The operating system for institutions.</span> Run your school, clinic, or pharmacy chain on Waves — our unified platform connecting admissions, fee collection, OPD queue calling, and pharmacy checkout.
                </p>

                <div className="bg-[#fdf2f2] border border-red-100 rounded-lg px-5 py-3 text-sm text-[#404040]">
                  Get full campus-wide access, starting at{" "}
                  <span className="font-bold text-black">₹4,999/month</span> with unlimited staff logins.
                </div>

                <div className="pt-2 w-full sm:w-auto">
                  <Link href="/pricing" className="zw-cta-main !bg-[#e42525] w-full sm:w-auto text-center block sm:inline-block">
                    TRY WAVES ONE <ChevronRight className="w-4 h-4 inline-block ml-1" />
                  </Link>
                </div>
              </div>

              <div className="lg:w-5/12 bg-[#f8f9fa] border border-[#e6e9f0] rounded-lg p-7 sm:p-8">
                <blockquote className="text-base sm:text-lg text-[#222] italic font-normal leading-[1.8] mb-6">
                  &ldquo;From student biometric attendance to instant WhatsApp fee receipts and hospital OPD token displays, Waves One replaced 4 separate software systems across our campus.&rdquo;
                </blockquote>
                
                <div className="flex items-center gap-4 border-t border-[#e6e9f0] pt-5">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-[#226eb4] font-medium text-lg flex items-center justify-center shrink-0">
                    RS
                  </div>
                  <div>
                    <p className="font-medium text-sm text-black">Dr. Rajesh Sharma</p>
                    <p className="text-xs text-[#7d7d7d]">Managing Director, Apex Group of Institutions</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. IMPLEMENTATION SERVICES STRIP                                         */}
        {/* ========================================================================= */}
        <section className="w-full bg-[#f8f9fa] px-6 py-16 lg:px-[5%] lg:py-[80px]">
          <div className="max-w-[1280px] mx-auto">
            
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="zw-label mx-auto mb-5">
                <span>Zero-Downtime Transition</span>
              </div>
              <h2 className="text-[28px] sm:text-[36px] font-medium text-black tracking-[-1px]">
                Our Hands-On Implementation Services
              </h2>
              <p className="text-base text-[#404040] mt-4 leading-[1.8]">
                Software fails when rollout is neglected. Our deployment engineers handle data migration, hardware setup, and staff onboarding directly.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="bg-white p-7 rounded-lg border border-[#e6e9f0] shadow-[0_0_0_4px_#f9fafc] flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#226eb4] flex items-center justify-center mb-5">
                    <Database className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-medium text-black mb-2">Legacy Data Migration</h3>
                  <p className="text-sm text-[#404040] leading-[1.8] mb-4">
                    Migrate student profiles, fee ledgers, medicine batches, and patient records from Tally, Marg, Busy, or Excel in under 24 hours.
                  </p>
                </div>
                <Link href="/services#data-migration" className="zw-cta-arrow text-xs">
                  View migration process
                </Link>
              </div>

              <div className="bg-white p-7 rounded-lg border border-[#e6e9f0] shadow-[0_0_0_4px_#f9fafc] flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-medium text-black mb-2">On-Site Staff Training</h3>
                  <p className="text-sm text-[#404040] leading-[1.8] mb-4">
                    Workshops for teachers (report cards), nurses (vitals & OPD), and cashiers (barcode POS) in Hindi, English, and regional languages.
                  </p>
                </div>
                <Link href="/services#staff-training" className="zw-cta-arrow text-xs">
                  View training modules
                </Link>
              </div>

              <div className="bg-white p-7 rounded-lg border border-[#e6e9f0] shadow-[0_0_0_4px_#f9fafc] flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-medium text-black mb-2">Hardware & IoT Setup</h3>
                  <p className="text-sm text-[#404040] leading-[1.8] mb-4">
                    Calibration for USB barcode scanners, thermal printers, RFID turnstiles, and waiting room token TV screens.
                  </p>
                </div>
                <Link href="/services#hardware-integration" className="zw-cta-arrow text-xs">
                  View supported hardware
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. CORE VALUES — Zoho Values Section                                     */}
        {/* ========================================================================= */}
        <section id="values" className="w-full bg-white border-t border-[#e6e9f0] px-6 py-14 lg:px-[5%] lg:py-[80px]">
          <div className="max-w-[1280px] mx-auto">
            
            <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
              <h2 className="text-[26px] sm:text-[34px] font-medium text-black tracking-[-1px] leading-tight">
                The core values and principles
                <span className="block">that drive us</span>
              </h2>
              <div className="w-[50px] border-t-[3px] border-[#e42525] mx-auto mt-6" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
              
              <div className="bg-white p-6 sm:p-7 rounded-xl border border-[#e6e9f0] shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#226eb4] flex items-center justify-center mb-5">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h3 className="text-[16px] font-semibold text-black mb-2">Long-term commitment</h3>
                <p className="text-[14px] text-[#555] leading-[1.75]">
                  We build software designed for decades of daily operational continuity. We never force disruptive redesigns or aggressive price hikes.
                </p>
              </div>

              <div className="bg-white p-6 sm:p-7 rounded-xl border border-[#e6e9f0] shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                  <Headphones className="w-5 h-5" />
                </div>
                <h3 className="text-[16px] font-semibold text-black mb-2">Customer-first philosophy</h3>
                <p className="text-[14px] text-[#555] leading-[1.75]">
                  Direct phone access to human solutions engineers who know your institution by name. On-site visits and real local support.
                </p>
              </div>

              <div className="bg-white p-6 sm:p-7 rounded-xl border border-[#e6e9f0] shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="w-10 h-10 rounded-lg bg-red-50 text-[#e42525] flex items-center justify-center mb-5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-[16px] font-semibold text-black mb-2">Privacy and security first</h3>
                <p className="text-[14px] text-[#555] leading-[1.75]">
                  We do not own, sell, or advertise against your student records, patient histories, or medicine sales. Full data sovereignty.
                </p>
              </div>

              <div className="bg-white p-6 sm:p-7 rounded-xl border border-[#e6e9f0] shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-[16px] font-semibold text-black mb-2">Focus on R&D</h3>
                <p className="text-[14px] text-[#555] leading-[1.75]">
                  Software is our craft. We own the entire technology stack, including running our own data centres in India for sovereignty.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. STATS — Zoho Stats Counter                                            */}
        {/* ========================================================================= */}
        <section className="w-full bg-[#005fb8] px-6 py-16 lg:px-[5%] lg:py-[80px]">
          <div className="max-w-[1280px] mx-auto">
            
            <div className="text-center mb-10 flex flex-col items-center">
              <h2 className="text-[28px] sm:text-[36px] font-medium text-white tracking-[-1px]">
                Made in India.<span className="block lg:inline"> Engineered for the World.</span>
              </h2>
              <div className="w-[50px] border-t-2 border-[#4ade80] mx-auto mt-6" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-4 text-center mt-12">
              
              <div className="px-2">
                <p className="text-[40px] sm:text-[48px] font-medium text-white">150K<span className="text-[#4ade80]">+</span></p>
                <p className="text-[12px] sm:text-[14px] font-bold text-white/80 mt-2">Users Globally</p>
              </div>

              <div className="px-2">
                <p className="text-[40px] sm:text-[48px] font-medium text-white">500<span className="text-[#4ade80]">+</span></p>
                <p className="text-[12px] sm:text-[14px] font-bold text-white/80 mt-2">Institutions Served</p>
              </div>

              <div className="px-2">
                <p className="text-[40px] sm:text-[48px] font-medium text-white">99.9<span className="text-[#4ade80]">%</span></p>
                <p className="text-[12px] sm:text-[14px] font-bold text-white/80 mt-2">Cloud Uptime SLA</p>
              </div>

              <div className="px-2">
                <p className="text-[40px] sm:text-[48px] font-medium text-white">24<span className="text-[#4ade80]"> Hrs</span></p>
                <p className="text-[12px] sm:text-[14px] font-bold text-white/80 mt-2">Setup Turnaround</p>
              </div>

            </div>

            <div className="text-center mt-16">
              <Link href="/contact" className="inline-block border border-white/30 rounded px-6 py-3 text-white text-[13px] font-bold tracking-wider hover:bg-white/10 transition">
                MORE ABOUT WAVES <ChevronRight className="w-4 h-4 inline-block ml-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. DEMO BOOKING FORM                                                     */}
        {/* ========================================================================= */}
        <section id="demo" className="w-full bg-white border-t border-[#e6e9f0] px-6 py-14 lg:px-[5%] lg:py-[80px]">
          <div className="max-w-[1280px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
              
              <div className="lg:w-5/12 space-y-5 lg:sticky lg:top-[80px]">
                <div className="zw-label">
                  <span>Consultation & Pilot</span>
                </div>
                
                <h2 className="text-[28px] sm:text-[36px] font-medium text-black tracking-[-1px] leading-tight">
                  Ready to modernize your institutional operations?
                </h2>

                <div className="w-14 border-t border-black" />

                <p className="text-base text-[#404040] leading-[1.8]">
                  Tell us about your campus, hospital, or pharmacy. Our solutions team will configure a dedicated live walkthrough tailored to your workflows.
                </p>

                <div className="space-y-3 pt-2 text-sm text-[#404040]">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                    <span><strong className="text-black">14-Day Zero-Risk Pilot:</strong> Test with your real staff before committing.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                    <span><strong className="text-black">Free Database Migration:</strong> Zero charge to move from Tally, Marg, or Excel.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                    <span><strong className="text-black">Transparent Pricing:</strong> Zero hidden annual maintenance fees.</span>
                  </div>
                </div>

                <div className="p-5 rounded-lg bg-[#f8f9fa] border border-[#e6e9f0] mt-6">
                  <p className="text-xs font-medium text-black">Prefer speaking with a solutions engineer now?</p>
                  <a
                    href="tel:+919876543210"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#226eb4] hover:underline mt-2"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>+91 98765 43210 (Direct Line)</span>
                  </a>
                </div>
              </div>

              <div className="lg:w-7/12">
                <BookDemoForm />
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. FINAL CTA BANNER — Zoho "Ready to do your best work?"                */}
        {/* ========================================================================= */}
        <section className="w-full bg-gradient-to-b from-[#f0f5ff] to-[#e8f0fe] border-t border-[#d4e3f5] px-6 py-14 lg:px-[5%] lg:py-[80px]">
          <div className="max-w-[700px] mx-auto text-center">
            <h2 className="text-[28px] sm:text-[40px] lg:text-[46px] font-medium tracking-[-1.5px] mb-4 text-[#111]">
              Ready to <span className="text-[#226eb4]">transform</span> your institution?
            </h2>
            <div className="w-[50px] border-t-[3px] border-[#226eb4] mx-auto mt-4 mb-6" />
            <p className="text-[15px] sm:text-base text-[#555] mb-8 leading-[1.8]">
              Join 500+ institutions already running on Waves. Let&apos;s get you started.
            </p>
            <Link href="#demo" className="zw-cta-main !bg-[#226eb4] hover:!bg-[#1a5a96] shadow-lg shadow-blue-500/20 w-full sm:w-auto text-center">
              REQUEST A DEMO <ChevronRight className="w-4 h-4 inline-block ml-1" />
            </Link>
          </div>
        </section>

      </main>

      {/* ========================================================================= */}
      {/* FOOTER                                                                    */}
      {/* ========================================================================= */}
      <footer className="w-full bg-[#0a0a0a] text-[#aaa] text-xs px-6 py-12 lg:px-[5%] lg:pt-[64px] lg:pb-[48px]">
        <div className="max-w-[1280px] mx-auto">
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-[#222]">
            
            <div>
              <p className="font-bold text-white text-xs uppercase tracking-wider mb-4">Software Suites</p>
              <ul className="space-y-2.5">
                <li><Link href="/erp" className="hover:text-white transition">Waves ERP</Link></li>
                <li><Link href="/school-erp" className="hover:text-white transition">Waves School Suite</Link></li>
                <li><Link href="/hospital-erp" className="hover:text-white transition">Waves Health Suite</Link></li>
                <li><Link href="/pharmacy-pos" className="hover:text-white transition">Waves Pharmacy POS</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition">Waves One</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-white text-xs uppercase tracking-wider mb-4">Services</p>
              <ul className="space-y-2.5">
                <li><Link href="/services#data-migration" className="hover:text-white transition">Data Migration</Link></li>
                <li><Link href="/services#staff-training" className="hover:text-white transition">Staff Training</Link></li>
                <li><Link href="/services#hardware-integration" className="hover:text-white transition">Hardware Setup</Link></li>
                <li><Link href="/services#priority-sla" className="hover:text-white transition">Priority SLA</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-white text-xs uppercase tracking-wider mb-4">Industries</p>
              <ul className="space-y-2.5">
                <li><Link href="/school-erp" className="hover:text-white transition">K-12 Education</Link></li>
                <li><Link href="/hospital-erp" className="hover:text-white transition">Clinics & Hospitals</Link></li>
                <li><Link href="/pharmacy-pos" className="hover:text-white transition">Retail Chemists</Link></li>
                <li><Link href="/erp" className="hover:text-white transition">SME & Enterprise</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-white text-xs uppercase tracking-wider mb-4">Contact</p>
              <ul className="space-y-2.5">
                <li><Link href="#demo" className="hover:text-white transition">Book Walkthrough</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><a href="tel:+919876543210" className="hover:text-white transition">+91 98765 43210</a></li>
                <li><Link href="/services" className="hover:text-white transition">SLA Guarantees</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-white text-xs uppercase tracking-wider mb-4">Platform</p>
              <ul className="space-y-2.5">
                <li><Link href="/book-demo" className="hover:text-white transition font-medium text-[#f87171]">Request a Demo</Link></li>
                <li><Link href="/login" className="hover:text-white transition">Sign In</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
                <li><Link href="/services#privacy" className="hover:text-white transition">Privacy</Link></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#777]">
            <div className="flex items-center gap-2">
              <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                <span className="w-1.5 h-1.5 rounded-[1px] bg-[#e42525]" />
                <span className="w-1.5 h-1.5 rounded-[1px] bg-[#226eb4]" />
                <span className="w-1.5 h-1.5 rounded-[1px] bg-[#10b981]" />
                <span className="w-1.5 h-1.5 rounded-[1px] bg-[#f59e0b]" />
              </div>
              <span className="font-bold text-[#ccc]">WAVES TECHNOLOGIES</span>
              <span>•</span>
              <span>Unified Institutional Software</span>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <Link href="/services" className="hover:text-[#ccc] transition">Terms</Link>
              <Link href="/services" className="hover:text-[#ccc] transition">Security</Link>
              <p>&copy; 2026 Waves Technologies. All rights reserved.</p>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}