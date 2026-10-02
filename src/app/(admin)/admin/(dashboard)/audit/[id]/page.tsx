import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { formatAdminDateTime } from "@/lib/admin-format";
import { auditActor, auditArea, describeAuditLog, type AuditLogRow } from "@/lib/audit-format";

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

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      <div className="flex items-start gap-4">
        <Link href="/admin/audit" aria-label="Back to audit log" className="rounded-lg border border-slate-200 bg-white p-2 hover:bg-slate-50">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{auditArea(log.resource_type)}</p>
          <h1 className="text-xl font-bold text-slate-900">{describeAuditLog(log)}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {auditActor(log)} · {formatAdminDateTime(log.created_at)}{log.ip_address ? ` · ${log.ip_address}` : ""}
          </p>
          {log.organization_id && (
            <Link href={`/admin/organizations/${log.organization_id}`} className="mt-2 inline-block text-sm font-semibold text-blue-600 hover:underline">Open client</Link>
          )}
        </div>
      </div>

      {isRowChange && (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 w-48">Field</th>
                <th className="px-4 py-3">Before</th>
                <th className="px-4 py-3">After</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fields.map((field) => (
                <tr key={field.key} className={field.changed ? "bg-amber-50/60" : ""}>
                  <td className="px-4 py-2.5 font-medium text-slate-700">{field.key.replaceAll("_", " ")}</td>
                  <td className="px-4 py-2.5 break-all text-slate-500">{display(field.before)}</td>
                  <td className={`px-4 py-2.5 break-all ${field.changed ? "font-semibold text-slate-900" : "text-slate-500"}`}>{display(field.after)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-slate-100 px-4 py-2 text-xs text-slate-500">Highlighted rows changed.</p>
        </div>
      )}

      {otherDetails.length > 0 && (
        <dl className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-white p-5 sm:grid-cols-2">
          {otherDetails.map(([key, value]) => (
            <div key={key}>
              <dt className="text-xs font-bold uppercase text-slate-400">{key.replaceAll("_", " ")}</dt>
              <dd className="break-all text-sm text-slate-800">{display(value)}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
