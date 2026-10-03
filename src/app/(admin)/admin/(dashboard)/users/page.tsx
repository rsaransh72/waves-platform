import { createServerSupabaseClient, getSessionUser } from "@/lib/supabase-server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { TeamList, type TeamMember } from "@/components/admin/TeamList";

export const revalidate = 0;
export const metadata = { title: "Platform team | Waves Admin" };

export default async function PlatformTeamPage() {
  const supabase = await createServerSupabaseClient();
  const [user, { data: rows, error }] = await Promise.all([
    getSessionUser(supabase),
    supabase.from("team_members").select("id, name, email, role, status, created_at").order("created_at"),
  ]);
  if (error) console.error("Error fetching platform team:", error);

  // Sign-in state comes from Supabase Auth: no confirmed email means the invitation
  // has not been accepted yet.
  const accounts = new Map<string, { confirmed: boolean; lastSignInAt: string | null }>();
  try {
    const { data } = await createSupabaseAdminClient().auth.admin.listUsers({ page: 1, perPage: 1000 });
    for (const account of data.users) {
      if (account.email) accounts.set(account.email.toLowerCase(), { confirmed: Boolean(account.email_confirmed_at), lastSignInAt: account.last_sign_in_at ?? null });
    }
  } catch (authError) {
    console.error("Could not load sign-in state for the platform team:", authError);
  }

  const members: TeamMember[] = (rows ?? []).map((row) => {
    const account = accounts.get(row.email.toLowerCase());
    return { ...row, lastSignInAt: account?.lastSignInAt ?? null, invited: account ? !account.confirmed : false };
  });

  return <TeamList members={members} currentEmail={user?.email ?? ""} />;
}
