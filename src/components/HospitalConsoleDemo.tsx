"use client";

import { useState } from "react";
import { 
  Hospital, 
  Stethoscope, 
  Bed, 
  Tv, 
  HeartPulse, 
  FileCheck2, 
  Sparkles, 
  Clock, 
  User, 
  AlertTriangle, 
  Check, 
  ShieldCheck,
  Send,
  Download,
  Activity
} from "lucide-react";

export default function HospitalConsoleDemo() {
  const [activeTab, setActiveTab] = useState<"opd" | "ipd" | "diagnostics" | "tpa" | "ai">("opd");

  return (
    <div className="w-full bg-[#f9fafc] border border-[#e6e9f0] rounded-xl shadow-2xl overflow-hidden text-left">
      {/* Top Bar */}
      <div className="bg-[#0b2420] text-white px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#1b3d37]">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-[#e42525]" />
            <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
            <span className="w-3 h-3 rounded-full bg-[#10b981]" />
          </div>
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-emerald-100">
            Waves Clinical Cloud &bull; Apollo City Hospital (NABH ID: NABH-2026-0819)
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-emerald-300 font-mono">ABHA Tier 1 Gateway: Live</span>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="bg-white border-b border-[#e6e9f0] px-4 sm:px-6 flex items-center justify-between overflow-x-auto scrollbar-none">
        <div className="flex space-x-1 sm:space-x-3 text-xs sm:text-sm font-medium py-2">
          <button
            onClick={() => setActiveTab("opd")}
            className={`px-3 py-2 rounded-md transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "opd"
                ? "bg-emerald-50 text-emerald-700 font-bold"
                : "text-[#404040] hover:text-black"
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>OPD TV Tokens &amp; Queue</span>
          </button>

          <button
            onClick={() => setActiveTab("ipd")}
            className={`px-3 py-2 rounded-md transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "ipd"
                ? "bg-emerald-50 text-emerald-700 font-bold"
                : "text-[#404040] hover:text-black"
            }`}
          >
            <Bed className="w-3.5 h-3.5" />
            <span>IPD Bed Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab("diagnostics")}
            className={`px-3 py-2 rounded-md transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "diagnostics"
                ? "bg-emerald-50 text-emerald-700 font-bold"
                : "text-[#404040] hover:text-black"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Pathology &amp; Labs</span>
          </button>

          <button
            onClick={() => setActiveTab("tpa")}
            className={`px-3 py-2 rounded-md transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "tpa"
                ? "bg-emerald-50 text-emerald-700 font-bold"
                : "text-[#404040] hover:text-black"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>TPA Cashless Claims</span>
          </button>

          <button
            onClick={() => setActiveTab("ai")}
            className={`px-3 py-2 rounded-md transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "ai"
                ? "bg-purple-50 text-purple-700 font-bold"
                : "text-[#404040] hover:text-black"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>AI Medical Scribe</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-500">
          <span>Active Inpatients: 86 &bull; Doctors On Duty: 14</span>
        </div>
      </div>

      {/* Screen Content */}
      <div className="p-4 sm:p-6 bg-white min-h-[400px]">
        {activeTab === "opd" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#f0fdf4] border border-[#bbf7d0] p-4 rounded-lg">
                <p className="text-xs text-emerald-800 uppercase font-semibold">Today&apos;s OPD Footfall</p>
                <p className="text-2xl font-bold text-emerald-950 mt-1">214 Patients</p>
                <p className="text-[11px] text-emerald-700 mt-1">162 Consulted &bull; 52 In Waiting</p>
              </div>

              <div className="bg-[#f0fdf4] border border-[#bbf7d0] p-4 rounded-lg">
                <p className="text-xs text-emerald-800 uppercase font-semibold">Average Consultation Time</p>
                <p className="text-2xl font-bold text-emerald-950 mt-1">11 Mins</p>
                <p className="text-[11px] text-emerald-700 mt-1">Reduced wait time by 45%</p>
              </div>

              <div className="bg-[#f0fdf4] border border-[#bbf7d0] p-4 rounded-lg">
                <p className="text-xs text-emerald-800 uppercase font-semibold">Live Queue TV Calling</p>
                <p className="text-2xl font-bold text-[#226eb4] mt-1">Token #44</p>
                <p className="text-[11px] text-slate-600 mt-1">Room 3 &bull; Dr. Ananya Sen</p>
              </div>

              <div className="bg-[#f0fdf4] border border-[#bbf7d0] p-4 rounded-lg">
                <p className="text-xs text-emerald-800 uppercase font-semibold">Digital Prescriptions</p>
                <p className="text-2xl font-bold text-purple-700 mt-1">100% Paperless</p>
                <p className="text-[11px] text-slate-600 mt-1">Instant WhatsApp dispatch</p>
              </div>
            </div>

            {/* Waiting Room TV Simulator */}
            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 border border-slate-200 rounded-lg p-4 bg-slate-900 text-white">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-3">
                  <span className="font-bold text-xs text-emerald-400 font-mono tracking-wider">
                    WAITING ROOM TV DISPLAY &bull; 4K CALLER FEED
                  </span>
                  <span className="text-[11px] text-slate-400">Audio Chime: Active</span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-emerald-900/60 border border-emerald-500/60 p-3 rounded">
                    <p className="text-[10px] text-emerald-300 font-mono">NOW CALLING</p>
                    <p className="text-3xl font-medium text-white mt-1">Token #44</p>
                    <p className="text-xs text-emerald-200 mt-1">Dr. Rajesh Varma &bull; Room 1</p>
                  </div>

                  <div className="bg-blue-900/40 border border-blue-500/40 p-3 rounded">
                    <p className="text-[10px] text-blue-300 font-mono">CONSULTING</p>
                    <p className="text-3xl font-medium text-white mt-1">Token #43</p>
                    <p className="text-xs text-blue-200 mt-1">Dr. Ananya Sen &bull; Room 3</p>
                  </div>

                  <div className="bg-slate-800/60 border border-slate-700 p-3 rounded">
                    <p className="text-[10px] text-slate-400 font-mono">NEXT IN LINE</p>
                    <p className="text-3xl font-medium text-slate-300 mt-1">Token #45</p>
                    <p className="text-xs text-slate-400 mt-1">Dr. Vikas Rao &bull; Room 4</p>
                  </div>
                </div>
              </div>

              {/* Digital Rx Pad Preview */}
              <div className="lg:col-span-4 border border-emerald-200 bg-emerald-50/40 rounded-lg p-4 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-emerald-950 border-b border-emerald-200 pb-2">
                  <span>Digital Rx Pad &bull; Dr. Ananya Sen</span>
                  <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Rx #9182</span>
                </div>
                <div className="space-y-1.5 text-slate-700">
                  <p><span className="font-bold text-black">Patient:</span> Smt. Rekha Sharma (46y / F)</p>
                  <p><span className="font-bold text-black">Diagnosis:</span> Essential Hypertension &bull; Stage 1</p>
                  <div className="bg-white p-2 rounded border border-emerald-200">
                    <p className="font-bold text-black">1. Tab. Telmisartan 40mg</p>
                    <p className="text-[11px] text-slate-500">1-0-0 (Morning after food) &bull; 30 Days</p>
                  </div>
                  <p className="text-[11px] text-emerald-700 font-bold">&check; Drug-Drug Interaction Checked: Safe</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ipd" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div>
                <h4 className="text-sm font-bold text-black">Visual Bed Matrix &bull; Inpatient Department</h4>
                <p className="text-xs text-slate-500">Occupancy: 86 / 100 Beds Occupied (86%) &bull; 14 Vacant</p>
              </div>
              <div className="flex space-x-2">
                <span className="text-xs bg-rose-100 text-rose-800 px-2.5 py-1 rounded font-bold">Occupied: 86</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded font-bold">Available: 14</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
              <div className="p-3 bg-rose-50 border border-rose-300 rounded text-center">
                <p className="font-bold text-rose-900">Bed 101 (ICU)</p>
                <p className="text-[10px] text-rose-700 mt-1">Patient: M. Roy</p>
                <span className="text-[9px] bg-rose-200 text-rose-900 px-1 py-0.5 rounded font-mono mt-1 inline-block">Occupied</span>
              </div>
              <div className="p-3 bg-rose-50 border border-rose-300 rounded text-center">
                <p className="font-bold text-rose-900">Bed 102 (ICU)</p>
                <p className="text-[10px] text-rose-700 mt-1">Patient: K. Das</p>
                <span className="text-[9px] bg-rose-200 text-rose-900 px-1 py-0.5 rounded font-mono mt-1 inline-block">Occupied</span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-center">
                <p className="font-bold text-emerald-900">Bed 103 (ICU)</p>
                <p className="text-[10px] text-emerald-700 mt-1">Sanitized</p>
                <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1 py-0.5 rounded font-mono mt-1 inline-block">Ready</span>
              </div>
              <div className="p-3 bg-rose-50 border border-rose-300 rounded text-center">
                <p className="font-bold text-rose-900">Bed 201 (Deluxe)</p>
                <p className="text-[10px] text-rose-700 mt-1">Patient: A. Gupta</p>
                <span className="text-[9px] bg-rose-200 text-rose-900 px-1 py-0.5 rounded font-mono mt-1 inline-block">Occupied</span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-center">
                <p className="font-bold text-emerald-900">Bed 202 (Deluxe)</p>
                <p className="text-[10px] text-emerald-700 mt-1">Housekeeping Done</p>
                <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1 py-0.5 rounded font-mono mt-1 inline-block">Ready</span>
              </div>
              <div className="p-3 bg-rose-50 border border-rose-300 rounded text-center">
                <p className="font-bold text-rose-900">Bed 301 (Gen)</p>
                <p className="text-[10px] text-rose-700 mt-1">Patient: S. Nair</p>
                <span className="text-[9px] bg-rose-200 text-rose-900 px-1 py-0.5 rounded font-mono mt-1 inline-block">Occupied</span>
              </div>
              <div className="p-3 bg-rose-50 border border-rose-300 rounded text-center">
                <p className="font-bold text-rose-900">Bed 302 (Gen)</p>
                <p className="text-[10px] text-rose-700 mt-1">Patient: V. Joshi</p>
                <span className="text-[9px] bg-rose-200 text-rose-900 px-1 py-0.5 rounded font-mono mt-1 inline-block">Occupied</span>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-300 rounded text-center">
                <p className="font-bold text-amber-900">Bed 303 (Gen)</p>
                <p className="text-[10px] text-amber-700 mt-1">Cleaning In Prog</p>
                <span className="text-[9px] bg-amber-200 text-amber-900 px-1 py-0.5 rounded font-mono mt-1 inline-block">Turnover</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "diagnostics" && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div>
                <h4 className="font-bold text-blue-900 text-sm">Pathology Laboratory &bull; Bidirectional Interfacing</h4>
                <p className="text-slate-600 mt-0.5">Automated test analyzer barcode sync with zero manual data entry</p>
              </div>
              <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">Beckman &bull; Sysmex Synced</span>
            </div>

            <div className="border border-[#e6e9f0] rounded-lg overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#f8fafc] text-slate-600 uppercase border-b border-[#e6e9f0]">
                  <tr>
                    <th className="p-3">Sample Barcode</th>
                    <th className="p-3">Patient</th>
                    <th className="p-3">Investigation</th>
                    <th className="p-3">Result</th>
                    <th className="p-3">Reference Range</th>
                    <th className="p-3">Panic Alert</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-[#226eb4]">#BC-849201</td>
                    <td className="p-3 font-medium">Suresh Iyer (52y)</td>
                    <td className="p-3">HbA1c Glycated Hemoglobin</td>
                    <td className="p-3 font-bold text-rose-600">8.4 %</td>
                    <td className="p-3 text-slate-500">&lt; 5.7 %</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-semibold text-[10px]">High &bull; SMS Sent</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-[#226eb4]">#BC-849202</td>
                    <td className="p-3 font-medium">Anita Varma (29y)</td>
                    <td className="p-3">Complete Blood Count (CBC) - Hb</td>
                    <td className="p-3 font-bold text-emerald-600">13.2 g/dL</td>
                    <td className="p-3 text-slate-500">12.0 - 15.0 g/dL</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">Normal</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "tpa" && (
          <div className="space-y-4 text-xs">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-emerald-800 font-bold uppercase text-[10px]">Cashless Settled</p>
                <p className="text-2xl font-bold text-emerald-950 mt-1">₹84.6 Lakhs</p>
                <p className="text-emerald-700 text-[11px] mt-1">99.4% first-pass approval</p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 font-bold uppercase text-[10px]">Active Pre-Auths</p>
                <p className="text-2xl font-bold text-blue-950 mt-1">18 Cases</p>
                <p className="text-blue-700 text-[11px] mt-1">Star Health, HDFC Ergo, ICICI</p>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-purple-800 font-bold uppercase text-[10px]">Ayushman PMJAY</p>
                <p className="text-2xl font-bold text-purple-950 mt-1">100% Digital</p>
                <p className="text-purple-700 text-[11px] mt-1">Instant TMS portal claim submission</p>
              </div>
            </div>

            <div className="p-4 bg-white border border-[#e6e9f0] rounded-lg space-y-2">
              <h5 className="font-bold text-black">Automated Claim Packet Assembly</h5>
              <p className="text-slate-500 leading-relaxed">
                Discharge summary with ICD-10 coding, lab investigation reports, and itemized billing ledger are bundled automatically into a single digitally signed PDF packet for instant TPA portal upload.
              </p>
            </div>
          </div>
        )}

        {activeTab === "ai" && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg flex items-start space-x-3">
              <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-purple-950 text-sm">Waves AI Clinical Scribe</h4>
                <p className="text-purple-800 mt-1 leading-relaxed">
                  Doctor speaks naturally during consultation; AI converts conversation into structured SOAP notes (Subjective, Objective, Assessment, Plan), medicine prescriptions, and follow-up orders.
                </p>
              </div>
            </div>

            <div className="bg-[#fdfbfe] border border-purple-100 p-4 rounded-lg space-y-2">
              <p className="font-bold text-purple-900">Generated SOAP Note &bull; Cardiology</p>
              <div className="p-2.5 bg-white rounded border border-purple-200 space-y-1 text-slate-700">
                <p><span className="font-bold">Subjective:</span> Patient complains of mild exertion breathlessness since 3 days.</p>
                <p><span className="font-bold">Objective:</span> BP 138/88 mmHg, Pulse 76 bpm regular, SpO2 98% on room air.</p>
                <p><span className="font-bold">Assessment:</span> Mild Angina Pectoris (suspected). Order ECG &bull; 2D Echo.</p>
                <p><span className="font-bold">Plan:</span> Start Tab. Sorbitrate 5mg SOS, review with echo report tomorrow.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
