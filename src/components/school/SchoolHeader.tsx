"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { SCHOOL_ROLE_LABELS } from "@/lib/school-permissions";
import { useSchoolSession } from "@/components/school/SchoolSessionContext";

export function SchoolHeader({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const router = useRouter();
  const session = useSchoolSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const signOut = async () => {
    setIsSigningOut(true);
    await createClient().auth.signOut();
    router.replace("/school/login");
    router.refresh();
  };

  const displayName = session?.name || session?.email || "Signed in";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8 print:hidden">
      <button type="button" onClick={onOpenSidebar} className="-m-2.5 p-2.5 text-slate-700 md:hidden">
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-700 md:hidden">{session?.schoolName}</div>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <div className="max-w-56 truncate text-sm font-semibold text-slate-900" title={session?.email}>{displayName}</div>
          {session && <div className="text-xs text-slate-500">{SCHOOL_ROLE_LABELS[session.role]}</div>}
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700" aria-hidden="true">
          {initial}
        </div>
        <button
          type="button"
          onClick={() => void signOut()}
          disabled={isSigningOut}
          className="inline-flex items-center gap-1.5 rounded border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{isSigningOut ? "Signing out..." : "Sign out"}</span>
        </button>
      </div>
    </header>
  );
}
