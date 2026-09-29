"use client";

import { useState } from "react";
import { 
  Users, 
  Clock, 
  Sparkles, 
  BookOpen, 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  GraduationCap
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

export default function SchoolProblemsSolver() {
  const problems: Problem[] = [
    {
      id: "engagement",
      title: "Classroom Engagement",
      icon: Users,
      problemText: "Digital-native students (Gen Alpha & Gen Z) struggle with passive 45-minute lectures. Monologue teaching leads to low retention, high absenteeism, and distracted classrooms.",
      solutionHeadline: "AI-Powered Interactive Flipped Learning & Dynamic Quizzes",
      solutionPoints: [
        "Flipped learning modules: Pre-class 10-minute micro-lectures allow classroom time for active debates.",
        "Interactive in-class polls and exit tickets directly from students' tablets or shared screen.",
        "24/7 AI tutor lets students resolve doubts at home without hesitation or fear of judgment."
      ],
      metricHighlight: "3.2x",
      metricLabel: "Higher student classroom participation"
    },
    {
      id: "admin",
      title: "Administrative Overload",
      icon: Clock,
      problemText: "Teachers lose up to 15 hours every single week maintaining paper registers, calling parents for overdue fees, calculating percentage tallies, and manually entering report card marks.",
      solutionHeadline: "Automated WhatsApp Fee Reconciliation & 1-Click Grading",
      solutionPoints: [
        "Biometric gate attendance triggers instant WhatsApp confirmation to parents within 2 seconds.",
        "Automated UPI payment links on WhatsApp eliminate fee queues at school counters.",
        "Automatic CBSE/ICSE 8-point & 9-point grading calculations cut report card prep time by 90%."
      ],
      metricHighlight: "90%",
      metricLabel: "Reduction in repetitive teacher clerical hours"
    },
    {
      id: "shortage",
      title: "Faculty Shortages & Burnout",
      icon: Sparkles,
      problemText: "Over 40 million teachers are needed globally by 2030. High teacher attrition, heavy syllabus pressure, and lack of prep time result in rushed lesson deliveries and burnt-out educators.",
      solutionHeadline: "Waves AI Lesson Assistant, Teaching Aids & Question Banks",
      solutionPoints: [
        "Instant lesson plan generator provides pedagogical hooks, real-world analogies, and timing guides.",
        "CBSE blueprint aligned question paper generator creates 3 unique exam sets with answer keys in 30 seconds.",
        "Bilingual circular & homework drafting frees teachers to focus exclusively on inspiring students."
      ],
      metricHighlight: "3.5 hrs",
      metricLabel: "Saved per teacher every week on lesson prep"
    },
    {
      id: "curriculum",
      title: "Structured Curriculum Delivery",
      icon: BookOpen,
      problemText: "Inconsistent teaching speeds cause uneven syllabus completion before term exams. Absent students permanently miss foundational concepts without access to structured revision material.",
      solutionHeadline: "Standardized Digital Course Pathways & Milestone Tracking",
      solutionPoints: [
        "Curriculum locking: Students unlock advanced chapters only upon passing foundational comprehension checks.",
        "Searchable lecture repository: Record classroom sessions for revision before periodic tests.",
        "Principal syllabus dashboard: Real-time tracking of syllabus completion across every section."
      ],
      metricHighlight: "100%",
      metricLabel: "Transparent syllabus tracking for principals"
    },
    {
      id: "branches",
      title: "Multi-Campus Trust Sync",
      icon: Building2,
      problemText: "Educational trusts running 5 to 50 campuses suffer from fragmented data, delayed fee audits, inconsistent academic standards, and chaotic inter-branch student transfers.",
      solutionHeadline: "Centralized Trust Cloud with Granular Branch Governance",
      solutionPoints: [
        "Unified fee collection audit: Consolidated financial visibility across all campuses on a single screen.",
        "Uniform question papers and exam schedules dispatched across all branches with one click.",
        "Seamless digital student transfers (TC, marks history, medical records) between trust branches."
      ],
      metricHighlight: "Zero",
      metricLabel: "Financial audit delays across campus networks"
    }
  ];

  const [activeId, setActiveId] = useState<string>("engagement");
  const activeProblem = problems.find((p) => p.id === activeId) || problems[0];

  return (
    <div className="w-full bg-[#f8f9fa] border border-[#e6e9f0] rounded-xl p-6 sm:p-10 lg:p-12">
      {/* Tab Switcher */}
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
                  ? "bg-[#226eb4] text-white shadow-md"
                  : "bg-white text-[#444444] border border-[#e2e8f0] hover:border-[#056cb8] hover:text-[#226eb4]"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{prob.title}</span>
            </button>
          );
        })}
      </div>

      {/* Problem & Solution Card */}
      <div className="grid lg:grid-cols-12 gap-8 items-center bg-white border border-[#e6e9f0] rounded-xl p-6 sm:p-8 lg:p-10 shadow-sm">
        {/* Left Column: Problem Diagnosis */}
        <div className="lg:col-span-5 space-y-4 border-b lg:border-b-0 lg:border-r border-[#e6e9f0] pb-6 lg:pb-0 lg:pr-8">
          <div className="flex items-center space-x-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>The Institutional Challenge</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-black tracking-tight leading-snug">
            {activeProblem.title}
          </h3>

          <p className="text-sm text-[#404040] leading-relaxed">
            {activeProblem.problemText}
          </p>

          <div className="pt-4 border-t border-[#f1f5f9] flex items-baseline space-x-3">
            <span className="text-3xl font-medium text-[#226eb4]">
              {activeProblem.metricHighlight}
            </span>
            <span className="text-xs text-[#404040] font-medium leading-tight">
              {activeProblem.metricLabel}
            </span>
          </div>
        </div>

        {/* Right Column: Waves Solution */}
        <div className="lg:col-span-7 space-y-5 lg:pl-4">
          <div className="flex items-center space-x-2 text-[#226eb4] font-bold text-xs uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>The Waves Solution</span>
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
