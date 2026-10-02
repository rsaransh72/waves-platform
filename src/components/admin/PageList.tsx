"use client";

import { useEffect, useMemo } from "react";
import { FileText, Globe, Lock, ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import { useAdminStore } from "@/store/adminStore";
import { DataTable } from "./DataTable";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { formatDate } from "@/lib/india";

export function PageList({ initialPages }: { initialPages: any[] }) {
  const { pages, setPages } = useAdminStore();
  
  useEffect(() => {
    setPages(initialPages);
  }, [initialPages, setPages]);

  const pagesData = useMemo(() => Object.values(pages.data), [pages.data]);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-400" />
          <span className="font-bold text-slate-900">{row.original.title}</span>
        </div>
      ),
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ row }) => <span className="font-medium text-slate-500 font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">{row.original.slug}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={clsx(
          "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold capitalize",
          row.original.status === 'published' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-slate-600 bg-slate-100 border-slate-200'
        )}>
          {row.original.status === 'published' ? <Globe className="w-3 h-3"/> : <Lock className="w-3 h-3"/>}
          {row.original.status}
        </span>
      ),
    },
    {
      id: "website",
      header: "On website",
      cell: ({ row }) => {
        const hasContent = Array.isArray(row.original.blocks) && row.original.blocks.some((block: { heading?: string; body?: string }) => block?.heading?.trim() || block?.body?.trim());
        if (row.original.status !== "published") return <span className="text-xs text-slate-500">Not published</span>;
        if (!hasContent) return <span className="text-xs font-semibold text-amber-700">Empty – not shown until you add content</span>;
        return <a href={`/${row.original.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue-600 hover:underline">/{row.original.slug} ↗</a>;
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => (
        <span className="font-medium text-slate-500">
          {formatDate(row.original.created_at)}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <Link 
            href={`/admin/pages/${row.original.slug}`}
            title="Edit Page"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
          >
            Edit <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      ),
    }
  ];

  return (
    <div className="flex-1 min-h-0 w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <DataTable 
        columns={columns} 
        data={pagesData} 
        searchKey="title" 
        disablePagination={true}
        filters={[
          {
            key: "status",
            label: "All Statuses",
            options: [
              { label: "Published", value: "published" },
              { label: "Draft", value: "draft" }
            ]
          }
        ]}
      />
    </div>
  );
}
