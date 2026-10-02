"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { LayoutDashboard, Users, BookOpen, Clock, Settings, GraduationCap, CreditCard, FileText, Bell, Library, CalendarDays, Bus, ShieldCheck } from "lucide-react";
import { canViewSchoolArea, type SchoolArea } from "@/lib/school-permissions";
import { useSchoolSession } from "@/components/school/SchoolSessionContext";

const schoolNavigation: Array<{ label: string; href: string; icon: typeof LayoutDashboard; area: SchoolArea }> = [
  { label: "Dashboard", href: "/school", icon: LayoutDashboard, area: "dashboard" },
  { label: "Students", href: "/school/students", icon: GraduationCap, area: "students" },
  { label: "Teachers", href: "/school/teachers", icon: Users, area: "teachers" },
  { label: "Classes & Subjects", href: "/school/classes", icon: BookOpen, area: "classes" },
  { label: "Attendance", href: "/school/attendance", icon: Clock, area: "attendance" },
  { label: "Exams & Grades", href: "/school/exams", icon: FileText, area: "exams" },
  { label: "Fee Structures", href: "/school/fees", icon: CreditCard, area: "feeStructures" },
  { label: "Fee Collection", href: "/school/fees/collection", icon: CreditCard, area: "fees" },
  { label: "Communications", href: "/school/communications", icon: Bell, area: "communications" },
  { label: "Library", href: "/school/library", icon: Library, area: "library" },
  { label: "Timetable", href: "/school/timetable", icon: CalendarDays, area: "timetable" },
  { label: "Transport", href: "/school/transport", icon: Bus, area: "transport" },
];

const adminNavigation: Array<{ label: string; href: string; icon: typeof LayoutDashboard; area: SchoolArea }> = [
  { label: "Users & Access", href: "/school/users", icon: ShieldCheck, area: "users" },
  { label: "School Settings", href: "/school/settings", icon: Settings, area: "settings" },
];

function NavLink({ item, pathname, onNavigate }: { item: typeof schoolNavigation[number]; pathname: string; onNavigate: () => void }) {
  // Fee Structures (/school/fees) must not stay highlighted on /school/fees/collection.
  const isActive = pathname === item.href
    || (item.href !== "/school" && item.href !== "/school/fees" && pathname.startsWith(`${item.href}/`));
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={clsx(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
        isActive ? "bg-blue-600 text-white shadow-sm" : "text-slate-300 hover:text-white hover:bg-slate-800"
      )}
    >
      <Icon className={clsx("h-[18px] w-[18px]", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200")} />
      {item.label}
    </Link>
  );
}

export function SchoolSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const session = useSchoolSession();
  const role = session?.role ?? "member";
  const visibleNavigation = schoolNavigation.filter((item) => canViewSchoolArea(role, item.area));
  const visibleAdminNavigation = adminNavigation.filter((item) => canViewSchoolArea(role, item.area));

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside className={clsx(
        "fixed left-0 top-0 z-40 h-screen w-64 bg-slate-900 flex flex-col justify-between text-slate-300 shadow-xl transition-transform duration-300 ease-in-out md:translate-x-0 print:hidden",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 shrink-0 items-center px-6 bg-slate-950/50">
          <div className="flex min-w-0 items-center gap-3 text-white">
            <div className="h-8 w-8 shrink-0 rounded bg-blue-600 flex items-center justify-center shadow-sm">
              <span className="font-bold text-sm text-white">{(session?.schoolName ?? "S").charAt(0).toUpperCase()}</span>
            </div>
            <span className="truncate font-bold text-base tracking-tight" title={session?.schoolName}>{session?.schoolName ?? "School ERP"}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <nav className="space-y-1">
            {visibleNavigation.map((item) => <NavLink key={item.href} item={item} pathname={pathname} onNavigate={onClose} />)}
          </nav>
        </div>

        {visibleAdminNavigation.length > 0 && (
          <div className="px-4 py-4 border-t border-slate-800 bg-slate-900 shrink-0 space-y-1">
            {visibleAdminNavigation.map((item) => <NavLink key={item.href} item={item} pathname={pathname} onNavigate={onClose} />)}
          </div>
        )}
      </aside>
    </>
  );
}
