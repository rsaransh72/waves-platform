import Link from "next/link";
import Navbar from "@/components/Navbar";
import SchoolDashboardDemo from "@/components/SchoolDashboardDemo";
import {
  ArrowRight,
  BellRing,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  GraduationCap,
  MapPinned,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
  Plug,
} from "lucide-react";

const accent = "#226eb4";

const featureCards = [
  {
    title: "Admissions & Enrolment",
    description:
      "Capture leads, track applications, collect documents, and convert new admissions without switching between tools.",
    icon: GraduationCap,
  },
  {
    title: "Smart Attendance",
    description:
      "Use biometric, RFID, or mobile check-ins with real-time absences, lateness alerts, and classroom visibility.",
    icon: Clock,
  },
  {
    title: "Academic LMS",
    description:
      "Manage timetables, assignments, assessments, report cards, and academic progress from one secure workspace.",
    icon: BookOpen,
  },
  {
    title: "Fee & Finance",
    description:
      "Generate fee structures, collect online payments, track dues, and reconcile cash flow across multiple intakes.",
    icon: FileText,
  },
  {
    title: "Parent Communication",
    description:
      "Send announcements, fee reminders, and event updates via SMS, WhatsApp, email, and the parent portal.",
    icon: BellRing,
  },
  {
    title: "Transport & Campus Ops",
    description:
      "Track routes, bus attendance, staff movement, and campus operations from unified dashboards and live reports.",
    icon: MapPinned,
  },
];

const featureHighlights = [
  {
    title: "Admissions that stay organized",
    text: "Give your admissions team a single place to manage inquiries, approvals, document checks, and intake progress.",
    bullet: ["Lead capture and follow-ups", "Document tracking", "Reporting for enrollment teams"],
    icon: GraduationCap,
  },
  {
    title: "Attendance visibility in real time",
    text: "Spot absentee trends early and ensure every class, teacher, and student stays aligned without manual tracking.",
    bullet: ["Live attendance analytics", "Role-based access", "Improved on-ground accountability"],
    icon: Clock,
  },
  {
    title: "Academic operations without spreadsheet chaos",
    text: "Create timetables, manage tests, track subject performance, and communicate results across every class.",
    bullet: ["Board-aligned workflows", "Grading and reports", "Teacher collaboration"],
    icon: BookOpen,
  },
];

const useCases = [
  {
    title: "Schools",
    description:
      "Run admissions, attendance, fee collection, and academic reporting with one management layer for the whole campus.",
  },
  {
    title: "Academies",
    description:
      "Keep batches, faculty schedules, and parent communication connected without juggling multiple tools.",
  },
  {
    title: "Multi-campus institutions",
    description:
      "Standardize operations across branches while preserving each campus’s local workflows and reporting needs.",
  },
];

const audience = [
  "Private schools",
  "International schools",
  "Academies & coaching centers",
  "School management teams",
  "Branch and campus leaders",
  "Parents and administrators",
];

