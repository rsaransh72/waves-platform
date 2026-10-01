import { createServerSupabaseClient } from "@/lib/supabase-server";
import { formatAdminDateTime } from "@/lib/admin-format";
import { Database, Activity } from "lucide-react";

export const revalidate = 0;

export default async function SystemPage() {
  const supabase = await createServerSupabaseClient();
  const { data: logs } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Health & Activity</h1>
          <p className="text-sm font-medium text-slate-500">Monitor database events and real-time audit logs.</p>
        </div>
      </div>
      
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" /> Recent System Events
          </h3>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div> DB Connected
          </span>
        </div>
        
        <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
          {!logs || logs.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No system events recorded yet.</div>
          ) : (
            logs.map(log => (
              <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4 text-sm">
                <Database className="w-5 h-5 text-slate-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-slate-900 font-medium">
                    <span className="uppercase text-xs font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded mr-2">
                      {log.action}
                    </span>
                    {log.entity} <span className="text-slate-500 font-normal">({log.entity_id})</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatAdminDateTime(log.created_at)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
