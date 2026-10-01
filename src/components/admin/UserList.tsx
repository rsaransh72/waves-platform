"use client";

import { useEffect, useState, useMemo } from "react";
import { Edit2, Trash2, UserPlus, Mail, VenetianMask } from "lucide-react";
import { clsx } from "clsx";
import { createClient } from "@/lib/supabase-browser";
import { useAdminStore } from "@/store/adminStore";
import { toast } from "sonner";
import { DataTable } from "./DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Drawer } from "./Drawer";
import { UserEditor } from "./UserEditor";

export function UserList({
  initialData,
  openCreateOnLoad = false,
}: {
  initialData: any[];
  openCreateOnLoad?: boolean;
}) {
  const { teamMembers, setTeamMembers, removeTeamMember } = useAdminStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(openCreateOnLoad);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  useEffect(() => {
    setTeamMembers(initialData);
  }, [initialData, setTeamMembers]);

  const usersData = useMemo(() => Object.values(teamMembers.data), [teamMembers.data]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove user "${name}"?`)) return;

    removeTeamMember(id);
    toast.success(`Removed ${name}`);
    
    try {
      const supabase = createClient();
      const { error } = await supabase.from("team_members").delete().eq("id", id);
      if (error) throw error;
    } catch (err: any) {
      toast.error(`Error removing user: ${err.message}`);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={row.original.avatar_url || `https://ui-avatars.com/api/?name=${row.original.name}`} alt={row.original.name} className="h-8 w-8 rounded-full bg-slate-200" />
          <div className="flex flex-col">
            <span className="font-bold text-slate-900">{row.original.name}</span>
            <span className="text-xs text-slate-500">{row.original.email}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 border border-slate-200 capitalize">
          {row.original.role}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={clsx(
          "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold capitalize",
          row.original.status === 'active' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-slate-500 bg-slate-100 border-slate-200'
        )}>
          {row.original.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Joined",
      cell: ({ row }) => (
        <span className="font-medium text-slate-500">
          {new Date(row.original.created_at).toLocaleDateString("en-CA")}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        if (row.original.email === 'admin@waves.com') {
          return (
            <div className="flex items-center justify-end">
              <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">System Admin</span>
            </div>
          );
        }

        return (
          <div className="flex items-center justify-end gap-2">
            <form action={async () => {
              const { impersonateUser } = await import('@/app/actions/impersonation');
              await impersonateUser(row.original.id, row.original.name, row.original.email, '/admin/users');
            }}>
              <button 
                type="submit"
                title="Login As User (Impersonate)"
                className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
              >
                <VenetianMask className="h-4 w-4" />
              </button>
            </form>
            <button 
              onClick={() => {
                setSelectedUser(row.original);
                setIsDrawerOpen(true);
              }}
              title="Edit User"
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button 
              onClick={() => handleDelete(row.original.id, row.original.name)}
              title="Remove User"
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    }
  ];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="flex-1 min-h-0 w-full">
        <DataTable 
          title={
            <h2 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <UserPlus className="h-3.5 w-3.5 text-slate-500" />
              Users & Roles
            </h2>
          }
          actions={
            <button 
              onClick={() => {
                setSelectedUser(null);
                setIsDrawerOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-blue-700 shadow-sm"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Invite User
            </button>
          }
          columns={columns} 
          data={usersData} 
          searchKey="name" 
          disablePagination={true}
          filters={[
            {
              key: "role",
              label: "All Roles",
              options: [
                { label: "Superadmin", value: "superadmin" },
                { label: "Admin", value: "admin" },
                { label: "Manager", value: "manager" },
                { label: "User", value: "user" }
              ]
            },
            {
              key: "status",
              label: "All Statuses",
              options: [
                { label: "Active", value: "active" },
                { label: "Suspended", value: "suspended" },
                { label: "Invited", value: "invited" }
              ]
            }
          ]}
          bulkActions={[
            {
              label: "Suspend",
              icon: <VenetianMask className="w-4 h-4" />,
              variant: "secondary",
              onClick: async (selectedRows) => {
                if (selectedRows.some(r => r.email === 'admin@waves.com')) {
                  toast.error("Cannot perform bulk actions on the System Admin account.");
                  return;
                }
                if (confirm(`Are you sure you want to suspend ${selectedRows.length} users?`)) {
                  const supabase = createClient();
                  const ids = selectedRows.map(r => r.id);
                  const { error } = await supabase
                    .from("team_members")
                    .update({ status: "suspended" })
                    .in("id", ids);

                  if (error) {
                    toast.error(`Error suspending users: ${error.message}`);
                  } else {
                    toast.success(`Successfully suspended ${selectedRows.length} users`);
                    // RealtimeProvider will automatically sync these changes to the store
                  }
                }
              }
            },
            {
              label: "Delete",
              icon: <Trash2 className="w-4 h-4" />,
              variant: "danger",
              onClick: async (selectedRows) => {
                if (selectedRows.some(r => r.email === 'admin@waves.com')) {
                  toast.error("Cannot perform bulk actions on the System Admin account.");
                  return;
                }
                if (confirm(`Are you sure you want to permanently delete ${selectedRows.length} users?`)) {
                  const supabase = createClient();
                  const ids = selectedRows.map(r => r.id);
                  const { error } = await supabase
                    .from("team_members")
                    .delete()
                    .in("id", ids);

                  if (error) {
                    toast.error(`Error deleting users: ${error.message}`);
                  } else {
                    toast.success(`Successfully deleted ${selectedRows.length} users`);
                    ids.forEach(id => removeTeamMember(id));
                  }
                }
              }
            }
          ]}
        />
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedUser ? "Edit User" : "Invite User"}
      >
        <UserEditor 
          initialData={selectedUser} 
          isNew={!selectedUser} 
          onClose={() => setIsDrawerOpen(false)} 
        />
      </Drawer>
    </div>
  );
}