const pricing = [
  {
    name: "Starter",
    desc: "For growing schools",
    price: "₹2,999",
    period: "/month",
    features: ["Up to 300 students", "Attendance & fee management", "Parent portal", "Basic reports"],
  },
  {
    name: "Growth",
    desc: "Most popular",
    price: "₹6,999",
    period: "/month",
    features: ["Unlimited students", "Academic LMS", "Advanced fee workflows", "Transport & alerts"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    desc: "For school groups",
    price: "Custom",
    period: "pricing",
    features: ["Multi-campus support", "Custom integrations", "Dedicated onboarding", "Priority support"],
  },
];

const integrations = [
  "Biometric devices",
  "RFID gates",
  "SMS gateways",
  "WhatsApp automation",
  "Google Workspace",
  "Microsoft 365",
  "Payment gateways",
  "Payroll systems",
];

const faqs = [
  {
    q: "Does School ERP support multiple campuses or branches?",
    a: "Yes. It is built for both single-campus schools and multi-campus institutions with permission-based access and centralized reporting.",
  },
  {
    q: "Can we integrate biometric and RFID attendance?",
    a: "Absolutely. School ERP supports biometric devices, RFID gates, and mobile attendance workflows for streamlined check-ins.",
  },
  {
    q: "Does it include parent access?",
    a: "Yes. Parents can view fee statements, attendance, announcements, and school communication via the dedicated parent portal.",
  },
  {
    q: "Can we migrate from an existing school system?",
    a: "Yes. Waves provides support for student data, fee data, and operational records during implementation and rollout.",
  },
];

export const metadata = {
  title: "School ERP | Waves",
  description:
    "School ERP product details for admissions, attendance, academics, fee management, transport, and parent engagement.",
};

export default function SchoolErpPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar requestDemoHref="/school-erp#demo" />

      <div className="sticky top-[64px] z-40 bg-white/95 backdrop-blur-md border-b border-[#e6e9f0] shadow-xs">
        <div className="w-full max-w-[1280px] mx-auto px-[5%] h-[48px] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-[15px] text-[#111]">School ERP</span>
            </div>
            <nav className="hidden md:flex items-center gap-5 text-[13px] font-medium text-[#555]">
              <a href="#features" className="hover:text-[#111] transition">Features</a>
              <a href="#use-cases" className="hover:text-[#111] transition">Use Cases</a>
              <a href="#pricing" className="hover:text-[#111] transition">Pricing</a>
              <a href="#integrations" className="hover:text-[#111] transition">Integrations</a>
              <a href="#faq" className="hover:text-[#111] transition">FAQ</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/signup" className="text-[12px] font-bold uppercase tracking-wider px-4 py-1.5 rounded text-white transition" style={{ backgroundColor: accent }}>
              Try Free →
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1 w-full overflow-hidden">
        <section className="relative w-full overflow-hidden bg-white" style={{ padding: "72px 5% 88px" }}>
          <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle, ${accent} 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }} />

          <div className="relative z-10 w-full max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider mb-6" style={{ backgroundColor: `${accent}12`, color: accent }}>
                <Sparkles className="w-3.5 h-3.5" />
                School ERP
              </div>

              <h1 className="text-[36px] sm:text-[44px] lg:text-[52px] font-bold text-[#111] tracking-[-1.5px] leading-[1.08] mb-5">
                A smarter way to run admissions, academics, and operations.
              </h1>

              <p className="text-[17px] leading-[1.7] text-[#444] max-w-[520px] mb-8">
                Manage student lifecycle, fee collections, attendance, parent updates, and campus operations from one connected platform built for modern schools.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-3">
                <Link href="/signup" className="font-bold text-white text-[14px] px-8 py-3.5 rounded-[6px] transition-all hover:shadow-lg" style={{ backgroundColor: accent }}>
                  START YOUR FREE TRIAL
                </Link>
                <Link href="/book-demo" className="font-bold text-[14px] px-8 py-3.5 rounded-[6px] border-2 transition-all hover:bg-[#f8f9fa]" style={{ borderColor: accent, color: accent }}>
                  REQUEST A DEMO
                </Link>
              </div>

              <div className="flex items-center gap-6 mt-8 text-[13px] text-[#777]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Free setup guidance</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Fast deployment</span>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute inset-0 rounded-2xl blur-3xl opacity-10" style={{ background: `linear-gradient(135deg, ${accent}, transparent)` }}></div>
              <div className="relative transform scale-[0.92] origin-center">
                <div className="shadow-2xl shadow-[#226eb4]/20 rounded-xl">
                  <SchoolDashboardDemo />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-6 bg-[#f8f9fa] border-y border-[#e6e9f0]">
          <div className="max-w-[1280px] mx-auto px-[5%] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[13px] font-semibold text-[#888] uppercase tracking-widest">
              Trusted by educational institutions and school groups
            </p>
            <div className="flex flex-wrap items-center gap-8 opacity-40 grayscale">
              {['Gyan Valley', 'Blue Oak', 'Meridian', 'NorthStar', 'EduNest'].map((name, idx) => (
                <div key={idx} className="text-[15px] font-bold text-[#333]">{name}</div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-white">
          <div className="max-w-[1280px] mx-auto px-[5%]">
            <div className="text-center mb-14">
              <p className="text-[13px] font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
                Powerful Features
              </p>
              <h2 className="text-[32px] sm:text-[40px] font-bold text-[#111] tracking-[-1px] leading-[1.15] mb-4">
                Everything you need to run a modern school
              </h2>
              <p className="text-[16px] text-[#555] max-w-[600px] mx-auto">
                Replace disconnected tools with one school management layer for parents, staff, leadership, and operations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureCards.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="group p-7 rounded-xl border border-[#e6e9f0] bg-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-transparent transition-all duration-300">
                    <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ backgroundColor: `${accent}10` }}>
                      <Icon className="w-5 h-5" style={{ color: accent }} />
                    </div>
                    <h3 className="text-[17px] font-bold text-[#111] mb-2">{feature.title}</h3>
                    <p className="text-[14px] text-[#555] leading-[1.7]">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#f8f9fa] border-y border-[#e6e9f0]">
          <div className="max-w-[1280px] mx-auto px-[5%] space-y-20">
            {featureHighlights.map((feature, idx) => {
              const Icon = feature.icon;
              const isReversed = idx % 2 === 1;

              return (
                <div key={idx} className={`flex flex-col ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 items-center`}>
                  <div className="lg:w-1/2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4" style={{ backgroundColor: `${accent}12`, color: accent }}>
                      Highlight {idx + 1}
                    </div>
                    <h3 className="text-[28px] sm:text-[32px] font-bold text-[#111] tracking-[-0.5px] leading-[1.2] mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-[16px] text-[#444] leading-[1.8] mb-6">{feature.text}</p>
                    <ul className="space-y-3">
                      {feature.bullet.map((point, bulletIdx) => (
                        <li key={bulletIdx} className="flex items-center gap-2.5 text-[14px] text-[#333]">
                          <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: accent }} />
                          {point}
                        </li>
                      ))}
                    </ul>
                    <Link href="/signup" className="inline-flex items-center gap-1.5 mt-6 text-[14px] font-bold transition-all hover:gap-2.5" style={{ color: accent }}>
                      Try it free <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="lg:w-1/2">
                    <div className="relative bg-white rounded-2xl border border-[#e6e9f0] shadow-lg overflow-hidden p-6">
                      <div className="aspect-[4/3] rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accent}08` }}>
                        <div className="text-center">
                          <div className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center mb-4" style={{ backgroundColor: `${accent}15` }}>
                            <Icon className="w-10 h-10" style={{ color: accent }} />
                          </div>
                          <div className="space-y-2 px-8">
                            <div className="h-3 rounded-full mx-auto" style={{ backgroundColor: `${accent}20`, width: "70%" }} />
                            <div className="h-2 rounded-full mx-auto bg-[#e6e9f0]" style={{ width: "50%" }} />
                            <div className="h-2 rounded-full mx-auto bg-[#e6e9f0]" style={{ width: "60%" }} />
                          </div>
                          <div className="grid grid-cols-3 gap-3 mt-6 px-4">
                            {[1, 2, 3].map((item) => (
                              <div key={item} className="h-16 rounded-lg border border-[#e6e9f0] bg-white flex items-center justify-center">
                                <div className="w-8 h-8 rounded" style={{ backgroundColor: `${accent}${10 + item * 5}` }} />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section id="use-cases" className="py-20 bg-white">
          <div className="max-w-[1280px] mx-auto px-[5%]">
            <div className="text-center mb-14">
              <p className="text-[13px] font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
                Use Cases
              </p>
              <h2 className="text-[32px] sm:text-[40px] font-bold text-[#111] tracking-[-1px] leading-[1.15] mb-4">
                Built for the way schools operate
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {useCases.map((item, idx) => (
                <div key={idx} className="relative p-8 rounded-2xl border border-[#e6e9f0] bg-[#f8f9fa] hover:bg-white hover:shadow-lg hover:border-transparent transition-all duration-300">
                  <div className="absolute top-0 left-8 w-12 h-1 rounded-b-full" style={{ backgroundColor: accent }} />
                  <h3 className="text-[20px] font-bold text-[#111] mb-3 mt-2">{item.title}</h3>
                  <p className="text-[15px] text-[#555] leading-[1.7]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 border-y border-[#e6e9f0]" style={{ backgroundColor: `${accent}05` }}>
          <div className="max-w-[1280px] mx-auto px-[5%]">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/3">
                <p className="text-[13px] font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
                  Who It&apos;s For
                </p>
                <h2 className="text-[28px] sm:text-[32px] font-bold text-[#111] tracking-[-0.5px] leading-[1.2] mb-3">
                  Designed for teams like yours
                </h2>
                <p className="text-[15px] text-[#555] leading-[1.7]">
                  From private schools to multi-campus institutions, School ERP adapts to the way your staff and parents work.
                </p>
              </div>
              <div className="lg:w-2/3 grid sm:grid-cols-2 gap-4">
                {audience.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-5 rounded-xl bg-white border border-[#e6e9f0] shadow-sm">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${accent}12` }}>
                      <Users className="w-5 h-5" style={{ color: accent }} />
                    </div>
                    <span className="text-[15px] font-semibold text-[#111]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20 bg-white">
          <div className="max-w-[1280px] mx-auto px-[5%]">
            <div className="text-center mb-14">
              <p className="text-[13px] font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
                Pricing
              </p>
              <h2 className="text-[32px] sm:text-[40px] font-bold text-[#111] tracking-[-1px] leading-[1.15] mb-4">
                A plan for every stage of growth
              </h2>
              <p className="text-[16px] text-[#555]">Start simple, scale when you&apos;re ready.</p>
            </div>

            <div className="grid gap-6 max-w-5xl mx-auto items-start md:grid-cols-3">
              {pricing.map((tier, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl p-7 flex flex-col relative transition-all ${tier.highlighted ? "border-2 text-white shadow-xl scale-[1.02]" : "border border-[#e6e9f0] bg-white"}`}
                  style={tier.highlighted ? { borderColor: accent, backgroundColor: accent } : {}}
                >
                  <h3 className={`text-[18px] font-bold mb-1 ${tier.highlighted ? "text-white" : "text-[#111]"}`}>{tier.name}</h3>
                  <p className={`text-[13px] mb-5 ${tier.highlighted ? "text-white/70" : "text-[#777]"}`}>{tier.desc}</p>
                  <div className="mb-6">
                    <span className={`text-[36px] font-extrabold ${tier.highlighted ? "text-white" : "text-[#111]"}`}>{tier.price}</span>
                    <span className={`text-[14px] ${tier.highlighted ? "text-white/60" : "text-[#888]"}`}>{tier.period}</span>
                  </div>
                  <ul className="space-y-3 mb-7 flex-1">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2.5">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${tier.highlighted ? "text-white/80" : ""}`} style={!tier.highlighted ? { color: accent } : {}} />
                        <span className={`text-[14px] ${tier.highlighted ? "text-white" : "text-[#333]"}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup" className={`w-full py-2.5 font-bold rounded-lg text-center text-[13px] uppercase tracking-wide transition-colors ${tier.highlighted ? "bg-white hover:bg-gray-50" : "border-2 hover:bg-[#f8f9fa]"}`} style={tier.highlighted ? { color: accent } : { borderColor: accent, color: accent }}>
                    Get Started
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="integrations" className="py-20 bg-[#f8f9fa] border-y border-[#e6e9f0]">
          <div className="max-w-[1280px] mx-auto px-[5%] text-center">
            <p className="text-[13px] font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
              Integrations
            </p>
            <h2 className="text-[32px] sm:text-[36px] font-bold text-[#111] tracking-[-1px] leading-[1.15] mb-4">
              Works with the tools you already use
            </h2>
            <p className="text-[16px] text-[#555] mb-10 max-w-[500px] mx-auto">
              Connect School ERP with your existing stack and keep your school operations unified from one dashboard.
            </p>

            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {integrations.map((item, idx) => (
                <div key={idx} className="flex items-center px-5 py-3 bg-white border border-[#e6e9f0] rounded-lg text-[14px] font-semibold text-[#333] hover:border-blue-200 hover:shadow-sm transition-all cursor-default">
                  <Plug className="w-4 h-4 mr-2.5" style={{ color: accent }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="py-20 bg-white">
          <div className="max-w-[800px] mx-auto px-[5%]">
            <div className="text-center mb-14">
              <p className="text-[13px] font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
                FAQ
              </p>
              <h2 className="text-[32px] sm:text-[36px] font-bold text-[#111] tracking-[-1px] leading-[1.15]">
                Frequently asked questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <details key={idx} className="group border border-[#e6e9f0] rounded-xl overflow-hidden bg-white hover:shadow-sm transition-shadow">
                  <summary className="flex items-center justify-between px-6 py-5 cursor-pointer text-[16px] font-semibold text-[#111] select-none list-none">
                    {faq.q}
                    <ChevronRight className="w-5 h-5 text-[#888] group-open:rotate-90 transition-transform shrink-0 ml-4" />
                  </summary>
                  <div className="px-6 pb-5 text-[15px] text-[#555] leading-[1.7] border-t border-[#e6e9f0] pt-4">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 relative overflow-hidden" style={{ backgroundColor: accent }}>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 50%, white 0%, transparent 50%)",
          }}></div>
          <div className="relative z-10 max-w-[700px] mx-auto px-[5%] text-center">
            <h2 className="text-[32px] sm:text-[40px] font-bold text-white tracking-[-1px] leading-[1.15] mb-5">
              Ready to upgrade your school operations?
            </h2>
            <p className="text-[16px] text-white/80 mb-8">
              Bring admissions, attendance, fees, and parent communication into one powerful platform built for growth.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="px-8 py-3.5 bg-white font-bold text-[14px] rounded-[6px] hover:bg-gray-50 transition-colors shadow-lg uppercase tracking-wide" style={{ color: accent }}>
                Start Free Trial
              </Link>
              <Link href="/book-demo" className="px-8 py-3.5 border-2 border-white/40 text-white font-bold text-[14px] rounded-[6px] hover:bg-white/10 transition-colors uppercase tracking-wide">
                Talk to Sales
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full bg-[#111] text-white py-12">
        <div className="max-w-[1280px] mx-auto px-[5%]">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
                  <span className="w-2 h-2 rounded-[2px] bg-[#e42525]" />
                  <span className="w-2 h-2 rounded-[2px] bg-[#226eb4]" />
                  <span className="w-2 h-2 rounded-[2px] bg-[#10b981]" />
                  <span className="w-2 h-2 rounded-[2px] bg-[#f59e0b]" />
                </div>
                <span className="text-[16px] font-bold">WAVES</span>
              </div>
              <p className="text-[13px] text-[#888] leading-relaxed">
                Privacy-first software for modern educational institutions.
              </p>
            </div>
            <div>
              <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#888] mb-4">Products</h4>
              <div className="space-y-2.5 text-[14px]">
                <Link href="/school-erp" className="block text-[#ccc] hover:text-white transition">School ERP</Link>
                <Link href="/hospital-erp" className="block text-[#ccc] hover:text-white transition">Health Suite</Link>
                <Link href="/pharmacy-pos" className="block text-[#ccc] hover:text-white transition">Pharmacy POS</Link>
                <Link href="/erp" className="block text-[#ccc] hover:text-white transition">Waves ERP</Link>
              </div>
            </div>
            <div>
              <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#888] mb-4">Company</h4>
              <div className="space-y-2.5 text-[14px]">
                <Link href="/pricing" className="block text-[#ccc] hover:text-white transition">Pricing</Link>
                <Link href="/services" className="block text-[#ccc] hover:text-white transition">Services</Link>
                <Link href="/contact" className="block text-[#ccc] hover:text-white transition">Contact</Link>
                <Link href="/book-demo" className="block text-[#ccc] hover:text-white transition">Book Demo</Link>
              </div>
            </div>
            <div>
              <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#888] mb-4">Legal</h4>
              <div className="space-y-2.5 text-[14px]">
                <Link href="#" className="block text-[#ccc] hover:text-white transition">Privacy Policy</Link>
                <Link href="#" className="block text-[#ccc] hover:text-white transition">Terms of Service</Link>
                <Link href="#" className="block text-[#ccc] hover:text-white transition">Security</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-[#333] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[12px] text-[#666]">© 2026 Waves Enterprise Platform. All rights reserved.</p>
            <div className="flex items-center gap-4 text-[12px] text-[#666]">
              <span>🇮🇳 Made in India</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
