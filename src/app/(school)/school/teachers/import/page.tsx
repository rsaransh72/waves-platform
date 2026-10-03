import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { canManageSchoolArea, normalizeSchoolRole } from "@/lib/school-permissions";
import { SpreadsheetImport } from "@/components/school/SpreadsheetImport";

export const revalidate = 0;

export const metadata = {
  title: "Import teachers | School ERP",
};

export default async function ImportTeachersPage() {
  const supabase = await createServerSupabaseClient();
  const [{ data: role }, { data: teachers }] = await Promise.all([
    supabase.rpc("get_auth_school_role"),
    supabase.from("school_teachers").select("employee_id"),
  ]);
  if (!canManageSchoolArea(normalizeSchoolRole(role), "teachers")) redirect("/school?denied=1");

  return <SpreadsheetImport kind="teachers" classes={[]} taken={{ employeeIds: (teachers ?? []).map((teacher) => teacher.employee_id) }} />;
}
