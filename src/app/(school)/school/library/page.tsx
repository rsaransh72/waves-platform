import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SchoolHeader } from "@/components/school/SchoolHeader";
import { LibraryList } from "@/components/school/LibraryList";

export const metadata = {
  title: "Library Management | Waves School ERP",
};

export default async function LibraryPage() {
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

  const { data: books } = await supabase
    .from("school_library_books")
    .select("*")
    .order("title", { ascending: true });

  const { data: students } = await supabase
    .from("school_students")
    .select("id, first_name, last_name, roll_number")
    .order("first_name", { ascending: true });

  return (
    <div className="flex-1 flex flex-col bg-[#f9f9fa] h-[100dvh] overflow-hidden">
      <SchoolHeader title="Library" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-[20px] font-semibold text-[#111111] tracking-tight">Library Books</h2>
              <p className="text-[14px] text-[#555555] mt-1">
                Manage books inventory and track student issues and returns.
              </p>
            </div>
          </div>
          
          <LibraryList initialBooks={books || []} students={students || []} />
        </div>
      </main>
    </div>
  );
}
