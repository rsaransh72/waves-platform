import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { canManageSchoolArea, normalizeSchoolRole } from "@/lib/school-permissions";
import { SpreadsheetImport } from "@/components/school/SpreadsheetImport";
import { rollKey } from "@/lib/school-import";

export const revalidate = 0;

export const metadata = {
  title: "Import students | School ERP",
};

export default async function ImportStudentsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: role } = await supabase.rpc("get_auth_school_role");
  if (!canManageSchoolArea(normalizeSchoolRole(role), "students")) redirect("/school?denied=1");

  // Every roll and admission number in use, active or not: the database keeps roll
  // numbers unique per class and admission numbers unique per school.
  const [{ data: classes }, { data: students }] = await Promise.all([
    supabase.from("school_classes").select("id, name, section").order("name"),
    supabase.from("school_students").select("roll_number, class_id, admission_number"),
  ]);

  return (
    <SpreadsheetImport
      kind="students"
      classes={classes ?? []}
      taken={{
        rolls: (students ?? []).map((student) => rollKey(student.class_id, student.roll_number)),
        admissions: (students ?? []).flatMap((student) => (student.admission_number ? [student.admission_number] : [])),
      }}
    />
  );
}
