import Link from "next/link";
import { ChevronLeft, ChevronRight, History, Search } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { formatAdminDateTime, formatRelative } from "@/lib/admin-format";
import { schoolToday } from "@/lib/school-date";
import { auditActor, auditArea, describeAuditLog, type AuditLogRow } from "@/lib/audit-format";
import { AuditExportButton } from "@/components/admin/AuditExportButton";
import { Avatar, Badge, Banner, EmptyState, PageHeader, PageSheet, adminInput, button, td, th } from "@/components/admin/ui";

export const metadata = { title: "Audit Logs | Waves Admin" };
export const revalidate = 0;

const PAGE_SIZE = 50;
const DAY_MS = 86_400_000;
const AREA_FILTERS = [
  { value: "", label: "All areas" },
  { value: "organizations", label: "Clients" },
  { value: "organization_members", label: "Client users" },
  { value: "subscriptions", label: "Subscriptions" },
  { value: "invoices", label: "Invoices" },
  { value: "leads", label: "Leads" },
  { value: "products", label: "Products" },
  { value: "services", label: "Services" },
  { value: "pages", label: "Pages" },
  { value: "team_members", label: "Platform team" },
  { value: "settings", label: "Settings" },
];

// Colour by what kind of record changed, so the list can be scanned.
const AREA_TONES: Record<string, "blue" | "amber" | "violet" | "red" | "green" | "slate"> = {
  organizations: "blue", organization_members: "blue", subscriptions: "green", invoices: "green",
  leads: "amber", lead_notes: "amber",
  products: "violet", services: "violet", pages: "violet", menus: "violet", suites: "violet", marketplaceitems: "violet",
  team_members: "red", settings: "slate",
};

const isDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime());
// Dates are Indian calendar days: from 00:00 IST on `from` to the end of `to`.
const istStart = (date: string) => new Date(`${date}T00:00:00+05:30`);

type AuditSearch = { area?: string; actor?: string; from?: string; to?: string; page?: string };

