import React from "react";
import { Users, BookOpen, Clock, Calendar, CheckCircle2, AlertCircle } from "lucide-react";

export default function SchoolDashboardDemo() {
  return (
    <div className="w-full bg-[#f8f9fa] rounded-xl overflow-hidden border border-[#e6e9f0] shadow-sm font-sans select-none">
      {/* Mac Browser Header */}
      <div className="h-10 bg-white border-b border-[#e6e9f0] flex items-center px-4 gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <div className="mx-auto bg-[#f1f3f5] rounded-md h-6 w-1/2 flex items-center justify-center">
          <span className="text-[11px] text-[#888] font-medium tracking-wide">waves.edu / dashboard</span>
        </div>
      </div>

      <div className="flex h-[400px]">
        {/* Sidebar */}
        <div className="w-48 bg-white border-r border-[#e6e9f0] p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-6 px-2">
            <div className="w-6 h-6 rounded bg-[#226eb4] text-white flex items-center justify-center">
              <span className="text-xs font-bold">W</span>
            </div>
            <span className="text-[13px] font-bold text-[#111]">School Suite</span>
          </div>
          
          <div className="px-2 py-1.5 bg-[#f0f5ff] text-[#226eb4] rounded flex items-center gap-2 mb-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            <span className="text-[12px] font-semibold">Dashboard</span>
          </div>
          <div className="px-2 py-1.5 text-[#555] rounded flex items-center gap-2 hover:bg-[#f8f9fa]">
            <Users className="w-4 h-4" />
            <span className="text-[12px] font-medium">Students</span>
          </div>
          <div className="px-2 py-1.5 text-[#555] rounded flex items-center gap-2 hover:bg-[#f8f9fa]">
            <Clock className="w-4 h-4" />
            <span className="text-[12px] font-medium">Attendance</span>
          </div>
          <div className="px-2 py-1.5 text-[#555] rounded flex items-center gap-2 hover:bg-[#f8f9fa]">
            <BookOpen className="w-4 h-4" />
            <span className="text-[12px] font-medium">Academics</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 bg-[#fafbfc] overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[18px] font-semibold text-[#111]">Morning Overview</h2>
            <div className="text-[12px] text-[#666] font-medium bg-white border border-[#e6e9f0] px-3 py-1 rounded-full shadow-sm">
              Today: Oct 26, 2024
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-[#e6e9f0] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <span className="text-[11px] font-bold text-[#888] uppercase tracking-wider mb-1 block">Total Students</span>
              <div className="text-[24px] font-bold text-[#111]">2,450</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-[#e6e9f0] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <span className="text-[11px] font-bold text-[#888] uppercase tracking-wider mb-1 block">Present Today</span>
              <div className="text-[24px] font-bold text-emerald-600">2,381</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-[#e6e9f0] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <span className="text-[11px] font-bold text-[#888] uppercase tracking-wider mb-1 block">Staff Absent</span>
              <div className="text-[24px] font-bold text-[#e42525]">4</div>
            </div>
          </div>

          {/* Live Gate Feed */}
          <div className="bg-white rounded-lg border border-[#e6e9f0] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#e6e9f0] bg-[#f8f9fa] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[12px] font-bold text-[#111]">Live RFID Gate Feed</span>
            </div>
            <div className="p-0">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#f1f3f5]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f0f5ff] text-[#226eb4] flex items-center justify-center text-xs font-bold">AK</div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#111]">Arjun Kumar</div>
                    <div className="text-[11px] text-[#666]">Class 10-A • Entry</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-[11px] font-bold">
                  <CheckCircle2 className="w-3 h-3" /> 08:14 AM
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#f1f3f5]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#fdf2f2] text-[#e42525] flex items-center justify-center text-xs font-bold">SM</div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#111]">Sneha Menon</div>
                    <div className="text-[11px] text-[#666]">Class 12-C • Entry</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-1 rounded text-[11px] font-bold">
                  <AlertCircle className="w-3 h-3" /> 08:32 AM (Late)
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f0f5ff] text-[#226eb4] flex items-center justify-center text-xs font-bold">RP</div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#111]">Rohan Patel</div>
                    <div className="text-[11px] text-[#666]">Class 9-B • Entry</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-[11px] font-bold">
                  <CheckCircle2 className="w-3 h-3" /> 08:12 AM
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
