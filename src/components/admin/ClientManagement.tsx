"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarPlus, CheckCircle2, KeyRound, Loader2, Mail, Pencil, Plus, Power, Receipt, Trash2, UserPlus, X } from "lucide-react";
import { Drawer } from "./Drawer";
import { OrganizationEditor } from "./OrganizationEditor";
import { formatAdminDate, formatAdminDateTime } from "@/lib/admin-format";
import { formatMoney } from "@/lib/money";
import { AmountInput, EmailInput } from "@/components/forms/IndiaInputs";
import {
  type ActionResult,
  changeClientUserRole,
  createInvoice,
  inviteClientUser,
  recordInvoicePayment,
  removeClientUser,
  renewSubscription,
  resendClientInvite,
  saveSubscription,
  sendClientPasswordReset,
  setClientStatus,
} from "@/app/actions/clients";

export type ClientOrganization = {
  id: string;
  name: string;
  slug: string;
  type: "school" | "hospital" | "pharmacy" | "other";
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  status: string;
};

export type ClientSubscription = {
  id: string;
  plan_name: string;
  amount: number;
  status: string;
  next_billing_date: string | null;
};

export type ClientInvoice = {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
  due_date: string;
  description?: string | null;
  paid_at?: string | null;
  payment_method?: string | null;
  payment_reference?: string | null;
};

export type ClientMember = {
  userId: string;
  role: string;
  email: string | null;
  name: string | null;
  accountStatus: "active" | "invited" | "unknown";
  lastSignInAt: string | null;
};

const inputClass = "w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";
const labelClass = "mb-1 block text-xs font-bold text-slate-600";
const primaryButton = "inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50";
const secondaryButton = "inline-flex items-center justify-center gap-1.5 rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  bank_transfer: "Bank transfer",
  upi: "UPI",
  cheque: "Cheque",
  cash: "Cash",
  card: "Card",
  other: "Other",
};

function today(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function useClientAction() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const run = (key: string, action: () => Promise<ActionResult>, onSuccess?: () => void) => {
    setActiveKey(key);
    startTransition(async () => {
      const result = await action();
      setActiveKey(null);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      if (result.message) toast.success(result.message);
      onSuccess?.();
      router.refresh();
    });
  };

  return { run, isPending, activeKey };
}

function Spinner({ show }: { show: boolean }) {
  return show ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null;
}

