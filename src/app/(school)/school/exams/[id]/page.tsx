import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SchoolHeader } from "@/components/school/SchoolHeader";
import { ExamGradingView } from "@/components/school/ExamGradingView";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Exam Grading | Waves School ERP",
};

export default async function ExamGradingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: examId } = await params;
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
  const { data: students } = await supabase
    .from("school_students")
    .select("id, first_name, last_name, roll_number")
    .eq("class_id", exam.class_id)
    .order("roll_number");

  // 3. Fetch all existing results for this exam
  const { data: results } = await supabase
    .from("school_exam_results")
    .select("*")
    .eq("exam_id", examId);

  return (
    <div className="flex-1 flex flex-col bg-[#f9f9fa] h-[100dvh] overflow-hidden">
      <SchoolHeader title="Exam Grading" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/school/exams" className="text-[#888888] hover:text-[#111111] transition-colors p-2 -ml-2 rounded-md hover:bg-white">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h2 className="text-[20px] font-semibold text-[#111111] tracking-tight">{exam.name} Grading</h2>
              <p className="text-[14px] text-[#555555] mt-1">
                {exam.school_classes?.name} ({exam.school_classes?.section}) • {new Date(exam.start_date).toLocaleDateString()}
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
