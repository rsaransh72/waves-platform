import { createServerSupabaseClient } from "@/lib/supabase-server";
import { TimetableList } from "@/components/school/TimetableList";

export const metadata = {
  title: "Timetable | Waves School ERP",
};

export default async function TimetablePage() {
  const supabase = await createServerSupabaseClient();

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
    <div className="flex-1 flex flex-col">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-[20px] font-semibold text-[#111111] tracking-tight">Class Schedules</h1>
              <p className="text-[14px] text-[#555555] mt-1">
                Weekly periods for each class. A teacher, class or room cannot be booked twice at the same time.
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
