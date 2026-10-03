import { createServerSupabaseClient } from "@/lib/supabase-server";
import { LibraryList } from "@/components/school/LibraryList";

export const metadata = {
  title: "Library Management | Waves School ERP",
};

export default async function LibraryPage() {
  const supabase = await createServerSupabaseClient();

  const [{ data: books }, { data: students }, { data: issues }] = await Promise.all([
    supabase
      .from("school_library_books")
      .select("*")
      .order("title", { ascending: true }),
    supabase
      .from("school_students")
      .select("id, first_name, last_name, roll_number")
      .eq("status", "active")
      .order("first_name", { ascending: true }),
    supabase
      .from("school_library_issues")
      .select("id, issue_date, due_date, book_id, school_library_books(title), school_students(first_name, last_name, roll_number)")
      .eq("status", "issued")
      .order("due_date", { ascending: true }),
  ]);

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-[20px] font-semibold text-[#111111] tracking-tight">Library Books</h1>
              <p className="text-[14px] text-[#555555] mt-1">
                Manage books inventory and track student issues and returns.
              </p>
            </div>
          </div>
          
          <LibraryList initialBooks={books || []} students={students || []} initialIssues={issues || []} />
        </div>
      </main>
    </div>
  );
}
