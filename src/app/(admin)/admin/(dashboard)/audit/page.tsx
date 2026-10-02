import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { formatAdminDateTime } from "@/lib/admin-format";
import { auditActor, auditArea, describeAuditLog, type AuditLogRow } from "@/lib/audit-format";
import { AuditExportButton } from "@/components/admin/AuditExportButton";

export const metadata = { title: "Audit Logs | Waves Admin" };
export const revalidate = 0;

const PAGE_SIZE = 50;
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
];

// Every change made in the admin console or by the database, newest first.
export default async function AuditLogsPage({ searchParams }: { searchParams: Promise<{ area?: string; actor?: string; page?: string }> }) {
  const { area = "", actor = "", page = "1" } = await searchParams;
  const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("audit_logs")
    .select("id, action, resource_type, resource_id, organization_id, actor_email, details, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((pageNumber - 1) * PAGE_SIZE, pageNumber * PAGE_SIZE - 1);
  if (area) query = query.eq("resource_type", area);
  if (actor.trim()) query = query.ilike("actor_email", `%${actor.trim()}%`);
  const { data, count, error } = await query;
  if (error) console.error("Error fetching audit logs:", error);

  const logs = (data ?? []) as AuditLogRow[];
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));
  const pageHref = (next: number) => `/admin/audit?${new URLSearchParams({ ...(area ? { area } : {}), ...(actor ? { actor } : {}), page: String(next) })}`;
  const rows = logs.map((log) => ({
    when: formatAdminDateTime(log.created_at),
    who: auditActor(log),
    area: auditArea(log.resource_type),
    what: describeAuditLog(log),
  }));

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Audit log</h1>
          <p className="text-sm text-slate-500">Every change to clients, billing, leads and website content, and who made it. Entries cannot be edited or deleted.</p>
        </div>
        <AuditExportButton rows={rows} />
      </div>

      <form className="flex flex-wrap items-end gap-3" action="/admin/audit">
        <label className="text-xs font-bold text-slate-600">
          Area
          <select name="area" defaultValue={area} className="mt-1 block rounded border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-900">
            {AREA_FILTERS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <label className="text-xs font-bold text-slate-600">
          Person (email)
          <input name="actor" defaultValue={actor} placeholder="e.g. admin@" className="mt-1 block w-60 rounded border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-900" />
        </label>
        <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">Apply</button>
        {(area || actor) && <Link href="/admin/audit" className="px-2 py-2 text-sm font-semibold text-blue-600 hover:underline">Clear</Link>}
      </form>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Who</th>
              <th className="px-4 py-3">Area</th>
              <th className="px-4 py-3">What happened</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-12 text-center text-slate-500">{area || actor ? "No entries match these filters." : "No activity recorded yet."}</td></tr>
            ) : logs.map((log, index) => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 whitespace-nowrap text-slate-500">{rows[index].when}</td>
                <td className="px-4 py-3 text-slate-700">{rows[index].who}</td>
                <td className="px-4 py-3"><span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">{rows[index].area}</span></td>
                <td className="px-4 py-3">
                  <Link href={`/admin/audit/${log.id}`} className="text-slate-900 hover:text-blue-700 hover:underline">{rows[index].what}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>{count ?? 0} entries · page {pageNumber} of {totalPages}</span>
        <div className="flex gap-2">
          {pageNumber > 1 && <Link href={pageHref(pageNumber - 1)} className="rounded border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50">Newer</Link>}
          {pageNumber < totalPages && <Link href={pageHref(pageNumber + 1)} className="rounded border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50">Older</Link>}
        </div>
      </div>
    </div>
  );
}
