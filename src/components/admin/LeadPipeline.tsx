"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Building, CalendarClock, Loader2, Mail, MessageCircle, Phone, Plus, Rocket, Search, Trash2 } from "lucide-react";
import { Drawer } from "./Drawer";
import { createClient } from "@/lib/supabase-browser";
import { formatAdminDate, formatAdminDateTime } from "@/lib/admin-format";
import { addLeadNote, createLead, deleteLead, updateLeadPipeline, type LeadActionResult } from "@/app/actions/leads";
import { INQUIRY_LABELS, LEAD_STATUSES, LEAD_STATUS_HINTS, LEAD_STATUS_LABELS, OPEN_LEAD_STATUSES, type LeadStatus } from "@/lib/lead-pipeline";

type Lead = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  organization_name: string | null;
  product: string | null;
  city: string | null;
  team_size: string | null;
  message: string | null;
  status: LeadStatus;
  source: string | null;
  inquiry_type: string | null;
  next_follow_up: string | null;
  lost_reason: string | null;
  organization_id: string | null;
  created_at: string;
};

type Note = { id: string; body: string; author_email: string | null; created_at: string };

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "text-blue-700 bg-blue-50 border-blue-200",
  contacted: "text-amber-700 bg-amber-50 border-amber-200",
  demo_scheduled: "text-purple-700 bg-purple-50 border-purple-200",
  qualified: "text-indigo-700 bg-indigo-50 border-indigo-200",
  converted: "text-emerald-700 bg-emerald-50 border-emerald-200",
  lost: "text-slate-600 bg-slate-100 border-slate-300",
};

const inputClass = "w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

function digits(value: string) {
  return value.replace(/[^\d+]/g, "");
}

function useAction() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const run = (action: () => Promise<LeadActionResult>, onSuccess?: () => void) => {
    startTransition(async () => {
      const result = await action();
      if (result.error) {
        toast.error(result.error);
        return;
      }
      if (result.message) toast.success(result.message);
      onSuccess?.();
      router.refresh();
    });
  };
  return { run, isPending };
}

