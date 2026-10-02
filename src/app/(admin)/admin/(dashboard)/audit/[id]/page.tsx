import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2 } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { formatAdminDateTime } from "@/lib/admin-format";
import { auditActor, auditArea, describeAuditLog, type AuditLogRow } from "@/lib/audit-format";
import { Avatar, FormSection, PageHeader, PageSheet, button } from "@/components/admin/ui";

export const revalidate = 0;

const IGNORED = new Set(["updated_at"]);

function display(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

// One audit entry: what changed, field by field, and who changed it.
export default async function AuditLogDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("id, action, resource_type, resource_id, organization_id, actor_email, details, ip_address, created_at")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) notFound();

  const log = data as AuditLogRow & { ip_address: string | null };
  const details = (typeof log.details === "string" ? JSON.parse(log.details) : log.details ?? {}) as Record<string, unknown>;
  const before = (details.previous_value ?? null) as Record<string, unknown> | null;
  const after = (details.new_value ?? null) as Record<string, unknown> | null;
  const isRowChange = before !== null || after !== null;
  const fields = Array.from(new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})]))
    .filter((key) => !IGNORED.has(key))
    .map((key) => ({ key, before: before?.[key], after: after?.[key], changed: JSON.stringify(before?.[key]) !== JSON.stringify(after?.[key]) }))
    .sort((left, right) => Number(right.changed) - Number(left.changed));
  const otherDetails = isRowChange ? [] : Object.entries(details);

  const changedCount = fields.filter((field) => field.changed).length;
  const meta: [string, React.ReactNode][] = [
    ["Area", auditArea(log.resource_type)],
    ["Changed by", <span key="who" className="inline-flex items-center gap-2"><Avatar size="sm" name={auditActor(log)} />{auditActor(log)}</span>],
    ["When", formatAdminDateTime(log.created_at)],
    ["Action", log.action.replaceAll("_", " ").toLowerCase()],
    ...(log.ip_address ? [["IP address", <span key="ip" className="font-mono text-[13px]">{log.ip_address}</span>] as [string, React.ReactNode]] : []),
  ];

  return (
    <PageSheet>
      <PageHeader
        backHref="/admin/audit"
        title={describeAuditLog(log)}
        description={`${auditArea(log.resource_type)} · ${formatAdminDateTime(log.created_at)}`}
        actions={log.organization_id ? <Link href={`/admin/organizations/${log.organization_id}`} className={button.secondary}><Building2 className="h-4 w-4" /> <span className="hidden sm:inline">Open client</span></Link> : undefined}
      />

      <div className="px-4 pb-12 md:px-8 xl:px-10">
        <div className="mx-auto max-w-[1180px]">
          <FormSection id="entry" title="Entry" columns="xl:grid-cols-2">
            {meta.map(([label, value]) => (
              <div key={label} className="grid gap-1 md:grid-cols-[160px_minmax(0,1fr)] md:gap-6">
                <p className="text-[13px] font-medium text-slate-500 md:text-right">{label}</p>
                <div className="text-sm font-medium text-slate-900">{value}</div>
              </div>
            ))}
          </FormSection>

          {isRowChange && (
            <section aria-labelledby="changes-title" className="py-8">
              <div className="mb-4 flex flex-wrap items-baseline gap-x-3">
                <h2 id="changes-title" className="!text-[15px] font-semibold text-slate-900">Changes</h2>
                <span className="text-xs text-slate-500">
                  {before && after ? `${changedCount} field${changedCount === 1 ? "" : "s"} changed, shown first` : before ? "Record deleted: its last values" : "Record created: its first values"}
                </span>
              </div>
              <div className="overflow-x-auto rounded border border-slate-200">
                <table className="w-full min-w-[640px] text-sm">
                  <thead className="bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="w-52 border-b border-slate-200 px-4 py-2.5">Field</th>
                      {before && <th className="border-b border-slate-200 px-4 py-2.5">Before</th>}
                      {after && <th className="border-b border-slate-200 px-4 py-2.5">After</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {fields.map((field) => {
                      const highlight = field.changed && before && after;
                      return (
                        <tr key={field.key} className={highlight ? "bg-amber-50/70" : ""}>
                          <td className="px-4 py-2.5 align-top text-[13px] font-medium text-slate-700">
                            <span className="flex items-center gap-2">
                              {highlight && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-label="Changed" />}
                              {field.key.replaceAll("_", " ")}
                            </span>
                          </td>
                          {before && <td className={`break-all px-4 py-2.5 align-top text-[13px] ${highlight ? "text-red-700 line-through decoration-red-300" : "text-slate-500"}`}>{display(field.before)}</td>}
                          {after && <td className={`break-all px-4 py-2.5 align-top text-[13px] ${highlight ? "font-medium text-emerald-800" : "text-slate-600"}`}>{display(field.after)}</td>}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {otherDetails.length > 0 && (
            <FormSection id="details" title="Details" columns="xl:grid-cols-2">
              {otherDetails.map(([key, value]) => (
                <div key={key} className="grid gap-1 md:grid-cols-[160px_minmax(0,1fr)] md:gap-6">
                  <p className="text-[13px] font-medium capitalize text-slate-500 md:text-right">{key.replaceAll("_", " ")}</p>
                  <p className="break-all text-sm text-slate-900">{display(value)}</p>
                </div>
              ))}
            </FormSection>
          )}
        </div>
      </div>
    </PageSheet>
  );
}
