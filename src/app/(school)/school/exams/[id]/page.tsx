import { createServerSupabaseClient } from "@/lib/supabase-server";
import { ExamGradingView } from "@/components/school/ExamGradingView";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { formatDate } from "@/lib/india";

export const metadata = {
  title: "Exam Grading | Waves School ERP",
};

export default async function ExamGradingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: examId } = await params;
  const supabase = await createServerSupabaseClient();

  // 1. Fetch Exam Details
  const { data: exam } = await supabase
    .from("school_exams")
    .select("*, school_classes(id, name, section)")
    .eq("id", examId)
    .single();

  if (!exam) {
    return <div>Exam not found</div>;
  }

  // 2. Fetch all students in this class
  const [{ data: students }, { data: results }] = await Promise.all([
    supabase
      .from("school_students")
      .select("id, first_name, last_name, roll_number")
      .eq("class_id", exam.class_id)
      .order("roll_number"),
    supabase
      .from("school_exam_results")
      .select("*")
      .eq("exam_id", examId),
  ]);

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/school/exams" className="text-[#888888] hover:text-[#111111] transition-colors p-2 -ml-2 rounded-md hover:bg-white">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-[20px] font-semibold text-[#111111] tracking-tight">{exam.name} Grading</h1>
              <p className="text-[14px] text-[#555555] mt-1">
                {exam.school_classes?.name} ({exam.school_classes?.section}) • {formatDate(exam.start_date)}
              </p>
            </div>
          </div>
          
          <ExamGradingView 
            examId={examId}
            students={students || []} 
            initialResults={results || []} 
          />
        </div>
      </main>
    </div>
  );
}
