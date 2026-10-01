import { createServerSupabaseClient } from "@/lib/supabase-server";
import { TeachersList } from "@/components/school/TeachersList";

export const revalidate = 0;

export const metadata = {
  title: "Teachers & Staff | School ERP",
};

export default async function TeachersPage() {
  const supabase = await createServerSupabaseClient();
  const { data: teachers, error } = await supabase
    .from("school_teachers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) console.error("Error fetching teachers:", error);

  return <TeachersList initialData={teachers || []} />;
}
