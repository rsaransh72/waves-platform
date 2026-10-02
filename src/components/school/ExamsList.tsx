"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2,
  X,
  FileText,
  Calendar,
  Layers
} from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { toast } from "sonner";
import { describeError } from "@/lib/error-message";
import { formatDate } from "@/lib/india";
import { useRouter } from "next/navigation";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

export interface Exam {
  id: string;
  name: string;
  class_id: string;
  start_date: string;
  end_date: string;
  status: string;
  school_classes?: {
    id: string;
    name: string;
    section: string;
  };
}

export function ExamsList({ initialData, classesList }: { initialData: Exam[], classesList: any[] }) {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>(initialData);
  const [filteredExams, setFilteredExams] = useState<Exam[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Exam>>({
    name: "",
    class_id: "",
    start_date: "",
    end_date: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createClient();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = exams.filter(e => 
      e.name.toLowerCase().includes(query) ||
      e.school_classes?.name.toLowerCase().includes(query)
    );
    setFilteredExams(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((formData.end_date ?? "") < (formData.start_date ?? "")) {
      toast.error("The end date must be on or after the start date.");
      return;
    }
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('school_exams')
        .insert([{
          name: formData.name,
          class_id: formData.class_id,
          start_date: formData.start_date,
          end_date: formData.end_date,
          status: 'upcoming'
        }])
        .select(`*, school_classes(id, name, section)`)
        .single();

      if (error) throw error;

      if (data) {
        const newData = [data, ...exams];
        setExams(newData);
        setFilteredExams(newData);
        setIsDrawerOpen(false);
        setFormData({ name: "", class_id: "", start_date: "", end_date: "" });
        toast.success("Exam scheduled.");
        router.refresh();
      }
    } catch (error) {
      console.error("Error creating exam:", error);
      toast.error(`Could not create exam: ${describeError(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-[#e5e5e5] shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#e5e5e5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fafafa]">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
            <input
              type="text"
              placeholder="Search exams..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full h-9 pl-9 pr-4 rounded-md border border-[#cccccc] bg-white text-[13px] text-[#111111] focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] transition-shadow placeholder:text-[#888888]"
            />
          </div>
          
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="h-9 px-4 bg-[#0066cc] hover:bg-[#0055bb] text-white text-[13px] font-medium rounded-md flex items-center justify-center gap-2 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Exam</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f4f4f5] border-b border-[#e5e5e5]">
                <th className="py-3 px-4 text-[12px] font-semibold text-[#555555] uppercase tracking-wider">Exam Name</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-[#555555] uppercase tracking-wider">Class</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-[#555555] uppercase tracking-wider">Timeline</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-[#555555] uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-[#555555] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e5]">
              {filteredExams.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#555555] text-[14px]">
                    No exams found.
                  </td>
                </tr>
              ) : (
                filteredExams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-[#fafafa] transition-colors group">
                    <td className="py-3 px-4 text-[14px] text-[#111111] font-medium">
                      {exam.name}
                    </td>
                    <td className="py-3 px-4 text-[14px] text-[#111111]">
                      {exam.school_classes ? `${exam.school_classes.name} - ${exam.school_classes.section}` : "—"}
                    </td>
                    <td className="py-3 px-4 text-[14px] text-[#111111]">
                      {formatDate(exam.start_date)} to {formatDate(exam.end_date)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={
                        `inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium capitalize border ` +
                        (exam.status === 'active' ? 'bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]' : 
                         exam.status === 'upcoming' ? 'bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]' :
                         'bg-[#f1f5f9] text-[#475569] border-[#cbd5e1]')
                      }>
                        {exam.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => router.push(`/school/exams/${exam.id}`)}
                        className="h-8 px-3 bg-white border border-[#cccccc] hover:bg-[#f4f4f5] text-[#333333] text-[12px] font-medium rounded transition-colors shadow-sm inline-flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Grade Exam
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e5e5e5]">
              <h3 className="text-[18px] font-semibold text-[#111111]">Schedule Exam</h3>
              <button onClick={() => setIsDrawerOpen(false)} className="text-[#888888] hover:text-[#111111] p-1 rounded-md hover:bg-[#f4f4f5] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-y-auto">
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Exam Name *</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Half-Yearly Examination 2026-27" minLength={2} maxLength={100}
                      className="w-full h-9 pl-9 pr-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Target Class *</label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                    <select
                      required
                      value={formData.class_id}
                      onChange={e => setFormData({...formData, class_id: e.target.value})}
                      className="w-full h-9 pl-9 pr-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow appearance-none"
                    >
                      <option value="">Select a Class...</option>
                      {classesList.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name} - {c.section}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Start Date *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                      <input
                        type="date"
                        required
                        value={formData.start_date}
                        onChange={e => setFormData({...formData, start_date: e.target.value})}
                        className="w-full h-9 pl-9 pr-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#333333] mb-1.5">End Date *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                      <input
                        type="date"
                        required
                        min={formData.start_date || undefined}
                        value={formData.end_date}
                        onChange={e => setFormData({...formData, end_date: e.target.value})}
                        className="w-full h-9 pl-9 pr-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto p-6 border-t border-[#e5e5e5] bg-[#fafafa]">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex-1 h-10 px-4 border border-[#cccccc] text-[#333333] text-[14px] font-medium rounded-md hover:bg-[#f4f4f5] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-10 px-4 bg-[#0066cc] text-white text-[14px] font-medium rounded-md hover:bg-[#0055bb] transition-colors disabled:opacity-70"
                  >
                    {isSubmitting ? 'Scheduling...' : 'Schedule Exam'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
