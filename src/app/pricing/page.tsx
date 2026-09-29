"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { 
  GraduationCap, 
  Hospital, 
  Store, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  HelpCircle,
  Layers 
} from "lucide-react";

export default function PricingPage() {
  const [suite, setSuite] = useState<"erp" | "school" | "health" | "pharmacy">("erp");

  return (
    <div className="min-h-screen bg-white flex flex-col antialiased">
      <Navbar />

      <main className="flex-1 w-full overflow-hidden">
        
        {/* ========================================================================= */}
        {/* 1. PRICING HERO SECTION                                                  */}
        {/* ========================================================================= */}
        <section className="w-full bg-white pt-12 pb-16 sm:pt-16 sm:pb-20 border-b border-[#e6e9f0]">
          <div className="w-full max-w-[1280px] mx-auto px-[5%]">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="waves-mono-tag mb-4">
                <span className="waves-mono-tag-dot" />
                TRANSPARENT INSTITUTIONAL PRICING
              </span>

              <h1 className="text-3xl sm:text-5xl font-bold text-black tracking-[-0.025em] leading-[1.15] mt-3">
                Predictable plans built to scale with your institution
              </h1>

              <div className="w-11 h-[2px] bg-[#e42525] mx-auto mt-4 mb-5" />

              <p className="text-base sm:text-lg text-[#404040] leading-relaxed">
                No hidden per-seat licensing penalties. All plans include 14-day zero-risk trial, free database migration, and dedicated phone support.
              </p>

              {/* Suite Selector Tabs */}
              <div className="mt-8 inline-flex flex-wrap p-1 rounded-[4px] bg-[#f8f9fa] border border-[#e6e9f0] gap-1 justify-center">
                <button
                  onClick={() => setSuite("erp")}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-[2px] text-xs sm:text-sm font-bold transition cursor-pointer ${
                    suite === "erp"
                      ? "bg-[#226eb4] text-white shadow-xs"
                      : "text-[#404040] hover:text-black"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Waves ERP</span>
                </button>

                <button
                  onClick={() => setSuite("school")}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-[2px] text-xs sm:text-sm font-bold transition cursor-pointer ${
                    suite === "school"
                      ? "bg-[#226eb4] text-white shadow-xs"
                      : "text-[#404040] hover:text-black"
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>School Suite</span>
                </button>

                <button
                  onClick={() => setSuite("health")}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-[2px] text-xs sm:text-sm font-bold transition cursor-pointer ${
                    suite === "health"
                      ? "bg-[#10b981] text-white shadow-xs"
                      : "text-[#404040] hover:text-black"
                  }`}
                >
                  <Hospital className="w-4 h-4" />
                  <span>Health Suite</span>
                </button>

                <button
                  onClick={() => setSuite("pharmacy")}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-[2px] text-xs sm:text-sm font-bold transition cursor-pointer ${
                    suite === "pharmacy"
                      ? "bg-[#f59e0b] text-white shadow-xs"
                      : "text-[#404040] hover:text-black"
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Pharmacy POS</span>
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. PRICING CARDS                                                         */}
        {/* ========================================================================= */}
        <section className="w-full bg-[#f8f9fa] py-16 sm:py-20 border-b border-[#e6e9f0]">
          <div className="w-full max-w-[1280px] mx-auto px-[5%]">
            
            {/* WAVES ERP PRICING */}
            {suite === "erp" && (
              <div className="grid md:grid-cols-3 gap-8">
                {/* ERP Plan 1 */}
                <div className="bg-white p-8 rounded-[4px] border border-[#e6e9f0] hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-black">Starter ERP</h3>
                    <p className="text-xs text-[#404040] mt-1">For single entities &amp; growing commercial businesses</p>
                    <div className="my-6">
                      <span className="text-3xl sm:text-4xl font-medium text-black">₹6,999</span>
                      <span className="text-xs text-[#7d7d7d]"> / month</span>
                      <p className="text-[11px] text-[#888888] mt-1">Billed annually • Up to 10 user seats</p>
                    </div>
                    <ul className="space-y-3 text-xs sm:text-sm text-[#333333] border-t border-[#f1f5f9] pt-6">
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Core General Ledger &amp; Trial Balance</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>GST E-Invoicing &amp; E-Way Bill Auto-Generation</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Single warehouse inventory &amp; batch tracking</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Automated bank reconciliation via API</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Free Tally / Marg master data migration</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-8">
                    <Link
                      href="/contact?plan=erp-starter"
                      className="zw-cta-outlined w-full text-center block"
                    >
                      Start 14-Day Free Pilot
                    </Link>
                  </div>
                </div>

                {/* ERP Plan 2 - Featured */}
                <div className="bg-white p-8 rounded-[4px] border-2 border-[#226eb4] shadow-lg relative flex flex-col justify-between">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#226eb4] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-[2px]">
                    Most Popular
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black">Professional ERP</h3>
                    <p className="text-xs text-[#404040] mt-1">For multi-location enterprises &amp; fast-growing chains</p>
                    <div className="my-6">
                      <span className="text-3xl sm:text-4xl font-medium text-black">₹14,999</span>
                      <span className="text-xs text-[#7d7d7d]"> / month</span>
                      <p className="text-[11px] text-[#888888] mt-1">Billed annually • Up to 50 user seats</p>
                    </div>
                    <ul className="space-y-3 text-xs sm:text-sm text-[#333333] border-t border-[#f1f5f9] pt-6">
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Multi-company consolidated ledgers</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Full multi-warehouse supply chain &amp; FEFO</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Contextual AI cashflow &amp; working capital alert</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Biometric attendance &amp; automated payroll/TDS</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Dedicated technical manager on hotline</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-8">
                    <Link
                      href="/contact?plan=erp-pro"
                      className="zw-cta-main w-full text-center block"
                    >
                      Get Started For Free &gt;
                    </Link>
                  </div>
                </div>

                {/* ERP Plan 3 */}
                <div className="bg-white p-8 rounded-[4px] border border-[#e6e9f0] hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-black">Enterprise Suite</h3>
                    <p className="text-xs text-[#404040] mt-1">For corporate trusts, hospital networks &amp; large conglomerates</p>
                    <div className="my-6">
                      <span className="text-3xl sm:text-4xl font-medium text-black">₹29,999</span>
                      <span className="text-xs text-[#7d7d7d]"> / month</span>
                      <p className="text-[11px] text-[#888888] mt-1">Billed annually • Unlimited capacity &amp; users</p>
                    </div>
                    <ul className="space-y-3 text-xs sm:text-sm text-[#333333] border-t border-[#f1f5f9] pt-6">
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Unlimited entities, subsidiaries &amp; locations</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Dedicated isolated database instance</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Custom REST API endpoints &amp; SAP/Oracle link</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>24/7 dedicated solutions architect &amp; priority SLA</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>On-site implementation team included</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-8">
                    <Link
                      href="/contact?plan=erp-enterprise"
                      className="zw-cta-outlined w-full text-center block"
                    >
                      Book Executive Consultation
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* SCHOOL SUITE PRICING */}
            {suite === "school" && (
              <div className="grid md:grid-cols-3 gap-8">
                {/* School Plan 1 */}
                <div className="bg-white p-8 rounded-[4px] border border-[#e6e9f0] hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-black">Starter Campus</h3>
                    <p className="text-xs text-[#404040] mt-1">For primary schools & institutes under 500 students</p>
                    <div className="my-6">
                      <span className="text-3xl sm:text-4xl font-medium text-black">₹2,499</span>
                      <span className="text-xs text-[#7d7d7d]"> / month</span>
                      <p className="text-[11px] text-[#888888] mt-1">Billed annually • Unlimited teachers</p>
                    </div>
                    <ul className="space-y-3 text-xs sm:text-sm text-[#333333] border-t border-[#f1f5f9] pt-6">
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Up to 500 active students</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Automated fee receipts & UPI links</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>CBSE/ICSE report card generator</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>WhatsApp parent announcements</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Free student master Excel migration</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-8">
                    <Link
                      href="/contact?plan=school-starter"
                      className="zw-cta-outlined w-full text-center block"
                    >
                      Start 14-Day Free Pilot
                    </Link>
                  </div>
                </div>

                {/* School Plan 2 - Featured */}
                <div className="bg-white p-8 rounded-[4px] border-2 border-[#056cb8] shadow-lg relative flex flex-col justify-between">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#226eb4] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-[2px]">
                    Most Popular
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black">Growth Academy</h3>
                    <p className="text-xs text-[#404040] mt-1">For established K-12 schools (500 to 2,000 students)</p>
                    <div className="my-6">
                      <span className="text-3xl sm:text-4xl font-medium text-black">₹4,999</span>
                      <span className="text-xs text-[#7d7d7d]"> / month</span>
                      <p className="text-[11px] text-[#888888] mt-1">Billed annually • Unlimited teachers & staff</p>
                    </div>
                    <ul className="space-y-3 text-xs sm:text-sm text-[#333333] border-t border-[#f1f5f9] pt-6">
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Up to 2,000 active students</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>RFID & Biometric gate punch sync</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Automated fee collection WhatsApp bot</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>School transport GPS live tracking</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Dedicated technical manager on call</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-8">
                    <Link
                      href="/contact?plan=school-growth"
                      className="zw-cta-main w-full text-center block"
                    >
                      Get Started For Free &gt;
                    </Link>
                  </div>
                </div>

                {/* School Plan 3 */}
                <div className="bg-white p-8 rounded-[4px] border border-[#e6e9f0] hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-black">Enterprise Network</h3>
                    <p className="text-xs text-[#404040] mt-1">For multi-branch chains, colleges & trusts</p>
                    <div className="my-6">
                      <span className="text-3xl sm:text-4xl font-medium text-black">₹8,999</span>
                      <span className="text-xs text-[#7d7d7d]"> / month</span>
                      <p className="text-[11px] text-[#888888] mt-1">Multi-campus support • Unlimited capacity</p>
                    </div>
                    <ul className="space-y-3 text-xs sm:text-sm text-[#333333] border-t border-[#f1f5f9] pt-6">
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Unlimited students & multiple branches</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Centralized trust management dashboard</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Custom report card formats & grading logic</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>On-site staff training workshops</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Priority 15-minute SLA hotline</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-8">
                    <Link
                      href="/contact?plan=school-enterprise"
                      className="zw-cta-outlined w-full text-center block"
                    >
                      Schedule Executive Demo
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* HEALTH SUITE PRICING */}
            {suite === "health" && (
              <div className="grid md:grid-cols-3 gap-8">
                {/* Health Plan 1 */}
                <div className="bg-white p-8 rounded-[4px] border border-[#e6e9f0] hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-black">Clinic Essential</h3>
                    <p className="text-xs text-[#404040] mt-1">For single-doctor clinics & day-care centers</p>
                    <div className="my-6">
                      <span className="text-3xl sm:text-4xl font-medium text-black">₹1,999</span>
                      <span className="text-xs text-[#7d7d7d]"> / month</span>
                      <p className="text-[11px] text-[#888888] mt-1">Billed annually • 2 Doctor logins</p>
                    </div>
                    <ul className="space-y-3 text-xs sm:text-sm text-[#333333] border-t border-[#f1f5f9] pt-6">
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>OPD appointment & patient register</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Digital Rx prescription pad</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>WhatsApp prescription sharing</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Consultation fee billing & GST receipts</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-8">
                    <Link
                      href="/contact?plan=health-clinic"
                      className="zw-cta-outlined w-full text-center block"
                    >
                      Start 14-Day Free Pilot
                    </Link>
                  </div>
                </div>

                {/* Health Plan 2 - Featured */}
                <div className="bg-white p-8 rounded-[4px] border-2 border-[#10b981] shadow-lg relative flex flex-col justify-between">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#10b981] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-[2px]">
                    Recommended
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black">Nursing Home & Polyclinic</h3>
                    <p className="text-xs text-[#404040] mt-1">For facilities with 10 to 50 beds & multi-specialty OPD</p>
                    <div className="my-6">
                      <span className="text-3xl sm:text-4xl font-medium text-black">₹5,499</span>
                      <span className="text-xs text-[#7d7d7d]"> / month</span>
                      <p className="text-[11px] text-[#888888] mt-1">Billed annually • Unlimited nursing staff</p>
                    </div>
                    <ul className="space-y-3 text-xs sm:text-sm text-[#333333] border-t border-[#f1f5f9] pt-6">
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Waiting room TV token queue calling</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>IPD bed matrix & daily nursing charges</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Pathology lab diagnostics & PDF reports</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>TPA pre-auth & cashless insurance tracking</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Free patient database migration</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-8">
                    <Link
                      href="/contact?plan=health-polyclinic"
                      className="zw-cta-main w-full text-center block"
                    >
                      Get Started For Free &gt;
                    </Link>
                  </div>
                </div>

                {/* Health Plan 3 */}
                <div className="bg-white p-8 rounded-[4px] border border-[#e6e9f0] hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-black">Full Hospital ERP</h3>
                    <p className="text-xs text-[#404040] mt-1">For 50+ bed multispecialty hospital centers</p>
                    <div className="my-6">
                      <span className="text-3xl sm:text-4xl font-medium text-black">₹11,999</span>
                      <span className="text-xs text-[#7d7d7d]"> / month</span>
                      <p className="text-[11px] text-[#888888] mt-1">Enterprise hospital package • Unlimited staff</p>
                    </div>
                    <ul className="space-y-3 text-xs sm:text-sm text-[#333333] border-t border-[#f1f5f9] pt-6">
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Full IPD, ICU, OT surgery schedule engine</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Integrated in-house hospital pharmacy POS</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>ABHA / NDHM digital health record sync</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>On-site doctor, nurse & billing training</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>24/7 dedicated clinical software hotline</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-8">
                    <Link
                      href="/contact?plan=health-hospital"
                      className="zw-cta-outlined w-full text-center block"
                    >
                      Book Hospital Consultation
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* PHARMACY POS PRICING */}
            {suite === "pharmacy" && (
              <div className="grid md:grid-cols-3 gap-8">
                {/* Pharmacy Plan 1 */}
                <div className="bg-white p-8 rounded-[4px] border border-[#e6e9f0] hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-black">Single Chemist Counter</h3>
                    <p className="text-xs text-[#404040] mt-1">For local retail pharmacies & medical shops</p>
                    <div className="my-6">
                      <span className="text-3xl sm:text-4xl font-medium text-black">₹1,299</span>
                      <span className="text-xs text-[#7d7d7d]"> / month</span>
                      <p className="text-[11px] text-[#888888] mt-1">Billed annually • 1 Billing counter</p>
                    </div>
                    <ul className="space-y-3 text-xs sm:text-sm text-[#333333] border-t border-[#f1f5f9] pt-6">
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>3-Second barcode scanner checkout</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Batch & near-expiry return alerts</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Strip-to-loose tablet price calculation</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Thermal POS receipt printer support</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>1-Click GSTR-1 JSON export</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-8">
                    <Link
                      href="/contact?plan=pharmacy-single"
                      className="zw-cta-outlined w-full text-center block"
                    >
                      Start 14-Day Free Trial
                    </Link>
                  </div>
                </div>

                {/* Pharmacy Plan 2 - Featured */}
                <div className="bg-white p-8 rounded-[4px] border-2 border-[#f59e0b] shadow-lg relative flex flex-col justify-between">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f59e0b] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-[2px]">
                    Most Popular
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black">Multi-Counter Store</h3>
                    <p className="text-xs text-[#404040] mt-1">For busy retail pharmacies with 2 to 4 checkout terminals</p>
                    <div className="my-6">
                      <span className="text-3xl sm:text-4xl font-medium text-black">₹2,899</span>
                      <span className="text-xs text-[#7d7d7d]"> / month</span>
                      <p className="text-[11px] text-[#888888] mt-1">Billed annually • Up to 4 billing counters</p>
                    </div>
                    <ul className="space-y-3 text-xs sm:text-sm text-[#333333] border-t border-[#f1f5f9] pt-6">
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Multi-counter cash drawer reconciliation</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Schedule H / H1 audit register compliance</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Supplier purchase orders & credit debits</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Customer loyalty & automated refill alerts</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Free medicine inventory migration</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-8">
                    <Link
                      href="/contact?plan=pharmacy-multi"
                      className="zw-cta-main w-full text-center block"
                    >
                      Get Started For Free &gt;
                    </Link>
                  </div>
                </div>

                {/* Pharmacy Plan 3 */}
                <div className="bg-white p-8 rounded-[4px] border border-[#e6e9f0] hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-black">Pharmacy Chain</h3>
                    <p className="text-xs text-[#404040] mt-1">For multi-outlet chemist networks & central warehouses</p>
                    <div className="my-6">
                      <span className="text-3xl sm:text-4xl font-medium text-black">₹6,499</span>
                      <span className="text-xs text-[#7d7d7d]"> / month</span>
                      <p className="text-[11px] text-[#888888] mt-1">Multi-branch chain • Central warehouse</p>
                    </div>
                    <ul className="space-y-3 text-xs sm:text-sm text-[#333333] border-t border-[#f1f5f9] pt-6">
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Centralized warehouse-to-store stock transfers</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Combined GSTR-1 & multi-branch GST filing</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Automated purchase reordering across outlets</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>On-site cashier hardware calibration</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Priority 24/7 hotline support</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-8">
                    <Link
                      href="/contact?plan=pharmacy-chain"
                      className="zw-cta-outlined w-full text-center block"
                    >
                      Inquire for Chain Rates
                    </Link>
                  </div>
                </div>
              </div>
            )}

          </div>
        </section>

      </main>

      <footer className="mt-auto border-t border-[#e6e9f0] bg-[#f8f9fa] py-8 text-center text-xs text-[#7d7d7d]">
        <p>&copy; 2026 Waves Technologies. Transparent Institutional Software Pricing. 14-day zero-risk trial on all plans.</p>
      </footer>
    </div>
  );
}
