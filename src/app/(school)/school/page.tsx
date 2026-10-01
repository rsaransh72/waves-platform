import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { BookOpen, GraduationCap, Users, UserCheck } from "lucide-react";

export default async function SchoolDashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Server Components can read cookies but cannot refresh them during rendering.
          }
        },
      },
    }
  );

  const today = new Date().toISOString().slice(0, 10);
  const [studentsResult, teachersResult, classesResult, attendanceResult] = await Promise.all([
    supabase.from("school_students").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("school_teachers").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("school_classes").select("id", { count: "exact", head: true }),
    supabase.from("school_attendance").select("status").eq("date", today),
  ]);

  const hasQueryError = [studentsResult, teachersResult, classesResult, attendanceResult].some(
    (result) => result.error
  );
  const activeStudents = studentsResult.count;
  const attendanceRecords = attendanceResult.data ?? [];
  const presentStudents = attendanceRecords.filter((record) => record.status === "present").length;
  const attendanceValue = attendanceResult.error || activeStudents === null
    ? "Unavailable"
    : activeStudents === 0
      ? "No students"
      : attendanceRecords.length === 0
        ? "Not marked"
        : `${Math.round((presentStudents / attendanceRecords.length) * 100)}%`;

  const stats = [
    { name: "Active Students", value: studentsResult.count?.toLocaleString() ?? "Unavailable", icon: GraduationCap, color: "text-blue-700", bg: "bg-blue-50" },
    { name: "Active Staff", value: teachersResult.count?.toLocaleString() ?? "Unavailable", icon: Users, color: "text-teal-700", bg: "bg-teal-50" },
    { name: "Classes", value: classesResult.count?.toLocaleString() ?? "Unavailable", icon: BookOpen, color: "text-amber-700", bg: "bg-amber-50" },
    { name: "Attendance Today", value: attendanceValue, icon: UserCheck, color: "text-emerald-700", bg: "bg-emerald-50" },
  ];

  const quickLinks = [
    { label: "Enroll a student", href: "/school/students", icon: GraduationCap },
    { label: "Take attendance", href: "/school/attendance", icon: UserCheck },
    { label: "Manage classes", href: "/school/classes", icon: BookOpen },
  ];

  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">School Dashboard</h1>
        <p className="text-sm text-slate-500">A live overview of your school operations.</p>
      </div>

      {hasQueryError && (
        <div role="alert" className="border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Some school data could not be loaded. Verify the ERP schema and organization access policies; unavailable totals are not shown as zero.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-500">{stat.name}</span>
                  <span className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</span>
                </div>
                <div className={`rounded-md p-3 ${stat.bg}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)]">
        <section className="border-t-2 border-slate-900 pt-4">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Today&apos;s attendance</h2>
              <p className="mt-1 text-sm text-slate-500">
                {attendanceResult.error ? "Unavailable" : attendanceRecords.length} records for {new Date(`${today}T00:00:00`).toLocaleDateString()}
              </p>
            </div>
            <Link href="/school/attendance" className="text-sm font-semibold text-blue-700 hover:text-blue-900">Open register</Link>
          </div>
          <div className="mt-5 grid grid-cols-3 border-y border-slate-200 py-4 text-center">
            {[
              { label: "Present", value: attendanceResult.error ? undefined : attendanceRecords.filter((record) => record.status === "present").length },
              { label: "Late", value: attendanceResult.error ? undefined : attendanceRecords.filter((record) => record.status === "late").length },
              { label: "Absent", value: attendanceResult.error ? undefined : attendanceRecords.filter((record) => record.status === "absent").length },
            ].map((item) => (
              <div key={item.label}>
                <div className="text-xl font-bold text-slate-900">{item.value ?? "-"}</div>
                <div className="mt-1 text-xs font-medium text-slate-500">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t-2 border-slate-900 pt-4">
          <h2 className="text-lg font-bold text-slate-900">School operations</h2>
          <div className="mt-3 divide-y divide-slate-200 border-y border-slate-200">
            {quickLinks.map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href} className="flex items-center justify-between gap-3 py-3 text-sm font-semibold text-slate-700 hover:text-blue-700">
                <span className="flex items-center gap-3"><Icon className="h-4 w-4" />{label}</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
