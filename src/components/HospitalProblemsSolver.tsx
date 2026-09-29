"use client";

import { useState } from "react";
import { 
  Tv, 
  FileText, 
  Bed, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  ShieldAlert, 
  HeartPulse 
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

export default function HospitalProblemsSolver() {
  const problems: Problem[] = [
    {
      id: "opd",
      title: "OPD Waiting Room Chaos",
      icon: Tv,
      problemText: "Outpatients crowd consultation doors without clear turn visibility. Front-desk staff spend all day fielding angry inquiries while doctors face unmanaged waiting rooms.",
      solutionHeadline: "Smart TV Token Calling & Live WhatsApp Queue Tracking",
      solutionPoints: [
        "Waiting room 4K TV displays current calling token with clear chime announcements.",
        "Patients scan QR code at reception to track their exact live queue position on WhatsApp.",
        "Automatic doctor consultation timer balances OPD schedules and minimizes bottlenecks."
      ],
      metricHighlight: "45%",
      metricLabel: "Reduction in patient waiting anxiety & lobby congestion"
    },
    {
      id: "prescriptions",
      title: "Handwritten Rx Errors",
      icon: FileText,
      problemText: "Illegible doctor handwriting leads to dangerous chemist dispensing mistakes, incorrect dosages, and missing patient allergy or drug-interaction warnings.",
      solutionHeadline: "Sub-Second Digital Prescription Pad with Safety Gates",
      solutionPoints: [
        "Built-in Indian medicine database with automated dosage, frequency, and duration defaults.",
        "Real-time drug-drug interaction & patient allergy checker warns doctors before signing.",
        "Instant digital prescription sent to patient WhatsApp & internal hospital pharmacy."
      ],
      metricHighlight: "100%",
      metricLabel: "Elimination of handwriting dispensing mistakes"
    },
    {
      id: "beds",
      title: "Bed Turnover Bottlenecks",
      icon: Bed,
      problemText: "Emergency patients wait hours in triage while cleaned beds in wards sit unassigned due to broken phone communication between nursing, housekeeping, and billing.",
      solutionHeadline: "Real-Time Visual Bed Occupancy & Automated Turnover",
      solutionPoints: [
        "Color-coded visual matrix reveals real-time status of ICU, Deluxe, and General beds.",
        "Discharge clearance instantly notifies housekeeping with automated cleaning countdowns.",
        "Emergency and admission desks allocate vacant sanitized beds in under 30 seconds."
      ],
      metricHighlight: "3.5x",
      metricLabel: "Faster inpatient bed turnover between discharges"
    },
    {
      id: "tpa",
      title: "TPA & Insurance Rejections",
      icon: ShieldCheck,
      problemText: "Hospitals face 45+ day cashflow delays and costly claim rejections because discharge summaries lack standardized ICD-10 codes or have mismatched itemized bills.",
      solutionHeadline: "Automated Pre-Auth & Digital Claim Packet Generator",
      solutionPoints: [
        "Pre-configured clinical discharge summary with ICD-10 diagnosis & procedure coding.",
        "Automated bundling of lab reports, operation theater notes, and invoices into single PDF.",
        "Direct tracking of insurer approvals across Star Health, HDFC Ergo, ICICI Lombard & PMJAY."
      ],
      metricHighlight: "99.4%",
      metricLabel: "First-pass cashless insurance approval rate"
    },
    {
      id: "compliance",
      title: "NABH & ABHA Regulatory Burden",
      icon: Award,
      problemText: "Maintaining physical audit registers, patient consent forms, and medical records for NABH accreditation and Ayushman Bharat ABHA compliance overwhelms administrative staff.",
      solutionHeadline: "Built-In NABH Audit Trails & ABDM Tier 1 Integration",
      solutionPoints: [
        "Instant creation of 14-digit Ayushman Bharat Health Account (ABHA) IDs at reception.",
        "Automated consent slip archiving, adverse incident logging, and doctor credential checks.",
        "Role-based encryption complying fully with Indian Digital Personal Data Protection (DPDP) Act."
      ],
      metricHighlight: "Zero",
      metricLabel: "Non-compliance penalties during NABH quality audits"
    }
  ];

  const [activeId, setActiveId] = useState<string>("opd");
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
                  ? "bg-emerald-700 text-white shadow-md"
                  : "bg-white text-[#444444] border border-[#e2e8f0] hover:border-emerald-600 hover:text-emerald-700"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{prob.title}</span>
            </button>
          );
        })}
      </div>

      {/* Diagnosis & Solution Card */}
      <div className="grid lg:grid-cols-12 gap-8 items-center bg-white border border-[#e6e9f0] rounded-xl p-6 sm:p-8 lg:p-10 shadow-sm">
        <div className="lg:col-span-5 space-y-4 border-b lg:border-b-0 lg:border-r border-[#e6e9f0] pb-6 lg:pb-0 lg:pr-8">
          <div className="flex items-center space-x-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>The Clinical Challenge</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-black tracking-tight leading-snug">
            {activeProblem.title}
          </h3>

          <p className="text-sm text-[#404040] leading-relaxed">
            {activeProblem.problemText}
          </p>

          <div className="pt-4 border-t border-[#f1f5f9] flex items-baseline space-x-3">
            <span className="text-3xl font-medium text-emerald-700">
              {activeProblem.metricHighlight}
            </span>
            <span className="text-xs text-[#404040] font-medium leading-tight">
              {activeProblem.metricLabel}
            </span>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-5 lg:pl-4">
          <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
            <HeartPulse className="w-4 h-4" />
            <span>The Waves Health Solution</span>
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
