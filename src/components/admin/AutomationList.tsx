"use client";

import { useEffect, useState, useMemo } from "react";
import { Zap, Edit2, Trash2, Plus, Power, PowerOff } from "lucide-react";
import { clsx } from "clsx";
import { createClient } from "@/lib/supabase-browser";
import { useAdminStore } from "@/store/adminStore";
import { toast } from "sonner";
import { DataTable } from "./DataTable";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export function AutomationList({ initialData }: { initialData: any[] }) {
  const { automationRules, setAutomationRules, removeAutomationRule } = useAdminStore();
  
  useEffect(() => {
    setAutomationRules(initialData);
  }, [initialData, setAutomationRules]);

  const rulesData = useMemo(() => Object.values(automationRules.data), [automationRules.data]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove rule "${name}"?`)) return;

    removeAutomationRule(id);
    toast.success(`Removed ${name}`);
    
    try {
      const supabase = createClient();
      const { error } = await supabase.from("automation_rules").delete().eq("id", id);
      if (error) throw error;
    } catch (err: any) {
      toast.error(`Error removing rule: ${err.message}`);
    }
  };

  const handleToggleActive = async (id: string, currentState: boolean) => {
    const newState = !currentState;
    try {
      const supabase = createClient();
      const { error } = await supabase.from("automation_rules").update({ is_active: newState }).eq("id", id);
      if (error) throw error;
      toast.success(`Rule ${newState ? 'enabled' : 'disabled'}`);
    } catch(err: any) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Rule Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.original.name}</span>
          <span className="text-xs text-slate-500">{row.original.description || "No description"}</span>
        </div>
      ),
    },
    {
      accessorKey: "trigger_event",
      header: "Trigger Event",
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 border border-purple-200 uppercase tracking-wide">
          <Zap className="w-3 h-3 mr-1" />
          {row.original.trigger_event}
        </span>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions Setup",
      cell: ({ row }) => {
        const actionCount = row.original.actions ? row.original.actions.length : 0;
        return (
          <span className="text-sm font-medium text-slate-600">
            {actionCount} step{actionCount === 1 ? '' : 's'}
          </span>
        )
      },
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => (
        <button 
          onClick={() => handleToggleActive(row.original.id, row.original.is_active)}
          className={clsx(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold capitalize transition-colors",
            row.original.is_active ? 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100' : 'text-slate-500 bg-slate-100 border-slate-200 hover:bg-slate-200'
          )}
        >
          {row.original.is_active ? <Power className="w-3 h-3" /> : <PowerOff className="w-3 h-3" />}
          {row.original.is_active ? 'Active' : 'Disabled'}
        </button>
      ),
    },
    {
      id: "manage",
      header: () => <div className="text-right">Manage</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <Link 
            href={`/admin/automations/${row.original.id}`}
            title="Edit Rule"
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </Link>
          <button 
            onClick={() => handleDelete(row.original.id, row.original.name)}
            title="Remove Rule"
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    }
  ];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="flex-1 min-h-0 w-full">
        <DataTable 
          title={
            <div className="flex flex-col">
              <h1 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-purple-600" />
                Automation Rules Engine
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Automate your business workflows</p>
            </div>
          }
          actions={
            <Link 
              href="/admin/automations/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-purple-700 shadow-md shadow-purple-600/20"
            >
              <Plus className="h-4 w-4" />
              Create Rule
            </Link>
          }
          columns={columns} 
          data={rulesData} 
          searchKey="name" 
          disablePagination={true}
        />
      </div>
    </div>
  );
}
