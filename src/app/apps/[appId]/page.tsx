import Navbar from "@/components/Navbar";
import Link from "next/link";
import { 
  Sparkles, Globe, ShieldCheck, Zap, Users, Layers, Workflow,
  Target, ChevronRight, CheckCircle2, ArrowRight, Star,
  Phone, Headphones, Monitor, Database, Package, Plug,
  Code, Lock, Eye, Camera, Cpu, Clock, Mail, Wallet,
  Search, Bell, MessageSquare, FileText, BarChart3,
  BookOpen, Award, Pencil, Upload, Share2, Filter,
  Calculator, RefreshCw, AlertTriangle, Heart, Play,
  Building2, Truck, Map, Clipboard, FolderOpen, Settings,
  Hash, Rss, Megaphone, Image, Video
} from "lucide-react";
import { notFound } from "next/navigation";
import appsData from "@/lib/appsData";

// Icon mapping
const iconMap: Record<string, any> = {
  sparkles: Sparkles, globe: Globe, shield: ShieldCheck, zap: Zap,
  users: Users, layers: Layers, workflow: Workflow, target: Target,
  phone: Phone, headphones: Headphones, monitor: Monitor, database: Database,
  package: Package, plug: Plug, code: Code, lock: Lock, eye: Eye,
  camera: Camera, cpu: Cpu, clock: Clock, mail: Mail, wallet: Wallet,
  search: Search, bell: Bell, message: MessageSquare, file: FileText,
  chart: BarChart3, book: BookOpen, award: Award, pencil: Pencil,
  upload: Upload, share: Share2, filter: Filter, calculator: Calculator,
  refresh: RefreshCw, alert: AlertTriangle, heart: Heart, play: Play,
  building: Building2, truck: Truck, map: Map, clipboard: Clipboard,
  folder: FolderOpen, settings: Settings, hash: Hash, rss: Rss,
  megaphone: Megaphone, image: Image, video: Video, star: Star,
  layout: Layers, smartphone: Monitor, card: Wallet, plane: Truck,
  checkCircle: CheckCircle2, form: FileText, receipt: FileText,
  qrcode: Code, cube: Package, user: Users, userPlus: Users,
  tag: Hash, ticket: FileText, split: Workflow, send: ArrowRight,
  palette: Sparkles, shopping: Package, bot: Cpu, trending: BarChart3,
  merge: Workflow, key: Lock, edit: Pencil, list: Clipboard,
  circle: Monitor, inbox: Mail, smile: Star,
};

function getIcon(key: string) {
  return iconMap[key] || Sparkles;
}

// Accent color palette for alternating section styles
const sectionBgs = [
  "bg-white",
  "bg-[#f8f9fa]",
  "bg-white",
  "bg-[#f8f9fa]",
];

export async function generateMetadata({ params }: { params: Promise<{ appId: string }> }) {
  const { appId } = await params;
  const app = appsData[appId];
  if (!app) return { title: "App Not Found | Waves" };
  return {
    title: `${app.title} — ${app.tagline} | Waves`,
    description: app.subtitle,
  };
}

