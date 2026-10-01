import { createServerSupabaseClient } from "@/lib/supabase-server";
import { OrganizationList } from "@/components/admin/OrganizationList";
import Link from "next/link";

export const revalidate = 0;

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string | string[] }>;
}) {
  const query = await searchParams;
  const openCreateOnLoad = query.new === "true";
  const supabase = await createServerSupabaseClient();
  const { data: orgs, error } = await supabase
    .from("organizations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching client organizations:", error);
    return (
      <div role="alert" className="rounded border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        Client organizations could not be loaded. Check platform-admin access and database policies, then <Link href="/admin/organizations" className="font-semibold underline">try again</Link>.
      </div>
    );
  }

  return <OrganizationList key={openCreateOnLoad ? "create" : "list"} initialData={orgs || []} openCreateOnLoad={openCreateOnLoad} />;
}
