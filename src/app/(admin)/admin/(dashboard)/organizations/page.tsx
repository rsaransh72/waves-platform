import { redirect } from "next/navigation";
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
  // New clients are created on the onboarding page, which has the product and plan list.
  if (query.new === "true") redirect("/admin/onboarding");
  const supabase = await createServerSupabaseClient();
  const { data: orgs, error } = await supabase
    .from("organizations")
    .select("id, name, slug, type, email, phone, city, status, subscriptions(plan_name, next_billing_date, status), organization_members(count)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching client organizations:", error);
    return (
      <div role="alert" className="rounded border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        Client organizations could not be loaded. Check platform-admin access and database policies, then <Link href="/admin/organizations" className="font-semibold underline">try again</Link>.
      </div>
    );
  }

  return <OrganizationList initialData={(orgs ?? []) as never} />;
}
