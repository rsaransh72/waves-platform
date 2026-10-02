"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { formatAdminDateTime } from "@/lib/admin-format";
import { auditActor, auditArea, describeAuditLog, type AuditLogRow } from "@/lib/audit-format";

// Latest changes across the platform, updated live. Uses the signed-in admin's
// session: audit logs are visible to platform administrators only.
export function DashboardAuditWidget({ initialLogs }: { initialLogs: AuditLogRow[] }) {
  const [logs, setLogs] = useState<AuditLogRow[]>(initialLogs);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("audit_logs_widget")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "audit_logs" }, (payload) => {
        setLogs((previous) => [payload.new as AuditLogRow, ...previous].slice(0, 6));
      })
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, []);

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 p-5">
        <h2 className="flex items-center gap-2 font-bold text-slate-800"><History className="h-4 w-4 text-slate-400" /> Recent activity</h2>
        <Link href="/admin/audit" className="text-sm font-medium text-blue-600 hover:text-blue-700">Audit log &rarr;</Link>
      </div>
      {logs.length === 0 ? (
        <p className="p-6 text-sm text-slate-500">No activity yet.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {logs.map((log) => (
            <li key={log.id} className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3">
              <span className="min-w-0 text-sm text-slate-800">
                <span className="mr-2 rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600">{auditArea(log.resource_type)}</span>
                {describeAuditLog(log)}
              </span>
              <span className="text-xs text-slate-400">{auditActor(log)} · {formatAdminDateTime(log.created_at)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
