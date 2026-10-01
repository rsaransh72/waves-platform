"use client";

import { useEffect, useState, useMemo } from "react";
import { MessageSquare, Clock, Edit2 } from "lucide-react";
import { clsx } from "clsx";
import { useAdminStore } from "@/store/adminStore";
import { DataTable } from "./DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Drawer } from "./Drawer";
import { TicketEditor } from "./TicketEditor";

export function TicketList({ initialData }: { initialData: any[] }) {
  const { tickets, setTickets } = useAdminStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  
  useEffect(() => {
    setTickets(initialData);
  }, [initialData, setTickets]);

  const ticketsData = useMemo(() => Object.values(tickets.data), [tickets.data]);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.original.subject}</span>
          <span className="text-xs text-slate-500">{row.original.customer_email}</span>
        </div>
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const colors: any = {
          high: "text-red-700 bg-red-50 border-red-200",
          medium: "text-amber-700 bg-amber-50 border-amber-200",
          low: "text-emerald-700 bg-emerald-50 border-emerald-200"
        };
        return (
          <span className={clsx("inline-flex items-center rounded px-2.5 py-1 text-xs font-bold border capitalize", colors[row.original.priority] || colors.low)}>
            {row.original.priority}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={clsx(
          "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold capitalize",
          row.original.status === 'open' ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-slate-600 bg-slate-100 border-slate-200'
        )}>
          {row.original.status === 'open' ? <Clock className="w-3 h-3"/> : <MessageSquare className="w-3 h-3"/>}
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => (
        <span className="font-medium text-slate-500">
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
            onClick={() => {
              setSelectedTicket(row.original);
              setIsDrawerOpen(true);
            }}
            title="Open Ticket"
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </div>
      ),
    }
  ];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Support Desk</h1>
          <p className="text-sm font-medium text-slate-500">Manage customer inquiries and tickets.</p>
        </div>
      </div>
      
      <div className="flex-1 min-h-0 w-full">
        <DataTable 
          columns={columns} 
          data={ticketsData} 
          searchKey="subject" 
          disablePagination={true}
          filters={[
            {
              key: "priority",
              label: "All Priorities",
              options: [
                { label: "High", value: "high" },
                { label: "Medium", value: "medium" },
                { label: "Low", value: "low" }
              ]
            },
            {
              key: "status",
              label: "All Statuses",
              options: [
                { label: "Open", value: "open" },
                { label: "Closed", value: "closed" }
              ]
            }
          ]}
        />
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Support Ticket"
      >
        <TicketEditor 
          initialData={selectedTicket} 
          onClose={() => setIsDrawerOpen(false)} 
        />
      </Drawer>
    </div>
  );
}
