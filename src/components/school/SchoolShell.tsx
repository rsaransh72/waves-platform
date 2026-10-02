"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import { SchoolHeader } from "@/components/school/SchoolHeader";
import { SchoolSidebar } from "@/components/school/SchoolSidebar";
import { SchoolSessionProvider, type SchoolSession } from "@/components/school/SchoolSessionContext";
import { formatPhone, phoneHref } from "@/lib/india";

export function SchoolShell({ session, children }: { session: SchoolSession | null; children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthPage = pathname === "/school/login"
    || pathname === "/school/signup"
    || pathname === "/school/accept-invite";

  if (isAuthPage || !session) {
    return (
      <>
        <Toaster position="top-right" richColors />
        {children}
      </>
    );
  }

  return (
    <SchoolSessionProvider session={session}>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 print:bg-white">
        <Toaster position="top-right" richColors />
        <SchoolSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex flex-col md:pl-64 print:pl-0">
          <SchoolHeader onOpenSidebar={() => setSidebarOpen(true)} />
          {session.billing && (
            <div role="status" className={`border-b px-4 py-2.5 text-sm md:px-6 print:hidden ${session.billing.tone === "overdue" ? "border-red-200 bg-red-50 text-red-900" : "border-amber-200 bg-amber-50 text-amber-900"}`}>
              <span className="font-semibold">{session.billing.tone === "overdue" ? "Payment overdue. " : "Plan ending soon. "}</span>
              {session.billing.message}
              {session.billing.phone && <> Call Waves on <a href={phoneHref(session.billing.phone)} className="font-semibold underline">{formatPhone(session.billing.phone)}</a>.</>}
            </div>
          )}
          <main className="flex-1 overflow-x-hidden p-4 md:p-6 flex flex-col print:p-0">
            <div className="w-full flex-1 flex flex-col min-h-0">{children}</div>
          </main>
        </div>
      </div>
    </SchoolSessionProvider>
  );
}
