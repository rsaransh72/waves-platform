import { createServerSupabaseClient } from "@/lib/supabase-server";
import { ExamsList } from "@/components/school/ExamsList";

export const metadata = {
  title: "Exams & Grades | Waves School ERP",
};

export default async function ExamsPage() {
  const supabase = await createServerSupabaseClient();

  // Fetch Exams
  const { data: exams } = await supabase
    .from("school_exams")
    .select(`
      *,
      school_classes (id, name, section)
    `)
    .order("start_date", { ascending: false });

  // Fetch classes for the dropdown
  const { data: classesList } = await supabase
    .from("school_classes")
    .select("id, name, section")
    .order("name");

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-[20px] font-semibold text-[#111111] tracking-tight">Examinations</h2>
              <p className="text-[14px] text-[#555555] mt-1">
                Schedule exams and manage student grading.
              </p>
            </div>
          </div>
          
          <ExamsList initialData={exams || []} classesList={classesList || []} />
        </div>
      </main>
    </div>
  );
}