// Every change made in the admin console or by the database, newest first.
export default async function AuditLogsPage({ searchParams }: { searchParams: Promise<AuditSearch> }) {
  const { area = "", actor = "", from = "", to = "", page = "1" } = await searchParams;
  const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);
  const today = schoolToday();
  const person = actor.trim().slice(0, 100);

  // Filters arrive in the URL, so they are checked here; a bad range is reported, not run.
  const filterErrors = [
    from && !isDate(from) ? "The From date is not a valid date." : null,
    to && !isDate(to) ? "The To date is not a valid date." : null,
    from && to && isDate(from) && isDate(to) && from > to ? "The From date is after the To date. Swap them or pick a new range." : null,
    from && isDate(from) && from > today ? "The From date is in the future, so nothing can match." : null,
  ].filter(Boolean) as string[];
  const useDates = filterErrors.length === 0;
  const knownArea = AREA_FILTERS.some((option) => option.value === area) ? area : "";

  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("audit_logs")
    .select("id, action, resource_type, resource_id, organization_id, actor_email, details, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((pageNumber - 1) * PAGE_SIZE, pageNumber * PAGE_SIZE - 1);
  if (knownArea) query = query.eq("resource_type", knownArea);
  if (person) query = query.ilike("actor_email", `%${person.replace(/[%_]/g, "\\$&")}%`);
  if (useDates && from) query = query.gte("created_at", istStart(from).toISOString());
  if (useDates && to) query = query.lt("created_at", new Date(istStart(to).getTime() + DAY_MS).toISOString());
  const { data, count, error } = await query;
  if (error) console.error("Error fetching audit logs:", error);

  const logs = (data ?? []) as AuditLogRow[];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const filtered = Boolean(knownArea || person || from || to);
  const params = { ...(knownArea ? { area: knownArea } : {}), ...(person ? { actor: person } : {}), ...(from ? { from } : {}), ...(to ? { to } : {}) };
  const pageHref = (next: number) => `/admin/audit?${new URLSearchParams({ ...params, page: String(next) })}`;
  const rows = logs.map((log) => ({
    when: formatAdminDateTime(log.created_at),
    who: auditActor(log),
    area: auditArea(log.resource_type),
    what: describeAuditLog(log),
  }));
  const first = total === 0 ? 0 : (pageNumber - 1) * PAGE_SIZE + 1;
  const last = Math.min(pageNumber * PAGE_SIZE, total);

  return (
    <PageSheet>
      <PageHeader
        title="Audit log"
        description="Every change to clients, billing, leads, the website and the team, and who made it. Entries cannot be edited or deleted."
        actions={<AuditExportButton rows={rows} />}
      />

      <form action="/admin/audit" className="flex flex-wrap items-end gap-3 border-b border-slate-200 bg-slate-50/70 px-4 py-3 md:px-6">
        <label className="w-full text-xs font-medium text-slate-600 sm:w-44">
          Area
          <select name="area" defaultValue={knownArea} className={`${adminInput} mt-1`}>
            {AREA_FILTERS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <label className="w-full text-xs font-medium text-slate-600 sm:w-64">
          Person
          <span className="relative mt-1 block">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input type="search" name="actor" defaultValue={person} maxLength={100} placeholder="Email contains…" className={`${adminInput} pl-9`} />
          </span>
        </label>
        <label className="w-[calc(50%-6px)] text-xs font-medium text-slate-600 sm:w-40">
          From
          <input type="date" name="from" defaultValue={from} max={today} className={`${adminInput} mt-1 ${from && !useDates ? "!border-red-500" : ""}`} />
        </label>
        <label className="w-[calc(50%-6px)] text-xs font-medium text-slate-600 sm:w-40">
          To
          <input type="date" name="to" defaultValue={to} max={today} className={`${adminInput} mt-1 ${to && !useDates ? "!border-red-500" : ""}`} />
        </label>
        <div className="flex gap-2">
          <button type="submit" className={button.primary}>Apply</button>
          {filtered && <Link href="/admin/audit" className={button.ghost}>Clear filters</Link>}
        </div>
      </form>

      {(filterErrors.length > 0 || error) && (
        <div className="space-y-2 px-4 pt-4 md:px-6">
          {filterErrors.length > 0 && (
            <Banner tone="error" role="alert" title="The date range was not applied">
              <ul className="list-disc pl-4">{filterErrors.map((message) => <li key={message}>{message}</li>)}</ul>
            </Banner>
          )}
          {error && <Banner tone="error" role="alert" title="The audit log could not be loaded">Refresh the page. If this keeps happening, check the database connection.</Banner>}
        </div>
      )}

      <div className="flex-1 overflow-x-auto lg:overflow-visible">
        <table className="w-full min-w-[880px] text-sm">
          <thead>
            <tr>
              <th className={`${th} w-48 md:pl-6`}>When</th>
              <th className={`${th} w-64`}>Who</th>
              <th className={`${th} w-44`}>Area</th>
              <th className={th}>What happened</th>
              <th className={`${th} w-12 md:pr-6`}><span className="sr-only">Open</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log, index) => (
              <tr key={log.id} className="group transition-colors hover:bg-slate-50/80">
                <td className={`${td} whitespace-nowrap md:pl-6`}>
                  <div className="text-[13px] text-slate-900">{rows[index].when}</div>
                  <div className="text-xs text-slate-400">{formatRelative(log.created_at)}</div>
                </td>
                <td className={td}>
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Avatar size="sm" name={rows[index].who} />
                    <span className="truncate text-[13px] text-slate-700" title={rows[index].who}>{rows[index].who}</span>
                  </div>
                </td>
                <td className={td}><Badge tone={AREA_TONES[log.resource_type ?? ""] ?? "slate"}>{rows[index].area}</Badge></td>
                <td className={td}>
                  <Link href={`/admin/audit/${log.id}`} className="text-[13px] text-slate-900 group-hover:text-blue-700 hover:underline">{rows[index].what}</Link>
                </td>
                <td className={`${td} text-right md:pr-6`}>
                  <Link href={`/admin/audit/${log.id}`} aria-label="Open entry" className="inline-flex h-7 w-7 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && !error && (
          <EmptyState icon={History} title={pageNumber > totalPages ? "This page is past the end" : filtered ? "No entries match these filters" : "No activity recorded yet"}>
            {pageNumber > totalPages
              ? <Link href={pageHref(1)} className="font-medium text-blue-600 hover:underline">Go to the newest entries</Link>
              : filtered ? <>Try a wider date range or another area, or <Link href="/admin/audit" className="font-medium text-blue-600 hover:underline">clear the filters</Link>.</> : "Changes made in the admin console appear here."}
          </EmptyState>
        )}
      </div>

      <footer className="sticky -bottom-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 text-[13px] text-slate-500 md:-bottom-6 md:px-6">
        <span>
          {total === 0 ? "No entries" : <>Showing <span className="font-medium text-slate-900">{first}–{last}</span> of <span className="font-medium text-slate-900">{total.toLocaleString("en-IN")}</span> entries</>}
        </span>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">Page {Math.min(pageNumber, totalPages)} of {totalPages}</span>
          {pageNumber > 1
            ? <Link href={pageHref(Math.min(pageNumber - 1, totalPages))} className={`${button.secondary} h-8 px-3`}><ChevronLeft className="h-4 w-4" /> Newer</Link>
            : <span className={`${button.secondary} h-8 cursor-not-allowed px-3 opacity-40`} aria-disabled><ChevronLeft className="h-4 w-4" /> Newer</span>}
          {pageNumber < totalPages
            ? <Link href={pageHref(pageNumber + 1)} className={`${button.secondary} h-8 px-3`}>Older <ChevronRight className="h-4 w-4" /></Link>
            : <span className={`${button.secondary} h-8 cursor-not-allowed px-3 opacity-40`} aria-disabled>Older <ChevronRight className="h-4 w-4" /></span>}
        </div>
      </footer>
    </PageSheet>
  );
}
