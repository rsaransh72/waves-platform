import { redirect } from "next/navigation";
import { Building2, CreditCard, Users } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { formatAdminDate } from "@/lib/admin-format";
import { formatMoney } from "@/lib/money";

const productNames: Record<string, string> = {
  hospital: "Hospital ERP",
  pharmacy: "Pharmacy POS",
  other: "Client workspace",
};

export const revalidate = 0;

export default async function ClientWorkspacePage() {
  const supabase = await createServerSupabaseClient();
  const { data: organizationId, error: membershipError } = await supabase.rpc("get_auth_client_organization_id");
  if (membershipError || !organizationId) redirect("/access-denied?area=client");

  const [{ data: organization }, { data: subscriptions }, { data: members }] = await Promise.all([
    supabase.from("organizations").select("id, name, type, email, status").eq("id", organizationId).single(),
    supabase.from("subscriptions").select("plan_name, amount, status, next_billing_date").eq("organization_id", organizationId).order("created_at", { ascending: false }).limit(1),
    supabase.from("organization_members").select("user_id, role, created_at").eq("organization_id", organizationId).order("created_at", { ascending: true }),
  ]);

  if (!organization) redirect("/access-denied?area=client");
  const subscription = subscriptions?.[0];

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3">
            <Building2 className="h-7 w-7 text-blue-700" />
            <div>
              <p className="text-xs font-bold uppercase text-blue-700">{productNames[organization.type] ?? "Client workspace"}</p>
              <h1 className="text-2xl font-bold">{organization.name}</h1>
            </div>
          </div>
          <span className="border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold capitalize">{organization.status}</span>
        </header>

        <section className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4 border-b border-slate-200 pb-6 md:border-b-0 md:border-r md:pr-8">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-slate-500" />
              <h2 className="text-lg font-bold">Subscription</h2>
            </div>
            {subscription ? (
              <dl className="grid grid-cols-2 gap-x-5 gap-y-4 text-sm">
                <dt className="text-slate-500">Plan</dt><dd className="font-semibold">{subscription.plan_name}</dd>
                <dt className="text-slate-500">Annual amount</dt><dd className="font-semibold">{formatMoney(subscription.amount)}</dd>
                <dt className="text-slate-500">Status</dt><dd className="font-semibold capitalize">{subscription.status}</dd>
                <dt className="text-slate-500">Term ends</dt><dd className="font-semibold">{formatAdminDate(subscription.next_billing_date)}</dd>
              </dl>
            ) : <p className="text-sm text-slate-500">No subscription is currently linked to this organization.</p>}
            <p className="text-sm text-slate-600">For billing changes or renewal, contact your Waves account representative at {organization.email || "your registered contact email"}.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-slate-500" />
              <h2 className="text-lg font-bold">Workspace members ({members?.length ?? 0})</h2>
            </div>
            {!members?.length ? <p className="text-sm text-slate-500">No members are linked to this workspace.</p> : (
              <ul className="divide-y divide-slate-200">
                {members.map((member) => (
                  <li key={member.user_id} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <span className="font-medium capitalize">{member.role}</span>
                    <span className="font-mono text-xs text-slate-500">{member.user_id}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}