export default async function DynamicAppPage({ params }: { params: Promise<{ appId: string }> }) {
  const { appId } = await params;
  const app = appsData[appId];

  if (!app) {
    notFound();
  }

  const accent = app.accentColor;

  return (
    <div className="min-h-screen bg-white flex flex-col antialiased">
      <Navbar />

      {/* ─── Sticky Product Nav Bar ─── */}
      <div className="sticky top-[64px] z-40 bg-white/95 backdrop-blur-md border-b border-[#e6e9f0] shadow-xs">
        <div className="w-full max-w-[1280px] mx-auto px-[5%] h-[48px] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div 
                className={`w-7 h-7 rounded-md bg-gradient-to-br ${app.color} flex items-center justify-center`}
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-[15px] text-[#111]">{app.title}</span>
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

        {/* ═══════════════════════════════════════════════════════════
            1. HERO SECTION
        ═══════════════════════════════════════════════════════════ */}
        <section className="relative w-full overflow-hidden bg-white" style={{ padding: "72px 5% 88px" }}>
          {/* Subtle grid bg */}
          <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]" style={{ 
            backgroundImage: `radial-gradient(circle, ${accent} 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }} />

          <div className="relative z-10 w-full max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Copy */}
            <div>
              <div 
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider mb-6"
                style={{ backgroundColor: `${accent}12`, color: accent }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {app.category}
              </div>

              <h1 className="text-[36px] sm:text-[44px] lg:text-[52px] font-bold text-[#111] tracking-[-1.5px] leading-[1.08] mb-5">
                {app.tagline}
              </h1>

              <p className="text-[17px] leading-[1.7] text-[#444] max-w-[520px] mb-8">
                {app.subtitle} Natively integrated into the Waves Platform so your data flows seamlessly across every department.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-3">
                <Link
                  href="/signup"
                  className="font-bold text-white text-[14px] px-8 py-3.5 rounded-[6px] transition-all hover:shadow-lg"
                  style={{ backgroundColor: accent }}
                >
                  START YOUR FREE TRIAL
                </Link>
                <Link
                  href="/book-demo"
                  className="font-bold text-[14px] px-8 py-3.5 rounded-[6px] border-2 transition-all hover:bg-[#f8f9fa]"
                  style={{ borderColor: accent, color: accent }}
                >
                  REQUEST A DEMO
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 mt-8 text-[13px] text-[#777]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Free forever plan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Setup in 5 min</span>
                </div>
              </div>
            </div>

            {/* Right: Product Preview Mock */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 rounded-2xl blur-3xl opacity-10" style={{ background: `linear-gradient(135deg, ${accent}, transparent)` }}></div>
              <div className="relative bg-white border border-[#e6e9f0] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden">
                {/* Window Chrome */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#f8f9fa] border-b border-[#e6e9f0]">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#28ca42]"></div>
                  </div>
                  <div className="w-48 h-5 bg-white rounded-md border border-[#e6e9f0]"></div>
                  <div className="w-16"></div>
                </div>
                {/* App UI Mock */}
                <div className="p-5">
                  <div className="flex gap-4 mb-4">
                    <div className="w-44 h-full bg-[#f8f9fa] rounded-lg p-3 space-y-2 shrink-0">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={`h-7 rounded-md ${i === 1 ? '' : 'bg-[#eee]'}`} style={i === 1 ? { backgroundColor: `${accent}15` } : {}}>
                          {i === 1 && <div className="h-full flex items-center px-2">
                            <div className="w-full h-2 rounded-full" style={{ backgroundColor: `${accent}40` }}></div>
                          </div>}
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 space-y-3">
                      {/* Stats Row */}
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "Active", val: "2,847", pct: "75%" },
                          { label: "Pipeline", val: "₹48.2L", pct: "62%" },
                          { label: "Closed", val: "342", pct: "88%" },
                        ].map((s, i) => (
                          <div key={i} className="bg-[#f8f9fa] rounded-lg p-3 border border-[#eee]">
                            <div className="text-[10px] text-[#888] font-medium mb-0.5">{s.label}</div>
                            <div className="text-[16px] font-bold text-[#111]">{s.val}</div>
                            <div className="w-full h-1.5 bg-[#eee] rounded-full mt-2">
                              <div className="h-full rounded-full" style={{ width: s.pct, backgroundColor: accent }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Chart Area */}
                      <div className="bg-[#f8f9fa] rounded-lg border border-[#eee] p-3 h-36 flex items-end justify-between gap-1.5">
                        {[35, 55, 40, 75, 60, 85, 50, 95, 70, 45, 80, 65].map((h, i) => (
                          <div 
                            key={i} 
                            className="w-full rounded-t-sm transition-all" 
                            style={{ height: `${h}%`, backgroundColor: i === 7 ? accent : `${accent}30` }}
                          ></div>
                        ))}
                      </div>
                      {/* Table */}
                      <div className="bg-[#f8f9fa] rounded-lg border border-[#eee] p-3 space-y-2">
                        {[1,2,3].map(i => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-[#e0e0e0]"></div>
                            <div className="flex-1">
                              <div className="h-2 bg-[#ddd] rounded-full w-24 mb-1"></div>
                              <div className="h-1.5 bg-[#eee] rounded-full w-16"></div>
                            </div>
                            <div className="h-5 w-14 rounded text-[8px] font-bold flex items-center justify-center" style={{ backgroundColor: `${accent}15`, color: accent }}>Active</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            2. SOCIAL PROOF BAR
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-6 bg-[#f8f9fa] border-y border-[#e6e9f0]">
          <div className="max-w-[1280px] mx-auto px-[5%] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[13px] font-semibold text-[#888] uppercase tracking-widest">
              Trusted by 50,000+ organizations worldwide
            </p>
            <div className="flex flex-wrap items-center gap-8 opacity-40 grayscale">
              {['TechNova', 'BluePeak', 'Meridian', 'ClearPath', 'NexGen'].map((name, i) => (
                <div key={i} className="text-[15px] font-bold text-[#333]">{name}</div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            3. FEATURES SECTION
        ═══════════════════════════════════════════════════════════ */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-[1280px] mx-auto px-[5%]">
            <div className="text-center mb-14">
              <p className="text-[13px] font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
                Powerful Features
              </p>
              <h2 className="text-[32px] sm:text-[40px] font-bold text-[#111] tracking-[-1px] leading-[1.15] mb-4">
                Everything you need in {app.title.replace("Waves ", "")}
              </h2>
              <p className="text-[16px] text-[#555] max-w-[600px] mx-auto">
                Built from the ground up to help your team work smarter, move faster, and achieve more.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {app.features.map((feat, idx) => {
                const Icon = getIcon(feat.iconKey);
                return (
                  <div 
                    key={idx} 
                    className="group p-7 rounded-xl border border-[#e6e9f0] bg-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-transparent transition-all duration-300"
                  >
                    <div 
                      className="w-11 h-11 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${accent}10` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: accent }} />
                    </div>
                    <h3 className="text-[17px] font-bold text-[#111] mb-2">{feat.title}</h3>
                    <p className="text-[14px] text-[#555] leading-[1.7]">{feat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            4. FEATURE HIGHLIGHT (Alternating Image + Text Rows)
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-20 bg-[#f8f9fa] border-y border-[#e6e9f0]">
          <div className="max-w-[1280px] mx-auto px-[5%] space-y-20">
            {app.features.slice(0, 3).map((feat, idx) => {
              const Icon = getIcon(feat.iconKey);
              const isReversed = idx % 2 === 1;
              return (
                <div 
                  key={idx} 
                  className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}
                >
                  {/* Text */}
                  <div className="lg:w-1/2">
                    <div 
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
                      style={{ backgroundColor: `${accent}12`, color: accent }}
                    >
                      Feature {idx + 1}
                    </div>
                    <h3 className="text-[28px] sm:text-[32px] font-bold text-[#111] tracking-[-0.5px] leading-[1.2] mb-4">
                      {feat.title}
                    </h3>
                    <p className="text-[16px] text-[#444] leading-[1.8] mb-6">
                      {feat.desc}
                    </p>
                    <ul className="space-y-3">
                      {[
                        "Works seamlessly across all devices",
                        "Real-time collaboration with your team",
                        "Enterprise-grade security built in",
                      ].map((point, i) => (
                        <li key={i} className="flex items-center gap-2.5 text-[14px] text-[#333]">
                          <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: accent }} />
                          {point}
                        </li>
                      ))}
                    </ul>
                    <Link 
                      href="/signup" 
                      className="inline-flex items-center gap-1.5 mt-6 text-[14px] font-bold transition-all hover:gap-2.5"
                      style={{ color: accent }}
                    >
                      Try it free <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Visual */}
                  <div className="lg:w-1/2">
                    <div className="relative bg-white rounded-2xl border border-[#e6e9f0] shadow-lg overflow-hidden p-6">
                      <div className="aspect-[4/3] rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accent}08` }}>
                        <div className="text-center">
                          <div 
                            className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center mb-4"
                            style={{ backgroundColor: `${accent}15` }}
                          >
                            <Icon className="w-10 h-10" style={{ color: accent }} />
                          </div>
                          <div className="space-y-2 px-8">
                            <div className="h-3 rounded-full mx-auto" style={{ backgroundColor: `${accent}20`, width: '70%' }}></div>
                            <div className="h-2 rounded-full mx-auto bg-[#e6e9f0]" style={{ width: '50%' }}></div>
                            <div className="h-2 rounded-full mx-auto bg-[#e6e9f0]" style={{ width: '60%' }}></div>
                          </div>
                          <div className="grid grid-cols-3 gap-3 mt-6 px-4">
                            {[1,2,3].map(i => (
                              <div key={i} className="h-16 rounded-lg border border-[#e6e9f0] bg-white flex items-center justify-center">
                                <div className="w-8 h-8 rounded" style={{ backgroundColor: `${accent}${10 + i * 5}` }}></div>
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

        {/* ═══════════════════════════════════════════════════════════
            5. USE CASES
        ═══════════════════════════════════════════════════════════ */}
        <section id="use-cases" className="py-20 bg-white">
          <div className="max-w-[1280px] mx-auto px-[5%]">
            <div className="text-center mb-14">
              <p className="text-[13px] font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
                Use Cases
              </p>
              <h2 className="text-[32px] sm:text-[40px] font-bold text-[#111] tracking-[-1px] leading-[1.15] mb-4">
                Built for the way you work
              </h2>
            </div>

            <div className={`grid ${app.useCases.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-3'} gap-8`}>
              {app.useCases.map((uc, idx) => (
                <div 
                  key={idx} 
                  className="relative p-8 rounded-2xl border border-[#e6e9f0] bg-[#f8f9fa] hover:bg-white hover:shadow-lg hover:border-transparent transition-all duration-300"
                >
                  <div 
                    className="absolute top-0 left-8 w-12 h-1 rounded-b-full"
                    style={{ backgroundColor: accent }}
                  ></div>
                  <h3 className="text-[20px] font-bold text-[#111] mb-3 mt-2">{uc.title}</h3>
                  <p className="text-[15px] text-[#555] leading-[1.7]">{uc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            6. WHO IS THIS FOR
        ═══════════════════════════════════════════════════════════ */}
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
                  Whether you&apos;re a startup or an enterprise, {app.title} adapts to your workflow.
                </p>
              </div>
              <div className="lg:w-2/3 grid sm:grid-cols-2 gap-4">
                {app.targetAudience.map((audience, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-4 p-5 rounded-xl bg-white border border-[#e6e9f0] shadow-sm"
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${accent}12` }}
                    >
                      <Users className="w-5 h-5" style={{ color: accent }} />
                    </div>
                    <span className="text-[15px] font-semibold text-[#111]">{audience}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            7. PRICING
        ═══════════════════════════════════════════════════════════ */}
        <section id="pricing" className="py-20 bg-white">
          <div className="max-w-[1280px] mx-auto px-[5%]">
            <div className="text-center mb-14">
              <p className="text-[13px] font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
                Pricing
              </p>
              <h2 className="text-[32px] sm:text-[40px] font-bold text-[#111] tracking-[-1px] leading-[1.15] mb-4">
                A plan for every stage of growth
              </h2>
              <p className="text-[16px] text-[#555]">Start free, scale when you&apos;re ready.</p>
            </div>

            <div className={`grid gap-6 max-w-5xl mx-auto items-start ${
              app.pricing.length === 1 ? 'md:grid-cols-1 max-w-md' :
              app.pricing.length === 2 ? 'md:grid-cols-2 max-w-3xl' :
              'md:grid-cols-3'
            }`}>
              {app.pricing.map((tier, idx) => (
                <div 
                  key={idx} 
                  className={`rounded-2xl p-7 flex flex-col relative transition-all ${
                    tier.highlighted 
                      ? 'border-2 text-white shadow-xl scale-[1.02]' 
                      : 'border border-[#e6e9f0] bg-white'
                  }`}
                  style={tier.highlighted ? { borderColor: accent, backgroundColor: accent } : {}}
                >
                  {tier.badge && (
                    <div className="absolute top-0 right-6 -translate-y-1/2 bg-amber-400 text-amber-950 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full">
                      {tier.badge}
                    </div>
                  )}
                  <h3 className={`text-[18px] font-bold mb-1 ${tier.highlighted ? 'text-white' : 'text-[#111]'}`}>{tier.name}</h3>
                  <p className={`text-[13px] mb-5 ${tier.highlighted ? 'text-white/70' : 'text-[#777]'}`}>{tier.desc}</p>
                  <div className="mb-6">
                    <span className={`text-[36px] font-extrabold ${tier.highlighted ? 'text-white' : 'text-[#111]'}`}>{tier.price}</span>
                    <span className={`text-[14px] ${tier.highlighted ? 'text-white/60' : 'text-[#888]'}`}>{tier.period}</span>
                  </div>
                  <ul className="space-y-3 mb-7 flex-1">
                    {tier.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${tier.highlighted ? 'text-white/80' : ''}`} style={!tier.highlighted ? { color: accent } : {}} />
                        <span className={`text-[14px] ${tier.highlighted ? 'text-white' : 'text-[#333]'}`}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <Link 
                    href="/signup" 
                    className={`w-full py-2.5 font-bold rounded-lg text-center text-[13px] uppercase tracking-wide transition-colors ${
                      tier.highlighted 
                        ? 'bg-white hover:bg-gray-50' 
                        : 'border-2 hover:bg-[#f8f9fa]'
                    }`}
                    style={tier.highlighted ? { color: accent } : { borderColor: accent, color: accent }}
                  >
                    Get Started
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            8. INTEGRATIONS
        ═══════════════════════════════════════════════════════════ */}
        <section id="integrations" className="py-20 bg-[#f8f9fa] border-y border-[#e6e9f0]">
          <div className="max-w-[1280px] mx-auto px-[5%] text-center">
            <p className="text-[13px] font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
              Integrations
            </p>
            <h2 className="text-[32px] sm:text-[36px] font-bold text-[#111] tracking-[-1px] leading-[1.15] mb-4">
              Works with the tools you love
            </h2>
            <p className="text-[16px] text-[#555] mb-10 max-w-[500px] mx-auto">
              Connect {app.title} with your existing stack — no data silos, no migration headaches.
            </p>

            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {app.integrations.map((int, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center px-5 py-3 bg-white border border-[#e6e9f0] rounded-lg text-[14px] font-semibold text-[#333] hover:border-blue-200 hover:shadow-sm transition-all cursor-default"
                >
                  <Plug className="w-4 h-4 mr-2.5" style={{ color: accent }} />
                  {int}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            9. FAQ SECTION
        ═══════════════════════════════════════════════════════════ */}
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
              {app.faqs.map((faq, idx) => (
                <details 
                  key={idx} 
                  className="group border border-[#e6e9f0] rounded-xl overflow-hidden bg-white hover:shadow-sm transition-shadow"
                >
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

        {/* ═══════════════════════════════════════════════════════════
            10. RELATED PRODUCTS
        ═══════════════════════════════════════════════════════════ */}
        {app.relatedApps.length > 0 && (
          <section className="py-16 bg-[#f8f9fa] border-t border-[#e6e9f0]">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <div className="text-center mb-10">
                <h2 className="text-[24px] font-bold text-[#111] tracking-[-0.5px]">
                  Explore related products
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {app.relatedApps.slice(0, 4).map((relId) => {
                  const rel = appsData[relId];
                  if (!rel) return null;
                  return (
                    <Link 
                      key={relId} 
                      href={`/apps/${relId}`}
                      className="group p-5 rounded-xl bg-white border border-[#e6e9f0] hover:shadow-lg hover:border-transparent transition-all"
                    >
                      <div 
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${rel.color} flex items-center justify-center mb-3`}
                      >
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-[15px] font-bold text-[#111] mb-1">{rel.title}</h3>
                      <p className="text-[13px] text-[#555] leading-[1.6] mb-3 line-clamp-2">{rel.subtitle}</p>
                      <span className="text-[12px] font-bold uppercase flex items-center gap-1 transition-all group-hover:gap-2" style={{ color: rel.accentColor }}>
                        Learn more <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════
            11. BOTTOM CTA
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-20 relative overflow-hidden" style={{ backgroundColor: accent }}>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 50%, white 0%, transparent 50%)`
          }}></div>
          <div className="relative z-10 max-w-[700px] mx-auto px-[5%] text-center">
            <h2 className="text-[32px] sm:text-[40px] font-bold text-white tracking-[-1px] leading-[1.15] mb-5">
              Ready to get started with {app.title}?
            </h2>
            <p className="text-[16px] text-white/80 mb-8">
              Join thousands of organizations using {app.title} to work smarter. Start your free trial today — no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="px-8 py-3.5 bg-white font-bold text-[14px] rounded-[6px] hover:bg-gray-50 transition-colors shadow-lg uppercase tracking-wide"
                style={{ color: accent }}
              >
                Start Free Trial
              </Link>
              <Link
                href="/book-demo"
                className="px-8 py-3.5 border-2 border-white/40 text-white font-bold text-[14px] rounded-[6px] hover:bg-white/10 transition-colors uppercase tracking-wide"
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* ─── Footer ─── */}
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
                Privacy-first cloud software for businesses of all sizes.
              </p>
            </div>
            <div>
              <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#888] mb-4">Products</h4>
              <div className="space-y-2.5 text-[14px]">
                <Link href="/apps/crm" className="block text-[#ccc] hover:text-white transition">Waves CRM</Link>
                <Link href="/apps/books" className="block text-[#ccc] hover:text-white transition">Waves Books</Link>
                <Link href="/apps/desk" className="block text-[#ccc] hover:text-white transition">Waves Desk</Link>
                <Link href="/apps/people" className="block text-[#ccc] hover:text-white transition">Waves People</Link>
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
              <span>·</span>
              <span>Data hosted in India</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
