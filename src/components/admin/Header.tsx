"use client";

import { Bell, Menu, Plus, ChevronDown, Search, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RealtimeStatusIndicator } from "./RealtimeStatusIndicator";
import { adminNavigation } from "@/lib/admin-navigation";
import { useEffect, useState } from "react";

import { useAdminStore } from "@/store/adminStore";

export function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const toggleSidebar = useAdminStore((state) => state.toggleSidebar);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine current page title from navigation config
  let currentNav = adminNavigation.find(n => pathname === n.href || (n.href !== '/admin' && pathname.startsWith(`${n.href}/`)));
  if (!currentNav && pathname === '/admin') {
    currentNav = adminNavigation.find(n => n.href === '/admin');
  }

  const triggerCommandPalette = () => {
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="md:hidden text-slate-500 hover:text-slate-700 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        {/* Breadcrumbs */}
        <div className="hidden md:flex items-center text-sm font-medium text-slate-500">
          <Link href="/admin" className="hover:text-slate-900 transition-colors">
            Admin
          </Link>
          {mounted && currentNav && currentNav.href !== '/admin' && (
            <>
              <ChevronRight className="h-4 w-4 mx-1 flex-shrink-0" />
              <Link href={currentNav.href} className="text-slate-900 font-semibold truncate max-w-[200px]">
                {currentNav.label}
              </Link>
            </>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Global Search Trigger */}
        <button 
          onClick={triggerCommandPalette}
          className="hidden md:flex items-center gap-2 text-sm text-slate-400 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 hover:bg-slate-100 hover:text-slate-600 transition-all w-64 shadow-inner"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="hidden lg:inline-flex items-center gap-1 rounded bg-slate-200 px-1.5 font-mono text-[10px] font-medium text-slate-500">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>

        <button 
          onClick={triggerCommandPalette}
          className="md:hidden text-slate-500 hover:text-slate-700"
        >
          <Search className="h-5 w-5" />
        </button>

        <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

        <RealtimeStatusIndicator />
        
        <div className="hidden sm:flex">
          <Link href="/admin/products/new" className="flex items-center gap-2 rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 shadow-sm">
            <Plus className="h-4 w-4" />
            <span className="hidden lg:inline">Create</span>
          </Link>
        </div>
        
        <button className="relative text-slate-500 hover:text-slate-700 transition-colors">
          <Bell className="h-5 w-5" />
        </button>
        
        <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1.5 rounded transition-colors">
          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-200">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}
