import Link from "next/link";
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
  ChevronRight
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
        <section className="w-full bg-white" style={{ padding: "110px 5% 120px" }}>
          <div className="max-w-[1280px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
              
              {/* Left Column: Typography + CTA */}
              <div className="lg:w-1/2 pt-2">
                
                <h1 className="text-[44px] sm:text-[52px] lg:text-[60px] font-medium text-[#111111] tracking-[-1.5px] leading-[1.05]">
                  Your institutional operations,
                  <span className="block">powered by Waves.</span>
                </h1>

                {/* Zoho-style divider line */}
                <div className="w-[50px] border-t-2 border-black mt-8 mb-8" />

                <p className="text-[17px] text-[#404040] leading-[1.7] max-w-xl mb-10">
                  A unique and powerful cloud management software suite designed for schools, healthcare clinics, and retail pharmacies of all sizes, built by a company that{" "}
                  <Link href="#values" className="zw-privacy-link">
                    values your data privacy
                  </Link>
                  .
                </p>

                <Link href="/signup" className="zw-cta-main shadow-lg shadow-red-500/20">
                  Get Started For Free
                </Link>
              </div>

              {/* Right Column: Featured Apps Grid (Zoho Style) */}
              <div className="lg:w-1/2">
                
                <h2 className="text-[13px] font-bold text-[#111111] uppercase tracking-[1px] mb-8 text-center lg:text-left">
                  Featured apps
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">
                  
                  <Link href="/school-erp" className="group flex items-start gap-5">
                    <div className="text-[#0066cc] flex items-center justify-center shrink-0">
                      <GraduationCap className="w-11 h-11" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-[20px] font-medium text-[#111111] leading-tight mb-2 group-hover:text-[#0066cc] transition-colors">
                        Classes
                      </h3>
                      <p className="text-[14px] text-[#444444] leading-[1.6]">
                        AI-powered academic LMS with smart gate attendance.
                      </p>
                    </div>
                  </Link>

                  <Link href="/hospital-erp" className="group flex items-start gap-5">
                    <div className="text-[#008f52] flex items-center justify-center shrink-0">
                      <Hospital className="w-11 h-11" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-[20px] font-medium text-[#111111] leading-tight mb-2 group-hover:text-[#008f52] transition-colors">
                        Health
                      </h3>
                      <p className="text-[14px] text-[#444444] leading-[1.6]">
                        OPD queue tokens on TV and digital Rx prescriptions.
                      </p>
                    </div>
                  </Link>

                  <Link href="/pharmacy-pos" className="group flex items-start gap-5">
                    <div className="text-[#d88900] flex items-center justify-center shrink-0">
                      <Store className="w-11 h-11" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-[20px] font-medium text-[#111111] leading-tight mb-2 group-hover:text-[#d88900] transition-colors">
                        Pharmacy
                      </h3>
                      <p className="text-[14px] text-[#444444] leading-[1.6]">
                        3-second barcode billing and batch expiry alerts.
                      </p>
                    </div>
                  </Link>

                  <Link href="/erp" className="group flex items-start gap-5">
                    <div className="text-[#8445e8] flex items-center justify-center shrink-0">
                      <Layers className="w-11 h-11" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-[20px] font-medium text-[#111111] leading-tight mb-2 group-hover:text-[#8445e8] transition-colors">
                        Waves ERP
                      </h3>
                      <p className="text-[14px] text-[#444444] leading-[1.6]">
                        Unified general ledger, supply chain & GST e-invoicing.
                      </p>
                    </div>
                  </Link>

                  <Link href="/pricing" className="group flex items-start gap-5">
                    <div className="text-[#00b3d8] flex items-center justify-center shrink-0">
                      <Receipt className="w-11 h-11" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-[20px] font-medium text-[#111111] leading-tight mb-2 group-hover:text-[#00b3d8] transition-colors">
                        Books
                      </h3>
                      <p className="text-[14px] text-[#444444] leading-[1.6]">
                        GST invoicing, multi-counter cash balancing & audits.
                      </p>
                    </div>
                  </Link>

                  <Link href="/services" className="group flex items-start gap-5">
                    <div className="text-[#e42525] flex items-center justify-center shrink-0">
                      <UserCheck className="w-11 h-11" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-[20px] font-medium text-[#111111] leading-tight mb-2 group-hover:text-[#e42525] transition-colors">
                        People
                      </h3>
                      <p className="text-[14px] text-[#444444] leading-[1.6]">
                        Biometric check-ins, nursing shifts & automated payroll.
                      </p>
                    </div>
                  </Link>

                </div>

                <div className="mt-12 text-center lg:text-left">
                  <Link href="/pricing" className="text-[#0066cc] text-[14px] font-bold uppercase flex items-center gap-1.5 justify-center lg:justify-start hover:underline">
                    Explore all products <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. PROMO TRAY — Zoho Catalyst + Zia Style                               */}
        {/* ========================================================================= */}
        <section className="w-full bg-[#f8f9fa]" style={{ padding: "80px 5%" }}>
          <div className="max-w-[1280px] mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Promo Card 1: Low-Code */}
              <div className="bg-[#f0f5ff] rounded-[10px] p-8 sm:p-12 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
                <div>
                  <div className="zw-label mb-5">
                    <span>Low-Code Workflows</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#226eb4] font-medium text-[15px] mb-3">
                    <Sparkles className="w-4 h-4" />
                    <span>Waves Flow Studio</span>
                  </div>
                  <h3 className="text-[28px] font-medium text-black tracking-tight mb-4 leading-tight">
                    Build custom institutional workflows without code
                  </h3>
                  <p className="text-[16px] text-[#404040] leading-[1.7] mb-8">
                    Craft student admission portals, outpatient intake forms, and automated WhatsApp alerts in minutes.
                  </p>
                </div>
                <div>
                  <Link 
                    href="/services#custom-development"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#226eb4] hover:bg-[#1a5a96] text-white text-[13px] font-bold uppercase tracking-wider rounded-[4px] transition"
                  >
                    Build with Flow →
                  </Link>
                </div>
              </div>

              {/* Promo Card 2: AI */}
              <div className="bg-[#faf4fe] rounded-[10px] p-8 sm:p-12 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
                <div>
                  <div className="zw-label mb-5">
                    <span className="!text-[#7e22ce]">Autonomous AI</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#7e22ce] font-medium text-[15px] mb-3">
                    <Sparkles className="w-4 h-4" />
                    <span>Waves AI Assistant</span>
                  </div>
                  <h3 className="text-[28px] font-medium text-black tracking-tight mb-4 leading-tight">
                    Deploy intelligent bots for parents & patients
                  </h3>
                  <p className="text-[16px] text-[#404040] leading-[1.7] mb-8">
                    Autonomous 24/7 AI assistants that answer fee inquiries, confirm appointments, and flag low inventory.
                  </p>
                </div>
                <div>
                  <Link 
                    href="#demo"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#7e22ce] hover:bg-[#6b21a8] text-white text-[13px] font-bold uppercase tracking-wider rounded-[4px] transition"
                  >
                    Explore AI Agents →
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. WAVES ONE — Zoho One Pattern                                          */}
        {/* ========================================================================= */}
        <section className="w-full bg-white" style={{ padding: "80px 5%" }}>
          <div className="max-w-[1280px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
              
              <div className="lg:w-7/12 space-y-5">
                <span className="text-xs font-bold uppercase tracking-[2.5px] text-[#226eb4]" style={{ fontFamily: "var(--font-mono)" }}>
                  All-in-one suite
                </span>
                
                <h2 className="text-[36px] sm:text-[48px] font-medium text-black tracking-[-1px]">
                  Waves One
                </h2>

                <p className="text-base sm:text-lg text-[#404040] leading-[1.8]">
                  <span className="font-medium text-black">The operating system for institutions.</span> Run your school, clinic, or pharmacy chain on Waves — our unified platform connecting admissions, fee collection, OPD queue calling, and pharmacy checkout.
                </p>

                <p className="text-sm text-[#404040]">
                  Get full campus-wide access, starting at{" "}
                  <span className="font-bold text-black text-base">₹4,999/month</span> with unlimited staff logins.
                </p>

                <div className="pt-3">
                  <Link href="/pricing" className="zw-cta-main">
                    Try Waves One
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
        <section className="w-full bg-[#f8f9fa]" style={{ padding: "80px 5%" }}>
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
        <section id="values" className="w-full bg-white" style={{ padding: "80px 5%" }}>
          <div className="max-w-[1280px] mx-auto">
            
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-[28px] sm:text-[36px] font-medium text-black tracking-[-1px]">
                The core values and principles that drive us
              </h2>
              <div className="w-14 border-t border-black mx-auto mt-5" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-[#f8f9fa] p-6 rounded-lg border border-[#e6e9f0]">
                <h3 className="text-base font-medium text-black mb-3">Long-term commitment</h3>
                <p className="text-sm text-[#404040] leading-[1.8]">
                  We build software designed for decades of daily operational continuity. We never force disruptive redesigns or aggressive price hikes.
                </p>
              </div>

              <div className="bg-[#f8f9fa] p-6 rounded-lg border border-[#e6e9f0]">
                <h3 className="text-base font-medium text-black mb-3">Customer-first philosophy</h3>
                <p className="text-sm text-[#404040] leading-[1.8]">
                  Direct phone access to human solutions engineers who know your institution by name. On-site visits and real local support.
                </p>
              </div>

              <div className="bg-[#f8f9fa] p-6 rounded-lg border border-[#e6e9f0]">
                <h3 className="text-base font-medium text-black mb-3">Privacy and security first</h3>
                <p className="text-sm text-[#404040] leading-[1.8]">
                  We do not own, sell, or advertise against your student records, patient histories, or medicine sales. Full data sovereignty.
                </p>
              </div>

              <div className="bg-[#f8f9fa] p-6 rounded-lg border border-[#e6e9f0]">
                <h3 className="text-base font-medium text-black mb-3">Focus on R&D</h3>
                <p className="text-sm text-[#404040] leading-[1.8]">
                  Software is our craft. We own the entire technology stack, including running our own data centres in India for sovereignty.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. STATS — Zoho Stats Counter                                            */}
        {/* ========================================================================= */}
        <section className="w-full bg-[#f8f9fa]" style={{ padding: "60px 5%" }}>
          <div className="max-w-[1280px] mx-auto">
            
            <div className="text-center mb-10">
              <h2 className="text-[28px] sm:text-[36px] font-medium text-black tracking-[-1px]">
                Made in India.<span className="block sm:inline"> Engineered for Institutional Reliability.</span>
              </h2>
              <div className="w-14 border-t border-black mx-auto mt-4" />
            </div>

            <div className="flex flex-wrap justify-center gap-0 text-center">
              
              <div className="flex-1 min-w-[140px] px-4 py-4 border-r border-[#e6e9f0] last:border-r-0">
                <p className="text-[36px] sm:text-[42px] font-medium text-black">500<span className="text-[#226eb4]">+</span></p>
                <p className="text-xs font-medium text-[#7d7d7d] uppercase tracking-wider mt-1">Institutions Served</p>
              </div>

              <div className="flex-1 min-w-[140px] px-4 py-4 border-r border-[#e6e9f0] last:border-r-0">
                <p className="text-[36px] sm:text-[42px] font-medium text-black">1.2M<span className="text-[#226eb4]">+</span></p>
                <p className="text-xs font-medium text-[#7d7d7d] uppercase tracking-wider mt-1">Students & Patients</p>
              </div>

              <div className="flex-1 min-w-[140px] px-4 py-4 border-r border-[#e6e9f0] last:border-r-0">
                <p className="text-[36px] sm:text-[42px] font-medium text-black">99.98<span className="text-[#226eb4]">%</span></p>
                <p className="text-xs font-medium text-[#7d7d7d] uppercase tracking-wider mt-1">Cloud Uptime SLA</p>
              </div>

              <div className="flex-1 min-w-[140px] px-4 py-4 border-r border-[#e6e9f0] last:border-r-0">
                <p className="text-[36px] sm:text-[42px] font-medium text-black">3<span className="text-[#226eb4]"> Sec</span></p>
                <p className="text-xs font-medium text-[#7d7d7d] uppercase tracking-wider mt-1">Barcode POS Billing</p>
              </div>

              <div className="flex-1 min-w-[140px] px-4 py-4">
                <p className="text-[36px] sm:text-[42px] font-medium text-black">24<span className="text-[#226eb4]"> Hrs</span></p>
                <p className="text-xs font-medium text-[#7d7d7d] uppercase tracking-wider mt-1">Migration Turnaround</p>
              </div>

            </div>

            <div className="text-center mt-8">
              <Link href="/contact" className="zw-cta-arrow">
                More about Waves
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. DEMO BOOKING FORM                                                     */}
        {/* ========================================================================= */}
        <section id="demo" className="w-full bg-white" style={{ padding: "80px 5%" }}>
          <div className="max-w-[1280px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
              
              <div className="lg:w-5/12 space-y-5">
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
        <section className="w-full bg-[#f8f9fa] border-t border-b border-[#e6e9f0]" style={{ padding: "80px 5%" }}>
          <div className="max-w-[800px] mx-auto text-center">
            <h2 className="text-[36px] sm:text-[48px] font-medium tracking-[-1px] mb-4 zw-text-gradient">
              Ready to transform your institution?
            </h2>
            <div className="w-14 border-t border-black mx-auto mt-3 mb-6" />
            <p className="text-base text-[#404040] mb-8 leading-[1.8]">
              Let&apos;s get you started.
            </p>
            <Link href="/signup" className="zw-erp-btn">
              Sign Up Now
            </Link>
          </div>
        </section>

      </main>

      {/* ========================================================================= */}
      {/* FOOTER                                                                    */}
      {/* ========================================================================= */}
      <footer className="w-full bg-[#0a0a0a] text-[#aaa] text-xs" style={{ padding: "64px 5% 48px" }}>
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
                <li><Link href="/signup" className="hover:text-white transition font-medium text-[#f87171]">Create Free Account</Link></li>
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