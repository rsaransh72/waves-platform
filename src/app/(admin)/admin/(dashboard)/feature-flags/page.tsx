import { createServerSupabaseClient } from "@/lib/supabase-server";
import { FeatureFlagList } from "@/components/admin/FeatureFlagList";

export const revalidate = 0;

export default async function FeatureFlagsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: flags, error } = await supabase
    .from("feature_flags")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) console.error("Error fetching feature flags:", error);

  return (
    <FeatureFlagList initialFlags={flags || []} />
  );
}
