import { createServerSupabaseClient } from "@/lib/supabase-server";
import { formatMoney } from "@/lib/money";
import { Activity, TrendingUp, Users, DollarSign } from "lucide-react";

export const revalidate = 0;

export default async function AnalyticsPage() {
  const supabase = await createServerSupabaseClient();
  const [
    { count: orgCount },
    { count: activeOrgCount },
    { count: leadsCount },
    { data: subs }
  ] = await Promise.all([
    supabase.from('organizations').select('*', { count: 'exact', head: true }),
    supabase.from('organizations').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('subscriptions').select('amount').eq('status', 'active')
  ]);

  const mrr = subs?.reduce((sum, sub) => sum + Number(sub.amount), 0) || 0;
  const conversionRate = leadsCount && orgCount ? Math.round((orgCount / leadsCount) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Platform Analytics</h1>
          <p className="text-sm font-medium text-slate-500">Real-time global business metrics from the database.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><DollarSign className="w-5 h-5"/></div>
            <h3 className="font-semibold text-slate-700">MRR</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">{formatMoney(mrr)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Users className="w-5 h-5"/></div>
            <h3 className="font-semibold text-slate-700">Total Customers</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">{orgCount || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Activity className="w-5 h-5"/></div>
            <h3 className="font-semibold text-slate-700">Active Rate</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {orgCount ? Math.round(((activeOrgCount || 0) / orgCount) * 100) : 0}%
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><TrendingUp className="w-5 h-5"/></div>
            <h3 className="font-semibold text-slate-700">Lead Conversion</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">{conversionRate}%</p>
        </div>
      </div>
    </div>
  );
}
