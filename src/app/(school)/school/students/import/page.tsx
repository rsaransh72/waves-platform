import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { canManageSchoolArea, normalizeSchoolRole } from "@/lib/school-permissions";
import { SpreadsheetImport } from "@/components/school/SpreadsheetImport";

export const revalidate = 0;

export const metadata = {
  title: "Import students | School ERP",
};

export default async function ImportStudentsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: role } = await supabase.rpc("get_auth_school_role");
  if (!canManageSchoolArea(normalizeSchoolRole(role), "students")) redirect("/school?denied=1");

  // Every roll number in use, active or not: the database keeps them unique per school.
  const [{ data: classes }, { data: students }] = await Promise.all([
    supabase.from("school_classes").select("id, name, section").order("name"),
    supabase.from("school_students").select("roll_number"),
  ]);

  return <SpreadsheetImport kind="students" classes={classes ?? []} taken={(students ?? []).map((student) => student.roll_number)} />;
}
