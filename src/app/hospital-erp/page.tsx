import Navbar from "@/components/Navbar";
import BookDemoForm from "@/components/BookDemoForm";
import HospitalConsoleDemo from "@/components/HospitalConsoleDemo";
import HospitalProblemsSolver from "@/components/HospitalProblemsSolver";
import Link from "next/link";
import { 
  Hospital, 
  CheckCircle2, 
  Activity, 
  Bed, 
  Stethoscope, 
  FileCheck, 
  Clock, 
  Tv, 
  HeartPulse,
  Receipt,
  ShieldCheck,
  Award,
  Sparkles,
  Laptop,
  Tablet,
  Smartphone
} from "lucide-react";

export const metadata = {
  title: "Waves Health Suite | Hospital & Clinic Cloud Management Software",
  description: "Manage OPD token queues, IPD beds, digital prescriptions, pathology lab tests, and TPA insurance billing with Waves Health Suite.",
};

export default function HospitalErpPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col antialiased">
      <Navbar />

      <main className="flex-1 w-full overflow-hidden">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION - Zoho Standard with Interactive Clinical Console         */}
        {/* ========================================================================= */}
        <section className="w-full bg-white pt-10 pb-16 sm:pt-14 sm:pb-20 border-b border-[#e6e9f0]">
          <div className="w-full max-w-[1280px] mx-auto px-[5%] text-center">
            
            {/* Top Mono Tag */}
            <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="font-mono text-[11px] font-bold tracking-widest text-emerald-800 uppercase">
                CLINICAL EHR &bull; ABHA / ABDM TIER 1 READY
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-bold text-black tracking-[-0.03em] leading-[1.15] max-w-4xl mx-auto">
              Clinical Management &amp; Hospital ERP <br />
              <span className="text-emerald-700">Simplified for Patient Care</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#444444] leading-relaxed max-w-2xl mx-auto mt-4 mb-8">
              From outpatient reception to the ICU. Digitize OPD waiting room TV token calling, IPD bed occupancy matrices, electronic health records (EHR), pathology interfacing, and TPA insurance claims in a unified high-speed system.
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
                REQUEST LIVE CLINICAL DEMO
              </a>
            </div>

            {/* Interactive Console Mockup */}
            <div className="mt-8 max-w-5xl mx-auto">
              <HospitalConsoleDemo />
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. TRUSTED BY HOSPITALS & CLINICS                                         */}
        {/* ========================================================================= */}
        <section className="w-full bg-[#f8f9fa] py-10 border-b border-[#e6e9f0]">
          <div className="w-full max-w-[1280px] mx-auto px-[5%] text-center">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#7d7d7d] mb-6">
              TRUSTED BY 280+ HOSPITALS, MULTI-SPECIALTY CLINICS &amp; DIAGNOSTIC CHAINS
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center opacity-85">
              <div className="p-3 bg-white border border-[#e2e8f0] rounded text-center">
                <p className="text-xs font-bold text-slate-800">NABH Standards</p>
                <p className="text-[10px] text-slate-500 font-mono">Audit-Ready Logs</p>
              </div>
              <div className="p-3 bg-white border border-[#e2e8f0] rounded text-center">
                <p className="text-xs font-bold text-slate-800">ABHA / ABDM</p>
                <p className="text-[10px] text-slate-500 font-mono">Tier 1 Certified</p>
              </div>
              <div className="p-3 bg-white border border-[#e2e8f0] rounded text-center">
                <p className="text-xs font-bold text-slate-800">Ayushman Bharat</p>
                <p className="text-[10px] text-slate-500 font-mono">PMJAY TMS API</p>
              </div>
              <div className="p-3 bg-white border border-[#e2e8f0] rounded text-center">
                <p className="text-xs font-bold text-slate-800">NABL Diagnostics</p>
                <p className="text-[10px] text-slate-500 font-mono">Bidirectional Labs</p>
              </div>
              <div className="p-3 bg-white border border-[#e2e8f0] rounded text-center">
                <p className="text-xs font-bold text-slate-800">ICD-10 Coded</p>
                <p className="text-[10px] text-slate-500 font-mono">Standardized Dx</p>
              </div>
              <div className="p-3 bg-white border border-[#e2e8f0] rounded text-center">
                <p className="text-xs font-bold text-slate-800">DPDP Compliant</p>
                <p className="text-[10px] text-slate-500 font-mono">AES-256 Cloud</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. 5 PROBLEMS WE SOLVE IN CLINICAL HEALTHCARE                             */}
        {/* ========================================================================= */}
        <section className="w-full bg-white py-16 sm:py-20 border-b border-[#e6e9f0]">
          <div className="w-full max-w-[1280px] mx-auto px-[5%]">
            
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="waves-mono-tag mb-3">
                <span className="waves-mono-tag-dot" />
                CLINICAL EXCELLENCE
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-black tracking-tight mt-2">
                5 Core Problems We Solve in Healthcare
              </h2>
              <div className="w-11 h-[2px] bg-[#e42525] mx-auto mt-4 mb-4" />
              <p className="text-sm sm:text-base text-[#404040]">
                From slashing OPD waiting room delays to eliminating handwriting dispensing errors and accelerating cashless insurance settlements.
              </p>
            </div>

            <HospitalProblemsSolver />

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. CLINICAL WORKFLOW PILLARS (6 Feature Cards)                            */}
        {/* ========================================================================= */}
        <section className="w-full bg-[#f8f9fa] py-16 sm:py-20 border-b border-[#e6e9f0]">
          <div className="w-full max-w-[1280px] mx-auto px-[5%]">
            
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="waves-mono-tag mb-3">
                <span className="waves-mono-tag-dot" />
                INTEGRATED HEALTHCARE
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-black tracking-tight mt-2">
                Comprehensive Modules for Every Department
              </h2>
              <div className="w-11 h-[2px] bg-[#e42525] mx-auto mt-4 mb-4" />
              <p className="text-sm sm:text-base text-[#404040]">
                A connected hospital management suite ensuring doctors, nurses, pharmacists, and billing accountants work in perfect harmony.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-white border border-[#e6e9f0] p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">Doctor Desk &amp; Digital Rx</h3>
                <p className="text-xs sm:text-sm text-[#404040] leading-relaxed mb-4">
                  1-click medical prescriptions with automated dosage, frequency, and duration defaults. Real-time allergy warnings and patient history lookup.
                </p>
                <div className="pt-4 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-emerald-700 font-bold">
                  <span>Drug Interaction Safety</span>
                  <span>&rarr;</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white border border-[#e6e9f0] p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#226eb4] flex items-center justify-center mb-5">
                  <Bed className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">Visual IPD Bed Matrix</h3>
                <p className="text-xs sm:text-sm text-[#404040] leading-relaxed mb-4">
                  Color-coded real-time bed occupancy for ICU, Deluxe, and General wards. Automated housekeeping notification upon patient discharge.
                </p>
                <div className="pt-4 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-[#226eb4] font-bold">
                  <span>Live Bed Turnover</span>
                  <span>&rarr;</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white border border-[#e6e9f0] p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-5">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">Pathology &amp; Lab Interfacing</h3>
                <p className="text-xs sm:text-sm text-[#404040] leading-relaxed mb-4">
                  Bidirectional interfacing with Sysmex, Beckman, and Roche analyzers. Automated barcoding and instant panic value SMS alerts to consulting doctors.
                </p>
                <div className="pt-4 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-purple-700 font-bold">
                  <span>Bidirectional Lab Sync</span>
                  <span>&rarr;</span>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white border border-[#e6e9f0] p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">TPA &amp; Cashless Claims</h3>
                <p className="text-xs sm:text-sm text-[#404040] leading-relaxed mb-4">
                  Automated pre-auth documentation with standardized ICD-10 coding. One-click claim packet assembly for Star Health, HDFC Ergo, ICICI &amp; PMJAY.
                </p>
                <div className="pt-4 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-amber-700 font-bold">
                  <span>99.4% First-Pass Approval</span>
                  <span>&rarr;</span>
                </div>
              </div>

              {/* Card 5 */}
              <div className="bg-white border border-[#e6e9f0] p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-5">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">Ayushman ABHA Sync</h3>
                <p className="text-xs sm:text-sm text-[#404040] leading-relaxed mb-4">
                  Direct ABDM Tier 1 gateway for 14-digit ABHA ID creation, Aadhaar OTP authentication, and digital health records locker synchronization.
                </p>
                <div className="pt-4 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-rose-700 font-bold">
                  <span>National Health Mission</span>
                  <span>&rarr;</span>
                </div>
              </div>

              {/* Card 6 */}
              <div className="bg-white border border-[#e6e9f0] p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">AI Clinical Medical Scribe</h3>
                <p className="text-xs sm:text-sm text-[#404040] leading-relaxed mb-4">
                  Converts natural doctor-patient spoken conversations into structured SOAP clinical notes, investigation orders, and discharge summaries in real time.
                </p>
                <div className="pt-4 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-indigo-700 font-bold">
                  <span>Automated SOAP Notes</span>
                  <span>&rarr;</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. IMPACT COUNTER (Matching Zoho Metric Style)                            */}
        {/* ========================================================================= */}
        <section className="w-full bg-[#061e1a] text-white py-16 sm:py-20 border-b border-[#133832]">
          <div className="w-full max-w-[1280px] mx-auto px-[5%]">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              
              <div className="border-r border-[#133832] last:border-r-0">
                <p className="text-4xl sm:text-5xl font-medium text-[#34d399] tracking-tight">3.2M+</p>
                <p className="text-xs sm:text-sm text-emerald-100 font-medium uppercase tracking-wider mt-2">
                  OPD Tokens Called
                </p>
                <p className="text-[11px] text-emerald-300 mt-1">With automated WhatsApp queue alerts</p>
              </div>

              <div className="border-r border-[#133832] last:border-r-0">
                <p className="text-4xl sm:text-5xl font-medium text-[#60a5fa] tracking-tight">45%</p>
                <p className="text-xs sm:text-sm text-emerald-100 font-medium uppercase tracking-wider mt-2">
                  Reduced Wait Time
                </p>
                <p className="text-[11px] text-emerald-300 mt-1">Balanced doctor consultation pacing</p>
              </div>

              <div className="border-r border-[#133832] last:border-r-0">
                <p className="text-4xl sm:text-5xl font-medium text-[#fbbf24] tracking-tight">99.4%</p>
                <p className="text-xs sm:text-sm text-emerald-100 font-medium uppercase tracking-wider mt-2">
                  First-Pass TPA Approval
                </p>
                <p className="text-[11px] text-emerald-300 mt-1">Standardized ICD-10 medical coding</p>
              </div>

              <div>
                <p className="text-4xl sm:text-5xl font-medium text-[#c084fc] tracking-tight">280+</p>
                <p className="text-xs sm:text-sm text-emerald-100 font-medium uppercase tracking-wider mt-2">
                  Hospitals &amp; Clinics
                </p>
                <p className="text-[11px] text-emerald-300 mt-1">Powered across India</p>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. MULTI-DEVICE CLINICAL MOBILITY                                         */}
        {/* ========================================================================= */}
        <section className="w-full bg-white py-16 sm:py-20 border-b border-[#e6e9f0]">
          <div className="w-full max-w-[1280px] mx-auto px-[5%]">
            
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <span className="waves-mono-tag">
                  <span className="waves-mono-tag-dot" />
                  HOSPITAL MOBILITY
                </span>
                
                <h2 className="text-2xl sm:text-4xl font-bold text-black tracking-tight leading-tight">
                  Connect consultation rooms, <br />
                  nursing stations, and waiting lobbies.
                </h2>

                <div className="w-11 h-[2px] bg-[#e42525]" />

                <p className="text-sm sm:text-base text-[#404040] leading-relaxed">
                  Waves Health Suite ensures continuous synchronization between doctor desks, ward tablets, reception token displays, and patient smartphones.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start space-x-3.5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <Laptop className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-black">Doctor Web Portal &amp; EMR</h4>
                      <p className="text-xs text-[#404040] mt-0.5">High-speed consultation pad, previous medical history, and lab order dispatches.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#226eb4] flex items-center justify-center shrink-0">
                      <Tablet className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-black">Nurse Ward Station Tablet</h4>
                      <p className="text-xs text-[#404040] mt-0.5">Bedside vitals charting, medication administration schedules, and doctor notes.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-black">Patient WhatsApp Health Assistant</h4>
                      <p className="text-xs text-[#404040] mt-0.5">Live queue token updates, digital prescriptions, lab report downloads, and bill payment.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphic Card */}
              <div className="lg:col-span-6 bg-[#f8f9fa] border border-[#e6e9f0] rounded-2xl p-6 sm:p-8 shadow-xl">
                <div className="bg-[#0b2420] text-white p-4 rounded-xl mb-4">
                  <div className="flex items-center justify-between text-xs border-b border-[#1b3d37] pb-2 mb-3">
                    <span className="font-mono text-emerald-400">&bull; Live Hospital Network Status</span>
                    <span className="text-slate-400">Response Latency: 110ms</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-[#12312b] p-2.5 rounded border border-[#1e4840]">
                      <p className="text-slate-400 text-[10px]">Waiting Room TVs</p>
                      <p className="font-bold text-emerald-400 mt-0.5">6 Active</p>
                    </div>
                    <div className="bg-[#12312b] p-2.5 rounded border border-[#1e4840]">
                      <p className="text-slate-400 text-[10px]">Ward Tablets</p>
                      <p className="font-bold text-emerald-400 mt-0.5">18 Synced</p>
                    </div>
                    <div className="bg-[#12312b] p-2.5 rounded border border-[#1e4840]">
                      <p className="text-slate-400 text-[10px]">ABHA Gateway</p>
                      <p className="font-bold text-emerald-400 mt-0.5">Connected</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-black">Sample Patient WhatsApp Prescription Dispatch</span>
                    <span className="text-slate-400">Instant</span>
                  </div>
                  <div className="bg-emerald-50/50 p-3.5 rounded-lg border border-emerald-200 text-xs space-y-2">
                    <p className="text-slate-800">
                      <span className="font-bold text-emerald-800">Apollo City Hospital:</span> Your consultation with Dr. Rajesh Varma has concluded.
                    </p>
                    <div className="p-2 bg-white rounded border border-emerald-100 flex items-center justify-between">
                      <span className="font-semibold text-slate-700">Digital Prescription #Rx-9812</span>
                      <span className="font-bold text-emerald-700">Verified &amp; Signed</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 font-bold">
                      Tap to view lab test bookings &amp; collect medicines from Hospital Pharmacy &gt;
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. LIVE CLINICAL DEMO BOOKING FORM                                        */}
        {/* ========================================================================= */}
        <section id="demo" className="w-full bg-white py-16 sm:py-20">
          <div className="w-full max-w-[1280px] mx-auto px-[5%]">
            
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-6 space-y-6">
                <span className="waves-mono-tag">
                  <span className="waves-mono-tag-dot" />
                  CLINICAL ONBOARDING
                </span>

                <h2 className="text-3xl sm:text-4xl font-bold text-black tracking-tight leading-tight">
                  Schedule a clinical demo tailored to your hospital specialties.
                </h2>

                <div className="w-11 h-[2px] bg-[#e42525]" />

                <p className="text-base text-[#404040] leading-relaxed">
                  Our healthcare workflow consultants will demonstrate live OPD TV calling, IPD bed allocation, and digital Rx prescription pads tailored to your doctors.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center space-x-3 text-sm text-[#333333]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Free migration of patient records from old HMIS software or Excel</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-[#333333]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>On-site staff training for receptionists, ward nurses, and pharmacy staff</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-[#333333]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Full assistance with Ayushman Bharat ABHA Tier 1 gateway onboarding</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#e6e9f0] flex items-center space-x-6">
                  <div>
                    <p className="text-2xl font-bold text-black">72 Hours</p>
                    <p className="text-xs text-[#7d7d7d]">Average hospital go-live</p>
                  </div>
                  <div className="h-8 w-[1px] bg-[#e7ebf0]" />
                  <div>
                    <p className="text-2xl font-bold text-black">100%</p>
                    <p className="text-xs text-[#7d7d7d]">Data privacy &amp; NABH ready</p>
                  </div>
                </div>
              </div>

              {/* Embedded Booking Form */}
              <div className="lg:col-span-6 bg-[#f8f9fa] border border-[#e6e9f0] rounded-xl p-6 sm:p-10 shadow-sm">
                <BookDemoForm defaultProduct="hospital-erp" />
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
