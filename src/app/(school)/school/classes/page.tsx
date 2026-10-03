import { createServerSupabaseClient } from "@/lib/supabase-server";
import { ClassesList } from "@/components/school/ClassesList";
import Link from "next/link";

export const revalidate = 0;

export const metadata = {
  title: "Classes & Sections | School ERP",
};

export default async function ClassesPage() {
  const supabase = await createServerSupabaseClient();
  const [{ data: classes, error }, { data: teachers }] = await Promise.all([
    supabase
      .from("school_classes")
      .select("*, school_teachers(first_name, last_name), school_students(count)")
      .order("created_at", { ascending: false }),
    supabase
      .from("school_teachers")
      .select("id, first_name, last_name")
      .eq("status", "active"),
  ]);

  if (error) {
    console.error("Error fetching school classes:", error);
    return (
      <div role="alert" className="rounded border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        Classes could not be loaded. Check your school access and database policies, then <Link href="/school/classes" className="font-semibold underline">try again</Link>.
      </div>
    );
  }

  return <ClassesList initialData={classes || []} teachers={teachers || []} />;
}
