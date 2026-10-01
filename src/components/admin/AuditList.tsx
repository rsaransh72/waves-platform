"use client";

import { useEffect, useMemo } from "react";
import { Activity, ArrowRight, Database, User } from "lucide-react";
import { clsx } from "clsx";
import { useAdminStore } from "@/store/adminStore";
import { DataTable } from "./DataTable";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { formatAdminDateTime } from "@/lib/admin-format";

export function AuditList({ initialLogs }: { initialLogs: any[] }) {
  const { auditLogs, setAuditLogs } = useAdminStore();
  
  useEffect(() => {
    setAuditLogs(initialLogs);
  }, [initialLogs, setAuditLogs]);

  const logsData = useMemo(() => Object.values(auditLogs.data).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()), [auditLogs.data]);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const action = row.original.action as string;
        const color = action === 'CREATE' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                      action === 'UPDATE' ? 'text-blue-700 bg-blue-50 border-blue-200' :
                      action === 'DELETE' ? 'text-red-700 bg-red-50 border-red-200' :
                      'text-slate-700 bg-slate-50 border-slate-200';
        return (
          <span className={clsx("inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase", color)}>
            {action}
          </span>
        );
      },
    },
    {
      accessorKey: "entity",
      header: "Entity",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-700 capitalize">{row.original.entity.replace('_', ' ')}</span>
        </div>
      ),
    },
    {
      accessorKey: "entity_id",
      header: "Record ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded truncate max-w-[150px] inline-block">
          {row.original.entity_id}
        </span>
      ),
    },
    {
      accessorKey: "user_id",
      header: "Actor (User ID)",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-slate-500">
          <User className="w-3.5 h-3.5" />
          <span className="font-mono text-[10px] truncate max-w-[100px]">{row.original.user_id}</span>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Timestamp",
      cell: ({ row }) => (
        <span className="font-medium text-slate-500 text-xs">
          {formatAdminDateTime(row.original.created_at)}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <Link 
            href={`/admin/audit/${row.original.id}`}
            title="View Details"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-200 rounded transition-colors border border-slate-200"
          >
            Inspect <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      ),
    }
  ];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" />
            Security & Audit Logs
          </h1>
          <p className="text-sm font-medium text-slate-500">System-wide immutable ledger of all administrative actions.</p>
        </div>
      </div>
      
      <div className="flex-1 min-h-0 w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <DataTable 
          columns={columns} 
          data={logsData} 
          searchKey="entity" 
          disablePagination={true}
          filters={[
            {
              key: "action",
              label: "All Actions",
              options: [
                { label: "CREATE", value: "CREATE" },
                { label: "UPDATE", value: "UPDATE" },
                { label: "DELETE", value: "DELETE" }
              ]
            }
          ]}
        />
      </div>
    </div>
  );
}
