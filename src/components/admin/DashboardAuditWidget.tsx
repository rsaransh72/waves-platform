"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { ShieldAlert, Key, CreditCard, User, Building, Server } from "lucide-react";
import Link from "next/link";
import { formatAdminDateTime } from "@/lib/admin-format";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

export function DashboardAuditWidget({ initialLogs }: { initialLogs: any[] }) {
  const [logs, setLogs] = useState<any[]>(initialLogs);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const channel = supabase.channel('audit_logs_widget')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'audit_logs' }, (payload) => {
        setLogs(prev => [payload.new, ...prev].slice(0, 5));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getActionIcon = (action: string) => {
    if (action.includes('login') || action.includes('auth')) return <Key className="w-3.5 h-3.5 text-purple-500" />;
    if (action.includes('payment') || action.includes('invoice')) return <CreditCard className="w-3.5 h-3.5 text-emerald-500" />;
    if (action.includes('user') || action.includes('student')) return <User className="w-3.5 h-3.5 text-blue-500" />;
    if (action.includes('organization')) return <Building className="w-3.5 h-3.5 text-amber-500" />;
    if (action.includes('system') || action.includes('backup')) return <Server className="w-3.5 h-3.5 text-gray-500" />;
    return <ShieldAlert className="w-3.5 h-3.5 text-gray-400" />;
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-slate-400" />
          Live Activity Feed
        </h3>
        <Link href="/admin/audit" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
          View All &rarr;
        </Link>
      </div>
      
      <div className="flex-1 overflow-auto p-0">
        {logs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">No recent activity detected.</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {logs.map((log) => (
              <li key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0 mt-0.5">
                  {getActionIcon(log.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {log.action.replace(/\./g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </p>
                    <span className="text-[11px] text-slate-500 whitespace-nowrap">
                      {formatAdminDateTime(log.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {log.actor_email || 'System'} &bull; {log.resource_type}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
