"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import { SchoolHeader } from "@/components/school/SchoolHeader";
import { SchoolSidebar } from "@/components/school/SchoolSidebar";
import { SchoolSessionProvider, type SchoolSession } from "@/components/school/SchoolSessionContext";

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
          <main className="flex-1 overflow-x-hidden p-4 md:p-6 flex flex-col print:p-0">
            <div className="w-full flex-1 flex flex-col min-h-0">{children}</div>
          </main>
        </div>
      </div>
    </SchoolSessionProvider>
  );
}
