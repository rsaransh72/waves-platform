"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Plus } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { DataTable } from "./DataTable";
import { setClientStatus } from "@/app/actions/clients";
import { formatAdminDate } from "@/lib/admin-format";
import { workspaceLabel } from "@/lib/product-workspaces";

export type ClientRow = {
  id: string;
  name: string;
  slug: string;
  type: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  status: string;
  subscriptions?: Array<{ plan_name: string; next_billing_date: string | null; status: string }>;
  organization_members?: Array<{ count: number }>;
};

type Row = ClientRow & { product: string; plan: string; termEnds: string | null; users: number };

const STATUS_STYLES: Record<string, string> = {
  active: "text-emerald-700 bg-emerald-50 border-emerald-200",
  trial: "text-blue-700 bg-blue-50 border-blue-200",
  suspended: "text-red-700 bg-red-50 border-red-200",
  inactive: "text-slate-700 bg-slate-50 border-slate-200",
};

export function OrganizationList({ initialData }: { initialData: ClientRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const rows: Row[] = initialData.map((client) => {
    const subscription = [...(client.subscriptions ?? [])].sort((a, b) => String(b.next_billing_date).localeCompare(String(a.next_billing_date)))[0];
    return {
      ...client,
      product: workspaceLabel(client.type),
      plan: subscription?.plan_name ?? "No subscription",
      termEnds: subscription?.next_billing_date ?? null,
      users: client.organization_members?.[0]?.count ?? 0,
    };
  });
  const products = Array.from(new Set(rows.map((row) => row.product)));

  const toggleStatus = (client: Row) => {
    const next = client.status === "suspended" || client.status === "inactive" ? "active" : "suspended";
    const message = next === "suspended"
      ? `Suspend ${client.name}? All of its users lose access immediately.`
      : `Reactivate ${client.name}? Its users regain access.`;
    if (!window.confirm(message)) return;
    startTransition(async () => {
      const result = await setClientStatus(client.id, next);
      if (result.error) toast.error(result.error);
      else toast.success(result.message ?? "Updated.");
      router.refresh();
    });
  };

  const columns: ColumnDef<Row>[] = [
    {
      accessorKey: "name",
      header: "Client",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <Link href={`/admin/organizations/${row.original.id}`} className="font-bold text-slate-900 hover:text-blue-700">{row.original.name}</Link>
          <span className="text-xs text-slate-500">{[row.original.city, row.original.email].filter(Boolean).join(" · ") || row.original.slug}</span>
        </div>
      ),
    },
    { accessorKey: "product", header: "Product" },
    {
      accessorKey: "plan",
      header: "Plan",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-slate-800">{row.original.plan}</span>
          {row.original.termEnds && <span className="text-xs text-slate-500">Term ends {formatAdminDate(row.original.termEnds)}</span>}
        </div>
      ),
    },
    { accessorKey: "users", header: "Users", cell: ({ row }) => <span className="text-slate-700">{row.original.users}</span> },
    {
      accessorKey: "status",
      header: "Access",
      cell: ({ row }) => (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${STATUS_STYLES[row.original.status] ?? STATUS_STYLES.inactive}`}>
          {row.original.status}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const suspended = row.original.status === "suspended" || row.original.status === "inactive";
        return (
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              disabled={isPending}
              onClick={() => toggleStatus(row.original)}
              className={`rounded border px-2.5 py-1.5 text-xs font-semibold disabled:opacity-50 ${suspended ? "border-emerald-300 text-emerald-700 hover:bg-emerald-50" : "border-red-200 text-red-700 hover:bg-red-50"}`}
            >
              {suspended ? "Reactivate" : "Suspend"}
            </button>
            <Link href={`/admin/organizations/${row.original.id}`} className="inline-flex items-center gap-1 rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              Open <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col space-y-6">
      <div className="flex shrink-0 items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Clients</h1>
          <p className="text-sm font-medium text-slate-500">Every organization using a product. Open a client to manage its subscription, invoices and users.</p>
        </div>
        <Link href="/admin/onboarding" className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Onboard client
        </Link>
      </div>
      <div className="min-h-0 w-full flex-1">
        <DataTable
          columns={columns}
          data={rows}
          searchKey="name"
          searchPlaceholder="Search clients..."
          filters={[
            ...(products.length > 1 ? [{ key: "product", label: "All products", options: products.map((product) => ({ value: product, label: product })) }] : []),
            { key: "status", label: "Any access", options: ["active", "trial", "suspended", "inactive"].map((value) => ({ value, label: value[0].toUpperCase() + value.slice(1) })) },
          ]}
          emptyState={
            <span>
              No clients yet. <Link href="/admin/onboarding" className="font-semibold text-blue-600 hover:underline">Onboard your first client</Link>, or convert a lead from <Link href="/admin/leads" className="font-semibold text-blue-600 hover:underline">Leads</Link>.
            </span>
          }
        />
      </div>
    </div>
  );
}
