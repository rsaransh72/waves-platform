import Link from "next/link";
import { AlertTriangle, Building, CalendarClock, CheckCircle2, CircleDashed, IndianRupee, Package, PhoneCall, Rocket } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { DashboardAuditWidget } from "@/components/admin/DashboardAuditWidget";
import { formatMoney } from "@/lib/money";
import { formatAdminDate } from "@/lib/admin-format";
import { schoolToday } from "@/lib/school-date";
import { INQUIRY_LABELS, LEAD_STATUS_LABELS, OPEN_LEAD_STATUSES, type LeadStatus } from "@/lib/lead-pipeline";

export const revalidate = 0;

function isoFromNow(days: number) {
  return new Date(Date.now() + days * 86_400_000).toISOString();
}

export default async function AdminDashboard() {
  const supabase = await createServerSupabaseClient();
  const today = schoolToday();
  const now = isoFromNow(0);
  const in30Days = isoFromNow(30);

  const [
    { data: openLeads },
    { count: activeClients },
    { data: renewals },
    { data: unpaidInvoices },
    { data: settingsRow },
    { data: publishedProducts },
    { data: pages },
    { data: recentLogs },
  ] = await Promise.all([
    supabase.from("leads").select("id, name, organization_name, status, inquiry_type, next_follow_up, created_at").in("status", OPEN_LEAD_STATUSES).order("created_at", { ascending: false }),
    supabase.from("organizations").select("id", { count: "exact", head: true }).in("status", ["active", "trial"]),
    supabase.from("subscriptions").select("id, organization_id, organization_name, plan_name, amount, next_billing_date, status").in("status", ["active", "trialing", "past_due"]).lte("next_billing_date", in30Days).order("next_billing_date"),
    supabase.from("invoices").select("amount").in("status", ["pending", "failed"]),
    supabase.from("settings").select("value").eq("key", "site_general").maybeSingle(),
    supabase.from("products").select("title, pricing").eq("status", "published"),
    supabase.from("pages").select("slug, blocks").eq("status", "published"),
    supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  const leads = (openLeads ?? []) as Array<{ id: string; name: string; organization_name: string | null; status: LeadStatus; inquiry_type: string | null; next_follow_up: string | null; created_at: string }>;
  const needsAction = leads.filter((lead) => lead.status === "new" || (lead.next_follow_up !== null && lead.next_follow_up <= today));
  const newLeads = leads.filter((lead) => lead.status === "new").length;
  const outstanding = (unpaidInvoices ?? []).reduce((total, invoice) => total + Number(invoice.amount ?? 0), 0);

  const site = (settingsRow?.value ?? {}) as Record<string, string>;
  const unpricedProducts = (publishedProducts ?? []).filter((product) => !Array.isArray(product.pricing) || product.pricing.length === 0).map((product) => product.title);
  const pagesWithContent = new Set((pages ?? []).filter((page) => Array.isArray(page.blocks) && page.blocks.length > 0).map((page) => page.slug));
  // Each check reflects real configuration, so the list shows what is left before launch.
  const checklist = [
    { label: "Company phone and email on the website", done: Boolean(site.phone && site.sales_email), href: "/admin/settings" },
    {
      label: unpricedProducts.length ? `Pricing plans for ${unpricedProducts.join(", ")}` : "Pricing plans for every published product",
      done: (publishedProducts?.length ?? 0) > 0 && unpricedProducts.length === 0,
      href: "/admin/products",
    },
    { label: "About page written", done: pagesWithContent.has("about"), href: "/admin/pages" },
    { label: "Terms and Privacy pages written", done: pagesWithContent.has("terms") && pagesWithContent.has("privacy"), href: "/admin/pages" },
    { label: "Invitation emails can be sent (service-role key)", done: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY), href: null },
    { label: "Lead and renewal emails (Resend)", done: Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL), href: null },
    { label: "Daily renewal job secret (CRON_SECRET)", done: Boolean(process.env.CRON_SECRET), href: null },
  ];
  const remaining = checklist.filter((item) => !item.done).length;

  const stats = [
    { name: "Leads waiting", value: String(needsAction.length), detail: `${newLeads} new, ${needsAction.length - newLeads} follow-ups due`, icon: PhoneCall, color: "text-orange-600", bg: "bg-orange-50", href: "/admin/leads" },
    { name: "Active clients", value: String(activeClients ?? 0), detail: "Active or on trial", icon: Building, color: "text-blue-600", bg: "bg-blue-50", href: "/admin/organizations" },
    { name: "Renewals in 30 days", value: String(renewals?.length ?? 0), detail: "Including expired, not yet renewed", icon: CalendarClock, color: "text-purple-600", bg: "bg-purple-50", href: "/admin/subscriptions" },
    { name: "Unpaid invoices", value: formatMoney(outstanding), detail: `${unpaidInvoices?.length ?? 0} invoices`, icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-50", href: "/admin/billing" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Today</h1>
        <p className="text-sm text-slate-500">What needs attention across sales, clients and billing.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ name, value, detail, icon: Icon, color, bg, href }) => (
          <Link key={name} href={href} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-500">{name}</span>
                <span className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">{value}</span>
              </div>
              <div className={`rounded-lg p-3 ${bg}`}><Icon className={`h-6 w-6 ${color}`} /></div>
            </div>
            <p className="mt-3 text-xs text-slate-500">{detail}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <h2 className="font-bold text-slate-800">Leads to call</h2>
              <Link href="/admin/leads" className="text-sm font-medium text-blue-600 hover:text-blue-700">All leads &rarr;</Link>
            </div>
            {needsAction.length === 0 ? (
              <p className="p-6 text-sm text-slate-500">Nothing waiting. New website enquiries appear here.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {needsAction.slice(0, 6).map((lead) => (
                  <li key={lead.id}>
                    <Link href="/admin/leads" className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 hover:bg-slate-50">
                      <span>
                        <span className="block text-sm font-semibold text-slate-900">{lead.organization_name || lead.name}</span>
                        <span className="block text-xs text-slate-500">{INQUIRY_LABELS[lead.inquiry_type ?? "demo"] ?? "Enquiry"} · {LEAD_STATUS_LABELS[lead.status]}</span>
                      </span>
                      <span className="text-xs font-semibold text-red-600">
                        {lead.status === "new" ? `New since ${formatAdminDate(lead.created_at)}` : `Follow up ${formatAdminDate(`${lead.next_follow_up}T12:00:00Z`)}`}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <h2 className="font-bold text-slate-800">Renewals coming up</h2>
              <Link href="/admin/subscriptions" className="text-sm font-medium text-blue-600 hover:text-blue-700">All subscriptions &rarr;</Link>
            </div>
            {!renewals?.length ? (
              <p className="p-6 text-sm text-slate-500">No subscription ends in the next 30 days.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {renewals.slice(0, 6).map((subscription) => {
                  const expired = subscription.next_billing_date && subscription.next_billing_date < now;
                  return (
                    <li key={subscription.id}>
                      <Link href={`/admin/organizations/${subscription.organization_id}`} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 hover:bg-slate-50">
                        <span>
                          <span className="block text-sm font-semibold text-slate-900">{subscription.organization_name}</span>
                          <span className="block text-xs text-slate-500">{subscription.plan_name} · {formatMoney(subscription.amount)} / year</span>
                        </span>
                        <span className={`text-xs font-semibold ${expired ? "text-red-600" : "text-amber-700"}`}>
                          {expired ? "Expired " : "Ends "}{formatAdminDate(subscription.next_billing_date)}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <div className="min-h-[300px]">
            <DashboardAuditWidget initialLogs={recentLogs || []} />
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
            <h2 className="font-bold text-slate-800 mb-4">Quick actions</h2>
            <div className="grid grid-cols-1 gap-3">
              {[
                { name: "Add a lead", icon: PhoneCall, href: "/admin/leads?new=1" },
                { name: "Onboard a client", icon: Rocket, href: "/admin/onboarding" },
                { name: "Edit products and pricing", icon: Package, href: "/admin/products" },
              ].map(({ name, icon: Icon, href }) => (
                <Link key={href} href={href} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all">
                  <Icon className="h-4 w-4" /> {name}
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
            <h2 className="font-bold text-slate-800">Launch checklist</h2>
            <p className="mt-1 mb-4 text-xs text-slate-500">{remaining === 0 ? "Everything is set up." : `${remaining} item${remaining === 1 ? "" : "s"} left.`}</p>
            <ul className="space-y-3">
              {checklist.map((item) => {
                const content = (
                  <span className="flex items-start gap-2 text-sm">
                    {item.done ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> : item.href ? <CircleDashed className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />}
                    <span className={item.done ? "text-slate-500" : "text-slate-800"}>{item.label}{!item.done && !item.href && <span className="block text-xs text-slate-500">Set on the server (hosting environment).</span>}</span>
                  </span>
                );
                return <li key={item.label}>{item.href && !item.done ? <Link href={item.href} className="hover:underline">{content}</Link> : content}</li>;
              })}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
