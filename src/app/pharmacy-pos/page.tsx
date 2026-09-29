import Navbar from "@/components/Navbar";
import BookDemoForm from "@/components/BookDemoForm";
import PharmacyConsoleDemo from "@/components/PharmacyConsoleDemo";
import PharmacyProblemsSolver from "@/components/PharmacyProblemsSolver";
import Link from "next/link";
import { 
  Store, 
  CheckCircle2, 
  Barcode, 
  CalendarX, 
  FileSpreadsheet, 
  ShieldCheck, 
  Zap, 
  Layers, 
  FileCheck2,
  Clock,
  Printer,
  QrCode,
  Laptop,
  Smartphone,
  Tablet,
  Package
} from "lucide-react";

export const metadata = {
  title: "Waves Pharmacy POS | Fast Barcode Billing & Batch Expiry Software",
  description: "Accelerate retail chemist billing with 3-second barcode checkout, automated near-expiry return alerts, loose tablet billing, and 1-click GST export.",
};

export default function PharmacyPosPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col antialiased">
      <Navbar />

      <main className="flex-1 w-full overflow-hidden">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION - Zoho Standard with Interactive Pharmacy Console         */}
        {/* ========================================================================= */}
        <section className="w-full bg-white pt-10 pb-16 sm:pt-14 sm:pb-20 border-b border-[#e6e9f0]">
          <div className="w-full max-w-[1280px] mx-auto px-[5%] text-center">
            
            {/* Top Mono Tag */}
            <div className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
              <span className="font-mono text-[11px] font-bold tracking-widest text-amber-900 uppercase">
                LIGHTNING 3-SECOND RETAIL POS &bull; ZERO EXPIRY LOSS
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-bold text-black tracking-[-0.03em] leading-[1.15] max-w-4xl mx-auto">
              Lightning Retail Pharmacy POS <br />
              <span className="text-amber-800">&amp; Automated Inventory Cloud</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#444444] leading-relaxed max-w-2xl mx-auto mt-4 mb-8">
              Cut customer checkout queues to under 3 seconds. Waves Pharmacy POS combines sub-second barcode scanning, automatic batch &amp; near-expiry return alerts, strip-to-loose tablet conversion, Schedule H/H1 registers, and 1-click GSTR-1 tax export.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/signup"
                className="zw-cta-main w-full sm:w-auto"
              >
                <span>GET STARTED FOR FREE</span>
                <span className="text-sm font-bold">&gt;</span>
              </Link>
              <a
                href="#demo"
                className="zw-cta-outlined w-full sm:w-auto py-3 px-6 text-xs uppercase tracking-wider"
              >
                REQUEST LIVE PHARMACY DEMO
              </a>
            </div>

            {/* Interactive Console Mockup */}
            <div className="mt-8 max-w-5xl mx-auto">
              <PharmacyConsoleDemo />
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. TRUSTED BY PHARMACIES & CHEMISTS                                       */}
        {/* ========================================================================= */}
        <section className="w-full bg-[#f8f9fa] py-10 border-b border-[#e6e9f0]">
          <div className="w-full max-w-[1280px] mx-auto px-[5%] text-center">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#7d7d7d] mb-6">
              TRUSTED BY 1,200+ RETAIL CHEMISTS, HOSPITAL PHARMACIES &amp; FRANCHISE CHAINS
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center opacity-85">
              <div className="p-3 bg-white border border-[#e2e8f0] rounded text-center">
                <p className="text-xs font-bold text-slate-800">Drug License</p>
                <p className="text-[10px] text-slate-500 font-mono">20B / 21B Ready</p>
              </div>
              <div className="p-3 bg-white border border-[#e2e8f0] rounded text-center">
                <p className="text-xs font-bold text-slate-800">Schedule H/H1</p>
                <p className="text-[10px] text-slate-500 font-mono">Auto Registers</p>
              </div>
              <div className="p-3 bg-white border border-[#e2e8f0] rounded text-center">
                <p className="text-xs font-bold text-slate-800">GST Compliant</p>
                <p className="text-[10px] text-slate-500 font-mono">1-Click JSON</p>
              </div>
              <div className="p-3 bg-white border border-[#e2e8f0] rounded text-center">
                <p className="text-xs font-bold text-slate-800">FEFO Expiry</p>
                <p className="text-[10px] text-slate-500 font-mono">Auto Debit Notes</p>
              </div>
              <div className="p-3 bg-white border border-[#e2e8f0] rounded text-center">
                <p className="text-xs font-bold text-slate-800">100k+ Medicines</p>
                <p className="text-[10px] text-slate-500 font-mono">Pre-Mapped Salts</p>
              </div>
              <div className="p-3 bg-white border border-[#e2e8f0] rounded text-center">
                <p className="text-xs font-bold text-slate-800">Tally / Busy</p>
                <p className="text-[10px] text-slate-500 font-mono">Zero Ledger Drift</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. 5 PROBLEMS WE SOLVE IN RETAIL & HOSPITAL PHARMACY                      */}
        {/* ========================================================================= */}
        <section className="w-full bg-white py-16 sm:py-20 border-b border-[#e6e9f0]">
          <div className="w-full max-w-[1280px] mx-auto px-[5%]">
            
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="waves-mono-tag mb-3">
                <span className="waves-mono-tag-dot" />
                PHARMACY PROFITABILITY
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-black tracking-tight mt-2">
                5 Core Problems We Solve in Pharmacy Retail
              </h2>
              <div className="w-11 h-[2px] bg-[#e42525] mx-auto mt-4 mb-4" />
              <p className="text-sm sm:text-base text-[#404040]">
                From cutting checkout times to under 3 seconds to reclaiming 100% of expiry losses through automated supplier debit notes.
              </p>
            </div>

            <PharmacyProblemsSolver />

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. PHARMACY WORKFLOW PILLARS (6 Feature Cards)                            */}
        {/* ========================================================================= */}
        <section className="w-full bg-[#f8f9fa] py-16 sm:py-20 border-b border-[#e6e9f0]">
          <div className="w-full max-w-[1280px] mx-auto px-[5%]">
            
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="waves-mono-tag mb-3">
                <span className="waves-mono-tag-dot" />
                INTELLIGENT RETAIL
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-black tracking-tight mt-2">
                Built Around the Speed of Indian Chemist Counters
              </h2>
              <div className="w-11 h-[2px] bg-[#e42525] mx-auto mt-4 mb-4" />
              <p className="text-sm sm:text-base text-[#404040]">
                Everything a pharmacy owner needs to maximize turnover, stay compliant, and keep customers coming back.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-white border border-[#e6e9f0] p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-5">
                  <Barcode className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">3-Sec Barcode Checkout</h3>
                <p className="text-xs sm:text-sm text-[#404040] leading-relaxed mb-4">
                  Sub-second barcode scanning with keyboard shortcuts (F2 Search, F4 Pay, F5 Print). Zero counter lag even on standard budget PCs.
                </p>
                <div className="pt-4 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-amber-800 font-bold">
                  <span>Fast POS Keyboard Hotkeys</span>
                  <span>&rarr;</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white border border-[#e6e9f0] p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-5">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">FEFO Expiry Radar</h3>
                <p className="text-xs sm:text-sm text-[#404040] leading-relaxed mb-4">
                  Visual 30/60/90-day expiry buckets with 1-click supplier return debit note generator. Reclaim 100% of purchase credit before cutoff dates.
                </p>
                <div className="pt-4 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-rose-700 font-bold">
                  <span>1-Click Return Debit Notes</span>
                  <span>&rarr;</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white border border-[#e6e9f0] p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#226eb4] flex items-center justify-center mb-5">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">Loose Tablet Pricing</h3>
                <p className="text-xs sm:text-sm text-[#404040] leading-relaxed mb-4">
                  Sell 2 or 4 tablets from a strip of 10 or 15. The system accurately calculates per-tablet rates and adjusts remaining fractional inventory.
                </p>
                <div className="pt-4 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-[#226eb4] font-bold">
                  <span>Fractional Strip Accounting</span>
                  <span>&rarr;</span>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white border border-[#e6e9f0] p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">Schedule H/H1 Drug Registers</h3>
                <p className="text-xs sm:text-sm text-[#404040] leading-relaxed mb-4">
                  Selling scheduled antibiotics or sedatives auto-logs patient name, doctor registration number, and quantity for instant Drug Inspector audits.
                </p>
                <div className="pt-4 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-emerald-700 font-bold">
                  <span>Drug Inspector Audit Ready</span>
                  <span>&rarr;</span>
                </div>
              </div>

              {/* Card 5 */}
              <div className="bg-white border border-[#e6e9f0] p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-5">
                  <Package className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">Distributor Auto-PO</h3>
                <p className="text-xs sm:text-sm text-[#404040] leading-relaxed mb-4">
                  Algorithms monitor 7-day sales velocity and seasonal demand to draft purchase orders automatically, sent via WhatsApp EDI to wholesalers.
                </p>
                <div className="pt-4 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-purple-700 font-bold">
                  <span>Predictive Stock Reordering</span>
                  <span>&rarr;</span>
                </div>
              </div>

              {/* Card 6 */}
              <div className="bg-white border border-[#e6e9f0] p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">1-Click GSTR-1 JSON Export</h3>
                <p className="text-xs sm:text-sm text-[#404040] leading-relaxed mb-4">
                  Multi-slab GST (0%, 5%, 12%, 18%) calculated automatically on every bill. Direct JSON export matches official GST portal schema with zero error.
                </p>
                <div className="pt-4 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-indigo-700 font-bold">
                  <span>Official GSTN Portal Schema</span>
                  <span>&rarr;</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. IMPACT COUNTER                                                         */}
        {/* ========================================================================= */}
        <section className="w-full bg-[#241706] text-white py-16 sm:py-20 border-b border-[#3d290c]">
          <div className="w-full max-w-[1280px] mx-auto px-[5%]">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              
              <div className="border-r border-[#3d290c] last:border-r-0">
                <p className="text-4xl sm:text-5xl font-medium text-[#fbbf24] tracking-tight">3 Sec</p>
                <p className="text-xs sm:text-sm text-amber-100 font-medium uppercase tracking-wider mt-2">
                  Average Checkout Speed
                </p>
                <p className="text-[11px] text-amber-300 mt-1">Sub-second barcode scan &amp; UPI</p>
              </div>

              <div className="border-r border-[#3d290c] last:border-r-0">
                <p className="text-4xl sm:text-5xl font-medium text-[#34d399] tracking-tight">0%</p>
                <p className="text-xs sm:text-sm text-amber-100 font-medium uppercase tracking-wider mt-2">
                  Unclaimed Expiry Loss
                </p>
                <p className="text-[11px] text-amber-300 mt-1">100% debit note supplier recovery</p>
              </div>

              <div className="border-r border-[#3d290c] last:border-r-0">
                <p className="text-4xl sm:text-5xl font-medium text-[#60a5fa] tracking-tight">1-Click</p>
                <p className="text-xs sm:text-sm text-amber-100 font-medium uppercase tracking-wider mt-2">
                  GSTR-1 JSON Export
                </p>
                <p className="text-[11px] text-amber-300 mt-1">Zero tax filing reconciliation stress</p>
              </div>

              <div>
                <p className="text-4xl sm:text-5xl font-medium text-[#c084fc] tracking-tight">1,200+</p>
                <p className="text-xs sm:text-sm text-amber-100 font-medium uppercase tracking-wider mt-2">
                  Pharmacies &amp; Chemists
                </p>
                <p className="text-[11px] text-amber-300 mt-1">Powered across India</p>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. MULTI-DEVICE COUNTER ECOSYSTEM                                         */}
        {/* ========================================================================= */}
        <section className="w-full bg-white py-16 sm:py-20 border-b border-[#e6e9f0]">
          <div className="w-full max-w-[1280px] mx-auto px-[5%]">
            
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <span className="waves-mono-tag">
                  <span className="waves-mono-tag-dot" />
                  COUNTER HARDWARE
                </span>
                
                <h2 className="text-2xl sm:text-4xl font-bold text-black tracking-tight leading-tight">
                  Seamlessly connected <br />
                  to all your billing counter hardware.
                </h2>

                <div className="w-11 h-[2px] bg-[#e42525]" />

                <p className="text-sm sm:text-base text-[#404040] leading-relaxed">
                  Waves Pharmacy POS interfaces directly with USB &amp; Bluetooth barcode scanners, thermal receipt printers, electronic cash drawers, customer-facing QR displays, and store owner smartphones.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start space-x-3.5">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                      <Barcode className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-black">High-Speed Barcode Gun Support</h4>
                      <p className="text-xs text-[#404040] mt-0.5">Plug &amp; play with Honeywell, TVS, Zebra, and standard 1D/2D QR handheld scanners.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#226eb4] flex items-center justify-center shrink-0">
                      <Printer className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-black">Thermal &amp; Laser Invoice Printers</h4>
                      <p className="text-xs text-[#404040] mt-0.5">Prints 2-inch and 3-inch roll receipts or full A4/A5 GST tax invoices with QR codes.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-black">Store Owner Live Mobile App</h4>
                      <p className="text-xs text-[#404040] mt-0.5">Monitor real-time cash drawer balance, counter sales, and low-stock alerts from anywhere.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphic Card */}
              <div className="lg:col-span-6 bg-[#f8f9fa] border border-[#e6e9f0] rounded-2xl p-6 sm:p-8 shadow-xl">
                <div className="bg-[#241706] text-white p-4 rounded-xl mb-4">
                  <div className="flex items-center justify-between text-xs border-b border-[#3d290c] pb-2 mb-3">
                    <span className="font-mono text-amber-400">&bull; Counter #1 Hardware Status</span>
                    <span className="text-slate-400">Scan Latency: 45ms</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-[#38240b] p-2.5 rounded border border-[#523512]">
                      <p className="text-amber-200 text-[10px]">Barcode Scanner</p>
                      <p className="font-bold text-emerald-400 mt-0.5">Online</p>
                    </div>
                    <div className="bg-[#38240b] p-2.5 rounded border border-[#523512]">
                      <p className="text-amber-200 text-[10px]">Thermal Printer</p>
                      <p className="font-bold text-emerald-400 mt-0.5">Ready</p>
                    </div>
                    <div className="bg-[#38240b] p-2.5 rounded border border-[#523512]">
                      <p className="text-amber-200 text-[10px]">Customer QR</p>
                      <p className="font-bold text-amber-400 mt-0.5">Synced</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-black">Sample Customer WhatsApp Bill Receipt</span>
                    <span className="text-slate-400">Instant</span>
                  </div>
                  <div className="bg-amber-50/50 p-3.5 rounded-lg border border-amber-200 text-xs space-y-2">
                    <p className="text-slate-800">
                      <span className="font-bold text-amber-900">Sanjivani Medico:</span> Thank you for your purchase. Your digital tax receipt is ready.
                    </p>
                    <div className="p-2 bg-white rounded border border-amber-100 flex items-center justify-between">
                      <span className="font-semibold text-slate-700">Bill #INV-4820 &bull; 3 Items</span>
                      <span className="font-bold text-emerald-700">₹288.00 Paid</span>
                    </div>
                    <p className="text-[11px] text-amber-900 font-bold">
                      Tap to download GST invoice with batch details &amp; dosage guide &gt;
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. LIVE PHARMACY DEMO BOOKING FORM                                        */}
        {/* ========================================================================= */}
        <section id="demo" className="w-full bg-white py-16 sm:py-20">
          <div className="w-full max-w-[1280px] mx-auto px-[5%]">
            
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-6 space-y-6">
                <span className="waves-mono-tag">
                  <span className="waves-mono-tag-dot" />
                  PHARMACY ONBOARDING
                </span>

                <h2 className="text-3xl sm:text-4xl font-bold text-black tracking-tight leading-tight">
                  Schedule a live demo <br />
                  using your actual retail counter setup.
                </h2>

                <div className="w-11 h-[2px] bg-[#e42525]" />

                <p className="text-base text-[#404040] leading-relaxed">
                  Our retail pharmacy specialists will demonstrate sub-second barcode billing, loose tablet calculations, and 1-click supplier return debit notes live on your screen.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center space-x-3 text-sm text-[#333333]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Free migration of medicine inventory &amp; distributor ledgers from Marg or Excel</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-[#333333]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Hardware setup assistance for your barcode guns and thermal printers</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-[#333333]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Access to 100,000+ pre-mapped Indian generic medicine database</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#e6e9f0] flex items-center space-x-6">
                  <div>
                    <p className="text-2xl font-bold text-black">24 Hours</p>
                    <p className="text-xs text-[#7d7d7d]">Average store go-live</p>
                  </div>
                  <div className="h-8 w-[1px] bg-[#e7ebf0]" />
                  <div>
                    <p className="text-2xl font-bold text-black">100%</p>
                    <p className="text-xs text-[#7d7d7d]">Audit ready for Drug Inspector</p>
                  </div>
                </div>
              </div>

              {/* Embedded Booking Form */}
              <div className="lg:col-span-6 bg-[#f8f9fa] border border-[#e6e9f0] rounded-xl p-6 sm:p-10 shadow-sm">
                <BookDemoForm defaultProduct="pharmacy-pos" />
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* Footer Strip */}
      <footer className="w-full bg-[#f8f9fa] py-8 border-t border-[#e6e9f0]">
        <div className="w-full max-w-[1280px] mx-auto px-[5%] flex flex-col sm:flex-row items-center justify-between text-xs text-[#7d7d7d] gap-4">
          <p>&copy; {new Date().getFullYear()} Waves Technologies. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="/school-erp" className="hover:text-black transition">School Suite</Link>
            <Link href="/hospital-erp" className="hover:text-black transition">Health Suite</Link>
            <Link href="/erp" className="hover:text-black transition">Waves ERP</Link>
            <Link href="/pricing" className="hover:text-black transition">Pricing</Link>
            <Link href="/signup" className="text-[#e42525] font-bold hover:underline">Get Started Free &gt;</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
