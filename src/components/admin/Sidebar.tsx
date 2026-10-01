"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { LogOut, Search } from "lucide-react";
import { adminNavigation, type AdminNavigationItem } from "@/lib/admin-navigation";
import { useAdminStore } from "@/store/adminStore";
import { createClient } from "@/lib/supabase-browser";
import type { AdminShellData } from "@/lib/admin-shell";

function initials(name: string) {
  const parts = name.replace(/@.*/, "").split(/[\s._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "A") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function Sidebar({ admin, counts }: AdminShellData) {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen } = useAdminStore();
  const [query, setQuery] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);

  const badges: Record<string, number> = { "/admin/leads": counts.newLeads + counts.dueFollowUps };
  const needle = query.trim().toLowerCase();
  const matches = (item: AdminNavigationItem) =>
    !needle || [item.label, item.section, item.description].some((value) => value?.toLowerCase().includes(needle));

  const mainItems = adminNavigation.filter((item) => !item.isBottom && matches(item));
  const bottomItems = adminNavigation.filter((item) => item.isBottom && matches(item));

  const signOut = async () => {
    setIsSigningOut(true);
    await createClient().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  };

  const renderItem = (item: AdminNavigationItem) => {
    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
    const Icon = item.icon;
    const badge = badges[item.href];
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setSidebarOpen(false)}
        title={item.description}
        className={clsx(
          "flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all group",
          isActive ? "bg-blue-600 text-white shadow-sm" : "text-slate-300 hover:text-white hover:bg-slate-800"
        )}
      >
        <span className="flex items-center gap-3">
          <Icon className={clsx("h-4 w-4", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200")} />
          {item.label}
        </span>
        {badge ? (
          <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-[10px] font-bold text-white" title="New leads and follow-ups due">{badge}</span>
        ) : null}
      </Link>
    );
  };

  // Items keep their configured order; a heading is shown when the section changes.
  const sections: Array<{ section?: string; items: AdminNavigationItem[] }> = [];
  for (const item of mainItems) {
    const last = sections[sections.length - 1];
    if (last && last.section === item.section) last.items.push(item);
    else sections.push({ section: item.section, items: [item] });
  }

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={clsx(
        "fixed left-0 top-0 z-40 h-screen w-64 bg-slate-900 flex flex-col text-slate-300 shadow-xl transition-transform duration-300 ease-in-out md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 shrink-0 items-center px-6 bg-slate-950/50">
          <Link href="/admin" className="flex items-center gap-3 text-white">
            <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center shadow-sm">
              <span className="font-bold text-sm text-white">W</span>
            </div>
            <span className="font-bold text-lg tracking-tight">Waves Admin</span>
          </Link>
        </div>

        <div className="px-4 pt-5 pb-2 shrink-0">
          <label className="relative block">
            <span className="sr-only">Search menu</span>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search menu..."
              className="w-full bg-slate-800/50 border border-slate-700 rounded py-2 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-4" style={{ scrollbarWidth: "none" }}>
          <nav className="space-y-4 pt-2">
            {sections.map(({ section, items }, index) => (
              <div key={`${section ?? "top"}-${index}`} className="space-y-1">
                {section && <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">{section}</p>}
                {items.map(renderItem)}
              </div>
            ))}
            {mainItems.length === 0 && bottomItems.length === 0 && <p className="px-3 text-xs text-slate-500">No matching pages.</p>}
          </nav>
        </div>

        <div className="px-4 py-4 border-t border-slate-800 bg-slate-900 shrink-0">
          {bottomItems.length > 0 && <nav className="space-y-1 mb-4">{bottomItems.map(renderItem)}</nav>}
          <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
              {initials(admin.name)}
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-sm font-semibold text-white truncate" title={admin.email}>{admin.name}</span>
              <span className="text-xs text-slate-400 truncate capitalize">{admin.role === "superadmin" ? "Super administrator" : admin.role}</span>
            </div>
            <button
              type="button"
              onClick={() => void signOut()}
              disabled={isSigningOut}
              title="Sign out"
              aria-label="Sign out"
              className="rounded p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
