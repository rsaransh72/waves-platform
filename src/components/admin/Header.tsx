"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, ChevronRight, Menu, Package, PhoneCall, Plus, Rocket, Search } from "lucide-react";
import { RealtimeStatusIndicator } from "./RealtimeStatusIndicator";
import { adminNavigation } from "@/lib/admin-navigation";
import { useAdminStore } from "@/store/adminStore";
import type { AdminShellData } from "@/lib/admin-shell";

const CREATE_ACTIONS = [
  { label: "Add a lead", description: "Phone, email or walk-in enquiry", href: "/admin/leads?new=1", icon: PhoneCall },
  { label: "Onboard a client", description: "Create an account and invite its admin", href: "/admin/onboarding", icon: Rocket },
  { label: "Add a product", description: "A new product for the website", href: "/admin/products/new", icon: Package },
];

export function Header({ counts }: AdminShellData) {
  const pathname = usePathname();
  const toggleSidebar = useAdminStore((state) => state.toggleSidebar);
  const [createOpen, setCreateOpen] = useState(false);
  const createRef = useRef<HTMLDivElement>(null);

  const currentNav = adminNavigation.find((item) => pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`)));
  const pendingLeads = counts.newLeads + counts.dueFollowUps;

  useEffect(() => {
    if (!createOpen) return;
    const close = (event: MouseEvent) => {
      if (createRef.current && !createRef.current.contains(event.target as Node)) setCreateOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [createOpen]);

  const openCommandPalette = () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }));
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6">
      <div className="flex items-center gap-4">
        <button type="button" onClick={toggleSidebar} aria-label="Open menu" className="md:hidden text-slate-500 hover:text-slate-700 transition-colors">
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden md:flex items-center text-sm font-medium text-slate-500">
          <Link href="/admin" className="hover:text-slate-900 transition-colors">Admin</Link>
          {currentNav && currentNav.href !== "/admin" && (
            <>
              <ChevronRight className="h-4 w-4 mx-1 flex-shrink-0" />
              <Link href={currentNav.href} className="text-slate-900 font-semibold truncate max-w-[200px]">{currentNav.label}</Link>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={openCommandPalette}
          className="hidden md:flex items-center gap-2 text-sm text-slate-400 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 hover:bg-slate-100 hover:text-slate-600 transition-all w-64 shadow-inner"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="hidden lg:inline-flex items-center gap-1 rounded bg-slate-200 px-1.5 font-mono text-[10px] font-medium text-slate-500">Ctrl K</kbd>
        </button>
        <button type="button" onClick={openCommandPalette} aria-label="Search" className="md:hidden text-slate-500 hover:text-slate-700">
          <Search className="h-5 w-5" />
        </button>

        <div className="h-6 w-px bg-gray-200 hidden sm:block" />

        <RealtimeStatusIndicator />

        <div ref={createRef} className="relative hidden sm:block">
          <button
            type="button"
            onClick={() => setCreateOpen((open) => !open)}
            aria-expanded={createOpen}
            className="flex items-center gap-2 rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden lg:inline">Create</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          {createOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
              {CREATE_ACTIONS.map(({ label, description, href, icon: Icon }) => (
                <Link key={href} href={href} onClick={() => setCreateOpen(false)} className="flex items-start gap-3 rounded-md px-3 py-2.5 hover:bg-slate-50">
                  <Icon className="mt-0.5 h-4 w-4 text-blue-600" />
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">{label}</span>
                    <span className="block text-xs text-slate-500">{description}</span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link
          href="/admin/leads"
          className="relative text-slate-500 hover:text-slate-700 transition-colors"
          title={pendingLeads ? `${counts.newLeads} new leads, ${counts.dueFollowUps} follow-ups due` : "No leads waiting"}
          aria-label={`Leads waiting: ${pendingLeads}`}
        >
          <Bell className="h-5 w-5" />
          {pendingLeads > 0 && (
            <span className="absolute -right-2 -top-2 min-w-[18px] rounded-full bg-red-500 px-1 text-center text-[10px] font-bold leading-[18px] text-white">{pendingLeads}</span>
          )}
        </Link>
      </div>
    </header>
  );
}
