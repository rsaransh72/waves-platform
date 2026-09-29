"use client";

import { useState } from "react";
import { 
  Barcode, 
  Clock, 
  AlertCircle, 
  Package, 
  Receipt, 
  CheckCircle2, 
  ShieldAlert, 
  Store 
} from "lucide-react";

interface Problem {
  id: string;
  title: string;
  icon: any;
  problemText: string;
  solutionHeadline: string;
  solutionPoints: string[];
  metricHighlight: string;
  metricLabel: string;
}

export default function PharmacyProblemsSolver() {
  const problems: Problem[] = [
    {
      id: "checkout",
      title: "Peak-Hour Counter Queues",
      icon: Barcode,
      problemText: "During evening rush hours, slow keyboard typing, manual strip cutting calculations, and paper receipt printing cause long queues. Impatient customers leave for competing chemists.",
      solutionHeadline: "Sub-Second Barcode Scanning & Instant Loose Tablet Conversion",
      solutionPoints: [
        "Sub-second barcode scanning populates batch, expiry, and MRP instantaneously.",
        "Automatic strip-to-loose tablet conversion: Type 4 caps, price divides accurately.",
        "Dynamic UPI QR pops up on screen; customers scan & pay before bill prints."
      ],
      metricHighlight: "3 Sec",
      metricLabel: "Average customer transaction checkout time"
    },
    {
      id: "expiry",
      title: "Dead-Stock & Expiry Losses",
      icon: Clock,
      problemText: "Retail chemists lose 4% to 6% of their gross annual margins to expired medicines discovered too late behind dispensary shelves after distributors refuse credit notes.",
      solutionHeadline: "Automated 90-Day FEFO Expiry Radar with 1-Click Debit Notes",
      solutionPoints: [
        "Color-coded warning radar highlights batches expiring in 30, 60, and 90 days.",
        "FEFO automated shelf picking ensures earliest expiring strips are dispensed first.",
        "1-click debit note generation formats supplier return slips for 100% credit recovery."
      ],
      metricHighlight: "0%",
      metricLabel: "Unclaimed medicine expiry losses"
    },
    {
      id: "compliance",
      title: "Drug Inspector Audits",
      icon: AlertCircle,
      problemText: "Manual Schedule H and H1 paper registers are error-prone, hard to maintain during rush hours, and subject chemist shops to license suspensions during surprise government audits.",
      solutionHeadline: "Automated Digital Schedule H & H1 Registers",
      solutionPoints: [
        "Selling any Schedule H/H1 antibiotic or sedative automatically logs patient name & doctor Reg #.",
        "Export audit-ready registers formatted to Drug & Cosmetics Act standards in seconds.",
        "Zero missing entries, zero penalty exposure during state drug inspections."
      ],
      metricHighlight: "100%",
      metricLabel: "Compliant with Drug & Cosmetics Act audits"
    },
    {
      id: "stockouts",
      title: "Stockouts of Fast-Movers",
      icon: Package,
      problemText: "Running out of routine chronic medications (Paracetamol, Telmisartan, Metformin) frustrates regular patients and permanently sends them to online delivery apps.",
      solutionHeadline: "Velocity-Based Smart Reordering & Supplier Sync",
      solutionPoints: [
        "Algorithms track 7-day and 30-day sales velocity to flag depleted stock.",
        "Consolidated purchase orders grouped by pharmaceutical distributor automatically.",
        "Send digital PO directly via WhatsApp EDI to wholesalers for same-day delivery."
      ],
      metricHighlight: "99.8%",
      metricLabel: "Stock availability for top 500 essential medicines"
    },
    {
      id: "gst",
      title: "Multi-Slab GST Chaos",
      icon: Receipt,
      problemText: "Medicines span 0%, 5%, 12%, and 18% GST tax slabs. Reconciling loose tablet sales, purchase credit notes, and input tax credit (ITC) takes days of manual CA effort.",
      solutionHeadline: "1-Click GSTR-1 JSON Export & Tally/Busy Sync",
      solutionPoints: [
        "Every barcode bill automatically splits taxable value, CGST, and SGST per HSN code.",
        "One-click export of GSTN-compatible JSON file for hassle-free GSTR-1 and GSTR-3B filing.",
        "Direct export to Tally Prime, Marg, and Busy with zero ledger mismatch."
      ],
      metricHighlight: "1-Click",
      metricLabel: "Monthly GST JSON export for tax portal filing"
    }
  ];

  const [activeId, setActiveId] = useState<string>("checkout");
  const activeProblem = problems.find((p) => p.id === activeId) || problems[0];

  return (
    <div className="w-full bg-[#f8f9fa] border border-[#e6e9f0] rounded-xl p-6 sm:p-10 lg:p-12">
      {/* Switcher Buttons */}
      <div className="flex flex-wrap gap-2 border-b border-[#e6e9f0] pb-6 mb-8 justify-center lg:justify-start">
        {problems.map((prob) => {
          const Icon = prob.icon;
          const isActive = prob.id === activeId;
          return (
            <button
              key={prob.id}
              onClick={() => setActiveId(prob.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-amber-700 text-white shadow-md"
                  : "bg-white text-[#444444] border border-[#e2e8f0] hover:border-amber-600 hover:text-amber-700"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{prob.title}</span>
            </button>
          );
        })}
      </div>

      {/* Card */}
      <div className="grid lg:grid-cols-12 gap-8 items-center bg-white border border-[#e6e9f0] rounded-xl p-6 sm:p-8 lg:p-10 shadow-sm">
        <div className="lg:col-span-5 space-y-4 border-b lg:border-b-0 lg:border-r border-[#e6e9f0] pb-6 lg:pb-0 lg:pr-8">
          <div className="flex items-center space-x-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>The Retail Chemist Challenge</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-black tracking-tight leading-snug">
            {activeProblem.title}
          </h3>

          <p className="text-sm text-[#404040] leading-relaxed">
            {activeProblem.problemText}
          </p>

          <div className="pt-4 border-t border-[#f1f5f9] flex items-baseline space-x-3">
            <span className="text-3xl font-medium text-amber-700">
              {activeProblem.metricHighlight}
            </span>
            <span className="text-xs text-[#404040] font-medium leading-tight">
              {activeProblem.metricLabel}
            </span>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-5 lg:pl-4">
          <div className="flex items-center space-x-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
            <Store className="w-4 h-4" />
            <span>The Waves POS Solution</span>
          </div>

          <h4 className="text-lg sm:text-xl font-bold text-black">
            {activeProblem.solutionHeadline}
          </h4>

          <ul className="space-y-3">
            {activeProblem.solutionPoints.map((pt, idx) => (
              <li key={idx} className="flex items-start space-x-3 text-sm text-[#333333] leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
