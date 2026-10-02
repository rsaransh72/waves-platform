import { SchoolShell } from "@/components/school/SchoolShell";
import type { SchoolSession } from "@/components/school/SchoolSessionContext";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { normalizeSchoolRole } from "@/lib/school-permissions";
import { billingNotice, type SchoolAccount } from "@/lib/school-account";
import { getSiteSettings } from "@/lib/site-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "School ERP | Waves Platform",
  description: "Enterprise School Management Suite",
};

export default async function SchoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  let session: SchoolSession | null = null;
  if (user) {
    const [{ data: role }, { data: settings }, { data: account }] = await Promise.all([
      supabase.rpc("get_auth_school_role"),
      supabase.from("school_settings").select("school_name").maybeSingle(),
      supabase.rpc("get_my_school_account").maybeSingle<SchoolAccount>(),
    ]);
    const schoolRole = normalizeSchoolRole(role);
    // eslint-disable-next-line react-hooks/purity -- the layout renders per request
    const billing = schoolRole === "admin" ? billingNotice(account, Date.now()) : null;
    if (billing) billing.phone = (await getSiteSettings()).phone || undefined;
    const metadataName = user.user_metadata?.full_name ?? user.user_metadata?.name;
    session = {
      email: user.email ?? "",
      name: typeof metadataName === "string" && metadataName.trim() ? metadataName.trim() : null,
      role: schoolRole,
      schoolName: settings?.school_name || "School ERP",
      billing,
    };
  }

  return <SchoolShell session={session}>{children}</SchoolShell>;
}
