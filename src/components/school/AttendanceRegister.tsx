"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CircleAlert, CircleX, Save } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { toast } from "sonner";

type SchoolClass = { id: string; name: string; section: string };
type Student = { id: string; first_name: string; last_name: string; roll_number: string; class_id: string };
type Attendance = { student_id: string; status: "present" | "absent" | "late" };

export function AttendanceRegister({
  classes,
  students,
  initialAttendance,
  today,
}: {
  classes: SchoolClass[];
  students: Student[];
  initialAttendance: Attendance[];
  today: string;
}) {
  const router = useRouter();
  const [classId, setClassId] = useState(classes[0]?.id ?? "");
  const [date, setDate] = useState(today);
  const [marks, setMarks] = useState<Record<string, Attendance["status"]>>(
    Object.fromEntries(initialAttendance.map(({ student_id, status }) => [student_id, status]))
  );
  const [isSaving, setIsSaving] = useState(false);
  const classStudents = students.filter((student) => student.class_id === classId);
  const markedCount = classStudents.filter((student) => marks[student.id]).length;

  const loadRegister = async (nextClassId: string, nextDate: string) => {
    setClassId(nextClassId);
    setDate(nextDate);
    setMarks({});
    if (!nextClassId || !nextDate) return;

    const { data, error } = await createClient()
      .from("school_attendance")
      .select("student_id, status")
      .eq("class_id", nextClassId)
      .eq("date", nextDate);

    if (error) {
      toast.error(`Could not load attendance: ${error.message}`);
      return;
    }
    setMarks(Object.fromEntries((data ?? []).map(({ student_id, status }) => [student_id, status])));
  };

  const saveRegister = async () => {
    if (!classId || classStudents.length === 0 || markedCount !== classStudents.length || isSaving) return;

    setIsSaving(true);
    const records = classStudents.map((student) => ({
      student_id: student.id,
      class_id: classId,
      date,
      status: marks[student.id],
    }));

    const { error } = await createClient()
      .from("school_attendance")
      .upsert(records, { onConflict: "student_id,date" });

    setIsSaving(false);
    if (error) {
      toast.error(`Could not save register: ${error.message}`);
      return;
    }

    toast.success(`Attendance saved for ${classStudents.length} students.`);
    router.refresh();
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Daily Attendance</h1>
          <p className="mt-1 text-sm text-slate-500">Mark each active student, then save the register.</p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="grid gap-1 text-xs font-semibold text-slate-600">
            Class
            <select value={classId} onChange={(event) => loadRegister(event.target.value, date)} className="h-10 min-w-48 rounded border border-slate-300 bg-white px-3 text-sm text-slate-900">
              {classes.length === 0 && <option value="">No classes</option>}
              {classes.map((schoolClass) => <option key={schoolClass.id} value={schoolClass.id}>{schoolClass.name} - {schoolClass.section}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-xs font-semibold text-slate-600">
            Date
            <input type="date" value={date} max={today} onChange={(event) => loadRegister(classId, event.target.value)} className="h-10 rounded border border-slate-300 bg-white px-3 text-sm text-slate-900" />
          </label>
          <button type="button" onClick={saveRegister} disabled={!classId || classStudents.length === 0 || markedCount !== classStudents.length || isSaving} className="inline-flex h-10 items-center gap-2 rounded bg-slate-900 px-4 text-sm font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
            <Save className="h-4 w-4" />{isSaving ? "Saving..." : "Save Register"}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between border-y border-slate-200 py-3 text-sm">
        <span className="font-medium text-slate-700">{markedCount} of {classStudents.length} students marked</span>
        <span className="text-slate-500">{date}</span>
      </div>

      {classStudents.length === 0 ? (
        <div className="flex flex-1 items-center justify-center border border-dashed border-slate-300 bg-white p-8 text-center">
          <div>
            <h2 className="font-semibold text-slate-900">{classes.length === 0 ? "Create a class first" : "No active students in this class"}</h2>
            <p className="mt-1 text-sm text-slate-500">Attendance becomes available when this class has active student enrollments.</p>
          </div>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-auto rounded border border-slate-200 bg-white">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="sticky top-0 bg-slate-50 text-xs font-bold uppercase text-slate-500">
              <tr><th className="px-4 py-3">Roll number</th><th className="px-4 py-3">Student</th><th className="px-4 py-3 text-right">Attendance</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((student) => (
                <tr key={student.id}>
                  <td className="px-4 py-3 font-medium text-slate-500">{student.roll_number}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{student.first_name} {student.last_name}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {([
                        ["present", "Present", Check, "text-emerald-700 border-emerald-300 bg-emerald-50"],
                        ["late", "Late", CircleAlert, "text-amber-700 border-amber-300 bg-amber-50"],
                        ["absent", "Absent", CircleX, "text-red-700 border-red-300 bg-red-50"],
                      ] as const).map(([status, label, Icon, activeClass]) => (
                        <button key={status} type="button" aria-pressed={marks[student.id] === status} onClick={() => setMarks((current) => ({ ...current, [student.id]: status }))} className={`inline-flex h-9 items-center gap-1.5 rounded border px-2.5 text-xs font-semibold ${marks[student.id] === status ? activeClass : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                          <Icon className="h-3.5 w-3.5" /><span>{label}</span>
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}