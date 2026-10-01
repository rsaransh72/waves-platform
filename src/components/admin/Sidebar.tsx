"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { Search } from "lucide-react";
import { adminNavigation } from "@/lib/admin-navigation";
import { useAdminStore } from "@/store/adminStore";

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen, organizations, subscriptions, tickets, invoices, auditLogs, pages } = useAdminStore();

  const getDynamicBadge = (href: string) => {
    switch (href) {
      case '/admin/organizations': return Object.keys(organizations.data).length || undefined;
      case '/admin/subscriptions': return Object.keys(subscriptions.data).length || undefined;
      case '/admin/support': return Object.keys(tickets.data).length || undefined;
      case '/admin/billing': return Object.keys(invoices.data).length || undefined; // Billing contains invoices
      case '/admin/audit': return Object.keys(auditLogs.data).length || undefined;
      case '/admin/pages': return Object.keys(pages.data).length || undefined;
      default: return undefined;
    }
  };

  const navItems = adminNavigation.filter(item => !item.isBottom).map(item => ({ ...item, badge: getDynamicBadge(item.href) || item.badge }));
  const bottomNavItems = adminNavigation.filter(item => item.isBottom).map(item => ({ ...item, badge: getDynamicBadge(item.href) || item.badge }));

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <aside className={clsx(
        "fixed left-0 top-0 z-40 h-screen w-64 bg-slate-900 flex flex-col justify-between text-slate-300 shadow-xl transition-transform duration-300 ease-in-out md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Brand Header */}
        <div className="flex h-16 shrink-0 items-center px-6 bg-slate-950/50">
          <div className="flex items-center gap-3 text-white">
            <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center shadow-sm">
              <span className="font-bold text-sm text-white">W</span>
            </div>
            <span className="font-bold text-lg tracking-tight">Waves Admin</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pt-6 pb-2 shrink-0">
          <div className="px-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search menu..." 
                className="w-full bg-slate-800/50 border border-slate-700 rounded py-2 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-4" style={{ scrollbarWidth: 'none' }}>
          <nav className="space-y-1">
            {navItems.map((item) => {
              // Exact match for dashboard, prefix match for others
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`)) || (item.href !== '/admin' && pathname === item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  prefetch={false}
                  className={clsx(
                    "flex items-center justify-between gap-3 px-3 py-2 rounded text-sm font-medium transition-all group",
                    isActive 
                      ? "bg-blue-600 text-white shadow-sm" 
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={clsx("h-4 w-4", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200")} />
                    {item.label}
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full bg-blue-700 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

      <div className="px-4 py-6 border-t border-slate-800 bg-slate-900 shrink-0">
        <nav className="space-y-1">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`));
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                prefetch={false}
                className={clsx(
                  "flex items-center justify-between gap-3 px-3 py-2 rounded text-sm font-medium transition-all group",
                  isActive 
                    ? "bg-blue-600 text-white shadow-sm" 
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={clsx("h-4 w-4", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200")} />
                  {item.label}
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-full bg-blue-700 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="mt-6 flex items-center gap-3 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50 cursor-pointer hover:bg-slate-800 transition-colors">
          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
            AD
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-semibold text-white truncate">Admin User</span>
            <span className="text-xs text-slate-400 truncate">Platform Administrator</span>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
}
