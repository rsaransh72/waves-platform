import { createServerSupabaseClient } from "@/lib/supabase-server";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";

export const revalidate = 0;

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("settings").select("value").eq("key", "site_general").maybeSingle();
  if (error) console.error("Error fetching settings:", error);

  return <SiteSettingsForm initialValues={(data?.value ?? {}) as Record<string, string>} />;
}
