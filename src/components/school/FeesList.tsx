"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Archive,
  ArchiveRestore,
  X,
  Calendar
} from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { toast } from "sonner";
import { describeError } from "@/lib/error-message";
import { useCanManage } from "@/components/school/SchoolSessionContext";
import { formatMoney } from "@/lib/money";
import { AmountInput } from "@/components/forms/IndiaInputs";
import { useRouter } from "next/navigation";

export interface FeeStructure {
  id: string;
  name: string;
  amount: number;
  frequency: string;
  archived_at?: string | null;
}

const FREQUENCIES = [
  ["monthly", "Monthly"],
  ["quarterly", "Quarterly"],
  ["yearly", "Yearly"],
  ["one_time", "One time"],
] as const;

const frequencyLabel = (value: string) => FREQUENCIES.find(([key]) => key === value)?.[1] ?? value;

export function FeesList({ initialData }: { initialData: FeeStructure[] }) {
  const router = useRouter();
  const canManage = useCanManage("feeStructures");
  const [fees, setFees] = useState<FeeStructure[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<FeeStructure | null>(null);
  const [formData, setFormData] = useState({ name: "", frequency: "monthly" });
  const [amountText, setAmountText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const supabase = createClient();
  const archivedCount = fees.filter((fee) => fee.archived_at).length;
  const query = searchQuery.toLowerCase();
  const visibleFees = fees.filter((fee) =>
    Boolean(fee.archived_at) === showArchived
    && (fee.name.toLowerCase().includes(query) || frequencyLabel(fee.frequency).toLowerCase().includes(query))
  );

  const openDrawer = (fee: FeeStructure | null) => {
    setEditing(fee);
    setFormData({ name: fee?.name ?? "", frequency: fee?.frequency ?? "monthly" });
    setAmountText(fee ? String(Number(fee.amount)) : "");
    setIsDrawerOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = formData.name.trim();
    if (fees.some((fee) => fee.id !== editing?.id && !fee.archived_at && fee.name.trim().toLowerCase() === name.toLowerCase())) {
      toast.error(`There is already a fee called "${name}".`);
      return;
    }
    setIsSubmitting(true);

    try {
      const record = { name, amount: Number(amountText), frequency: formData.frequency };
      const { data, error } = editing
        ? await supabase.from('school_fee_structures').update(record).eq('id', editing.id).select().single()
        : await supabase.from('school_fee_structures').insert([record]).select().single();

      if (error) throw error;

      setFees((current) => editing ? current.map((fee) => fee.id === data.id ? data : fee) : [data, ...current]);
      setIsDrawerOpen(false);
      toast.success(editing ? `"${data.name}" updated.` : `"${data.name}" created. Assign it to classes from Fee Collection.`);
      router.refresh();
    } catch (error) {
      toast.error(`Could not save fee structure: ${describeError(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const setArchived = async (fee: FeeStructure, archive: boolean) => {
    if (archive && !window.confirm(`Archive "${fee.name}"?\n\nIt will no longer be offered when assigning fees. Fees already assigned to students, and their payments, are kept.`)) return;
    setBusyId(fee.id);
    const { data, error } = await supabase
      .from('school_fee_structures')
      .update({ archived_at: archive ? new Date().toISOString() : null })
      .eq('id', fee.id)
      .select()
      .single();
    setBusyId(null);
    if (error) {
      toast.error(`Could not ${archive ? "archive" : "restore"} "${fee.name}": ${describeError(error)}`);
      return;
    }
    setFees((current) => current.map((item) => item.id === data.id ? data : item));
    toast.success(archive ? `"${fee.name}" archived.` : `"${fee.name}" restored.`);
    router.refresh();
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-[#e5e5e5] shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#e5e5e5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fafafa]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full sm:w-auto">
            <div className="relative max-w-md w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
              <input
                type="search"
                aria-label="Search fee structures"
                placeholder="Search fees..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full h-9 pl-9 pr-4 rounded-md border border-[#cccccc] bg-white text-[13px] text-[#111111] focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] transition-shadow placeholder:text-[#888888]"
              />
            </div>
            {archivedCount > 0 && (
              <label className="inline-flex items-center gap-2 text-[13px] text-[#555555]">
                <input type="checkbox" checked={showArchived} onChange={(event) => setShowArchived(event.target.checked)} className="h-4 w-4" />
                Show archived ({archivedCount})
              </label>
            )}
          </div>

          {canManage && <button
            onClick={() => openDrawer(null)}
            className="h-9 px-4 bg-[#0066cc] hover:bg-[#0055bb] text-white text-[13px] font-medium rounded-md flex items-center justify-center gap-2 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Create Structure</span>
          </button>}
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f4f4f5] border-b border-[#e5e5e5]">
                <th className="py-3 px-4 text-[12px] font-semibold text-[#555555] uppercase tracking-wider">Fee Name</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-[#555555] uppercase tracking-wider">Amount</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-[#555555] uppercase tracking-wider">Frequency</th>
                {canManage && <th className="py-3 px-4 text-[12px] font-semibold text-[#555555] uppercase tracking-wider text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e5]">
              {visibleFees.length === 0 ? (
                <tr>
                  <td colSpan={canManage ? 4 : 3} className="py-12 text-center text-[#555555] text-[14px]">
                    {showArchived ? "No archived fee structures." : fees.length === 0 ? "No fee structures yet. Create one for tuition, transport or annual charges." : "No fee structures match your search."}
                  </td>
                </tr>
              ) : (
                visibleFees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-[#fafafa] transition-colors">
                    <td className="py-3 px-4 text-[14px] text-[#111111] font-medium">
                      {fee.name}
                      {fee.archived_at && <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600">Archived</span>}
                    </td>
                    <td className="py-3 px-4 text-[14px] text-[#111111] tabular-nums">
                      {formatMoney(fee.amount)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium bg-[#f0f9ff] text-[#0284c7] border border-[#e0f2fe]">
                        {frequencyLabel(fee.frequency)}
                      </span>
                    </td>
                    {canManage && (
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {fee.archived_at ? (
                          <button type="button" disabled={busyId === fee.id} onClick={() => setArchived(fee, false)} className="inline-flex h-8 items-center gap-1.5 rounded px-2.5 text-[13px] font-medium text-[#0066cc] hover:bg-[#f0f9ff] disabled:opacity-50">
                            <ArchiveRestore className="w-4 h-4" /> Restore
                          </button>
                        ) : (
                          <>
                            <button type="button" onClick={() => openDrawer(fee)} aria-label={`Edit ${fee.name}`} className="inline-flex h-8 items-center gap-1.5 rounded px-2.5 text-[13px] font-medium text-[#333333] hover:bg-[#f4f4f5]">
                              <Edit2 className="w-4 h-4" /> Edit
                            </button>
                            <button type="button" disabled={busyId === fee.id} onClick={() => setArchived(fee, true)} aria-label={`Archive ${fee.name}`} className="inline-flex h-8 items-center gap-1.5 rounded px-2.5 text-[13px] font-medium text-[#555555] hover:bg-[#f4f4f5] disabled:opacity-50">
                              <Archive className="w-4 h-4" /> Archive
                            </button>
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)} />
          <div role="dialog" aria-modal="true" aria-labelledby="fee-drawer-title" className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e5e5e5]">
              <h3 id="fee-drawer-title" className="text-[18px] font-semibold text-[#111111]">{editing ? "Edit Fee Structure" : "Create Fee Structure"}</h3>
              <button type="button" aria-label="Close" onClick={() => setIsDrawerOpen(false)} className="text-[#888888] hover:text-[#111111] p-1 rounded-md hover:bg-[#f4f4f5] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-y-auto">
              <div className="p-6 space-y-5">
                <div>
                  <label htmlFor="fee-name" className="block text-[13px] font-medium text-[#333333] mb-1.5">Fee Name *</label>
                  <input
                    id="fee-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Tuition Fee – Term 1" minLength={2} maxLength={100}
                    className="w-full h-9 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                  />
                </div>

                <div>
                  <label htmlFor="fee-amount" className="block text-[13px] font-medium text-[#333333] mb-1.5">Amount (₹) *</label>
                  <AmountInput
                    id="fee-amount"
                    value={amountText}
                    onValueChange={setAmountText}
                    placeholder="e.g. 12500"
                    className="w-full h-9 pr-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                  />
                  {editing && <p className="mt-1.5 text-[12px] text-[#888888]">A new amount applies to fees assigned from now on. Fees already assigned to students keep their amount.</p>}
                </div>

                <div>
                  <label htmlFor="fee-frequency" className="block text-[13px] font-medium text-[#333333] mb-1.5">Frequency *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                    <select
                      id="fee-frequency"
                      required
                      value={formData.frequency}
                      onChange={e => setFormData({...formData, frequency: e.target.value})}
                      className="w-full h-9 pl-9 pr-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow appearance-none"
                    >
                      {FREQUENCIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-auto p-6 border-t border-[#e5e5e5] bg-[#fafafa]">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex-1 h-10 px-4 border border-[#cccccc] text-[#333333] text-[14px] font-medium rounded-md hover:bg-[#f4f4f5] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-10 px-4 bg-[#0066cc] text-white text-[14px] font-medium rounded-md hover:bg-[#0055bb] transition-colors disabled:opacity-70"
                  >
                    {isSubmitting ? 'Saving...' : editing ? 'Save Changes' : 'Save Structure'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
