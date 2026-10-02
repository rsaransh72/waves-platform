"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label = "Print" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
    >
      <Printer className="h-4 w-4" /> {label}
    </button>
  );
}