function StatusBadge({ status }: { status: string }) {
  const tone = ["active", "paid"].includes(status)
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : ["trial", "trialing", "invited", "pending"].includes(status)
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : ["suspended", "past_due", "canceled", "failed", "inactive"].includes(status)
        ? "border-red-200 bg-red-50 text-red-700"
        : "border-slate-200 bg-slate-100 text-slate-700";
  return <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase ${tone}`}>{status.replaceAll("_", " ")}</span>;
}

export function ClientHeaderActions({ organization }: { organization: ClientOrganization }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const { run, isPending } = useClientAction();
  const isSuspended = organization.status === "suspended" || organization.status === "inactive";

  const toggleStatus = () => {
    const next = isSuspended ? "active" : "suspended";
    const prompt = next === "suspended"
      ? `Suspend ${organization.name}? All of their users will immediately lose access to the product.`
      : `Reactivate ${organization.name}? Their users will regain access.`;
    if (!window.confirm(prompt)) return;
    run("status", () => setClientStatus(organization.id, next));
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <StatusBadge status={organization.status} />
      <button type="button" onClick={() => setIsEditing(true)} className={secondaryButton}>
        <Pencil className="h-3.5 w-3.5" /> Edit details
      </button>
      <button
        type="button"
        onClick={toggleStatus}
        disabled={isPending}
        className={isSuspended
          ? "inline-flex items-center gap-1.5 rounded bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
          : "inline-flex items-center gap-1.5 rounded border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-50 disabled:opacity-50"}
      >
        <Power className="h-3.5 w-3.5" /> {isSuspended ? "Reactivate" : "Suspend"}
      </button>
      <Drawer isOpen={isEditing} onClose={() => setIsEditing(false)} title={`Edit ${organization.name}`}>
        {isEditing && (
          <OrganizationEditor
            initialData={organization}
            onClose={() => { setIsEditing(false); router.refresh(); }}
          />
        )}
      </Drawer>
    </div>
  );
}

function SubscriptionForm({ organizationId, subscription, onDone }: { organizationId: string; subscription: ClientSubscription | null; onDone: () => void }) {
  const { run, isPending } = useClientAction();
  const [planName, setPlanName] = useState(subscription?.plan_name ?? "School ERP Annual");
  const [amount, setAmount] = useState(String(subscription?.amount ?? ""));
  const [status, setStatus] = useState(subscription?.status ?? "active");
  const [termEnd, setTermEnd] = useState(subscription?.next_billing_date?.slice(0, 10) ?? today(365));

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        run("save", () => saveSubscription(organizationId, { id: subscription?.id, planName, amount: Number(amount), status, termEnd }), onDone);
      }}
    >
      <div>
        <label className={labelClass}>Plan name</label>
        <input value={planName} onChange={(event) => setPlanName(event.target.value)} required minLength={2} maxLength={100} className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Annual amount (₹)</label>
          <AmountInput allowZero showWords={false} value={amount} onValueChange={setAmount} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className={inputClass}>
            <option value="active">Active</option>
            <option value="trialing">Trial</option>
            <option value="past_due">Past due</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass}>Term ends</label>
        <input type="date" value={termEnd} onChange={(event) => setTermEnd(event.target.value)} required className={inputClass} />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={isPending} className={primaryButton}><Spinner show={isPending} />{subscription ? "Save subscription" : "Create subscription"}</button>
        {subscription && <button type="button" onClick={onDone} className={secondaryButton}>Cancel</button>}
      </div>
    </form>
  );
}

export function SubscriptionPanel({ organizationId, subscription, daysLeft }: { organizationId: string; subscription: ClientSubscription | null; daysLeft: number | null }) {
  const [isEditing, setIsEditing] = useState(false);
  const [years, setYears] = useState(1);
  const [withInvoice, setWithInvoice] = useState(true);
  const { run, isPending, activeKey } = useClientAction();

  if (!subscription) {
    return (
      <div className="p-5">
        <p className="mb-4 text-sm text-slate-500">This client has no subscription. Create one to set their plan and term.</p>
        <SubscriptionForm organizationId={organizationId} subscription={null} onDone={() => {}} />
      </div>
    );
  }

  if (isEditing) {
    return <div className="p-5"><SubscriptionForm organizationId={organizationId} subscription={subscription} onDone={() => setIsEditing(false)} /></div>;
  }

  return (
    <div className="divide-y divide-slate-100">
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-bold text-slate-900">{subscription.plan_name}</div>
            <div className="text-sm text-slate-500">{formatMoney(subscription.amount)} / year</div>
          </div>
          <StatusBadge status={subscription.status} />
        </div>
        <div className="text-sm text-slate-600">
          Term ends <strong className="text-slate-900">{formatAdminDate(subscription.next_billing_date)}</strong>
          {daysLeft !== null && (
            <span className={daysLeft <= 0 ? "ml-2 font-bold text-red-600" : daysLeft <= 30 ? "ml-2 font-bold text-amber-600" : "ml-2 text-slate-400"}>
              {daysLeft <= 0 ? "Expired" : `${daysLeft} days left`}
            </span>
          )}
        </div>
        <button type="button" onClick={() => setIsEditing(true)} className={secondaryButton}><Pencil className="h-3.5 w-3.5" /> Edit plan, amount or term</button>
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800"><CalendarPlus className="h-4 w-4 text-blue-600" /> Renew term</div>
        <div className="flex items-center gap-2">
          <select value={years} onChange={(event) => setYears(Number(event.target.value))} className={`${inputClass} w-28`}>
            <option value={1}>1 year</option>
            <option value={2}>2 years</option>
            <option value={3}>3 years</option>
          </select>
          <button
            type="button"
            disabled={isPending}
            onClick={() => run("renew", () => renewSubscription(organizationId, subscription.id, years, withInvoice))}
            className={primaryButton}
          >
            <Spinner show={activeKey === "renew"} /> Renew
          </button>
        </div>
        <label className="flex items-center gap-2 text-xs text-slate-600">
          <input type="checkbox" checked={withInvoice} onChange={(event) => setWithInvoice(event.target.checked)} />
          Create a pending invoice for {formatMoney(Number(subscription.amount) * years)}
        </label>
        <p className="text-xs text-slate-400">Renewing reactivates a suspended client and resets the renewal reminder.</p>
      </div>
    </div>
  );
}

function PaymentForm({ organizationId, invoice, onDone }: { organizationId: string; invoice: ClientInvoice; onDone: () => void }) {
  const { run, isPending } = useClientAction();
  const [method, setMethod] = useState("bank_transfer");
  const [reference, setReference] = useState("");
  const [paidOn, setPaidOn] = useState(today());

  return (
    <form
      className="mt-3 grid grid-cols-1 gap-3 rounded border border-slate-200 bg-slate-50 p-3 sm:grid-cols-4 sm:items-end"
      onSubmit={(event) => {
        event.preventDefault();
        run("pay", () => recordInvoicePayment(organizationId, invoice.id, { method, reference, paidOn }), onDone);
      }}
    >
      <div>
        <label className={labelClass}>Method</label>
        <select value={method} onChange={(event) => setMethod(event.target.value)} className={inputClass}>
          {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>
      <div>
        <label className={labelClass}>Reference / UTR</label>
        <input value={reference} onChange={(event) => setReference(event.target.value.toUpperCase().replace(/[^A-Z0-9/-]/g, ""))} maxLength={30} placeholder="UTR / cheque no." className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Paid on</label>
        <input type="date" value={paidOn} onChange={(event) => setPaidOn(event.target.value)} required className={inputClass} />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={isPending} className={primaryButton}><Spinner show={isPending} />Save</button>
        <button type="button" onClick={onDone} className={secondaryButton} aria-label="Cancel"><X className="h-3.5 w-3.5" /></button>
      </div>
    </form>
  );
}

export function InvoicesPanel({ organizationId, invoices, subscription }: { organizationId: string; invoices: ClientInvoice[]; subscription: ClientSubscription | null }) {
  const [isCreating, setIsCreating] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [amount, setAmount] = useState(subscription ? String(subscription.amount) : "");
  const [dueDate, setDueDate] = useState(today(7));
  const [description, setDescription] = useState(subscription ? `${subscription.plan_name} subscription` : "");
  const { run, isPending } = useClientAction();

  const outstanding = invoices.filter((invoice) => invoice.status === "pending").reduce((total, invoice) => total + Number(invoice.amount), 0);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5">
        <div className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-slate-400" />
          <h3 className="font-bold text-slate-800">Invoices</h3>
          {outstanding > 0 && <span className="text-xs font-bold text-amber-700">{formatMoney(outstanding)} outstanding</span>}
        </div>
        <button type="button" onClick={() => setIsCreating((value) => !value)} className={secondaryButton}><Plus className="h-3.5 w-3.5" /> New invoice</button>
      </div>

      {isCreating && (
        <form
          className="grid grid-cols-1 gap-3 border-b border-slate-100 bg-slate-50 p-5 sm:grid-cols-4 sm:items-end"
          onSubmit={(event) => {
            event.preventDefault();
            run("invoice", () => createInvoice(organizationId, { amount: Number(amount), dueDate, description, subscriptionId: subscription?.id }), () => setIsCreating(false));
          }}
        >
          <div className="sm:col-span-2">
            <label className={labelClass}>Description</label>
            <input value={description} onChange={(event) => setDescription(event.target.value)} required minLength={3} maxLength={300} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Amount (₹)</label>
            <AmountInput showWords={false} value={amount} onValueChange={setAmount} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Due date</label>
            <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} required className={inputClass} />
          </div>
          <div className="sm:col-span-4">
            <button type="submit" disabled={isPending} className={primaryButton}><Spinner show={isPending} />Create invoice</button>
          </div>
        </form>
      )}

      {invoices.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-500">No invoices yet.</div>
      ) : (
        <div className="divide-y divide-slate-100">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900">{invoice.invoice_number}</div>
                  <div className="text-xs text-slate-500">{invoice.description || "Invoice"}</div>
                  <div className="mt-0.5 text-xs text-slate-400">
                    {invoice.status === "paid"
                      ? `Paid ${formatAdminDate(invoice.paid_at)}${invoice.payment_method ? ` by ${PAYMENT_METHOD_LABELS[invoice.payment_method] ?? invoice.payment_method}` : ""}${invoice.payment_reference ? ` · Ref ${invoice.payment_reference}` : ""}`
                      : `Due ${formatAdminDate(invoice.due_date)}`}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-bold text-slate-900">{formatMoney(invoice.amount)}</div>
                    <StatusBadge status={invoice.status} />
                  </div>
                  {["pending", "failed"].includes(invoice.status) && payingId !== invoice.id && (
                    <button type="button" onClick={() => setPayingId(invoice.id)} className={secondaryButton}><CheckCircle2 className="h-3.5 w-3.5" /> Record payment</button>
                  )}
                </div>
              </div>
              {payingId === invoice.id && <PaymentForm organizationId={organizationId} invoice={invoice} onDone={() => setPayingId(null)} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function UsersPanel({ organizationId, members, directoryError }: { organizationId: string; members: ClientMember[]; directoryError: string | null }) {
  const [isInviting, setIsInviting] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("staff");
  const { run, isPending, activeKey } = useClientAction();

  return (
    <div>
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5">
        <h3 className="font-bold text-slate-800">Users ({members.length})</h3>
        <button type="button" onClick={() => setIsInviting((value) => !value)} className={secondaryButton}><UserPlus className="h-3.5 w-3.5" /> Add user</button>
      </div>

      {directoryError && <div className="border-b border-amber-200 bg-amber-50 px-5 py-3 text-xs text-amber-900">{directoryError}</div>}

      {isInviting && (
        <form
          className="grid grid-cols-1 gap-3 border-b border-slate-100 bg-slate-50 p-5 sm:grid-cols-4 sm:items-end"
          onSubmit={(event) => {
            event.preventDefault();
            run("invite", () => inviteClientUser(organizationId, email, role), () => { setIsInviting(false); setEmail(""); });
          }}
        >
          <div className="sm:col-span-2">
            <label className={labelClass}>Email</label>
            <EmailInput required value={email} onValueChange={setEmail} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Role</label>
            <select value={role} onChange={(event) => setRole(event.target.value)} className={inputClass}>
              <option value="admin">Administrator</option>
              <option value="teacher">Teacher</option>
              <option value="staff">Staff</option>
            </select>
          </div>
          <button type="submit" disabled={isPending} className={primaryButton}><Spinner show={activeKey === "invite"} />Send invitation</button>
        </form>
      )}

      {members.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-500">No users are linked to this client yet.</div>
      ) : (
        <div className="divide-y divide-slate-100">
          {members.map((member) => {
            const busy = isPending && activeKey?.endsWith(member.userId);
            return (
              <div key={member.userId} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <div className="truncate font-semibold text-slate-900">{member.name || member.email || member.userId}</div>
                  {member.name && member.email && <div className="truncate text-xs text-slate-500">{member.email}</div>}
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                    <StatusBadge status={member.accountStatus} />
                    <span>Last sign-in: {member.lastSignInAt ? formatAdminDateTime(member.lastSignInAt) : "Never"}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={member.role}
                    disabled={busy}
                    onChange={(event) => run(`role-${member.userId}`, () => changeClientUserRole(organizationId, member.userId, event.target.value))}
                    className="rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700"
                    aria-label="Role"
                  >
                    {!["admin", "teacher", "staff"].includes(member.role) && <option value={member.role}>{member.role}</option>}
                    <option value="admin">Administrator</option>
                    <option value="teacher">Teacher</option>
                    <option value="staff">Staff</option>
                  </select>
                  {member.accountStatus === "invited" ? (
                    <button type="button" disabled={busy} onClick={() => run(`invite-${member.userId}`, () => resendClientInvite(organizationId, member.userId))} className={secondaryButton}>
                      <Mail className="h-3.5 w-3.5" /> Resend invite
                    </button>
                  ) : (
                    <button type="button" disabled={busy || !member.email} onClick={() => run(`reset-${member.userId}`, () => sendClientPasswordReset(organizationId, member.userId))} className={secondaryButton}>
                      <KeyRound className="h-3.5 w-3.5" /> Password reset
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      if (window.confirm(`Remove ${member.email ?? "this user"}'s access to this client?`)) {
                        run(`remove-${member.userId}`, () => removeClientUser(organizationId, member.userId));
                      }
                    }}
                    className="inline-flex items-center rounded border border-red-200 bg-white p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-40"
                    aria-label="Remove user"
                    title="Remove user"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
