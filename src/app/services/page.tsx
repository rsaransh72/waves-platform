import Navbar from "@/components/Navbar";
import BookDemoForm from "@/components/BookDemoForm";
import Link from "next/link";
import { 
  Database, 
  Users, 
  Code2, 
  Cpu, 
  FileCheck, 
  Headphones, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Layers,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Laptop
} from "lucide-react";

export const metadata = {
  title: "Professional Implementation & Migration Services | Waves Platform",
  description: "End-to-end implementation services by Waves Technologies: legacy data migration, staff training, custom integrations, and hardware setup.",
};

const SERVICES = [
  {
    id: "data-migration",
    title: "Legacy Data Migration",
    tagline: "Move from Tally, Marg, Busy, SAP or Excel with zero data loss",
    icon: Database,
    description: "Our dedicated data engineering team extracts, sanitizes, and imports your historic student profiles, patient EHR records, outstanding fee registers, and medicine batch inventory into Waves Cloud in under 24 hours.",
    deliverables: [
      "Master student, patient & medicine database import",
      "Historical fee ledger & outstanding balance reconciliation",
      "Batch-wise medicine stock & expiry date mapping",
      "Complete data integrity verification and audit sign-off report",
    ],
    timeline: "24 – 48 Hours",
  },
  {
    id: "staff-training",
    title: "On-Site Staff Onboarding",
    tagline: "Empower teachers, doctors, nurses, and billing cashiers",
    icon: Users,
    description: "Software fails when frontline staff aren't confident. We conduct structured live workshops in English, Hindi, and regional languages for your staff, complete with role-specific certification.",
    deliverables: [
      "Interactive sessions for teachers (CBSE grading & report cards)",
      "Clinical training for doctors & nurses (digital Rx & ward beds)",
      "Cashier & chemist training (3-second barcode checkout)",
      "Comprehensive regional video guides and printed quick-start manuals",
    ],
    timeline: "1 – 3 Days",
  },
  {
    id: "hardware-integration",
    title: "Hardware & IoT Setup",
    tagline: "Plug-and-play biometric, RFID, barcode, and TV tokens",
    icon: Cpu,
    description: "Avoid IT configuration headaches. Our field engineers provide on-site or guided remote calibration for USB/Bluetooth barcode guns, thermal receipt printers, RFID student gate turnstiles, and waiting room token TVs.",
    deliverables: [
      "Thermal POS printer baud rate & page cut calibration",
      "USB & wireless 1D/2D QR handheld barcode scanner setup",
      "Biometric fingerprint machine & RFID turnstile network link",
      "Waiting room HDMI TV token display screen configuration",
    ],
    timeline: "Same-Day Setup",
  },
  {
    id: "custom-development",
    title: "Custom Module Engineering",
    tagline: "Tailored workflows for your unique institutional rules",
    icon: Code2,
    description: "Every educational trust and hospital has distinct governance rules. Our core engineering team builds custom report templates, automated fee concession matrices, third-party lab machine integrations, and specialized REST APIs.",
    deliverables: [
      "Custom CBSE / ICSE report card formats & grade weightages",
      "Complex fee concession, installment & scholarship matrices",
      "Bi-directional REST API endpoints for existing internal systems",
      "Custom medical department consultation sheets & discharge forms",
    ],
    timeline: "Scoped upon review",
  },
  {
    id: "compliance-setup",
    title: "Regulatory & Indian Tax Setup",
    tagline: "100% compliant with Indian statutory requirements",
    icon: FileCheck,
    description: "Ensure your operations strictly follow Indian government regulations. We configure your GST tax slabs, HSN/SAC codes, Schedule H/H1 restricted medicine registers, and Ayushman Bharat (ABHA) connectivity.",
    deliverables: [
      "GST HSN code mapping & 1-click GSTR-1 JSON export test",
      "Schedule H & H1 drug inspection register formatting",
      "Ayushman Bharat Digital Mission (ABHA) health ID sync",
      "Automated daily encrypted cloud backup verification",
    ],
    timeline: "Included with onboarding",
  },
  {
    id: "priority-sla",
    title: "Priority SLA & Dedicated Support",
    tagline: "Guaranteed 99.9% uptime with direct engineering hotline",
    icon: Headphones,
    description: "Critical institutional operations never sleep. Our Priority Enterprise SLA guarantees 15-minute response times, a dedicated relationship engineer, and zero-interruption cloud reliability.",
    deliverables: [
      "Direct technical manager phone hotline & WhatsApp channel",
      "15-minute guaranteed first response for P1 critical issues",
      "Quarterly operational reviews and feature optimization calls",
      "99.95% cloud infrastructure uptime SLA backed by credit guarantee",
    ],
    timeline: "Continuous 24/7/365",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col antialiased">
      <Navbar />

      <main className="flex-1 w-full overflow-hidden">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION - Zoho Style Proportions & Typography                     */}
        {/* ========================================================================= */}
        <section className="w-full bg-white border-b border-[#e6e9f0]" style={{ padding: "80px 5% 100px" }}>
          <div className="w-full max-w-[1280px] mx-auto text-center">
            
            {/* Top Mono Tag */}
            <div className="zw-label mx-auto mb-6">
              <span>Professional Implementation &bull; Zero Downtime</span>
            </div>

            {/* Headline */}
            <h1 className="text-[42px] sm:text-[50px] lg:text-[56px] font-medium text-black tracking-[-1px] leading-[1.15] max-w-4xl mx-auto">
              We Don&apos;t Just Sell Software. <br />
              <span className="text-[#226eb4]">We Deploy, Migrate &amp; Train Your Staff</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#444444] leading-relaxed max-w-2xl mx-auto mt-4 mb-8">
              Most institutional ERP migrations fail due to poor data transition and neglected staff onboarding. Our dedicated implementation specialists ensure a seamless, zero-downtime go-live for your school, hospital, or pharmacy.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <a
                href="#consultation"
                className="zw-cta-main w-full sm:w-auto"
              >
                <span>SCHEDULE ONBOARDING CONSULTATION</span>
                <span className="text-sm font-bold">&gt;</span>
              </a>
              <Link
                href="/pricing"
                className="zw-cta-outlined w-full sm:w-auto py-3 px-6 text-xs uppercase tracking-wider"
              >
                VIEW PRICING PLANS
              </Link>
            </div>

            {/* 3 Metric Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto pt-6 border-t border-[#e6e9f0]">
              <div>
                <p className="text-3xl font-medium text-black">24 – 48 Hrs</p>
                <p className="text-xs text-[#7d7d7d] font-medium mt-1">Average Migration Time</p>
              </div>
              <div>
                <p className="text-3xl font-medium text-[#226eb4]">Zero</p>
                <p className="text-xs text-[#7d7d7d] font-medium mt-1">Historical Data Loss</p>
              </div>
              <div>
                <p className="text-3xl font-medium text-emerald-600">100%</p>
                <p className="text-xs text-[#7d7d7d] font-medium mt-1">On-Site Staff Trained</p>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. THE 5-STAGE IMPLEMENTATION METHODOLOGY                                  */}
        {/* ========================================================================= */}
        <section className="w-full bg-[#f8f9fa] border-b border-[#e6e9f0]" style={{ padding: "80px 5%" }}>
          <div className="w-full max-w-[1280px] mx-auto">
            
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="zw-label mx-auto mb-3">
                <span>Our Methodology</span>
              </div>
              <h2 className="text-[28px] sm:text-[36px] font-medium text-black tracking-[-1px] mt-2">
                5-Stage Turnkey Deployment Framework
              </h2>
              <div className="w-14 border-t border-black mx-auto mt-5 mb-6" />
              <p className="text-sm sm:text-base text-[#404040]">
                A proven, structured deployment blueprint executed by certified enterprise solution engineers.
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-4">
              
              <div className="bg-white p-6 rounded-xl border border-[#e6e9f0] shadow-xs hover:border-[#056cb8] transition">
                <span className="font-mono text-xs font-bold text-[#226eb4] bg-blue-50 px-2.5 py-1 rounded">STAGE 01</span>
                <h3 className="text-base font-bold text-black mt-3">Architectural Audit</h3>
                <p className="text-xs text-[#404040] mt-2 leading-relaxed">
                  We review your existing student, medical, or pharmacy registers, current hardware, and institutional workflows.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[#e6e9f0] shadow-xs hover:border-[#056cb8] transition">
                <span className="font-mono text-xs font-bold text-[#226eb4] bg-blue-50 px-2.5 py-1 rounded">STAGE 02</span>
                <h3 className="text-base font-bold text-black mt-3">Extraction &amp; Cleanse</h3>
                <p className="text-xs text-[#404040] mt-2 leading-relaxed">
                  Automated scripts extract records from Tally, Marg, Busy, or Excel, de-duplicating data and verifying integrity.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[#e6e9f0] shadow-xs hover:border-[#056cb8] transition">
                <span className="font-mono text-xs font-bold text-[#226eb4] bg-blue-50 px-2.5 py-1 rounded">STAGE 03</span>
                <h3 className="text-base font-bold text-black mt-3">Sandbox Validation</h3>
                <p className="text-xs text-[#404040] mt-2 leading-relaxed">
                  We deploy your actual data into a secure sandbox environment for key stakeholders to review and test.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[#e6e9f0] shadow-xs hover:border-[#056cb8] transition">
                <span className="font-mono text-xs font-bold text-[#226eb4] bg-blue-50 px-2.5 py-1 rounded">STAGE 04</span>
                <h3 className="text-base font-bold text-black mt-3">Staff Workshops</h3>
                <p className="text-xs text-[#404040] mt-2 leading-relaxed">
                  Role-based training sessions for teachers, nurses, cashiers, and accountants with hands-on practice terminals.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[#e6e9f0] shadow-xs hover:border-emerald-600 transition">
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">STAGE 05</span>
                <h3 className="text-base font-bold text-black mt-3">Parallel Go-Live</h3>
                <p className="text-xs text-[#404040] mt-2 leading-relaxed">
                  Full production switchover with on-site engineer presence during initial operations ensuring zero downtime.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. COMPLETE SERVICES SCOPE                                                */}
        {/* ========================================================================= */}
        <section className="w-full bg-white py-16 sm:py-24 border-b border-[#e6e9f0]">
          <div className="w-full max-w-[1280px] mx-auto px-[5%]">
            
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="waves-mono-tag mb-3">
                <span className="waves-mono-tag-dot" />
                COMPREHENSIVE SCOPE
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-black tracking-tight mt-2">
                Tailored Professional Services
              </h2>
              <div className="w-11 h-[2px] bg-[#e42525] mx-auto mt-4 mb-4" />
              <p className="text-sm sm:text-base text-[#404040]">
                Select the exact onboarding and integration modules required for your organization.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SERVICES.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.id}
                    id={s.id}
                    className="bg-[#f8f9fa] border border-[#e6e9f0] rounded-xl p-8 flex flex-col justify-between hover:border-[#056cb8] hover:shadow-md transition"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#226eb4] flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-mono text-[#226eb4] bg-blue-50 px-2 py-0.5 rounded font-bold">
                          {s.timeline}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-black mb-1">
                        {s.title}
                      </h3>
                      <p className="text-xs font-semibold text-[#226eb4] mb-3">
                        {s.tagline}
                      </p>
                      <p className="text-xs sm:text-sm text-[#404040] leading-relaxed mb-6">
                        {s.description}
                      </p>

                      <div className="space-y-2 border-t border-[#e2e8f0] pt-4">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#7d7d7d]">
                          KEY DELIVERABLES:
                        </p>
                        {s.deliverables.map((d, idx) => (
                          <div key={idx} className="flex items-start space-x-2 text-xs text-[#333333]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-[#e2e8f0]">
                      <a
                        href="#consultation"
                        className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#226eb4] hover:underline"
                      >
                        <span>Request Service Quote</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. THE WAVES GUARANTEE                                                    */}
        {/* ========================================================================= */}
        <section className="w-full bg-[#0a1f33] text-white py-16 border-b border-[#1b354d]">
          <div className="w-full max-w-[1280px] mx-auto px-[5%]">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-4">
                <span className="inline-flex items-center space-x-2 bg-[#0d2a45] border border-[#1e4870] px-3.5 py-1.5 rounded-full">
                  <ShieldCheck className="w-4 h-4 text-[#4199ea]" />
                  <span className="font-mono text-[11px] font-bold tracking-widest text-[#7bb8ec] uppercase">
                    THE WAVES COMMITMENT
                  </span>
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Zero Data Loss &bull; 99.95% Uptime SLA Guarantee
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  We guarantee zero interruption to your institutional billing, classes, or outpatient consulting. If any unexpected downtime occurs during scheduled migration, our engineering credits policy applies automatically.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
                <div className="p-4 bg-[#0d2a45] border border-[#1e4870] rounded-lg">
                  <p className="text-lg font-bold text-emerald-400">100% Free Audit</p>
                  <p className="text-xs text-slate-300 mt-0.5">We analyze your Excel / Tally files at no charge</p>
                </div>
                <div className="p-4 bg-[#0d2a45] border border-[#1e4870] rounded-lg">
                  <p className="text-lg font-bold text-[#4199ea]">Direct Engineer Hotline</p>
                  <p className="text-xs text-slate-300 mt-0.5">Speak with the actual architect building your system</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. CONSULTATION BOOKING FORM                                              */}
        {/* ========================================================================= */}
        <section id="consultation" className="w-full bg-[#f8f9fa] py-16 sm:py-24">
          <div className="w-full max-w-[1280px] mx-auto px-[5%]">
            
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-6 space-y-6">
                <span className="waves-mono-tag">
                  <span className="waves-mono-tag-dot" />
                  START YOUR MIGRATION
                </span>

                <h2 className="text-3xl sm:text-4xl font-bold text-black tracking-tight leading-tight">
                  Schedule an implementation consultation with our lead engineers.
                </h2>

                <div className="w-11 h-[2px] bg-[#e42525]" />

                <p className="text-base text-[#404040] leading-relaxed">
                  Let us evaluate your existing legacy system and outline an exact timeline, hardware specification, and staff onboarding plan for your institution.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center space-x-3 text-sm text-[#333333]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Free historical data migration review</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-[#333333]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>On-site workshops for teachers, nurses, or cashiers</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-[#333333]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Dedicated account engineer &amp; WhatsApp priority channel</span>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <div className="lg:col-span-6">
                <BookDemoForm defaultProduct="erp" />
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full bg-white py-8 border-t border-[#e6e9f0]">
        <div className="w-full max-w-[1280px] mx-auto px-[5%] flex flex-col sm:flex-row items-center justify-between text-xs text-[#7d7d7d] gap-4">
          <p>&copy; {new Date().getFullYear()} Waves Technologies. All rights reserved.</p>
          <div className="flex items-center space-x-6">
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
