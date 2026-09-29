"use client";

import { useState } from "react";
import { 
  Calendar, 
  Users, 
  CheckCircle2, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  Sparkles, 
  Clock, 
  CreditCard, 
  Search, 
  Bell, 
  Download, 
  Send,
  Layers,
  ChevronRight,
  TrendingUp,
  Award,
  Video,
  Check
} from "lucide-react";

export default function SchoolConsoleDemo() {
  const [roleTab, setRoleTab] = useState<"educator" | "student">("educator");
  const [subTab, setSubTab] = useState<"dashboard" | "attendance" | "fees" | "exams" | "ai">("dashboard");

  return (
    <div className="w-full bg-[#f9fafc] border border-[#e6e9f0] rounded-xl shadow-2xl overflow-hidden text-left">
      {/* Top Console Bar */}
      <div className="bg-[#0b1b2b] text-white px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#1f3347]">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-[#e42525]" />
            <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
            <span className="w-3 h-3 rounded-full bg-[#10b981]" />
          </div>
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-slate-200">
            Waves Academic Cloud &bull; St. Xavier&apos;s Senior Secondary (Affiliation #2130842)
          </span>
        </div>

        {/* Role Switcher Tabs (Zoho Classes style: Educator vs Student) */}
        <div className="flex bg-[#16273b] p-1 rounded-lg border border-[#233b54]">
          <button
            onClick={() => setRoleTab("educator")}
            className={`px-3 sm:px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              roleTab === "educator"
                ? "bg-[#226eb4] text-white shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Educator &amp; Admin
          </button>
          <button
            onClick={() => setRoleTab("student")}
            className={`px-3 sm:px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              roleTab === "student"
                ? "bg-[#226eb4] text-white shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Student &amp; Parent
          </button>
        </div>
      </div>

      {roleTab === "educator" ? (
        <div>
          {/* Sub Navigation Bar */}
          <div className="bg-white border-b border-[#e6e9f0] px-4 sm:px-6 flex items-center justify-between overflow-x-auto scrollbar-none">
            <div className="flex space-x-1 sm:space-x-3 text-xs sm:text-sm font-medium py-2">
              <button
                onClick={() => setSubTab("dashboard")}
                className={`px-3 py-2 rounded-md transition cursor-pointer flex items-center space-x-1.5 ${
                  subTab === "dashboard"
                    ? "bg-[#edf5fc] text-[#226eb4] font-bold"
                    : "text-[#404040] hover:text-black"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setSubTab("attendance")}
                className={`px-3 py-2 rounded-md transition cursor-pointer flex items-center space-x-1.5 ${
                  subTab === "attendance"
                    ? "bg-[#edf5fc] text-[#226eb4] font-bold"
                    : "text-[#404040] hover:text-black"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>RFID Attendance</span>
              </button>

              <button
                onClick={() => setSubTab("fees")}
                className={`px-3 py-2 rounded-md transition cursor-pointer flex items-center space-x-1.5 ${
                  subTab === "fees"
                    ? "bg-[#edf5fc] text-[#226eb4] font-bold"
                    : "text-[#404040] hover:text-black"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>WhatsApp Fees &amp; UPI</span>
              </button>

              <button
                onClick={() => setSubTab("exams")}
                className={`px-3 py-2 rounded-md transition cursor-pointer flex items-center space-x-1.5 ${
                  subTab === "exams"
                    ? "bg-[#edf5fc] text-[#226eb4] font-bold"
                    : "text-[#404040] hover:text-black"
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>CBSE Exams &amp; Blueprints</span>
              </button>

              <button
                onClick={() => setSubTab("ai")}
                className={`px-3 py-2 rounded-md transition cursor-pointer flex items-center space-x-1.5 ${
                  subTab === "ai"
                    ? "bg-purple-50 text-purple-700 font-bold"
                    : "text-[#404040] hover:text-black"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>AI Lesson Planner</span>
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Biometric Gateway: Online (8 readers synced)</span>
            </div>
          </div>

          {/* Sub Tab Content */}
          <div className="p-4 sm:p-6 bg-white min-h-[420px]">
            {subTab === "dashboard" && (
              <div className="space-y-6">
                {/* 4 Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#f8fafc] border border-[#e2e8f0] p-4 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Today&apos;s Attendance</p>
                    <div className="flex items-baseline space-x-2 mt-1">
                      <span className="text-2xl font-bold text-black">97.2%</span>
                      <span className="text-xs text-emerald-600 font-semibold">+1.8% vs last week</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">2,148 of 2,210 students punched in</p>
                  </div>

                  <div className="bg-[#f8fafc] border border-[#e2e8f0] p-4 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Q3 Fee Collected (UPI)</p>
                    <div className="flex items-baseline space-x-2 mt-1">
                      <span className="text-2xl font-bold text-[#226eb4]">₹18.45 L</span>
                      <span className="text-xs text-slate-500 font-semibold">Today</span>
                    </div>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">98.1% on-time recovery rate</p>
                  </div>

                  <div className="bg-[#f8fafc] border border-[#e2e8f0] p-4 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Parent WhatsApp Alerts</p>
                    <div className="flex items-baseline space-x-2 mt-1">
                      <span className="text-2xl font-bold text-black">1,840</span>
                      <span className="text-xs text-emerald-600 font-medium">Delivered</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Zero pending delivery queue</p>
                  </div>

                  <div className="bg-[#f8fafc] border border-[#e2e8f0] p-4 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Next Board Mock Exam</p>
                    <div className="flex items-baseline space-x-2 mt-1">
                      <span className="text-2xl font-bold text-purple-700">Class 10 &amp; 12</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Physics &amp; Chemistry &bull; 02 Oct</p>
                  </div>
                </div>

                {/* Live Stream Panels */}
                <div className="grid lg:grid-cols-12 gap-6">
                  {/* Left Column: Live Class Schedule & Attendance */}
                  <div className="lg:col-span-7 border border-[#e6e9f0] rounded-lg p-5 bg-[#ffffff]">
                    <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3 mb-4">
                      <h4 className="text-sm font-bold text-black">Live Classroom Schedule &bull; Grade 10-A</h4>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full font-semibold">Period 4 in progress</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded bg-blue-50 text-[#226eb4] flex items-center justify-center font-bold text-xs">
                            PHY
                          </div>
                          <div>
                            <p className="text-xs font-bold text-black">Electromagnetic Induction (Ch. 6)</p>
                            <p className="text-[11px] text-slate-500">Dr. Rajesh Varma &bull; Room 304</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-emerald-600">38/38 Present</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white rounded border border-slate-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                            MAT
                          </div>
                          <div>
                            <p className="text-xs font-bold text-black">Calculus &amp; Trigonometric Ratios</p>
                            <p className="text-[11px] text-slate-500">Mrs. Ananya Sen &bull; Next: 11:30 AM</p>
                          </div>
                        </div>
                        <span className="text-xs text-slate-500">Upcoming</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white rounded border border-slate-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                            CHE
                          </div>
                          <div>
                            <p className="text-xs font-bold text-black">Organic Chemistry Lab &bull; Titration</p>
                            <p className="text-[11px] text-slate-500">Lab 2 &bull; 01:15 PM</p>
                          </div>
                        </div>
                        <span className="text-xs text-slate-500">Upcoming</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Instant WhatsApp Notice Preview */}
                  <div className="lg:col-span-5 border border-emerald-100 bg-emerald-50/40 rounded-lg p-5">
                    <div className="flex items-center justify-between pb-3 border-b border-emerald-200 mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">Automated WhatsApp Dispatch</h4>
                      </div>
                      <span className="text-[11px] text-emerald-800 font-mono">Synced</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-lg border border-emerald-200 shadow-sm space-y-2 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Official St. Xavier&apos;s WhatsApp Gateway</span>
                        <span>08:02 AM</span>
                      </div>
                      <p className="text-slate-800 font-medium leading-relaxed">
                        Dear Parent, your child <span className="font-bold text-black">Aarav Sharma</span> (Class 10-A, Roll #14) has punched into school campus safely at <span className="font-semibold text-emerald-700">07:54 AM</span> via RFID Gate Reader #2.
                      </p>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Bus Route #12 Driver: +91 98450 11223</span>
                        <span className="text-emerald-600 font-bold flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>Delivered</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {subTab === "attendance" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div>
                    <h4 className="text-sm font-bold text-black">Biometric Turnstile &amp; RFID Bus Punch Log</h4>
                    <p className="text-xs text-slate-500">Instant parent notification triggers upon tap</p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded">
                    Hardware Stream: Active
                  </span>
                </div>

                <div className="border border-[#e6e9f0] rounded-lg overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#f8fafc] text-slate-600 uppercase border-b border-[#e6e9f0]">
                      <tr>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Class &amp; Sec</th>
                        <th className="p-3">Punch Time</th>
                        <th className="p-3">Method</th>
                        <th className="p-3">Parent Notification</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9]">
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-black">Aditya Vikram</td>
                        <td className="p-3 text-slate-600">Grade 11-PCM</td>
                        <td className="p-3 font-mono">07:48:12 AM</td>
                        <td className="p-3">RFID Turnstile #1</td>
                        <td className="p-3 text-emerald-600 font-medium">WhatsApp Sent (07:48 AM)</td>
                        <td className="p-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">On-Time</span></td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-black">Priya Sundaram</td>
                        <td className="p-3 text-slate-600">Grade 9-B</td>
                        <td className="p-3 font-mono">07:51:30 AM</td>
                        <td className="p-3">Bus #04 RFID Reader</td>
                        <td className="p-3 text-emerald-600 font-medium">WhatsApp Sent (07:51 AM)</td>
                        <td className="p-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">On-Time</span></td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-black">Rohan Kulkarni</td>
                        <td className="p-3 text-slate-600">Grade 12-Comm</td>
                        <td className="p-3 font-mono">08:04:15 AM</td>
                        <td className="p-3">Main Gate Biometric</td>
                        <td className="p-3 text-amber-600 font-medium">Late Arrival Notice Sent</td>
                        <td className="p-3"><span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-semibold text-[10px]">Late (4 mins)</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {subTab === "fees" && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-xs text-emerald-800 font-bold uppercase">Automated UPI Receipts</p>
                    <p className="text-2xl font-bold text-emerald-950 mt-1">₹42.8 Lakhs</p>
                    <p className="text-xs text-emerald-700 mt-1">Reconciled this month with zero human entry</p>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-[#226eb4] font-bold uppercase">WhatsApp Payment Links</p>
                    <p className="text-2xl font-bold text-[#226eb4] mt-1">1-Click Pay</p>
                    <p className="text-xs text-blue-700 mt-1">Direct Google Pay, PhonePe &amp; Paytm gateway</p>
                  </div>
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-800 font-bold uppercase">Default Reduction</p>
                    <p className="text-2xl font-bold text-amber-950 mt-1">-84%</p>
                    <p className="text-xs text-amber-700 mt-1">Automated 3-tier gentle reminders before due date</p>
                  </div>
                </div>

                <div className="p-4 bg-white border border-[#e6e9f0] rounded-lg">
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-3">Live Institutional Fee Ledger Sample</h4>
                  <div className="flex flex-col sm:flex-row items-center justify-between p-3 bg-slate-50 rounded border border-slate-200 gap-3">
                    <div>
                      <p className="text-xs font-bold text-black">Student: Tanvi Mehta &bull; Class 8-C (Roll #22)</p>
                      <p className="text-[11px] text-slate-500">Term 2 Composite Tuition &amp; Lab Fee &bull; Ref #INV-2026-9812</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-mono font-bold text-black">₹24,500</span>
                      <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Auto-Paid via UPI</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {subTab === "exams" && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-[#226eb4]">CBSE 2026 Question Paper &amp; Blueprint Engine</h4>
                    <p className="text-xs text-slate-600">Generates 3 parallel paper sets (Set A, B, C) matching 33% competency-based questions</p>
                  </div>
                  <button className="px-3.5 py-1.5 bg-[#226eb4] text-white text-xs font-bold rounded hover:bg-[#045594] transition cursor-pointer">
                    + Generate Exam Paper
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border border-[#e6e9f0] rounded-lg bg-white">
                    <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase font-bold">CBSE Class 10</span>
                    <h5 className="text-sm font-bold text-black mt-2">Mathematics Standard &bull; Pre-Board 1</h5>
                    <p className="text-xs text-slate-500 mt-1">Section A: 20 MCQs | Section B: 5 Very Short | Section C: 6 Short | Section D: 4 Long | Section E: 3 Case Studies</p>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-emerald-600 font-semibold">&check; NEP 2020 Rubric Matched</span>
                      <button className="text-[#226eb4] font-bold hover:underline">Download PDF &gt;</button>
                    </div>
                  </div>

                  <div className="p-4 border border-[#e6e9f0] rounded-lg bg-white">
                    <span className="text-[10px] font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded uppercase font-bold">ICSE Class 10</span>
                    <h5 className="text-sm font-bold text-black mt-2">Science Paper 1 &bull; Physics Term Exam</h5>
                    <p className="text-xs text-slate-500 mt-1">Section 1 (40 Marks): Compulsory Short Answers | Section 2 (40 Marks): Choice Numerical Problems</p>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-emerald-600 font-semibold">&check; Model Answer Key Included</span>
                      <button className="text-[#226eb4] font-bold hover:underline">Download PDF &gt;</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {subTab === "ai" && (
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg flex items-start space-x-3">
                  <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-purple-950">Waves AI Teaching Assistant &amp; Lesson Generator</h4>
                    <p className="text-xs text-purple-800 leading-relaxed mt-0.5">
                      Empowering teachers to draft 45-minute lesson plans, real-world analogies, classroom debate topics, and multi-lingual notices in seconds.
                    </p>
                  </div>
                </div>

                <div className="p-4 border border-purple-100 rounded-lg bg-[#fdfbfe] space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900">Generated Lesson Plan: Photosynthesis &amp; Cellular Respiration</span>
                    <span className="text-slate-400">Class 9 Biology &bull; 45 mins</span>
                  </div>
                  <div className="space-y-1.5 text-slate-700">
                    <p><span className="font-bold text-black">00-05 min:</span> Hook &bull; The Solar Panel Analogy (How plants charge chemical batteries).</p>
                    <p><span className="font-bold text-black">05-20 min:</span> Light-Dependent vs Light-Independent Reactions in Thylakoids.</p>
                    <p><span className="font-bold text-black">20-35 min:</span> Interactive Student Poll via App (Stomata opening factors).</p>
                    <p><span className="font-bold text-black">35-45 min:</span> Exit Ticket MCQ quiz with instant phone-based scoring.</p>
                  </div>
                  <div className="pt-2 border-t border-purple-100 flex justify-end">
                    <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold text-xs transition cursor-pointer">
                      Export to Teacher Timetable
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Student & Parent Portal */
        <div className="p-4 sm:p-6 bg-white min-h-[420px] space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#e6e9f0] gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">STUDENT PORTAL</span>
                <span className="text-xs text-slate-500">&bull; Aryan Singhania &bull; Grade 10-A</span>
              </div>
              <h4 className="text-lg font-bold text-black mt-1">Academic Progress &amp; Flipped Learning Station</h4>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
              Term 1 Cumulative Score: 94.2%
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Left 2 Cols: Flipped Learning & Homework */}
            <div className="md:col-span-2 space-y-4">
              <div className="border border-[#e6e9f0] rounded-lg p-4 bg-slate-50">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-xs font-bold uppercase text-slate-700 flex items-center space-x-1.5">
                    <Video className="w-3.5 h-3.5 text-[#226eb4]" />
                    <span>Flipped Learning Video Lecture &bull; Watch before Tomorrow</span>
                  </h5>
                  <span className="text-[11px] text-amber-600 font-semibold">Due 08:00 AM</span>
                </div>
                <div className="p-3 bg-white rounded border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-black">Quadratic Equations: Derivation of the Quadratic Formula</p>
                    <p className="text-[11px] text-slate-500">12 min micro-lecture by Mrs. Ananya Sen &bull; Includes 3 comprehension check questions</p>
                  </div>
                  <button className="px-3 py-1.5 bg-[#226eb4] text-white rounded text-xs font-bold hover:bg-[#045594] transition shrink-0 cursor-pointer">
                    Watch Now
                  </button>
                </div>
              </div>

              <div className="border border-[#e6e9f0] rounded-lg p-4 bg-white">
                <h5 className="text-xs font-bold uppercase text-slate-500 mb-3">Active Assignments &amp; Tests</h5>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-100">
                    <span className="font-semibold text-black">English Literature Essay: The Merchant of Venice Act III</span>
                    <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold text-[10px]">Submitted &bull; Graded (19/20)</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-100">
                    <span className="font-semibold text-black">Chemistry Practice Set 4: Periodic Classification</span>
                    <span className="text-blue-700 bg-blue-100 px-2 py-0.5 rounded font-bold text-[10px]">In Progress &bull; Due Today 06:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Parent Quick View & Fees */}
            <div className="border border-[#e6e9f0] rounded-lg p-4 bg-slate-50 space-y-4">
              <h5 className="text-xs font-bold uppercase text-slate-600">Parent Summary Card</h5>
              
              <div className="bg-white p-3 rounded border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Academic Year:</span>
                  <span className="font-bold text-black">2026 - 2027</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Overall Attendance:</span>
                  <span className="font-bold text-emerald-600">98.5% (180/182 days)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Next Term Fee:</span>
                  <span className="font-bold text-emerald-600">Cleared &bull; ₹0 Due</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-100/60 rounded border border-emerald-200 text-xs text-emerald-900">
                <p className="font-bold">WhatsApp Guardian Sync Active</p>
                <p className="text-[11px] text-emerald-800 mt-0.5">Parent mobile (+91 98450 XXXXX) receives automated arrival, departure &amp; report cards.</p>
              </div>

              <button className="w-full py-2 bg-white hover:bg-slate-100 text-black border border-slate-300 rounded text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer">
                <Download className="w-3.5 h-3.5" />
                <span>Download CBSE Report Card (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
