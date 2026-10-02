"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { clsx } from "clsx";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import { formatAdminDate } from "@/lib/admin-format";
import { formatMoney } from "@/lib/money";

type Subscription = {
  id: string;
  organization_id: string;
  organization_name: string;
  plan_name: string;
  amount: number | string;
  status: string;
  next_billing_date: string | null;
  organizations?: { name: string; status: string | null } | null;
};

type Row = Subscription & { client: string; daysLeft: number | null; term: string };

const STATUS_LABELS: Record<string, string> = { active: "Active", trialing: "Trial", past_due: "Payment overdue", canceled: "Canceled" };

function statusLabel({ status, daysLeft }: { status: string; daysLeft: number | null }) {
  const label = STATUS_LABELS[status] ?? status;
  if (status !== "past_due" || daysLeft === null || daysLeft >= 0) return label;
  const late = -daysLeft;
  return `${label} · ${late} ${late === 1 ? "day" : "days"}`;
}

function statusStyle(status: string) {
  if (status === "active") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (status === "trialing") return "border-blue-200 bg-blue-50 text-blue-800";
  if (status === "past_due") return "border-red-200 bg-red-50 text-red-700";
  return "border-slate-200 bg-slate-100 text-slate-600";
}

// Plans and renewal dates of every client. Renewing, changing the plan or recording
// payment happens on the client's page, where the invoices and users are too.
export function SubscriptionList({ initialData, now }: { initialData: Subscription[]; now: number }) {
  const rows: Row[] = initialData.map((subscription) => {
    const daysLeft = subscription.next_billing_date ? Math.ceil((new Date(subscription.next_billing_date).getTime() - now) / 86_400_000) : null;
    return {
      ...subscription,
      client: subscription.organizations?.name ?? subscription.organization_name,
      daysLeft,
      term: daysLeft === null ? "No end date" : daysLeft < 0 ? "Expired" : daysLeft <= 30 ? "Ends within 30 days" : "Running",
    };
  });

  const columns: ColumnDef<Row>[] = [
    {
      accessorKey: "client",
      header: "Client",
      cell: ({ row }) => (
        <Link href={`/admin/organizations/${row.original.organization_id}`} className="font-semibold text-slate-900 hover:text-blue-700">
          {row.original.client}
        </Link>
      ),
    },
    { accessorKey: "plan_name", header: "Plan" },
    {
      accessorKey: "amount",
      header: "Per year",
      cell: ({ row }) => <span className="font-semibold text-slate-900">{formatMoney(row.original.amount)}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={clsx("inline-flex rounded-full border px-2.5 py-1 text-xs font-bold", statusStyle(row.original.status))}>
          {statusLabel(row.original)}
        </span>
      ),
    },
    {
      accessorKey: "next_billing_date",
      header: "Term ends",
      cell: ({ row }) => {
        const { daysLeft } = row.original;
        return (
          <div className="whitespace-nowrap">
            <div className="text-slate-800">{formatAdminDate(row.original.next_billing_date)}</div>
            {daysLeft !== null && (
              <div className={clsx("text-xs font-semibold", daysLeft < 0 ? "text-red-600" : daysLeft <= 30 ? "text-amber-700" : "text-slate-400")}>
                {daysLeft < 0 ? `Expired ${Math.abs(daysLeft)} days ago` : `${daysLeft} days left`}
              </div>
            )}
          </div>
        );
      },
    },
    { accessorKey: "term", header: "Term" },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <Link href={`/admin/organizations/${row.original.organization_id}`} className="inline-flex items-center gap-1 rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
            Manage <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Subscriptions</h1>
        <p className="text-sm font-medium text-slate-500">Each client&apos;s plan and term. Open a client to renew, change the plan or record a payment.</p>
      </div>
      <div className="min-h-0 w-full flex-1">
        <DataTable
          columns={columns}
          data={rows}
          searchKey="client"
          searchPlaceholder="Search clients..."
          hiddenColumns={["term"]}
          filters={[
            { key: "status", label: "All statuses", options: Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label })) },
            { key: "term", label: "Any term", options: ["Expired", "Ends within 30 days", "Running"].map((value) => ({ value, label: value })) },
          ]}
          emptyState={
            <span>
              No subscriptions yet. A subscription is created when you{" "}
              <Link href="/admin/onboarding" className="font-semibold text-blue-600 hover:underline">onboard a client</Link>.
            </span>
          }
        />
      </div>
    </div>
  );
}
