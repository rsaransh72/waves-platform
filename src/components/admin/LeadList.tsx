"use client";

import { useEffect, useState, useMemo } from "react";
import { Edit2, Trash2, Plus, Mail, Phone, Building } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { useAdminStore } from "@/store/adminStore";
import { toast } from "sonner";
import { DataTable } from "./DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Drawer } from "./Drawer";
import { LeadEditor } from "./LeadEditor";

export function LeadList({ initialData }: { initialData: any[] }) {
  const { leads, setLeads, removeLead } = useAdminStore();
  
  useEffect(() => {
    setLeads(initialData);
  }, [initialData, setLeads]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  const leadData = useMemo(() => Object.values(leads.data), [leads.data]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete lead "${name}"?`)) return;

    removeLead(id);
    toast.success(`Deleted ${name}`);
    
    try {
      const supabase = createClient();
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
    } catch (err: any) {
      toast.error(`Error deleting lead: ${err.message}`);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Lead",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.original.name}</span>
          {row.original.organization_name && <span className="text-xs text-slate-500 font-medium flex items-center gap-1"><Building className="h-3 w-3"/> {row.original.organization_name}</span>}
        </div>
      ),
    },
    {
      accessorKey: "contact",
      header: "Contact Info",
      cell: ({ row }) => (
        <div className="flex flex-col text-xs text-slate-500 font-medium space-y-0.5">
          <div className="flex items-center gap-1"><Mail className="h-3 w-3"/> {row.original.email}</div>
          <div className="flex items-center gap-1"><Phone className="h-3 w-3"/> {row.original.phone}</div>
        </div>
      ),
    },
    {
      accessorKey: "product",
      header: "Interest",
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700 border border-slate-200">
          {row.original.product}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.original.status;
        const color = 
          s === 'new' ? 'text-blue-700 bg-blue-50 border-blue-200' :
          s === 'contacted' ? 'text-amber-700 bg-amber-50 border-amber-200' :
          s === 'demo_scheduled' ? 'text-purple-700 bg-purple-50 border-purple-200' :
          s === 'converted' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
          'text-slate-700 bg-slate-100 border-slate-300';
        
        return (
          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold capitalize shadow-sm ${color}`}>
            {s.replace('_', ' ')}
          </span>
        );
      }
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-slate-500 font-medium text-xs whitespace-nowrap">
          {new Date(row.original.created_at).toLocaleDateString("en-CA")}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => { setSelectedLead(row.original); setIsDrawerOpen(true); }}
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Leads</h1>
          <p className="text-sm font-medium text-slate-500">Manage incoming demo requests and inquiries</p>
        </div>
        <button
          onClick={() => { setSelectedLead(null); setIsDrawerOpen(true); }}
          className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Lead
        </button>
      </div>
      <div className="flex-1 min-h-0 w-full">
        <DataTable 
          columns={columns} 
          data={leadData} 
          searchKey="name" 
          disablePagination={true}
          filters={[
            {
              key: "status",
              label: "All Statuses",
              options: [
                { label: "New", value: "new" },
                { label: "Contacted", value: "contacted" },
                { label: "Demo Scheduled", value: "demo_scheduled" },
                { label: "Converted", value: "converted" },
                { label: "Lost", value: "lost" }
              ]
            }
          ]}
        />
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedLead ? "Edit Lead" : "New Lead"}
      >
        {isDrawerOpen && (
          <LeadEditor 
            initialData={selectedLead || {}} 
            isNew={!selectedLead}
            onClose={() => setIsDrawerOpen(false)}
          />
        )}
      </Drawer>
    </div>
  );
}
