import React from "react";
import { Activity, Calendar, Stethoscope, Users, CheckCircle2, Clock } from "lucide-react";

export default function HealthDashboardDemo() {
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
          <span className="text-[11px] text-[#888] font-medium tracking-wide">waves.health / opd-queue</span>
        </div>
      </div>

      <div className="flex h-[400px]">
        {/* Sidebar */}
        <div className="w-48 bg-white border-r border-[#e6e9f0] p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-6 px-2">
            <div className="w-6 h-6 rounded bg-[#008f52] text-white flex items-center justify-center">
              <Activity className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <span className="text-[13px] font-bold text-[#111]">Health Suite</span>
          </div>
          
          <div className="px-2 py-1.5 bg-[#e6f4ed] text-[#008f52] rounded flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4" />
            <span className="text-[12px] font-semibold">Live OPD Queue</span>
          </div>
          <div className="px-2 py-1.5 text-[#555] rounded flex items-center gap-2 hover:bg-[#f8f9fa]">
            <Users className="w-4 h-4" />
            <span className="text-[12px] font-medium">IPD Bed Matrix</span>
          </div>
          <div className="px-2 py-1.5 text-[#555] rounded flex items-center gap-2 hover:bg-[#f8f9fa]">
            <Stethoscope className="w-4 h-4" />
            <span className="text-[12px] font-medium">Prescriptions</span>
          </div>
          <div className="px-2 py-1.5 text-[#555] rounded flex items-center gap-2 hover:bg-[#f8f9fa]">
            <Calendar className="w-4 h-4" />
            <span className="text-[12px] font-medium">Appointments</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 bg-[#fafbfc] overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-[18px] font-semibold text-[#111]">General Medicine - OPD 1</h2>
              <p className="text-[12px] text-[#666]">Dr. Ramesh Kumar • Wait time: ~14 mins</p>
            </div>
            <div className="text-[12px] text-white font-medium bg-[#008f52] px-3 py-1.5 rounded shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span> TV Display Active
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-[#e6e9f0] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <span className="text-[11px] font-bold text-[#888] uppercase tracking-wider mb-1 block">Current Token</span>
              <div className="text-[28px] font-bold text-[#111] leading-none">A-42</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-[#e6e9f0] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <span className="text-[11px] font-bold text-[#888] uppercase tracking-wider mb-1 block">In Waiting</span>
              <div className="text-[28px] font-bold text-[#e42525] leading-none">18</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-[#e6e9f0] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <span className="text-[11px] font-bold text-[#888] uppercase tracking-wider mb-1 block">Completed</span>
              <div className="text-[28px] font-bold text-[#008f52] leading-none">41</div>
            </div>
          </div>

          {/* Next in Queue List */}
          <div className="bg-white rounded-lg border border-[#e6e9f0] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#e6e9f0] bg-[#f8f9fa] flex items-center gap-2">
              <Clock className="w-3 h-3 text-[#666]" />
              <span className="text-[12px] font-bold text-[#111]">Upcoming Tokens</span>
            </div>
            <div className="p-0">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#f1f3f5] bg-[#fffdf0]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-[#ffeebb] text-[#d88900] flex items-center justify-center text-sm font-bold border border-[#ffd566]">A-43</div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#111]">Suresh Verma</div>
                    <div className="text-[11px] text-[#666]">Male, 45 yrs • Follow-up</div>
                  </div>
                </div>
                <div className="text-[12px] font-bold text-[#d88900]">Next</div>
              </div>
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#f1f3f5]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-[#f1f3f5] text-[#555] flex items-center justify-center text-sm font-bold">A-44</div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#111]">Priya Singh</div>
                    <div className="text-[11px] text-[#666]">Female, 28 yrs • New Consult</div>
                  </div>
                </div>
                <div className="text-[12px] font-medium text-[#888]">Est. 10:15 AM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
