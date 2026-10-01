"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { LayoutDashboard, Users, BookOpen, Clock, Settings, GraduationCap, CreditCard, FileText, Bell, Library, CalendarDays, Bus } from "lucide-react";
import { useState } from "react";

const schoolNavigation = [
  { label: "Dashboard", href: "/school", icon: LayoutDashboard },
  { label: "Students", href: "/school/students", icon: GraduationCap },
  { label: "Teachers", href: "/school/teachers", icon: Users },
  { label: "Classes & Subjects", href: "/school/classes", icon: BookOpen },
  { label: "Attendance", href: "/school/attendance", icon: Clock },
  { label: "Exams & Grades", href: "/school/exams", icon: FileText },
  { label: "Fee Structures", href: "/school/fees", icon: CreditCard },
  { label: "Fee Collection", href: "/school/fees/collection", icon: CreditCard },
  { label: "Communications", href: "/school/communications", icon: Bell },
  { label: "Library", href: "/school/library", icon: Library },
  { label: "Timetable", href: "/school/timetable", icon: CalendarDays },
  { label: "Transport", href: "/school/transport", icon: Bus },
];

export function SchoolSidebar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
              <span className="font-bold text-sm text-white">S</span>
            </div>
            <span className="font-bold text-lg tracking-tight">School ERP</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <nav className="space-y-1">
            {schoolNavigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/school' && pathname.startsWith(`${item.href}/`));
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                    isActive 
                      ? "bg-blue-600 text-white shadow-sm" 
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  )}
                >
                  <Icon className={clsx("h-[18px] w-[18px]", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Settings */}
        <div className="px-4 py-6 border-t border-slate-800 bg-slate-900 shrink-0">
          <Link
            href="/school/settings"
            className={clsx(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
              pathname.startsWith('/school/settings') ? "bg-blue-600 text-white shadow-sm" : "text-slate-300 hover:text-white hover:bg-slate-800"
            )}
          >
            <Settings className={clsx("h-[18px] w-[18px]", pathname.startsWith('/school/settings') ? "text-white" : "text-slate-400 group-hover:text-slate-200")} />
            School Settings
          </Link>
        </div>
      </aside>
    </>
  );
}
