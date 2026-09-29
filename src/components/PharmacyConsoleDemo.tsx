"use client";

import { useState } from "react";
import { 
  Barcode, 
  Store, 
  Clock, 
  AlertCircle, 
  FileSpreadsheet, 
  CheckCircle2, 
  Zap, 
  Layers, 
  QrCode, 
  Printer, 
  Send,
  Sparkles,
  Search,
  ShoppingCart
} from "lucide-react";

export default function PharmacyConsoleDemo() {
  const [activeTab, setActiveTab] = useState<"pos" | "expiry" | "schedule" | "po">("pos");

  return (
    <div className="w-full bg-[#f9fafc] border border-[#e6e9f0] rounded-xl shadow-2xl overflow-hidden text-left">
      {/* Top Bar */}
      <div className="bg-[#241706] text-white px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#3d290c]">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-[#e42525]" />
            <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
            <span className="w-3 h-3 rounded-full bg-[#10b981]" />
          </div>
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-amber-100">
            Waves Pharmacy POS &bull; Sanjivani Medico (Drug License: DL-20B-98401)
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-amber-300 font-mono">Barcode Gun &amp; UPI QR: Connected</span>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="bg-white border-b border-[#e6e9f0] px-4 sm:px-6 flex items-center justify-between overflow-x-auto scrollbar-none">
        <div className="flex space-x-1 sm:space-x-3 text-xs sm:text-sm font-medium py-2">
          <button
            onClick={() => setActiveTab("pos")}
            className={`px-3 py-2 rounded-md transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "pos"
                ? "bg-amber-50 text-amber-800 font-bold"
                : "text-[#404040] hover:text-black"
            }`}
          >
            <Barcode className="w-3.5 h-3.5" />
            <span>3-Sec Barcode Checkout</span>
          </button>

          <button
            onClick={() => setActiveTab("expiry")}
            className={`px-3 py-2 rounded-md transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "expiry"
                ? "bg-amber-50 text-amber-800 font-bold"
                : "text-[#404040] hover:text-black"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>FEFO Expiry Radar</span>
          </button>

          <button
            onClick={() => setActiveTab("schedule")}
            className={`px-3 py-2 rounded-md transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "schedule"
                ? "bg-amber-50 text-amber-800 font-bold"
                : "text-[#404040] hover:text-black"
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Schedule H/H1 Register</span>
          </button>

          <button
            onClick={() => setActiveTab("po")}
            className={`px-3 py-2 rounded-md transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "po"
                ? "bg-amber-50 text-amber-800 font-bold"
                : "text-[#404040] hover:text-black"
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Distributor Auto-PO</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-500">
          <span>Today&apos;s Bills: 184 &bull; Counter Cash: ₹62,450 &bull; UPI: ₹44,800</span>
        </div>
      </div>

      {/* Screen Content */}
      <div className="p-4 sm:p-6 bg-white min-h-[400px]">
        {activeTab === "pos" && (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-12 gap-6">
              {/* Left Column: Live Cart Screen */}
              <div className="lg:col-span-8 border border-[#e6e9f0] rounded-lg p-4 bg-white shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-black">Billing Counter #1 &bull; Inv #INV-4820</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold">Fast POS</span>
                  </div>
                  <span className="text-xs text-slate-500">Shortcut: F2 Search | F4 Pay</span>
                </div>

                <div className="border border-[#e6e9f0] rounded overflow-x-auto mb-4">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#f8fafc] text-slate-600 uppercase border-b border-[#e6e9f0]">
                      <tr>
                        <th className="p-2.5">Medicine Name</th>
                        <th className="p-2.5">Batch</th>
                        <th className="p-2.5">Exp</th>
                        <th className="p-2.5">Type</th>
                        <th className="p-2.5">Qty</th>
                        <th className="p-2.5">Rate</th>
                        <th className="p-2.5">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9]">
                      <tr>
                        <td className="p-2.5 font-bold text-black">Dolo 650mg Tablet</td>
                        <td className="p-2.5 font-mono text-slate-500">DL-8120</td>
                        <td className="p-2.5 text-slate-600">12/28</td>
                        <td className="p-2.5"><span className="text-[10px] bg-blue-50 text-blue-700 px-1 py-0.5 rounded">Strip (15)</span></td>
                        <td className="p-2.5 font-bold">1</td>
                        <td className="p-2.5">₹33.60</td>
                        <td className="p-2.5 font-bold text-black">₹33.60</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-black">Augmentin 625 Duo</td>
                        <td className="p-2.5 font-mono text-slate-500">AG-9402</td>
                        <td className="p-2.5 text-slate-600">09/27</td>
                        <td className="p-2.5"><span className="text-[10px] bg-blue-50 text-blue-700 px-1 py-0.5 rounded">Strip (10)</span></td>
                        <td className="p-2.5 font-bold">1</td>
                        <td className="p-2.5">₹201.50</td>
                        <td className="p-2.5 font-bold text-black">₹201.50</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-black">Pan-D 40mg Capsule</td>
                        <td className="p-2.5 font-mono text-slate-500">PD-3312</td>
                        <td className="p-2.5 text-slate-600">04/28</td>
                        <td className="p-2.5"><span className="text-[10px] bg-amber-50 text-amber-800 px-1 py-0.5 rounded font-semibold">Loose Cut</span></td>
                        <td className="p-2.5 font-bold">4 caps</td>
                        <td className="p-2.5">₹13.26/cap</td>
                        <td className="p-2.5 font-bold text-black">₹53.04</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="text-slate-500">Subtotal: ₹288.14 &bull; GST (12%): ₹34.58</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-700">Total Net Amount:</span>
                    <span className="text-lg font-bold text-amber-900 font-mono">₹288.00</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Customer Display & Instant UPI QR */}
              <div className="lg:col-span-4 bg-[#fefce8] border border-amber-200 rounded-lg p-5 flex flex-col justify-between text-xs space-y-4">
                <div>
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2 mb-3">
                    <span className="font-bold text-amber-900 uppercase tracking-wider text-[11px]">Dynamic UPI QR</span>
                    <span className="text-emerald-700 font-bold">&bull; Auto-Reconciled</span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-amber-200 text-center shadow-xs">
                    <div className="w-28 h-28 bg-slate-900 text-white mx-auto rounded flex items-center justify-center p-2 mb-2">
                      <QrCode className="w-24 h-24 text-amber-400" />
                    </div>
                    <p className="text-[11px] font-bold text-slate-800">Scan to Pay ₹288.00</p>
                    <p className="text-[10px] text-slate-500">GPay, PhonePe, Paytm, BHIM</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <button className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm">
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Thermal Receipt (F5)</span>
                  </button>
                  <p className="text-[10px] text-center text-slate-500">
                    &check; WhatsApp Digital Receipt will be sent automatically
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "expiry" && (
          <div className="space-y-4 text-xs">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg">
                <p className="text-rose-800 font-bold uppercase text-[10px]">Expiring in &lt; 30 Days</p>
                <p className="text-2xl font-bold text-rose-950 mt-1">₹4,250</p>
                <p className="text-rose-700 text-[11px] mt-1">3 Batches &bull; Ready for supplier return</p>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800 font-bold uppercase text-[10px]">Expiring in 60-90 Days</p>
                <p className="text-2xl font-bold text-amber-950 mt-1">₹18,900</p>
                <p className="text-amber-700 text-[11px] mt-1">Push on front counter or return early</p>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-emerald-800 font-bold uppercase text-[10px]">Unclaimed Losses</p>
                <p className="text-2xl font-bold text-emerald-950 mt-1">0% Loss</p>
                <p className="text-emerald-700 text-[11px] mt-1">100% credit note recovery via auto-debit</p>
              </div>
            </div>

            <div className="p-4 bg-white border border-[#e6e9f0] rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-black">Automated Supplier Return Debit Note</h4>
                <button className="px-3 py-1 bg-rose-600 text-white rounded font-bold text-xs hover:bg-rose-700 transition cursor-pointer">
                  Export Debit Note to Distributor
                </button>
              </div>
              <p className="text-slate-500 leading-relaxed text-xs">
                Generated Debit Note #DN-2026-081 against Vardhman Pharma Distributors for Batch #AM-104 (Amoxicillin 500mg) expiring 15 Oct 2026. Credit note value ₹3,840 adjusted in next purchase ledger.
              </p>
            </div>
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
              <div>
                <h4 className="font-bold text-amber-900 text-sm">Schedule H &amp; H1 Regulatory Drug Register</h4>
                <p className="text-slate-600 mt-0.5">Automated logging compliant with Indian Drug &amp; Cosmetics Rules</p>
              </div>
              <span className="font-mono bg-amber-100 text-amber-900 px-2.5 py-1 rounded font-bold">
                Drug Inspector Audit: 100% Ready
              </span>
            </div>

            <div className="border border-[#e6e9f0] rounded-lg overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#f8fafc] text-slate-600 uppercase border-b border-[#e6e9f0]">
                  <tr>
                    <th className="p-3">Dispense Date</th>
                    <th className="p-3">Drug Name</th>
                    <th className="p-3">Patient Name</th>
                    <th className="p-3">Prescribing Doctor</th>
                    <th className="p-3">Doctor Reg #</th>
                    <th className="p-3">Qty Dispensed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-mono">Today 10:14 AM</td>
                    <td className="p-3 font-bold text-black">Alprazolam 0.25mg (Sch H1)</td>
                    <td className="p-3">Mahesh Deshmukh</td>
                    <td className="p-3">Dr. K. S. Murthy (Psychiatry)</td>
                    <td className="p-3 font-mono text-[#226eb4]">MCI-48192</td>
                    <td className="p-3 font-bold">10 Tablets</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-mono">Today 11:32 AM</td>
                    <td className="p-3 font-bold text-black">Cefixime 200mg (Sch H)</td>
                    <td className="p-3">Sunita Rawat</td>
                    <td className="p-3">Dr. Ananya Sen (Medicine)</td>
                    <td className="p-3 font-mono text-[#226eb4]">DMC-81204</td>
                    <td className="p-3 font-bold">10 Tablets</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "po" && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div>
                <h4 className="font-bold text-blue-900 text-sm">Smart Distributor Purchase Order Generator</h4>
                <p className="text-slate-600 mt-0.5">Calculates 7-day sales velocity and auto-fills reorder quantities</p>
              </div>
              <button className="px-3 py-1.5 bg-[#226eb4] text-white rounded font-bold text-xs hover:bg-[#045594] transition cursor-pointer">
                Send PO via WhatsApp EDI
              </button>
            </div>

            <div className="p-4 bg-white border border-[#e6e9f0] rounded-lg space-y-2">
              <p className="font-bold text-black">Auto-Generated PO #PO-9412 &bull; MedPlus Distributors</p>
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1 text-slate-700">
                <p>&bull; <span className="font-bold text-black">Dolo 650mg:</span> Current stock 4 strips &bull; Velocity 18 strips/day &bull; Reorder: 10 boxes (100 strips)</p>
                <p>&bull; <span className="font-bold text-black">Pan-D 40mg:</span> Current stock 2 strips &bull; Velocity 8 strips/day &bull; Reorder: 5 boxes (50 strips)</p>
                <p>&bull; <span className="font-bold text-black">Azithromycin 500mg:</span> Current stock 1 strip &bull; Seasonal spike +40% &bull; Reorder: 6 boxes</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
