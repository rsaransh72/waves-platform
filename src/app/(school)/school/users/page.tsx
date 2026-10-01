import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { listMembers, type ClientMember } from "@/lib/client-members";
import { SchoolUsersList } from "@/components/school/SchoolUsersList";

export const metadata = {
  title: "Users & Access | School ERP",
};

export default async function SchoolUsersPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: organizationId }, { data: role }] = await Promise.all([
    supabase.rpc("get_auth_organization_id"),
    supabase.rpc("get_auth_school_role"),
  ]);
  if (!user || !organizationId || role !== "admin") redirect("/school?denied=1");

  let members: ClientMember[] = [];
  let loadError: string | null = null;
  try {
    members = await listMembers(organizationId);
  } catch (error) {
    console.error("Could not load school users:", error);
    loadError = "Users could not be loaded. Contact Waves support if this continues.";
  }

  return <SchoolUsersList members={members} currentUserId={user.id} loadError={loadError} />;
}
