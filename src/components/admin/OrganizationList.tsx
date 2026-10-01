"use client";

import { useEffect, useState, useMemo } from "react";
import { Ban, CircleCheck, Edit2, Plus, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import { useAdminStore } from "@/store/adminStore";
import { toast } from "sonner";
import { DataTable } from "./DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Drawer } from "./Drawer";
import { OrganizationEditor } from "./OrganizationEditor";

type ClientOrganization = {
  id: string;
  name: string;
  slug: string;
  type: "school" | "hospital" | "pharmacy" | "other";
  email: string | null;
  phone: string | null;
  status: string;
};

export function OrganizationList({
  initialData,
  openCreateOnLoad = false,
}: {
  initialData: ClientOrganization[];
  openCreateOnLoad?: boolean;
}) {
  const { organizations, setOrganizations, updateOrganization } = useAdminStore();
  
  useEffect(() => {
    setOrganizations(initialData);
  }, [initialData, setOrganizations]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(openCreateOnLoad);
  const [selectedOrg, setSelectedOrg] = useState<ClientOrganization | null>(null);

  const orgData = useMemo(() => Object.values(organizations.data) as ClientOrganization[], [organizations.data]);

  const handleStatusChange = async (id: string, name: string, currentStatus: string) => {
    const nextStatus = currentStatus === "suspended" ? "active" : "suspended";
    const action = nextStatus === "suspended" ? "suspend" : "reactivate";
    if (!window.confirm(`${action === "suspend" ? "Suspend" : "Reactivate"} ${name}?`)) return;

    const { error } = await createClient()
      .from("organizations")
      .update({ status: nextStatus })
      .eq("id", id)
      .in("type", ["school", "hospital", "pharmacy", "other"]);

    if (error) {
      toast.error(`Could not ${action} school: ${error.message}`);
      return;
    }

    updateOrganization(id, { status: nextStatus });
    toast.success(`${name} ${nextStatus === "suspended" ? "suspended" : "reactivated"}.`);
  };

  const columns: ColumnDef<ClientOrganization>[] = [
    {
      accessorKey: "name",
      header: "Organization Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <Link href={`/admin/organizations/${row.original.id}`} className="font-bold text-slate-900 hover:text-blue-700">{row.original.name}</Link>
          <span className="text-xs font-medium text-slate-500">/{row.original.slug}</span>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <span className="capitalize text-slate-600 font-medium">{row.original.type}</span>,
    },
    {
      accessorKey: "contact",
      header: "Contact",
      cell: ({ row }) => (
        <div className="flex flex-col text-xs text-slate-500">
          {row.original.email && <div className="flex items-center gap-1"><Mail className="h-3 w-3"/> {row.original.email}</div>}
          {row.original.phone && <div className="flex items-center gap-1"><Phone className="h-3 w-3"/> {row.original.phone}</div>}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.original.status;
        const color = 
          s === 'active' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
          s === 'inactive' ? 'text-slate-700 bg-slate-50 border-slate-200' :
          s === 'suspended' ? 'text-red-700 bg-red-50 border-red-200' :
          'text-blue-700 bg-blue-50 border-blue-200';
        
        return (
          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${color}`}>
            {s}
          </span>
        );
      }
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => { setSelectedOrg(row.original); setIsDrawerOpen(true); }}
            aria-label={`Edit ${row.original.name}`}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleStatusChange(row.original.id, row.original.name, row.original.status)}
            aria-label={`${row.original.status === "suspended" ? "Reactivate" : "Suspend"} ${row.original.name}`}
            className={`p-2 rounded transition-colors ${row.original.status === "suspended" ? "text-slate-400 hover:text-emerald-700 hover:bg-emerald-50" : "text-slate-400 hover:text-red-600 hover:bg-red-50"}`}
          >
            {row.original.status === "suspended" ? <CircleCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
          </button>
        </div>
      ),
    }
  ];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Clients</h1>
            <p className="text-sm font-medium text-slate-500">Manage customer organizations, subscriptions, and access</p>
        </div>
        <Link
          href="/admin/onboarding"
          className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-sm"
        >
          <Plus className="h-4 w-4" /> Onboard Client
        </Link>
      </div>
      <div className="flex-1 min-h-0 w-full">
        <DataTable 
          columns={columns} 
          data={orgData} 
          searchKey="name" 
          disablePagination={true} 
          filters={[
            {
              key: "type",
              label: "All Products",
              options: [
                { label: "School ERP", value: "school" },
                { label: "Hospital ERP", value: "hospital" },
                { label: "Pharmacy POS", value: "pharmacy" },
                { label: "Other", value: "other" },
              ]
            },
            {
              key: "status",
              label: "All Statuses",
              options: [
                { label: "Active", value: "active" },
                { label: "Trial", value: "trial" },
                { label: "Suspended", value: "suspended" },
                { label: "Inactive", value: "inactive" }
              ]
            }
          ]}
        />
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedOrg ? "Edit Client" : "Onboard Client"}
      >
        {isDrawerOpen && (
          <OrganizationEditor 
            initialData={selectedOrg || {}} 
            isNew={!selectedOrg}
            onClose={() => setIsDrawerOpen(false)}
          />
        )}
      </Drawer>
    </div>
  );
}
