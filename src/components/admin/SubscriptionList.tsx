"use client";

import { useEffect, useState, useMemo } from "react";
import { ArrowUpRight, Ban, CalendarClock, CheckCircle, RotateCcw } from "lucide-react";
import { clsx } from "clsx";
import { useAdminStore } from "@/store/adminStore";
import { DataTable } from "./DataTable";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import { toast } from "sonner";
import { formatAdminDate } from "@/lib/admin-format";

interface Subscription {
  id: string;
  organization_id: string;
  organization_name: string;
  plan_name: string;
  amount: number | string;
  status: string;
  next_billing_date: string | null;
  created_at: string | null;
  updated_at: string | null;
  billing_cycle: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  organizations?: { name: string; email: string | null; type: string | null; status: string | null } | null;
}

function formatDate(value: string | null | undefined) {
  return formatAdminDate(value);
}

function statusStyle(status: string) {
  if (status === "active" || status === "trialing") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (status === "past_due") return "border-amber-200 bg-amber-50 text-amber-800";
  return "border-slate-200 bg-slate-100 text-slate-700";
}

export function SubscriptionList({ initialData }: { initialData: Subscription[] }) {
  const { subscriptions, setSubscriptions } = useAdminStore();
  const { updateSubscription } = useAdminStore();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  useEffect(() => {
    setSubscriptions(initialData);
  }, [initialData, setSubscriptions]);

  const subscriptionsData = useMemo(() => (Object.values(subscriptions.data) as Subscription[]).map((subscription) => ({
    ...subscription,
    billing_cycle_label: subscription.billing_cycle || "Not set",
    cancellation_state: subscription.cancel_at_period_end ? "Scheduled" : "Not scheduled",
  })), [subscriptions.data]);

  const toggleCancellation = async (subscription: Subscription) => {
    if (updatingId) return;
    const cancelAtPeriodEnd = !subscription.cancel_at_period_end;
    const confirmation = cancelAtPeriodEnd
      ? "Schedule this subscription to cancel at the end of its current term?"
      : "Keep this subscription active by removing its scheduled cancellation?";
    if (!window.confirm(confirmation)) return;
    setUpdatingId(subscription.id);
    const { error } = await createClient()
      .from("subscriptions")
      .update({ cancel_at_period_end: cancelAtPeriodEnd })
      .eq("id", subscription.id);
    setUpdatingId(null);
    if (error) {
      toast.error(`Could not update renewal setting: ${error.message}`);
      return;
    }
    updateSubscription(subscription.id, { cancel_at_period_end: cancelAtPeriodEnd });
    toast.success(cancelAtPeriodEnd ? "Cancellation scheduled for the end of the term." : "Automatic cancellation removed.");
  };

  const columns: ColumnDef<Subscription & { billing_cycle_label: string; cancellation_state: string }>[] = [
    {
      accessorKey: "organization_name",
      header: "Organization",
      cell: ({ row }) => {
        const organization = row.original.organizations;
        return (
          <div className="min-w-40">
            <Link href={`/admin/organizations/${row.original.organization_id}`} className="font-bold text-slate-900 hover:text-blue-700">
              {organization?.name || row.original.organization_name || "Unknown organization"}
            </Link>
            <div className="mt-0.5 text-xs text-slate-500">{organization?.email || "Contact unavailable"}</div>
            <div className="mt-1 flex flex-wrap gap-1.5 text-[10px] font-semibold uppercase text-slate-500">
              {organization?.type && <span>{organization.type}</span>}
              {organization?.status && <span>Org {organization.status}</span>}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "id",
      header: "Subscription ID",
      cell: ({ row }) => <span title={row.original.id} className="block max-w-32 truncate font-mono text-[11px] text-slate-500">{row.original.id}</span>,
    },
    {
      accessorKey: "plan_name",
      header: "Plan",
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-200">
          {row.original.plan_name}
        </span>
      ),
    },
    {
      accessorKey: "amount",
      header: "Price",
      cell: ({ row }) => {
        const cycle = row.original.billing_cycle;
        const cycleLabel = cycle === "yearly" || cycle === "annual" ? "/year" : cycle === "monthly" ? "/month" : cycle ? `/${cycle}` : "";
        return <span className="whitespace-nowrap font-medium text-slate-700">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(row.original.amount || 0))}{cycleLabel}</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={clsx("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold", statusStyle(row.original.status))}>
          {row.original.status === "active" || row.original.status === "trialing" ? <CheckCircle className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: "billing_cycle_label",
      header: "Billing Cycle",
      cell: ({ row }) => <span className="capitalize text-slate-700">{row.original.billing_cycle_label}</span>,
    },
    {
      accessorKey: "current_period_end",
      header: "Term Ends",
      cell: ({ row }) => <span className="whitespace-nowrap text-slate-600">{formatDate(row.original.current_period_end)}</span>,
    },
    {
      accessorKey: "next_billing_date",
      header: "Next Billing",
      cell: ({ row }) => <span className="whitespace-nowrap font-medium text-slate-600">{formatDate(row.original.next_billing_date)}</span>,
    },
    {
      accessorKey: "cancellation_state",
      header: "Renewal",
      cell: ({ row }) => (
        <span className={clsx("inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold", row.original.cancel_at_period_end ? "text-amber-700" : "text-emerald-700")}>
          <CalendarClock className="h-3.5 w-3.5" />
          {row.original.cancellation_state}
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => <span className="whitespace-nowrap text-xs text-slate-500">{formatDate(row.original.created_at)}</span>,
    },
    {
      accessorKey: "updated_at",
      header: "Updated",
      cell: ({ row }) => <span className="whitespace-nowrap text-xs text-slate-500">{formatDate(row.original.updated_at)}</span>,
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      enableHiding: false,
      cell: ({ row }) => {
        const subscription = row.original;
        return (
          <div className="flex min-w-52 items-center justify-end gap-2">
            <Link
              href={`/admin/organizations/${subscription.organization_id}`}
              title="Open organization details"
              aria-label={`Open ${subscription.organization_name} organization`}
              className="inline-flex h-8 items-center gap-1.5 border border-slate-300 px-2.5 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50"
            >
              <ArrowUpRight className="h-3.5 w-3.5" />Organization
            </Link>
            <button
              type="button"
              disabled={updatingId !== null}
              onClick={() => void toggleCancellation(subscription)}
              title={subscription.cancel_at_period_end ? "Keep this subscription active" : "Schedule cancellation at term end"}
              className={clsx("inline-flex h-8 items-center gap-1.5 border px-2.5 text-xs font-semibold disabled:opacity-50", subscription.cancel_at_period_end ? "border-emerald-300 text-emerald-700 hover:bg-emerald-50" : "border-amber-300 text-amber-800 hover:bg-amber-50")}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {updatingId === subscription.id ? "Saving" : subscription.cancel_at_period_end ? "Keep" : "Cancel at term end"}
            </button>
          </div>
        );
      },
    }
  ];

  return (
    <div className="flex min-h-[calc(100vh-120px)] flex-col space-y-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Subscriptions</h1>
          <p className="text-sm font-medium text-slate-500">Manage renewal status and open the linked organization for plan changes.</p>
        </div>
      </div>
      
      <div className="h-[calc(100vh-220px)] min-h-0 w-full">
        <DataTable 
          columns={columns} 
          data={subscriptionsData} 
          searchKey="organization_name"
          searchPlaceholder="Search organizations..."
          disablePagination={true}
          hiddenColumns={["id", "billing_cycle_label", "created_at", "updated_at"]}
          filters={[
            {
              key: "status",
              label: "All Statuses",
              options: [
                { label: "Active", value: "active" },
                { label: "Canceled", value: "canceled" },
                { label: "Past Due", value: "past_due" },
                { label: "Trialing", value: "trialing" }
              ]
            },
            {
              key: "billing_cycle_label",
              label: "All Billing Cycles",
              options: [
                { label: "Monthly", value: "monthly" },
                { label: "Yearly", value: "yearly" },
                { label: "Annual", value: "annual" },
                { label: "Not set", value: "Not set" }
              ]
            },
            {
              key: "cancellation_state",
              label: "All Renewal States",
              options: [
                { label: "Renewing", value: "Not scheduled" },
                { label: "Cancellation scheduled", value: "Scheduled" }
              ]
            }
          ]}
        />
      </div>
    </div>
  );
}
