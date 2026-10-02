import { createServerSupabaseClient } from "@/lib/supabase-server";
import { AttendanceRegister } from "@/components/school/AttendanceRegister";
import Link from "next/link";
import { schoolToday } from "@/lib/school-date";

export const revalidate = 0;

export const metadata = {
  title: "Attendance | School ERP",
};

export default async function AttendancePage() {
  const supabase = await createServerSupabaseClient();
  const today = schoolToday();
  const [classesResult, studentsResult, attendanceResult] = await Promise.all([
    supabase
      .from("school_classes")
      .select("id, name, section")
      .order("name", { ascending: true }),
    supabase
      .from("school_students")
      .select("id, first_name, last_name, roll_number, class_id")
      .eq("status", "active")
      .order("roll_number", { ascending: true }),
    supabase
      .from("school_attendance")
      .select("student_id, status")
      .eq("date", today),
  ]);

  const queryError = classesResult.error || studentsResult.error || attendanceResult.error;
  if (queryError) {
    console.error("Error loading school attendance register:", queryError);
    return (
      <div role="alert" className="rounded border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        The attendance register could not be loaded. Check your school access and database policies, then <Link href="/school/attendance" className="font-semibold underline">try again</Link>.
      </div>
    );
  }

  return (
    <AttendanceRegister
      classes={classesResult.data || []}
      students={studentsResult.data || []}
      initialAttendance={attendanceResult.data || []}
      today={today}
    />
  );
}
