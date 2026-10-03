import { createServerSupabaseClient } from "@/lib/supabase-server";
import { StudentsList } from "@/components/school/StudentsList";
import Link from "next/link";

export const revalidate = 0;

export const metadata = {
  title: "Students | School ERP",
};

export default async function StudentsPage() {
  const supabase = await createServerSupabaseClient();
  const [{ data: students, error }, { data: classes }] = await Promise.all([
    supabase
      .from("school_students")
      .select("*, school_classes(name, section)")
      .order("created_at", { ascending: false }),
    supabase
      .from("school_classes")
      .select("id, name, section")
      .order("name", { ascending: true }),
  ]);

  if (error) {
    console.error("Error fetching school students:", error);
    return (
      <div role="alert" className="rounded border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        Students could not be loaded. Check your school access and database policies, then <Link href="/school/students" className="font-semibold underline">try again</Link>.
      </div>
    );
  }

  return <StudentsList initialData={students || []} classes={classes || []} />;
}
