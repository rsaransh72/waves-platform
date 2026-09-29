"use client";

import { useState } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  Users, 
  FileCheck2, 
  ArrowUpRight, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  Clock, 
  BarChart3,
  Layers,
  Sparkles
} from "lucide-react";

export default function ErpConsoleDemo() {
  const [activeTab, setActiveTab] = useState<"finance" | "supply" | "compliance" | "ai">("finance");

  return (
    <div className="w-full bg-[#0a192f] text-white rounded-xl border border-[#1e3a5f] shadow-2xl overflow-hidden waves-perspective-card">
      {/* Top Window Bar */}
      <div className="bg-[#051020] px-4 py-3 flex items-center justify-between border-b border-[#162e4e] text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#e42525]" />
          <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
          <div className="w-3 h-3 rounded-full bg-[#10b981]" />
          <span className="text-slate-300 font-medium ml-2 font-mono text-[11px]">
            Waves Enterprise ERP &bull; Consolidated Group Ledger (FY 2026-27)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-emerald-400 font-mono">GST E-Invoicing API: Live</span>
        </div>
      </div>

      {/* Interactive Module Tabs */}
      <div className="bg-[#0b1f38] px-4 sm:px-6 py-2 border-b border-[#162e4e] flex items-center space-x-2 overflow-x-auto scrollbar-none text-xs">
        <button
          onClick={() => setActiveTab("finance")}
          className={`px-3 py-1.5 rounded transition cursor-pointer flex items-center space-x-1.5 ${
            activeTab === "finance"
              ? "bg-[#226eb4] text-white font-bold"
              : "text-slate-300 hover:text-white"
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Core Financials</span>
        </button>

        <button
          onClick={() => setActiveTab("supply")}
          className={`px-3 py-1.5 rounded transition cursor-pointer flex items-center space-x-1.5 ${
            activeTab === "supply"
              ? "bg-[#226eb4] text-white font-bold"
              : "text-slate-300 hover:text-white"
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Supply Chain &amp; Warehousing</span>
        </button>

        <button
          onClick={() => setActiveTab("compliance")}
          className={`px-3 py-1.5 rounded transition cursor-pointer flex items-center space-x-1.5 ${
            activeTab === "compliance"
              ? "bg-[#226eb4] text-white font-bold"
              : "text-slate-300 hover:text-white"
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>GST E-Way Bills &amp; Tax</span>
        </button>

        <button
          onClick={() => setActiveTab("ai")}
          className={`px-3 py-1.5 rounded transition cursor-pointer flex items-center space-x-1.5 ${
            activeTab === "ai"
              ? "bg-purple-600 text-white font-bold"
              : "text-slate-300 hover:text-white"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          <span>Contextual AI Assistant</span>
        </button>
      </div>

      {/* Main Interactive Screen */}
      <div className="p-4 sm:p-6 bg-[#071324] min-h-[380px] text-left">
        {activeTab === "finance" && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0e2442] border border-[#1b3e6b] p-4 rounded-lg">
                <p className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">Consolidated Revenue</p>
                <p className="text-2xl font-bold text-white mt-1">₹4.82 Cr</p>
                <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" /> +24.6% YoY growth
                </p>
              </div>

              <div className="bg-[#0e2442] border border-[#1b3e6b] p-4 rounded-lg">
                <p className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">Operating Margin</p>
                <p className="text-2xl font-bold text-white mt-1">32.8%</p>
                <p className="text-[11px] text-emerald-400 font-semibold mt-1">EBITDA Optimized</p>
              </div>

              <div className="bg-[#0e2442] border border-[#1b3e6b] p-4 rounded-lg">
                <p className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">DSO (Days Sales Out)</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">18 Days</p>
                <p className="text-[11px] text-slate-400 mt-1">Down from 46 days</p>
              </div>

              <div className="bg-[#0e2442] border border-[#1b3e6b] p-4 rounded-lg">
                <p className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">Cash Runway</p>
                <p className="text-2xl font-bold text-blue-400 mt-1">28 Months</p>
                <p className="text-[11px] text-slate-400 mt-1">Self-sustaining operating cash</p>
              </div>
            </div>

            {/* General Ledger Preview */}
            <div className="bg-[#0b1f38] border border-[#1b3e6b] rounded-lg p-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1b3e6b] text-xs">
                <span className="font-bold text-slate-200">Real-Time Enterprise Trial Balance</span>
                <span className="text-emerald-400 font-mono">Balanced &bull; Zero Discrepancy</span>
              </div>
              <div className="divide-y divide-[#162e4e] text-xs mt-2">
                <div className="py-2 flex justify-between items-center text-slate-300">
                  <span>Operating Accounts Receivable (UPI + Corporate Net Banking)</span>
                  <span className="font-mono text-emerald-400 font-bold">₹82,40,150 Dr</span>
                </div>
                <div className="py-2 flex justify-between items-center text-slate-300">
                  <span>Inventory Asset Valuation (Weighted Average Method)</span>
                  <span className="font-mono text-emerald-400 font-bold">₹1,44,20,000 Dr</span>
                </div>
                <div className="py-2 flex justify-between items-center text-slate-300">
                  <span>Sundry Creditors &amp; Vendor Payables</span>
                  <span className="font-mono text-amber-400 font-bold">₹34,18,500 Cr</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "supply" && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-[#0e2442] border border-[#1b3e6b] p-4 rounded-lg">
                <p className="text-[11px] text-slate-400 uppercase font-mono">Active Warehouses</p>
                <p className="text-2xl font-bold text-white mt-1">6 Hubs</p>
                <p className="text-xs text-emerald-400 mt-1">Multi-location automated replenishment</p>
              </div>
              <div className="bg-[#0e2442] border border-[#1b3e6b] p-4 rounded-lg">
                <p className="text-[11px] text-slate-400 uppercase font-mono">Stockout Prevention</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">99.8%</p>
                <p className="text-xs text-slate-400 mt-1">Predictive lead-time reordering</p>
              </div>
              <div className="bg-[#0e2442] border border-[#1b3e6b] p-4 rounded-lg">
                <p className="text-[11px] text-slate-400 uppercase font-mono">FEFO Expiry Auditing</p>
                <p className="text-2xl font-bold text-blue-400 mt-1">Zero Waste</p>
                <p className="text-xs text-slate-400 mt-1">First-Expiry-First-Out automated picking</p>
              </div>
            </div>

            <div className="bg-[#0b1f38] border border-[#1b3e6b] rounded-lg p-4 text-xs">
              <h4 className="font-bold text-slate-200 mb-2">Automated Purchase Order Dispatch</h4>
              <p className="text-slate-400 leading-relaxed">
                Centralized ERP auto-generated PO #9842 to Sun Pharma Distributors based on 14-day rolling consumption velocity. Vendor acknowledgment received via WhatsApp EDI in 4 minutes.
              </p>
            </div>
          </div>
        )}

        {activeTab === "compliance" && (
          <div className="space-y-4">
            <div className="bg-emerald-950/60 border border-emerald-700/60 p-4 rounded-lg flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-emerald-300">GST E-Invoicing &amp; E-Way Bill Auto-Generation</p>
                <p className="text-slate-300 mt-0.5">Direct integration with National Informatics Centre (NIC) Invoice Registration Portal (IRP)</p>
              </div>
              <span className="font-mono bg-emerald-800 text-emerald-100 px-3 py-1 rounded font-bold">
                100% Tax Compliant
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#0e2442] border border-[#1b3e6b] p-4 rounded-lg space-y-2">
                <p className="font-bold text-white">Latest Generated E-Invoice</p>
                <div className="p-2 bg-[#071324] rounded border border-[#1b3e6b] font-mono text-[11px] text-slate-300">
                  IRN: 8a4b2c...9e31f0 &bull; QR Code Embedded &bull; Signed by IRP
                </div>
                <p className="text-[11px] text-emerald-400">&check; Auto-synced into GSTR-1 and GSTR-3B filings</p>
              </div>

              <div className="bg-[#0e2442] border border-[#1b3e6b] p-4 rounded-lg space-y-2">
                <p className="font-bold text-white">TDS &amp; ESI/PF Automated Computation</p>
                <p className="text-slate-300 text-xs">
                  Section 194C, 194J &amp; 194Q TDS deducted on invoice creation. Form 26Q export ready on the 1st of every month.
                </p>
                <p className="text-[11px] text-blue-400">&check; One-click challan generation via net banking</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ai" && (
          <div className="space-y-4">
            <div className="bg-purple-950/60 border border-purple-700/60 p-4 rounded-lg flex items-start space-x-3 text-xs">
              <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-purple-200">Contextual AI Financial Analyst</p>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  Real-time anomaly detection across ledgers, vendor quote variance analysis, and predictive working capital forecasting.
                </p>
              </div>
            </div>

            <div className="bg-[#0e2442] border border-[#1b3e6b] p-4 rounded-lg text-xs space-y-2">
              <p className="font-bold text-purple-300">AI Alert: Working Capital Opportunity Detected</p>
              <p className="text-slate-300 leading-relaxed">
                Vendor &apos;MedTech Supplies&apos; offers a 2.5% early settlement discount if invoice #4812 (₹8.4 Lakhs) is cleared 6 days before the due date. Recommending auto-clearance based on existing ₹28L surplus operating cash. Expected net savings: ₹21,000.
              </p>
              <div className="pt-2 flex space-x-3">
                <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold transition cursor-pointer">
                  Approve Early Settlement
                </button>
                <button className="px-3 py-1 bg-[#162e4e] hover:bg-[#1f4068] text-slate-300 rounded font-semibold transition cursor-pointer">
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
