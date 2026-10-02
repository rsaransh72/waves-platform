"use client";

import { Download } from "lucide-react";
import { button } from "@/components/admin/ui";

type Row = { when: string; who: string; area: string; what: string };

function csvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

// Downloads the entries currently shown (this page, with the active filters).
export function AuditExportButton({ rows }: { rows: Row[] }) {
  const download = () => {
    const lines = [["When", "Who", "Area", "What happened"], ...rows.map((row) => [row.when, row.who, row.area, row.what])]
      .map((line) => line.map(csvCell).join(","));
    const blob = new Blob([`﻿${lines.join("\n")}`], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <button type="button" onClick={download} disabled={rows.length === 0} title="Downloads the entries on this page, with the current filters" className={button.secondary}>
      <Download className="h-4 w-4" /> <span className="hidden sm:inline">Export CSV</span>
    </button>
  );
}
