import { createServerSupabaseClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { formatAdminDateTime } from "@/lib/admin-format";
import { ArrowLeft, Database, User, Clock, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

export const revalidate = 0;

export default async function AuditLogDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: log, error } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !log) {
    return notFound();
  }

  const actionColor = log.action === 'CREATE' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                      log.action === 'UPDATE' ? 'text-blue-700 bg-blue-50 border-blue-200' :
                      log.action === 'DELETE' ? 'text-red-700 bg-red-50 border-red-200' :
                      'text-slate-700 bg-slate-50 border-slate-200';

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/audit" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-slate-400" />
            Audit Log Event
          </h1>
          <p className="text-sm text-slate-500 font-mono mt-1">ID: {log.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Col - Details */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800">Event Metadata</h3>
            </div>
            <div className="p-5 space-y-5">
              
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Action Type</label>
                <div className="mt-1">
                  <span className={clsx("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold uppercase", actionColor)}>
                    {log.action}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Entity</label>
                <div className="mt-1 flex items-center gap-2 text-slate-900 font-medium capitalize">
                  <Database className="w-4 h-4 text-slate-400" />
                  {log.entity.replace('_', ' ')}
                </div>
                <div className="mt-1 font-mono text-xs bg-slate-100 p-1.5 rounded text-slate-600 break-all">
                  {log.entity_id}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Actor (User ID)</label>
                <div className="mt-1 flex items-center gap-2 text-slate-900 font-medium">
                  <User className="w-4 h-4 text-slate-400" />
                  System / Admin
                </div>
                <div className="mt-1 font-mono text-xs bg-slate-100 p-1.5 rounded text-slate-600 break-all">
                  {log.user_id}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Timestamp</label>
                <div className="mt-1 flex items-center gap-2 text-slate-900 text-sm">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {formatAdminDateTime(log.created_at)}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Col - Diff Viewer */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">State Diff Viewer</h3>
              <span className="text-xs font-mono text-slate-500">JSON Format</span>
            </div>
            
            <div className="flex-1 p-0 grid grid-cols-2 divide-x divide-slate-200 min-h-[400px]">
              
              {/* Previous State */}
              <div className="flex flex-col">
                <div className="px-4 py-2 bg-red-50 border-b border-red-100 text-xs font-bold text-red-800 uppercase tracking-wider">
                  Previous State
                </div>
                <div className="p-4 flex-1 bg-slate-900 text-red-400 font-mono text-xs overflow-auto">
                  {log.previous_value ? (
                    <pre>{JSON.stringify(log.previous_value, null, 2)}</pre>
                  ) : (
                    <div className="text-slate-600 italic">No previous state (NULL)</div>
                  )}
                </div>
              </div>

              {/* New State */}
              <div className="flex flex-col">
                <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  New State
                </div>
                <div className="p-4 flex-1 bg-slate-900 text-emerald-400 font-mono text-xs overflow-auto">
                  {log.new_value ? (
                    <pre>{JSON.stringify(log.new_value, null, 2)}</pre>
                  ) : (
                    <div className="text-slate-600 italic">No new state (NULL)</div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
