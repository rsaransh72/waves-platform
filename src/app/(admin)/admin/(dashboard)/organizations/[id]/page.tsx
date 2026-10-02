import { createServerSupabaseClient } from "@/lib/supabase-server";
import { listMembers } from "@/lib/client-members";
import { notFound } from "next/navigation";
import { Activity, ArrowLeft, Building2, CreditCard, Users } from "lucide-react";
import Link from "next/link";
import { formatAdminDateTime } from "@/lib/admin-format";
import { auditActor, describeAuditLog, type AuditLogRow } from "@/lib/audit-format";
import { workspaceLabel } from "@/lib/product-workspaces";
import {
  ClientHeaderActions,
  InvoicesPanel,
  SubscriptionPanel,
  UsersPanel,
  type ClientMember,
} from "@/components/admin/ClientManagement";

export const revalidate = 0;

function daysUntil(value: string | null | undefined) {
  if (!value) return null;
  return Math.ceil((new Date(value).getTime() - Date.now()) / 86_400_000);
}

async function loadMembers(organizationId: string) {
  try {
    return { members: await listMembers(organizationId), directoryError: null };
  } catch (error) {
    console.error("Could not load client users:", error);
    return {
      members: [] as ClientMember[],
      directoryError: "Users could not be loaded. Check that SUPABASE_SERVICE_ROLE_KEY is configured on the server; invitations and resets also need it.",
    };
  }
}

export default async function OrganizationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", id)
    .single();

  if (orgError || !org) {
    return notFound();
  }

  const [subscriptionsResult, invoicesResult, activityResult] = await Promise.all([
    supabase.from("subscriptions").select("*").eq("organization_id", org.id).order("created_at", { ascending: false }),
    supabase.from("invoices").select("*").eq("organization_id", org.id).order("created_at", { ascending: false }),
    supabase
      .from("audit_logs")
      .select("id, action, resource_type, actor_email, details, created_at")
      .or(`organization_id.eq.${org.id},and(resource_type.eq.organizations,resource_id.eq.${org.id})`)
      .order("created_at", { ascending: false })
      .limit(30),
  ]);

  const subscription = subscriptionsResult.data?.[0] ?? null;
  const { members, directoryError } = await loadMembers(org.id);
  const activity = (activityResult.data ?? []) as AuditLogRow[];

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/organizations" className="rounded-lg border border-slate-200 bg-white p-2 transition-colors hover:bg-slate-50" aria-label="Back to clients">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
              <Building2 className="h-6 w-6 text-slate-400" />
              {org.name}
            </h1>
            <p className="text-sm text-slate-500">{workspaceLabel(org.type)} client · <span className="font-mono">{org.slug}</span></p>
          </div>
        </div>
        <ClientHeaderActions organization={org} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5"><h3 className="font-bold text-slate-800">Contact</h3></div>
            <dl className="space-y-3 p-5 text-sm">
              <div><dt className="text-xs font-bold uppercase text-slate-400">Email</dt><dd className="text-slate-900">{org.email || "Not set"}</dd></div>
              <div><dt className="text-xs font-bold uppercase text-slate-400">Phone</dt><dd className="text-slate-900">{org.phone || "Not set"}</dd></div>
              <div>
                <dt className="text-xs font-bold uppercase text-slate-400">Address</dt>
                <dd className="text-slate-900">{[org.address, org.city, org.state, org.pincode].filter(Boolean).join(", ") || "Not set"}</dd>
              </div>
            </dl>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 p-5">
              <CreditCard className="h-4 w-4 text-slate-400" />
              <h3 className="font-bold text-slate-800">Subscription</h3>
            </div>
            <SubscriptionPanel organizationId={org.id} subscription={subscription} daysLeft={daysUntil(subscription?.next_billing_date)} />
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <InvoicesPanel organizationId={org.id} invoices={invoicesResult.data ?? []} subscription={subscription} />
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <UsersPanel organizationId={org.id} members={members} directoryError={directoryError} />
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 p-5">
              <Activity className="h-4 w-4 text-slate-400" />
              <h3 className="font-bold text-slate-800">Activity</h3>
            </div>
            {activity.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">No recorded activity for this client yet.</div>
            ) : (
              <ol className="divide-y divide-slate-100">
                {activity.map((log) => (
                  <li key={log.id} className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3 text-sm">
                    <span className="text-slate-800">{describeAuditLog(log)}</span>
                    <span className="text-xs text-slate-400">{auditActor(log)} · {formatAdminDateTime(log.created_at)}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <p className="flex items-center gap-2 text-xs text-slate-400">
            <Users className="h-3.5 w-3.5" />
            Suspending the client or letting the term lapse blocks every user above from signing in to the product.
          </p>
        </div>
      </div>
    </div>
  );
}
