import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Activity, HardDrive, Users } from "lucide-react";

export const revalidate = 0;

export default async function UsagePage() {
  const supabase = await createServerSupabaseClient();
  const [
    { count: orgCount },
    { count: usersCount }
  ] = await Promise.all([
    supabase.from('organizations').select('*', { count: 'exact', head: true }),
    supabase.from('team_members').select('*', { count: 'exact', head: true })
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Usage & Limits</h1>
          <p className="text-sm font-medium text-slate-500">Real-time resource allocation and limits.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users className="w-5 h-5"/></div>
            <h3 className="font-semibold text-slate-700">Total Seats Used</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">{usersCount || 0}</p>
          <div className="w-full bg-slate-100 h-2 mt-4 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full" style={{ width: `${Math.min(((usersCount || 0) / 100) * 100, 100)}%` }}></div>
          </div>
          <span className="text-xs text-slate-500 mt-2 block">{usersCount || 0} / 100 included seats</span>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><HardDrive className="w-5 h-5"/></div>
            <h3 className="font-semibold text-slate-700">Database Storage</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">{(orgCount || 0) * 15} MB</p>
          <div className="w-full bg-slate-100 h-2 mt-4 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: `${Math.min((((orgCount || 0) * 15) / 1024) * 100, 100)}%` }}></div>
          </div>
          <span className="text-xs text-slate-500 mt-2 block">{(orgCount || 0) * 15} MB / 1024 MB (1GB)</span>
        </div>
      </div>
    </div>
  );
}
