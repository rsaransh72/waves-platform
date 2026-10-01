"use client";

import { useEffect, useState, useMemo } from "react";
import { FileText, Download, Edit2 } from "lucide-react";
import { clsx } from "clsx";
import { toast } from "sonner";
import { useAdminStore } from "@/store/adminStore";
import { DataTable } from "./DataTable";
import { ColumnDef } from "@tanstack/react-table";
import jsPDF from "jspdf";
import { formatMoney, formatMoneyCode } from "@/lib/money";
import { Drawer } from "./Drawer";
import { InvoiceEditor } from "./InvoiceEditor";
import { useRouter } from "next/navigation";

interface Invoice {
  id: string;
  invoice_number: string;
  organization_name: string;
  amount: number;
  status: string;
  due_date: string;
}

export function InvoiceList({ initialData, initialInvoiceId }: { initialData: Invoice[]; initialInvoiceId?: string }) {
  const { invoices, setInvoices } = useAdminStore();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  
  useEffect(() => {
    setInvoices(initialData);
  }, [initialData, setInvoices]);

  const invoicesData = useMemo(() => Object.values(invoices.data) as Invoice[], [invoices.data]);
  const linkedInvoice = initialInvoiceId
    ? invoicesData.find((invoice) => invoice.id === initialInvoiceId) ?? null
    : null;
  const activeInvoice = selectedInvoice ?? linkedInvoice;

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "invoice_number",
      header: "Invoice #",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-400" />
          <span className="font-bold text-slate-900">{row.original.invoice_number}</span>
        </div>
      ),
    },
    {
      accessorKey: "organization_name",
      header: "Customer",
      cell: ({ row }) => <span className="font-medium text-slate-700">{row.original.organization_name}</span>,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => <span className="font-bold text-slate-900">{formatMoney(row.original.amount)}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={clsx(
          "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold capitalize",
          row.original.status === 'paid' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 
          row.original.status === 'pending' ? 'text-amber-700 bg-amber-50 border-amber-200' : 
          'text-red-700 bg-red-50 border-red-200'
        )}>
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: "due_date",
      header: "Due Date",
      cell: ({ row }) => (
        <span className="font-medium text-slate-500">
          {new Date(row.original.due_date).toLocaleDateString("en-CA")}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const handleDownload = () => {
          const inv = row.original;
          const doc = new jsPDF();
          
          // Header
          doc.setFontSize(22);
          doc.text("INVOICE", 105, 20, { align: "center" });
          
          doc.setFontSize(12);
          doc.text(`Invoice Number: ${inv.invoice_number}`, 20, 40);
          doc.text(`Date Issued: ${new Date().toLocaleDateString("en-CA")}`, 20, 50);
          doc.text(`Due Date: ${new Date(inv.due_date).toLocaleDateString("en-CA")}`, 20, 60);
          doc.text(`Status: ${inv.status.toUpperCase()}`, 20, 70);
          
          // Billed To
          doc.setFontSize(14);
          doc.text("Billed To:", 20, 90);
          doc.setFontSize(12);
          doc.text(inv.organization_name, 20, 100);
          
          // Amount
          doc.setFontSize(16);
          doc.text(`Total Amount Due: ${formatMoneyCode(inv.amount)}`, 20, 130);
          
          doc.setFontSize(10);
          doc.text("Thank you for your business!", 105, 280, { align: "center" });
          
          doc.save(`${inv.invoice_number}.pdf`);
          toast.success(`Downloaded ${inv.invoice_number}.pdf`);
        };

        return (
          <div className="flex items-center justify-end gap-2">
            <button 
              onClick={() => {
                setSelectedInvoice(row.original);
                setIsDrawerOpen(true);
              }}
              title="Edit Invoice"
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button 
              onClick={handleDownload}
              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" 
              title="Download Invoice (PDF)"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        );
      },
    }
  ];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Billing History</h1>
          <p className="text-sm font-medium text-slate-500">View all customer invoices.</p>
        </div>
      </div>
      
      <div className="flex-1 min-h-0 w-full">
        <DataTable 
          columns={columns} 
          data={invoicesData} 
          searchKey="invoice_number" 
          disablePagination={true}
          filters={[
            {
              key: "status",
              label: "All Statuses",
              options: [
                { label: "Paid", value: "paid" },
                { label: "Pending", value: "pending" },
                { label: "Overdue", value: "overdue" }
              ]
            }
          ]}
        />
      </div>

      <Drawer
        isOpen={isDrawerOpen || Boolean(linkedInvoice)}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedInvoice(null);
          if (initialInvoiceId) router.replace("/admin/billing");
        }}
        title="Edit Invoice"
      >
        <InvoiceEditor 
          initialData={activeInvoice} 
          onClose={() => setIsDrawerOpen(false)} 
        />
      </Drawer>
    </div>
  );
}
