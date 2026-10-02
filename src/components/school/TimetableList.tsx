"use client";

import { useMemo, useState } from "react";
import { 
  Plus, 
  X,
  CalendarDays,
  Clock,
  User,
  MapPin
} from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { toast } from "sonner";
import { describeError } from "@/lib/error-message";
import { useCanManage } from "@/components/school/SchoolSessionContext";
import { useRouter } from "next/navigation";
import { formatTime } from "@/lib/india";
import { classLabel, findClashes, roomLabel, type Period } from "@/lib/school-timetable";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function TimetableList({ initialTimetables, classes, teachers }: { initialTimetables: any[], classes: any[], teachers: any[] }) {
  const router = useRouter();
  const canManage = useCanManage("timetable");
  const [timetables, setTimetables] = useState<any[]>(initialTimetables);
  
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.id || "");
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    class_id: classes[0]?.id || "",
    teacher_id: "",
    day_of_week: "Monday",
    subject: "",
    start_time: "08:00",
    end_time: "09:00",
    room_number: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createClient();

  const filteredTimetables = timetables.filter(t => 
    t.class_id === selectedClass && t.day_of_week === selectedDay
  );

  // Warn while the form is filled in; the save checks again against fresh data.
  const clashes = useMemo(() => {
    if (!formData.teacher_id || !formData.start_time || !formData.end_time || formData.end_time <= formData.start_time) return [];
    return findClashes(formData, timetables as Period[]);
  }, [formData, timetables]);

  const openDrawer = () => {
    setFormData((current) => ({ ...current, class_id: selectedClass || current.class_id, day_of_week: selectedDay }));
    setIsDrawerOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.end_time || formData.end_time <= formData.start_time) {
      toast.error("The period must end after it starts.");
      return;
    }
    setIsSubmitting(true);

    try {
      // Someone else may have added periods since this page loaded.
      const { data: sameDay, error: loadError } = await supabase
        .from('school_timetables')
        .select(`id, class_id, teacher_id, day_of_week, subject, start_time, end_time, room_number, school_classes(name, section), school_teachers(first_name, last_name)`)
        .eq('day_of_week', formData.day_of_week);
      if (loadError) throw loadError;
      const freshClashes = findClashes(formData, (sameDay ?? []) as unknown as Period[]);
      if (freshClashes.length) {
        toast.error(freshClashes[0]);
        return;
      }

      const { data, error } = await supabase
        .from('school_timetables')
        .insert([{
          class_id: formData.class_id,
          teacher_id: formData.teacher_id,
          day_of_week: formData.day_of_week,
          subject: formData.subject,
          start_time: formData.start_time,
          end_time: formData.end_time,
          room_number: formData.room_number.trim() || null
        }])
        .select(`*, school_classes(id, name, section), school_teachers(id, first_name, last_name)`)
        .single();

      if (error) throw error;

      if (data) {
        const newData = [...timetables, data].sort((a, b) => a.start_time.localeCompare(b.start_time));
        setTimetables(newData);
        setIsDrawerOpen(false);
        setSelectedClass(data.class_id);
        setSelectedDay(data.day_of_week);
        setFormData({ ...formData, subject: "", start_time: formData.end_time, end_time: "", room_number: "" });
        toast.success(`${data.subject} added for ${classLabel(data.school_classes)} on ${data.day_of_week}.`);
        router.refresh();
      }
    } catch (error) {
      console.error("Error creating schedule:", error);
      toast.error(`Failed to create schedule: ${describeError(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-[#e5e5e5] shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#e5e5e5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fafafa]">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="h-9 px-3 rounded-md border border-[#cccccc] bg-white text-[13px] font-medium text-[#111111] focus:outline-none focus:border-[#0066cc]"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{classLabel(c)}</option>
              ))}
            </select>
            
            <div className="flex bg-[#f4f4f5] rounded-md border border-[#cccccc] p-1 overflow-x-auto">
              {DAYS.map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1.5 text-[12px] font-medium rounded-sm transition-colors whitespace-nowrap ${selectedDay === day ? 'bg-white shadow-sm text-[#111111]' : 'text-[#888888] hover:text-[#333333]'}`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
          
          {canManage && <button
            onClick={openDrawer}
            className="h-9 px-4 bg-[#0066cc] hover:bg-[#0055bb] text-white text-[13px] font-medium rounded-md flex items-center justify-center gap-2 transition-colors shadow-sm whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Period</span>
          </button>}
        </div>

        {/* Schedule List */}
        <div className="min-h-[400px] p-6">
          {filteredTimetables.length === 0 ? (
            <div className="text-center py-12">
              <CalendarDays className="w-12 h-12 text-[#cccccc] mx-auto mb-3" />
              <div className="text-[#111111] font-medium">No Schedule Found</div>
              <p className="text-[#888888] text-[13px] mt-1">There are no classes scheduled for {selectedDay}.</p>
            </div>
          ) : (
            <div className="relative border-l-2 border-[#e5e5e5] ml-4 space-y-6">
              {filteredTimetables.map((period, idx) => (
                <div key={period.id} className="relative pl-6">
                  <div className="absolute w-3 h-3 bg-[#0066cc] rounded-full -left-[7px] top-1.5 ring-4 ring-white" />
                  <div className="bg-[#f9f9fa] border border-[#e5e5e5] rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 text-[12px] font-bold text-[#0066cc] mb-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatTime(period.start_time)} – {formatTime(period.end_time)}
                        </div>
                        <h4 className="text-[16px] font-bold text-[#111111]">{period.subject}</h4>
                        <div className="flex items-center gap-4 mt-2 text-[13px] text-[#555555]">
                          <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-[#888888]" /> {period.school_teachers?.first_name} {period.school_teachers?.last_name}</span>
                          {period.room_number && (
                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#888888]" /> {roomLabel(period.room_number)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Period Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)} />
          <div role="dialog" aria-modal="true" aria-labelledby="period-title" className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e5e5e5]">
              <h3 id="period-title" className="text-[18px] font-semibold text-[#111111]">Add Schedule Period</h3>
              <button type="button" aria-label="Close" onClick={() => setIsDrawerOpen(false)} className="text-[#888888] hover:text-[#111111] p-1 rounded-md hover:bg-[#f4f4f5] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-y-auto">
              <div className="p-6 space-y-5">
                <div>
                  <label htmlFor="period-class" className="block text-[13px] font-medium text-[#333333] mb-1.5">Class *</label>
                  <select
                    required
                    value={formData.class_id}
                    id="period-class"
                    onChange={e => setFormData({...formData, class_id: e.target.value})}
                    className="w-full h-9 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                  >
                    {classes.map((c: any) => (
                      <option key={c.id} value={c.id}>{classLabel(c)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="period-day" className="block text-[13px] font-medium text-[#333333] mb-1.5">Day of Week *</label>
                  <select
                    required
                    value={formData.day_of_week}
                    id="period-day"
                    onChange={e => setFormData({...formData, day_of_week: e.target.value})}
                    className="w-full h-9 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                  >
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="period-start" className="block text-[13px] font-medium text-[#333333] mb-1.5">Start Time *</label>
                    <input
                      type="time"
                      required
                      value={formData.start_time}
                      id="period-start"
                    onChange={e => setFormData({...formData, start_time: e.target.value})}
                      className="w-full h-9 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                    />
                  </div>
                  <div>
                    <label htmlFor="period-end" className="block text-[13px] font-medium text-[#333333] mb-1.5">End Time *</label>
                    <input
                      type="time"
                      required
                      value={formData.end_time}
                      id="period-end"
                    onChange={e => setFormData({...formData, end_time: e.target.value})}
                      className="w-full h-9 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="period-subject" className="block text-[13px] font-medium text-[#333333] mb-1.5">Subject *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    id="period-subject"
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                    placeholder="e.g. Physics" minLength={2} maxLength={60}
                    className="w-full h-9 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                  />
                </div>

                <div>
                  <label htmlFor="period-teacher" className="block text-[13px] font-medium text-[#333333] mb-1.5">Assigned Teacher *</label>
                  <select
                    required
                    value={formData.teacher_id}
                    id="period-teacher"
                    onChange={e => setFormData({...formData, teacher_id: e.target.value})}
                    className="w-full h-9 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                  >
                    <option value="">Select Teacher...</option>
                    {teachers.map((t: any) => (
                      <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="period-room" className="block text-[13px] font-medium text-[#333333] mb-1.5">Room Number (Optional)</label>
                  <input
                    type="text"
                    value={formData.room_number}
                    id="period-room"
                    onChange={e => setFormData({...formData, room_number: e.target.value})}
                    placeholder="e.g. 101A" maxLength={20}
                    className="w-full h-9 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                  />
                </div>
              </div>
              
              {clashes.length > 0 && (
                <div role="alert" className="mx-6 mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-[13px] text-red-800">
                  <p className="font-semibold">This period clashes with the timetable:</p>
                  <ul className="mt-1 list-disc space-y-0.5 pl-5">
                    {clashes.map((clash) => <li key={clash}>{clash}</li>)}
                  </ul>
                </div>
              )}

              <div className="mt-auto p-6 border-t border-[#e5e5e5] bg-[#fafafa]">
                <div className="flex gap-3">
                  <button type="button" onClick={() => setIsDrawerOpen(false)} className="flex-1 h-10 border rounded-md font-medium text-[14px]">Cancel</button>
                  <button type="submit" disabled={isSubmitting || clashes.length > 0} className="flex-1 h-10 bg-[#0066cc] text-white rounded-md font-medium text-[14px] disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? 'Saving...' : 'Add Period'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
