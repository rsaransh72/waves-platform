"use client";

import { useEffect, useState, useMemo } from "react";
import { Edit2, Trash2, Plus, Flag, CheckCircle, XCircle } from "lucide-react";
import { clsx } from "clsx";
import { createClient } from "@/lib/supabase-browser";
import { useAdminStore } from "@/store/adminStore";
import { toast } from "sonner";
import { DataTable } from "./DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Drawer } from "./Drawer";
import { FeatureFlagEditor } from "./FeatureFlagEditor";

export function FeatureFlagList({ initialFlags }: { initialFlags: any[] }) {
  const { featureFlags, setFeatureFlags, removeFeatureFlag, updateFeatureFlag } = useAdminStore();
  
  useEffect(() => {
    setFeatureFlags(initialFlags);
  }, [initialFlags, setFeatureFlags]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState<any | null>(null);

  const flagData = useMemo(() => Object.values(featureFlags.data), [featureFlags.data]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete flag "${name}"?`)) return;

    removeFeatureFlag(id);
    toast.success(`Deleted ${name}`);
    
    try {
      const supabase = createClient();
      const { error } = await supabase.from("feature_flags").delete().eq("id", id);
      if (error) throw error;
    } catch (err: any) {
      toast.error(`Error deleting flag: ${err.message}`);
    }
  };

  const handleToggleState = async (id: string, currentEnabled: boolean) => {
    const newEnabled = !currentEnabled;
    updateFeatureFlag(id, { is_enabled: newEnabled });
    toast.success(`Flag ${newEnabled ? 'enabled' : 'disabled'}`);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("feature_flags").update({ is_enabled: newEnabled }).eq("id", id);
      if (error) throw error;
    } catch (err: any) {
      toast.error(`Error updating flag: ${err.message}`);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Flag Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.original.name}</span>
          <span className="text-xs font-medium text-slate-500 font-mono">{row.original.key}</span>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <span className="text-sm text-slate-600">{row.original.description || '-'}</span>,
    },
    {
      accessorKey: "is_enabled",
      header: "State",
      cell: ({ row }) => {
        const isEnabled = row.original.is_enabled;
        return (
          <button 
            onClick={() => handleToggleState(row.original.id, isEnabled)}
            className={clsx(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold shadow-sm transition-colors",
              isEnabled ? "text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100" : "text-slate-600 bg-slate-100 border-slate-300 hover:bg-slate-200"
            )}
          >
            {isEnabled ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
            {isEnabled ? 'Enabled' : 'Disabled'}
          </button>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => { setSelectedFlag(row.original); setIsDrawerOpen(true); }}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDelete(row.original.id, row.original.name)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    }
  ];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Feature Flags</h1>
          <p className="text-sm font-medium text-slate-500">Manage rollout of new features</p>
        </div>
        <button
          onClick={() => { setSelectedFlag(null); setIsDrawerOpen(true); }}
          className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Flag
        </button>
      </div>
      <div className="flex-1 min-h-0 w-full">
        <DataTable columns={columns} data={flagData} searchKey="name" disablePagination={true} />
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedFlag ? "Edit Feature Flag" : "New Feature Flag"}
      >
        {isDrawerOpen && (
          <FeatureFlagEditor 
            initialData={selectedFlag || {}} 
            isNew={!selectedFlag}
            onClose={() => setIsDrawerOpen(false)}
          />
        )}
      </Drawer>
    </div>
  );
}
