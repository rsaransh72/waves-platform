import Navbar from "@/components/Navbar";
import BookDemoForm from "@/components/BookDemoForm";
import ErpConsoleDemo from "@/components/ErpConsoleDemo";
import Link from "next/link";
import { 
  DollarSign, 
  Package, 
  FileCheck2, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Building2, 
  TrendingUp, 
  Lock, 
  Cpu, 
  Receipt,
  Globe2,
  ChevronDown
} from "lucide-react";

export const metadata = {
  title: "Waves ERP | Cloud ERP Software for India with Contextual Intelligence",
  description: "ERP software built to bring your vision to life. Waves ERP unifies core financials, supply chain, Indian GST e-invoicing, and multi-vertical operations on one single database.",
};

export default function ErpPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col antialiased">
      <Navbar />

      {/* ========================================================================= */}
      {/* SECONDARY ERP PRODUCT HEADER (Zoho ERP Pattern)                           */}
      {/* ========================================================================= */}
      <div className="sticky top-[72px] z-40 bg-[#ffffff] border-b border-[#e2e8f0] shadow-xs">
        <div className="w-full max-w-[1280px] mx-auto px-[5%] h-12 flex items-center justify-between text-xs">
          
          <div className="flex items-center space-x-6">
            <Link href="/erp" className="font-medium text-black text-sm tracking-tight flex items-center space-x-1.5">
              <span className="text-[#226eb4]">WAVES</span>
              <span className="bg-[#226eb4] text-white px-1.5 py-0.5 rounded text-[10px] font-mono">ERP</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6 text-[#444444] font-medium">
              <a href="#solutions" className="hover:text-[#226eb4] transition">Solutions</a>
              <a href="#verticals" className="hover:text-[#226eb4] transition">Verticals</a>
              <a href="#architecture" className="hover:text-[#226eb4] transition">Architecture</a>
              <a href="#compliance" className="hover:text-[#226eb4] transition">GST &amp; Taxes</a>
              <Link href="/pricing" className="hover:text-[#226eb4] transition">Pricing</Link>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <a 
              href="#demo"
              className="text-[#226eb4] font-bold hover:underline hidden sm:inline"
            >
              Request a demo
            </a>
            <Link
              href="/signup"
              className="zw-erp-btn py-1.5 px-4 text-xs font-bold rounded"
            >
              Sign up now &gt;
            </Link>
          </div>

        </div>
      </div>

      <main className="flex-1 w-full overflow-hidden">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION - Zoho ERP Ambient Glow & 3D Dashboard Mockup             */}
        {/* ========================================================================= */}
        <section className="relative w-full bg-[#030d1a] text-white overflow-hidden" style={{ padding: "100px 5% 120px" }}>
          {/* Ambient Glow Beam */}
          <div className="waves-light-beam" />

          <div className="relative z-10 w-full max-w-[1280px] mx-auto text-center">
            
            {/* Zoho ERP Mono Badge */}
            <div className="inline-flex items-center space-x-2 bg-[#0a2340] border border-[#1b436e] px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-[#4199ea] animate-pulse" />
              <span className="font-mono text-[11px] font-bold tracking-widest text-[#7bb8ec] uppercase">
                ERP SOFTWARE FOR INDIA &bull; CONTEXTUAL INTELLIGENCE
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[42px] sm:text-[50px] lg:text-[56px] font-medium text-white tracking-[-1px] leading-[1.14] max-w-4xl mx-auto">
              ERP software built to bring <br />
              <span className="bg-gradient-to-r from-white via-[#7bb8ec] to-[#4199ea] bg-clip-text text-transparent">
                your enterprise vision to life.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto mt-5 mb-8 font-normal">
              Waves ERP unifies core financials, multi-channel supply chain, Indian tax compliance, and vertical-specific workflows into one intuitive platform with zero data fragmentation.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              <Link
                href="/signup"
                className="zw-erp-btn w-full sm:w-auto"
              >
                <span>SIGN UP NOW FOR FREE</span>
                <span>&gt;</span>
              </Link>
              <a
                href="#demo"
                className="w-full sm:w-auto px-6 py-3.5 border border-slate-500 hover:border-white text-white text-xs font-bold uppercase tracking-wider rounded transition bg-slate-900/50 backdrop-blur-sm"
              >
                REQUEST AN ENTERPRISE DEMO
              </a>
            </div>

            {/* Interactive 3D Perspective ERP Dashboard */}
            <div className="max-w-5xl mx-auto mt-6">
              <ErpConsoleDemo />
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. PRODUCT HIGHLIGHT WIDGETS STRIP (Zoho ERP Pattern)                      */}
        {/* ========================================================================= */}
        <section id="solutions" className="w-full bg-[#ffffff] border-b border-[#e2e8f0] py-12">
          <div className="w-full max-w-[1280px] mx-auto px-[5%]">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-[#e2e8f0]">
              
              <div className="pt-6 lg:pt-0 lg:px-6 first:pl-0">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#226eb4] flex items-center justify-center mb-4">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">Core Financials</h3>
                <p className="text-xs sm:text-sm text-[#404040] leading-relaxed">
                  General ledgers, multi-entity cash balancing, fixed asset depreciation, and automated financial close.
                </p>
              </div>

              <div className="pt-6 lg:pt-0 lg:px-6">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Package className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">Supply Chain Management</h3>
                <p className="text-xs sm:text-sm text-[#404040] leading-relaxed">
                  Multi-warehouse inventory, batch expiry management, vendor purchase velocity, and FEFO picking.
                </p>
              </div>

              <div className="pt-6 lg:pt-0 lg:px-6">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                  <Receipt className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">Automated Billing &amp; Tax</h3>
                <p className="text-xs sm:text-sm text-[#404040] leading-relaxed">
                  Direct NIC portal GST e-invoicing, IRN generation, automated e-way bills, and UPI dynamic QR.
                </p>
              </div>

              <div className="pt-6 lg:pt-0 lg:px-6 last:pr-0">
                <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">People &amp; Payroll</h3>
                <p className="text-xs sm:text-sm text-[#404040] leading-relaxed">
                  Biometric shift scheduling, automated PF/ESI calculations, TDS 194C/J deductions, and direct salary transfers.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. GROWTH WITH WAVES ERP - FEATURE CARDS (Zoho ERP Pattern)                */}
        {/* ========================================================================= */}
        <section className="w-full bg-[#f8f9fa] py-16 sm:py-24 border-b border-[#e2e8f0]">
          <div className="w-full max-w-[1280px] mx-auto px-[5%]">
            
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="waves-mono-tag mb-3">
                <span className="waves-mono-tag-dot" />
                ENTERPRISE SCALE
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-black tracking-tight mt-2">
                Accelerate Growth with Contextual Intelligence
              </h2>
              <div className="w-11 h-[2px] bg-[#e42525] mx-auto mt-4 mb-4" />
              <p className="text-sm sm:text-base text-[#404040]">
                Replace 8 disconnected software subscriptions with one unified operational backbone that grows with your business.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Card 1: Core Financials */}
              <div className="group bg-white border border-[#e2e8f0] p-8 rounded-xl shadow-xs hover:shadow-lg transition-all relative">
                <span className="waves-mono-tag mb-4">
                  <span className="waves-mono-tag-dot" />
                  FINANCIAL LEDGER
                </span>
                <h3 className="text-xl font-bold text-black mb-3 group-hover:text-[#226eb4] transition">
                  Close Books 5x Faster with Continuous Reconciliation
                </h3>
                <p className="text-sm text-[#404040] leading-relaxed mb-6">
                  Say goodbye to month-end panic. Every UPI payment, bank transfer, and vendor bill matches instantly against your bank feed with automated anomaly flagging.
                </p>
                <div className="flex items-center text-xs font-bold text-[#226eb4] group-hover:translate-x-2 transition-transform">
                  <span>Explore Core Financials</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </div>
              </div>

              {/* Card 2: Supply Chain */}
              <div className="group bg-white border border-[#e2e8f0] p-8 rounded-xl shadow-xs hover:shadow-lg transition-all relative">
                <span className="waves-mono-tag mb-4">
                  <span className="waves-mono-tag-dot" />
                  SUPPLY CHAIN
                </span>
                <h3 className="text-xl font-bold text-black mb-3 group-hover:text-[#226eb4] transition">
                  Predictive Inventory That Eliminates Stockouts &amp; Expiry
                </h3>
                <p className="text-sm text-[#404040] leading-relaxed mb-6">
                  Intelligent reordering algorithms calculate seasonal consumption spikes and supplier lead times, auto-dispatching purchase orders before shelves run empty.
                </p>
                <div className="flex items-center text-xs font-bold text-[#226eb4] group-hover:translate-x-2 transition-transform">
                  <span>Explore Supply Chain</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </div>
              </div>

              {/* Card 3: Tax Compliance */}
              <div className="group bg-white border border-[#e2e8f0] p-8 rounded-xl shadow-xs hover:shadow-lg transition-all relative">
                <span className="waves-mono-tag mb-4">
                  <span className="waves-mono-tag-dot" />
                  TAX ENGINE
                </span>
                <h3 className="text-xl font-bold text-black mb-3 group-hover:text-[#226eb4] transition">
                  Permanent Tax Compliance for the Indian Regulatory Regime
                </h3>
                <p className="text-sm text-[#404040] leading-relaxed mb-6">
                  Generate IRN e-invoices and e-way bills with QR codes instantly on invoice generation. One-click GSTR-1, GSTR-3B JSON exports ensure zero filing penalties.
                </p>
                <div className="flex items-center text-xs font-bold text-[#226eb4] group-hover:translate-x-2 transition-transform">
                  <span>Explore Indian Tax Capabilities</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </div>
              </div>

              {/* Card 4: Platform & Workflows */}
              <div className="group bg-white border border-[#e2e8f0] p-8 rounded-xl shadow-xs hover:shadow-lg transition-all relative">
                <span className="waves-mono-tag mb-4">
                  <span className="waves-mono-tag-dot" />
                  LOW-CODE PLATFORM
                </span>
                <h3 className="text-xl font-bold text-black mb-3 group-hover:text-[#226eb4] transition">
                  Extensible Architecture Tailored to How You Operate
                </h3>
                <p className="text-sm text-[#404040] leading-relaxed mb-6">
                  Create custom departmental approval matrices, WhatsApp notification bots, and bespoke data tables with Waves Flow without writing complex backend code.
                </p>
                <div className="flex items-center text-xs font-bold text-[#226eb4] group-hover:translate-x-2 transition-transform">
                  <span>Explore Waves Platform</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. VERTICAL SOLUTIONS (Education, Healthcare, Retail)                     */}
        {/* ========================================================================= */}
        <section id="verticals" className="w-full bg-white py-16 sm:py-24 border-b border-[#e2e8f0]">
          <div className="w-full max-w-[1280px] mx-auto px-[5%]">
            
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="waves-mono-tag mb-3">
                <span className="waves-mono-tag-dot" />
                INDUSTRY VERTICALS
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-black tracking-tight mt-2">
                Purpose-Built for High-Trust Indian Sectors
              </h2>
              <div className="w-11 h-[2px] bg-[#e42525] mx-auto mt-4 mb-4" />
              <p className="text-sm sm:text-base text-[#404040]">
                Unlike rigid generic ERPs, Waves delivers deep, out-of-the-box vertical workflows tailored to schools, hospitals, and pharmacies.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              
              {/* Vertical 1: Education */}
              <div className="border border-[#e2e8f0] rounded-xl p-8 bg-[#f8f9fa] flex flex-col justify-between hover:border-[#056cb8] transition">
                <div>
                  <div className="flex items-center space-x-2 text-[#226eb4] font-bold text-xs uppercase mb-3">
                    <Building2 className="w-4 h-4" />
                    <span>Education &amp; Academics</span>
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2">Waves School Suite</h3>
                  <p className="text-xs sm:text-sm text-[#404040] leading-relaxed mb-6">
                    Automated parent WhatsApp fee receipts, CBSE/ICSE grading blueprints, RFID bus tracking, and flipped learning portals.
                  </p>
                </div>
                <Link
                  href="/school-erp"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#226eb4] hover:underline"
                >
                  <span>View School ERP Suite</span>
                  <span>&gt;</span>
                </Link>
              </div>

              {/* Vertical 2: Healthcare */}
              <div className="border border-[#e2e8f0] rounded-xl p-8 bg-[#f8f9fa] flex flex-col justify-between hover:border-emerald-600 transition">
                <div>
                  <div className="flex items-center space-x-2 text-emerald-600 font-bold text-xs uppercase mb-3">
                    <Building2 className="w-4 h-4" />
                    <span>Hospitals &amp; Clinics</span>
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2">Waves Health Suite</h3>
                  <p className="text-xs sm:text-sm text-[#404040] leading-relaxed mb-6">
                    OPD TV token calling, IPD bed allocation matrix, digital Rx prescription pads, and insurance TPA claim management.
                  </p>
                </div>
                <Link
                  href="/hospital-erp"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-600 hover:underline"
                >
                  <span>View Hospital ERP Suite</span>
                  <span>&gt;</span>
                </Link>
              </div>

              {/* Vertical 3: Retail Pharmacy */}
              <div className="border border-[#e2e8f0] rounded-xl p-8 bg-[#f8f9fa] flex flex-col justify-between hover:border-amber-600 transition">
                <div>
                  <div className="flex items-center space-x-2 text-amber-600 font-bold text-xs uppercase mb-3">
                    <Building2 className="w-4 h-4" />
                    <span>Retail &amp; Distribution</span>
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2">Waves Pharmacy POS</h3>
                  <p className="text-xs sm:text-sm text-[#404040] leading-relaxed mb-6">
                    3-second barcode billing, batch expiry warnings, Schedule H/X compliance registers, and instant distributor PO sync.
                  </p>
                </div>
                <Link
                  href="/pharmacy-pos"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-600 hover:underline"
                >
                  <span>View Pharmacy POS Suite</span>
                  <span>&gt;</span>
                </Link>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. THE 4-LAYER UNIFIED ARCHITECTURE ("Zero Data Fragmentation")            */}
        {/* ========================================================================= */}
        <section id="architecture" className="w-full bg-[#030d1a] text-white py-16 sm:py-24 border-b border-[#1b354d]">
          <div className="w-full max-w-[1280px] mx-auto px-[5%]">
            
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-flex items-center space-x-2 bg-[#0a2340] border border-[#1b436e] px-3.5 py-1.5 rounded-full mb-4">
                <span className="w-2 h-2 rounded-full bg-[#4199ea]" />
                <span className="font-mono text-[11px] font-bold tracking-widest text-[#7bb8ec] uppercase">
                  UNIFIED ARCHITECTURE
                </span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mt-2">
                Zero Data Fragmentation &bull; One Source of Truth
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-3">
                How Waves replaces disjointed point tools with a 4-layer unified cloud architecture.
              </p>
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
              
              {/* Layer 4: Touchpoints */}
              <div className="bg-[#0b1f38] border border-[#1e426f] p-5 sm:p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <span className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    L4
                  </span>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white">Omnichannel Touchpoint Layer</h4>
                    <p className="text-xs text-slate-300 mt-0.5">Administrator Web Portal &bull; Mobile Apps &bull; WhatsApp Bot &bull; POS Barcode &bull; Biometric Readers</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
                  Instant Synced
                </span>
              </div>

              {/* Layer 3: Vertical Business Logic */}
              <div className="bg-[#0b1f38] border border-[#1e426f] p-5 sm:p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <span className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                    L3
                  </span>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white">Domain Workflows &amp; Vertical Engines</h4>
                    <p className="text-xs text-slate-300 mt-0.5">CBSE/ICSE Grading &bull; Hospital OPD/IPD Bed Matrix &bull; Pharmacy Batch Expiry &bull; Student Records</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-blue-400 bg-blue-950 px-2.5 py-1 rounded border border-blue-800">
                  Modular Core
                </span>
              </div>

              {/* Layer 2: Intelligence & AI Engine */}
              <div className="bg-[#0b1f38] border border-[#1e426f] p-5 sm:p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <span className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                    L2
                  </span>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white">Contextual AI &amp; Analytics Engine</h4>
                    <p className="text-xs text-slate-300 mt-0.5">Predictive Inventory Ordering &bull; Working Capital Optimization &bull; Anomaly Detection &bull; AI Assistant</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-purple-400 bg-purple-950 px-2.5 py-1 rounded border border-purple-800">
                  Agentic AI
                </span>
              </div>

              {/* Layer 1: Unified Enterprise Database */}
              <div className="bg-[#0e2a4d] border border-[#2b5894] p-5 sm:p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center space-x-4">
                  <span className="w-10 h-10 rounded-lg bg-[#226eb4] text-white flex items-center justify-center font-bold text-sm">
                    L1
                  </span>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white">Unified Ledger &amp; Relational Master Data</h4>
                    <p className="text-xs text-slate-200 mt-0.5">Single source of truth &bull; 100% India residency &bull; Real-time ACID transactions &bull; AES-256 encryption</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-700">
                  Zero Redundancy
                </span>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. GST & INDIAN TAX COMPLIANCE STRIP                                       */}
        {/* ========================================================================= */}
        <section id="compliance" className="w-full bg-white py-16 border-b border-[#e2e8f0]">
          <div className="w-full max-w-[1280px] mx-auto px-[5%]">
            
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-4">
                <span className="waves-mono-tag">
                  <span className="waves-mono-tag-dot" />
                  GOVERNMENT COMPLIANT
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">
                  Seamless Integration with GSTN, NIC &amp; Banking Rails
                </h3>
                <p className="text-sm text-[#404040] leading-relaxed">
                  Waves ERP connects natively with the Indian Government Invoice Registration Portal (IRP). Every invoice exceeding regulatory turnover thresholds automatically receives an IRN number and signed QR code in real-time.
                </p>
              </div>

              <div className="lg:col-span-4 grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#f8f9fa] border border-[#e2e8f0] rounded-lg text-center">
                  <p className="text-xl font-bold text-black">GSTR-1 &amp; 3B</p>
                  <p className="text-[11px] text-[#7d7d7d] mt-0.5">1-Click JSON Export</p>
                </div>
                <div className="p-4 bg-[#f8f9fa] border border-[#e2e8f0] rounded-lg text-center">
                  <p className="text-xl font-bold text-black">E-Way Bill</p>
                  <p className="text-[11px] text-[#7d7d7d] mt-0.5">Vehicle Dispatch Sync</p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. LIVE ENTERPRISE DEMO BOOKING FORM                                       */}
        {/* ========================================================================= */}
        <section id="demo" className="w-full bg-[#f8f9fa] py-16 sm:py-24">
          <div className="w-full max-w-[1280px] mx-auto px-[5%]">
            
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-6 space-y-6">
                <span className="waves-mono-tag">
                  <span className="waves-mono-tag-dot" />
                  ENTERPRISE CONSULTATION
                </span>

                <h2 className="text-3xl sm:text-4xl font-bold text-black tracking-tight leading-tight">
                  Schedule an executive demo <br />
                  built around your operational model.
                </h2>

                <div className="w-11 h-[2px] bg-[#e42525]" />

                <p className="text-base text-[#404040] leading-relaxed">
                  Our enterprise architects will model your chart of accounts, supply chain flow, and multi-branch structure during a live 30-minute working session.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center space-x-3 text-sm text-[#333333]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Full Tally, Marg, SAP, or Busy master ledger data migration</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-[#333333]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Dedicated account manager &amp; certified on-site implementation team</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-[#333333]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Custom API endpoints for your proprietary ERP extensions</span>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <div className="lg:col-span-6 bg-white border border-[#e2e8f0] rounded-xl p-6 sm:p-10 shadow-sm">
                <BookDemoForm defaultProduct="erp" />
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full bg-white py-8 border-t border-[#e2e8f0]">
        <div className="w-full max-w-[1280px] mx-auto px-[5%] flex flex-col sm:flex-row items-center justify-between text-xs text-[#7d7d7d] gap-4">
          <p>&copy; {new Date().getFullYear()} Waves Technologies. All rights reserved.</p>
          <div className="flex items-center space-x-6">
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
