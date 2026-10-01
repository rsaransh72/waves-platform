import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SchoolHeader } from "@/components/school/SchoolHeader";
import { TimetableList } from "@/components/school/TimetableList";

export const metadata = {
  title: "Timetable | Waves School ERP",
};

export default async function TimetablePage() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: timetables } = await supabase
    .from("school_timetables")
    .select(`
      *,
      school_classes(id, name, section),
      school_teachers(id, first_name, last_name)
    `)
    .order("start_time", { ascending: true });

  const { data: classes } = await supabase
    .from("school_classes")
    .select("id, name, section")
    .order("name", { ascending: true });

  const { data: teachers } = await supabase
    .from("school_teachers")
    .select("id, first_name, last_name")
    .order("first_name", { ascending: true });

  return (
    <div className="flex-1 flex flex-col bg-[#f9f9fa] h-[100dvh] overflow-hidden">
      <SchoolHeader title="Timetable" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-[20px] font-semibold text-[#111111] tracking-tight">Class Schedules</h2>
              <p className="text-[14px] text-[#555555] mt-1">
                Manage weekly timetables for classes and teachers.
              </p>
            </div>
          </div>
          
          <TimetableList 
            initialTimetables={timetables || []} 
            classes={classes || []} 
            teachers={teachers || []} 
          />
        </div>
      </main>
    </div>
  );
}
