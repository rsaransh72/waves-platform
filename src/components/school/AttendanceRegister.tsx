"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CircleAlert, CircleX, Save } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { toast } from "sonner";
import { useCanManage } from "@/components/school/SchoolSessionContext";
import { describeError } from "@/lib/error-message";
import { formatDate } from "@/lib/india";

type SchoolClass = { id: string; name: string; section: string };
type Student = { id: string; first_name: string; last_name: string; roll_number: string; class_id: string };
type Status = "present" | "absent" | "late";
type Attendance = { student_id: string; status: Status };

const STATUSES = [
  ["present", "Present", Check, "text-emerald-700 border-emerald-300 bg-emerald-50"],
  ["late", "Late", CircleAlert, "text-amber-700 border-amber-300 bg-amber-50"],
  ["absent", "Absent", CircleX, "text-red-700 border-red-300 bg-red-50"],
] as const;

// Most children are in school on most days, so a register that has not been saved
// yet starts with everyone present and the teacher marks only the exceptions.
const allPresent = (students: Student[]) => Object.fromEntries(students.map((student) => [student.id, "present" as Status]));

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
  const canManage = useCanManage("attendance");
  const [classId, setClassId] = useState(classes[0]?.id ?? "");
  const [date, setDate] = useState(today);
  const classStudentsOf = (id: string) => students.filter((student) => student.class_id === id);
  const startMarks = (saved: Attendance[], id: string): Record<string, Status> =>
    saved.length ? Object.fromEntries(saved.map(({ student_id, status }) => [student_id, status])) : canManage ? allPresent(classStudentsOf(id)) : {};
  const [marks, setMarks] = useState<Record<string, Status>>(() => startMarks(initialAttendance, classes[0]?.id ?? ""));
  const [isSaved, setIsSaved] = useState(initialAttendance.length > 0);
  const [isSaving, setIsSaving] = useState(false);
  const classStudents = classStudentsOf(classId);
  const markedCount = classStudents.filter((student) => marks[student.id]).length;
  const counts = STATUSES.map(([status, label]) => [label, classStudents.filter((student) => marks[student.id] === status).length] as const);

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
      toast.error(`Could not load attendance: ${describeError(error)}`);
      return;
    }
    setIsSaved((data ?? []).length > 0);
    setMarks(startMarks((data ?? []) as Attendance[], nextClassId));
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
      toast.error(`Could not save register: ${describeError(error)}`);
      return;
    }
    setIsSaved(true);
    toast.success(`Attendance saved for ${classStudents.length} students.`);
    router.refresh();
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Daily Attendance</h1>
          <p className="mt-1 text-sm text-slate-500">{canManage ? "Mark the students who are absent or late, then save the register." : "View-only: attendance is marked by teachers and administrators."}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-end">
          <label className="grid gap-1 text-xs font-semibold text-slate-600">
            Class
            <select value={classId} onChange={(event) => loadRegister(event.target.value, date)} className="h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm text-slate-900 sm:min-w-48">
              {classes.length === 0 && <option value="">No classes</option>}
              {classes.map((schoolClass) => <option key={schoolClass.id} value={schoolClass.id}>{schoolClass.name} - {schoolClass.section}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-xs font-semibold text-slate-600">
            Date
            <input type="date" value={date} max={today} onChange={(event) => loadRegister(classId, event.target.value)} className="h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm text-slate-900" />
          </label>
          {canManage && <button type="button" onClick={saveRegister} disabled={!classId || classStudents.length === 0 || markedCount !== classStudents.length || isSaving} className="col-span-2 inline-flex h-10 items-center justify-center gap-2 rounded bg-slate-900 px-4 text-sm font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
            <Save className="h-4 w-4" />{isSaving ? "Saving..." : "Save Register"}
          </button>}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-slate-200 py-3 text-sm">
        <span className="font-medium text-slate-700">{formatDate(date)}</span>
        <span className="text-slate-500 tabular-nums">{counts.map(([label, count]) => `${count} ${label.toLowerCase()}`).join(" · ")}</span>
        {markedCount < classStudents.length && <span className="text-amber-700">{classStudents.length - markedCount} not marked</span>}
        {canManage && classStudents.length > 0 && (
          <span className="ml-auto flex gap-2">
            <button type="button" onClick={() => setMarks(allPresent(classStudents))} className="h-9 rounded border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50">All present</button>
            <button type="button" onClick={() => setMarks({})} className="h-9 rounded border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50">Clear</button>
          </span>
        )}
      </div>

      {canManage && !isSaved && classStudents.length > 0 && (
        <p role="status" className="rounded border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-900">
          Not saved yet. Everyone starts as present: mark who is absent or late, then press Save Register.
        </p>
      )}

      {classStudents.length === 0 ? (
        <div className="flex flex-1 items-center justify-center border border-dashed border-slate-300 bg-white p-8 text-center">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{classes.length === 0 ? "Create a class first" : "No active students in this class"}</h2>
            <p className="mt-1 text-sm text-slate-500">Attendance becomes available when this class has active student enrollments.</p>
          </div>
        </div>
      ) : (
        <ul className="min-h-0 flex-1 divide-y divide-slate-100 overflow-auto rounded border border-slate-200 bg-white" aria-label="Students">
          {classStudents.map((student) => (
            <li key={student.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-baseline gap-3">
                <span className="w-10 shrink-0 text-sm font-medium tabular-nums text-slate-500">{student.roll_number}</span>
                <span className="truncate font-semibold text-slate-900">{student.first_name} {student.last_name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:flex sm:justify-end" role="group" aria-label={`Attendance for ${student.first_name} ${student.last_name}`}>
                {STATUSES.map(([status, label, Icon, activeClass]) => (
                  <button key={status} type="button" disabled={!canManage} aria-pressed={marks[student.id] === status} onClick={() => setMarks((current) => ({ ...current, [student.id]: status }))} className={`inline-flex h-11 items-center justify-center gap-1.5 rounded border px-3 text-sm font-semibold sm:h-9 sm:text-xs ${marks[student.id] === status ? activeClass : "border-slate-200 text-slate-500 hover:bg-slate-50"} disabled:cursor-default disabled:hover:bg-transparent`}>
                    <Icon className="h-4 w-4 sm:h-3.5 sm:w-3.5" /><span>{label}</span>
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
