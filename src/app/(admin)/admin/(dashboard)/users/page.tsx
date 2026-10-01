import { createServerSupabaseClient } from "@/lib/supabase-server";
import { UserList } from "@/components/admin/UserList";

export const revalidate = 0;

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string | string[] }>;
}) {
  const supabase = await createServerSupabaseClient();
  const query = await searchParams;
  const openCreateOnLoad = query.new === "true";
  const { data: users, error } = await supabase
    .from("team_members")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) console.error("Error fetching team members:", error);

  return <UserList key={openCreateOnLoad ? "create" : "list"} initialData={users || []} openCreateOnLoad={openCreateOnLoad} />;
}

