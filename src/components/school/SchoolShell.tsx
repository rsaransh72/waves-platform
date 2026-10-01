"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import { SchoolHeader } from "@/components/school/SchoolHeader";
import { SchoolSidebar } from "@/components/school/SchoolSidebar";

export function SchoolShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/school/login"
    || pathname === "/school/signup"
    || pathname === "/school/accept-invite";

  if (isAuthPage) {
    return (
      <>
        <Toaster position="top-right" richColors />
        {children}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Toaster position="top-right" richColors />
      <SchoolSidebar />
      <div className="flex flex-col md:pl-64">
        <SchoolHeader />
        <main className="flex-1 overflow-x-hidden p-4 md:p-6 flex flex-col">
          <div className="w-full flex-1 flex flex-col min-h-0">{children}</div>
        </main>
      </div>
    </div>
  );
}