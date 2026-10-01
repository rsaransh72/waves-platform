import { Package, Briefcase, FileText, Building, Users, PhoneCall, TrendingUp, ShieldAlert, Zap } from "lucide-react";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { DashboardAuditWidget } from "@/components/admin/DashboardAuditWidget";

export const revalidate = 0; // Always fetch fresh data

export default async function AdminDashboard() {
  const supabase = await createServerSupabaseClient();
  // Fetch real metrics from Supabase
  const [
    { count: organizationsCount }, 
    { count: activeOrganizationsCount }, 
    { count: leadsCount }, 
    { count: productsCount }, 
    { count: suitesCount },
    { count: auditCount },
    { data: recentLogs }
  ] = await Promise.all([
    supabase.from('organizations').select('*', { count: 'exact', head: true }),
    supabase.from('organizations').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('suites').select('*', { count: 'exact', head: true }),
    supabase.from('audit_logs').select('*', { count: 'exact', head: true }),
    supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(5)
  ]);

  const stats = [
    { name: "Total Organizations", value: organizationsCount?.toString() || "0", change: "+2", icon: Building, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Active Organizations", value: activeOrganizationsCount?.toString() || "0", change: "+1", icon: Zap, color: "text-emerald-600", bg: "bg-emerald-50" },
    { name: "New Leads", value: leadsCount?.toString() || "0", change: "+5", icon: PhoneCall, color: "text-orange-600", bg: "bg-orange-50" },
    { name: "Active Products", value: productsCount?.toString() || "0", change: "0", icon: Package, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Platform Overview</h1>
        <p className="text-sm text-slate-500">Mission control for the Waves Platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-200 group">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-500">{stat.name}</span>
                  <span className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</span>
                </div>
                <div className={`rounded-lg p-3 ${stat.bg}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-600">{stat.change}</span>
                <span className="text-xs text-slate-500 ml-1">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Actions & Activity) */}
        <div className="lg:col-span-2 space-y-6 flex flex-col h-full">
          {/* Quick Actions */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: "Onboard Client", icon: Building, href: "/admin/onboarding" },
                { name: "New User", icon: Users, href: "/admin/users?new=true" },
                { name: "New Product", icon: Package, href: "/admin/products/new" },
              ].map((action, i) => {
                const Icon = action.icon;
                return (
                  <Link href={action.href} key={i} className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm font-bold text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm">
                    <Icon className="h-6 w-6 mb-1" />
                    {action.name}
                  </Link>
                )
              })}
            </div>
          </div>
          
          <div className="flex-1 min-h-[300px]">
            <DashboardAuditWidget initialLogs={recentLogs || []} />
          </div>
        </div>
        
        {/* System Health / Status */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 flex flex-col h-full">
            <h3 className="font-bold text-slate-800 mb-4">System Health</h3>
            
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-emerald-100 bg-emerald-50/50">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-sm font-semibold text-slate-700">Database</span>
                </div>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-1 rounded">Operational</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border border-emerald-100 bg-emerald-50/50">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-sm font-semibold text-slate-700">Realtime</span>
                </div>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-1 rounded">Operational</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border border-emerald-100 bg-emerald-50/50">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-sm font-semibold text-slate-700">Audit Logs</span>
                </div>
                <span className="text-xs font-medium text-slate-600">{auditCount || 0} Events</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100">
              <Link href="/admin/system" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View detailed metrics &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