export function LeadPipeline({ leads, products, today, openCreate = false }: { leads: Lead[]; products: Array<{ slug: string; title: string; status: string }>; today: string; openCreate?: boolean }) {
  const [filter, setFilter] = useState<"open" | "due" | LeadStatus | "all">("open");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(openCreate);
  const productTitles = useMemo(() => new Map(products.map((product) => [product.slug, product.title])), [products]);
  const selected = leads.find((lead) => lead.id === selectedId) ?? null;

  const isDue = (lead: Lead) => OPEN_LEAD_STATUSES.includes(lead.status) && (lead.status === "new" || (lead.next_follow_up !== null && lead.next_follow_up <= today));

  const counts = useMemo(() => {
    const result: Record<string, number> = { all: leads.length, open: 0, due: 0 };
    for (const lead of leads) {
      result[lead.status] = (result[lead.status] ?? 0) + 1;
      if (OPEN_LEAD_STATUSES.includes(lead.status)) result.open += 1;
      if (isDue(lead)) result.due += 1;
    }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leads, today]);

  const visible = leads.filter((lead) => {
    const matchesFilter = filter === "all" ? true
      : filter === "open" ? OPEN_LEAD_STATUSES.includes(lead.status)
      : filter === "due" ? isDue(lead)
      : lead.status === filter;
    if (!matchesFilter) return false;
    const needle = query.trim().toLowerCase();
    return !needle || [lead.name, lead.email, lead.phone, lead.organization_name, lead.city].some((value) => value?.toLowerCase().includes(needle));
  });

  const tabs: Array<{ key: typeof filter; label: string }> = [
    { key: "open", label: "Open" },
    { key: "due", label: "Follow-up due" },
    ...LEAD_STATUSES.map((status) => ({ key: status, label: LEAD_STATUS_LABELS[status] })),
    { key: "all", label: "All" },
  ];

  return (
    <div className="flex flex-col space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Leads</h1>
          <p className="text-sm font-medium text-slate-500">Every enquiry from the website, and ones you add by hand. Work each one to Converted or Lost.</p>
        </div>
        <button type="button" onClick={() => setIsCreating(true)} className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 shadow-sm">
          <Plus className="h-4 w-4" /> Add lead
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${filter === tab.key ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}
          >
            {tab.label} <span className={filter === tab.key ? "text-blue-100" : "text-slate-400"}>{counts[tab.key] ?? 0}</span>
          </button>
        ))}
      </div>

      <label className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, phone, email, school..." className={`${inputClass} pl-9`} />
      </label>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Request</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Follow-up</th>
              <th className="px-4 py-3">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-500">No leads here.</td></tr>
            ) : visible.map((lead) => (
              <tr key={lead.id} onClick={() => setSelectedId(lead.id)} className="cursor-pointer hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="font-bold text-slate-900">{lead.name}</div>
                  {lead.organization_name && <div className="flex items-center gap-1 text-xs text-slate-500"><Building className="h-3 w-3" /> {lead.organization_name}{lead.city ? `, ${lead.city}` : ""}</div>}
                </td>
                <td className="px-4 py-3">
                  <div className="text-slate-800">{INQUIRY_LABELS[lead.inquiry_type ?? "demo"] ?? "Enquiry"}</div>
                  <div className="text-xs text-slate-500">{lead.product && lead.product !== "general" ? productTitles.get(lead.product) ?? lead.product : "No product chosen"}</div>
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">
                  {lead.phone && <div className="flex items-center gap-1"><Phone className="h-3 w-3" /> {lead.phone}</div>}
                  {lead.email && <div className="flex items-center gap-1"><Mail className="h-3 w-3" /> {lead.email}</div>}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${STATUS_STYLES[lead.status] ?? STATUS_STYLES.new}`}>{LEAD_STATUS_LABELS[lead.status] ?? lead.status}</span>
                </td>
                <td className="px-4 py-3 text-xs whitespace-nowrap">
                  {lead.next_follow_up
                    ? <span className={lead.next_follow_up <= today && OPEN_LEAD_STATUSES.includes(lead.status) ? "font-bold text-red-600" : "text-slate-600"}>{formatAdminDate(`${lead.next_follow_up}T12:00:00Z`)}</span>
                    : lead.status === "new" ? <span className="font-bold text-red-600">Call now</span> : <span className="text-slate-400">—</span>}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{formatAdminDateTime(lead.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Drawer isOpen={selected !== null} onClose={() => setSelectedId(null)} title={selected?.name ?? "Lead"}>
        {selected && <LeadDetail key={selected.id} lead={selected} productTitle={selected.product && selected.product !== "general" ? productTitles.get(selected.product) ?? selected.product : null} onClose={() => setSelectedId(null)} />}
      </Drawer>

      <Drawer isOpen={isCreating} onClose={() => setIsCreating(false)} title="Add a lead">
        {isCreating && <NewLeadForm products={products.filter((product) => product.status === "published")} onDone={() => setIsCreating(false)} />}
      </Drawer>
    </div>
  );
}

function LeadDetail({ lead, productTitle, onClose }: { lead: Lead; productTitle: string | null; onClose: () => void }) {
  const { run, isPending } = useAction();
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [followUp, setFollowUp] = useState(lead.next_follow_up ?? "");
  const [lostReason, setLostReason] = useState(lead.lost_reason ?? "");
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const converted = lead.status === "converted";

  const loadNotes = async () => {
    const { data } = await createClient().from("lead_notes").select("id, body, author_email, created_at").eq("lead_id", lead.id).order("created_at", { ascending: false });
    setNotes(data ?? []);
  };

  useEffect(() => {
    let current = true;
    void createClient()
      .from("lead_notes")
      .select("id, body, author_email, created_at")
      .eq("lead_id", lead.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => { if (current) setNotes(data ?? []); });
    return () => { current = false; };
  }, [lead.id]);

  const onboardHref = `/admin/onboarding?lead=${lead.id}`;

  return (
    <div className="space-y-6 p-1 pb-16">
      <div className="flex flex-wrap gap-2">
        {lead.phone && <a href={`tel:${digits(lead.phone)}`} className="inline-flex items-center gap-1.5 rounded border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"><Phone className="h-3.5 w-3.5" /> Call</a>}
        {lead.phone && <a href={`https://wa.me/${digits(lead.phone).replace(/^\+/, "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"><MessageCircle className="h-3.5 w-3.5" /> WhatsApp</a>}
        {lead.email && <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1.5 rounded border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"><Mail className="h-3.5 w-3.5" /> Email</a>}
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div><dt className="text-xs font-bold uppercase text-slate-400">Request</dt><dd className="text-slate-900">{INQUIRY_LABELS[lead.inquiry_type ?? "demo"] ?? "Enquiry"}</dd></div>
        <div><dt className="text-xs font-bold uppercase text-slate-400">Product</dt><dd className="text-slate-900">{productTitle ?? "Not chosen"}</dd></div>
        <div><dt className="text-xs font-bold uppercase text-slate-400">Phone</dt><dd className="text-slate-900">{lead.phone || "—"}</dd></div>
        <div><dt className="text-xs font-bold uppercase text-slate-400">Email</dt><dd className="break-all text-slate-900">{lead.email || "—"}</dd></div>
        <div><dt className="text-xs font-bold uppercase text-slate-400">Organization</dt><dd className="text-slate-900">{lead.organization_name || "—"}</dd></div>
        <div><dt className="text-xs font-bold uppercase text-slate-400">City</dt><dd className="text-slate-900">{lead.city || "—"}</dd></div>
        <div><dt className="text-xs font-bold uppercase text-slate-400">Size</dt><dd className="text-slate-900">{lead.team_size || "—"}</dd></div>
        <div><dt className="text-xs font-bold uppercase text-slate-400">Received</dt><dd className="text-slate-900">{formatAdminDateTime(lead.created_at)} · {lead.source ?? "website"}</dd></div>
      </dl>
      {lead.message && <p className="whitespace-pre-line rounded bg-slate-50 p-3 text-sm text-slate-700">{lead.message}</p>}

      {converted ? (
        <div className="rounded border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          Converted to a client.{" "}
          {lead.organization_id && <Link href={`/admin/organizations/${lead.organization_id}`} className="font-bold underline">Open client</Link>}
        </div>
      ) : (
        <>
          <form
            className="space-y-3 rounded-lg border border-slate-200 p-4"
            onSubmit={(event) => {
              event.preventDefault();
              run(() => updateLeadPipeline(lead.id, { status, next_follow_up: followUp, lost_reason: lostReason }));
            }}
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-600">Stage</label>
                <select value={status} onChange={(event) => setStatus(event.target.value as LeadStatus)} className={inputClass}>
                  {LEAD_STATUSES.filter((item) => item !== "converted").map((item) => <option key={item} value={item}>{LEAD_STATUS_LABELS[item]}</option>)}
                </select>
              </div>
              {status !== "lost" ? (
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-600">Next follow-up</label>
                  <input type="date" value={followUp} onChange={(event) => setFollowUp(event.target.value)} className={inputClass} />
                </div>
              ) : (
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-600">Reason lost *</label>
                  <input value={lostReason} onChange={(event) => setLostReason(event.target.value)} placeholder="e.g. Chose another vendor" className={inputClass} />
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500">{LEAD_STATUS_HINTS[status]}</p>
            <button type="submit" disabled={isPending} className="inline-flex items-center gap-2 rounded bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />} Save stage
            </button>
          </form>

          <Link href={onboardHref} className="flex items-center justify-center gap-2 rounded bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700">
            <Rocket className="h-4 w-4" /> Onboard as client
          </Link>
        </>
      )}

      <section>
        <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900"><CalendarClock className="h-4 w-4 text-slate-400" /> Notes</h3>
        <form
          className="space-y-2"
          onSubmit={(event) => {
            event.preventDefault();
            run(() => addLeadNote(lead.id, noteDraft), () => { setNoteDraft(""); void loadNotes(); });
          }}
        >
          <textarea value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} rows={3} placeholder="What was discussed, what was promised, next step..." className={inputClass} />
          <button type="submit" disabled={isPending || !noteDraft.trim()} className="rounded border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40">Add note</button>
        </form>
        <ol className="mt-4 space-y-3">
          {notes === null && <li className="text-xs text-slate-400">Loading notes...</li>}
          {notes?.length === 0 && <li className="text-xs text-slate-400">No notes yet.</li>}
          {notes?.map((note) => (
            <li key={note.id} className="rounded border border-slate-100 bg-slate-50 p-3">
              <p className="whitespace-pre-line text-sm text-slate-800">{note.body}</p>
              <p className="mt-1 text-[11px] text-slate-400">{note.author_email ?? "Admin"} · {formatAdminDateTime(note.created_at)}</p>
            </li>
          ))}
        </ol>
      </section>

      {!converted && (
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Delete the lead "${lead.name}"? Use this only for spam or duplicates.`)) run(() => deleteLead(lead.id), onClose);
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:underline"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete (spam or duplicate)
        </button>
      )}
    </div>
  );
}

function NewLeadForm({ products, onDone }: { products: Array<{ slug: string; title: string }>; onDone: () => void }) {
  const { run, isPending } = useAction();
  const [form, setForm] = useState({ name: "", phone: "", email: "", organization_name: "", city: "", product: products[0]?.slug ?? "", inquiry_type: "demo", source: "phone", message: "" });
  const update = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm({ ...form, [field]: event.target.value });

  return (
    <form className="space-y-4 p-1" onSubmit={(event) => { event.preventDefault(); run(() => createLead(form), onDone); }}>
      <div><label className="mb-1 block text-xs font-bold text-slate-600">Name *</label><input value={form.name} onChange={update("name")} required className={inputClass} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="mb-1 block text-xs font-bold text-slate-600">Phone</label><input type="tel" value={form.phone} onChange={update("phone")} className={inputClass} /></div>
        <div><label className="mb-1 block text-xs font-bold text-slate-600">Email</label><input type="email" value={form.email} onChange={update("email")} className={inputClass} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="mb-1 block text-xs font-bold text-slate-600">Organization</label><input value={form.organization_name} onChange={update("organization_name")} className={inputClass} /></div>
        <div><label className="mb-1 block text-xs font-bold text-slate-600">City</label><input value={form.city} onChange={update("city")} className={inputClass} /></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-600">Product</label>
          <select value={form.product} onChange={update("product")} className={inputClass}>
            <option value="general">Not decided</option>
            {products.map((product) => <option key={product.slug} value={product.slug}>{product.title}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-600">Request</label>
          <select value={form.inquiry_type} onChange={update("inquiry_type")} className={inputClass}>
            {Object.entries(INQUIRY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-600">Came via</label>
          <select value={form.source} onChange={update("source")} className={inputClass}>
            <option value="phone">Phone call</option>
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="referral">Referral</option>
            <option value="visit">Visit / event</option>
            <option value="manual">Other</option>
          </select>
        </div>
      </div>
      <div><label className="mb-1 block text-xs font-bold text-slate-600">Notes from the conversation</label><textarea value={form.message} onChange={update("message")} rows={3} className={inputClass} /></div>
      <button type="submit" disabled={isPending} className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50">
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />} Add lead
      </button>
    </form>
  );
}
