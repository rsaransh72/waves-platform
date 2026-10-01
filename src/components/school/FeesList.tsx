"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2,
  X,
  CreditCard,
  Calendar
} from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { toast } from "sonner";
import { describeError } from "@/lib/error-message";
import { useCanManage } from "@/components/school/SchoolSessionContext";
import { formatMoney } from "@/lib/money";
import { useRouter } from "next/navigation";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

export interface FeeStructure {
  id: string;
  name: string;
  amount: number;
  frequency: string;
}

export function FeesList({ initialData }: { initialData: FeeStructure[] }) {
  const router = useRouter();
  const canManage = useCanManage("feeStructures");
  const [fees, setFees] = useState<FeeStructure[]>(initialData);
  const [filteredFees, setFilteredFees] = useState<FeeStructure[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<FeeStructure>>({
    name: "",
    amount: 0,
    frequency: "monthly"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createClient();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = fees.filter(f => 
      f.name.toLowerCase().includes(query) ||
      f.frequency.toLowerCase().includes(query)
    );
    setFilteredFees(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('school_fee_structures')
        .insert([{
          name: formData.name,
          amount: formData.amount,
          frequency: formData.frequency
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newData = [data, ...fees];
        setFees(newData);
        setFilteredFees(newData);
        setIsDrawerOpen(false);
        setFormData({ name: "", amount: 0, frequency: "monthly" });
        router.refresh();
      }
    } catch (error) {
      console.error("Error creating fee structure:", error);
      toast.error(`Could not create fee structure: ${describeError(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-[#e5e5e5] shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#e5e5e5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fafafa]">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
            <input
              type="text"
              placeholder="Search fees..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full h-9 pl-9 pr-4 rounded-md border border-[#cccccc] bg-white text-[13px] text-[#111111] focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] transition-shadow placeholder:text-[#888888]"
            />
          </div>
          
          {canManage && <button
            onClick={() => setIsDrawerOpen(true)}
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
                <th className="py-3 px-4 text-[12px] font-semibold text-[#555555] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e5]">
              {filteredFees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-[#555555] text-[14px]">
                    No fee structures found.
                  </td>
                </tr>
              ) : (
                filteredFees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-[#fafafa] transition-colors group">
                    <td className="py-3 px-4 text-[14px] text-[#111111] font-medium">
                      {fee.name}
                    </td>
                    <td className="py-3 px-4 text-[14px] text-[#111111]">
                      {formatMoney(fee.amount)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium bg-[#f0f9ff] text-[#0284c7] border border-[#e0f2fe] capitalize">
                        {fee.frequency}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="p-1.5 text-[#888888] hover:text-[#111111] hover:bg-[#f4f4f5] rounded transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
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
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e5e5e5]">
              <h3 className="text-[18px] font-semibold text-[#111111]">Create Fee Structure</h3>
              <button onClick={() => setIsDrawerOpen(false)} className="text-[#888888] hover:text-[#111111] p-1 rounded-md hover:bg-[#f4f4f5] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-y-auto">
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Fee Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Term 1 Tuition"
                    className="w-full h-9 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Amount *</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.amount}
                      onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})}
                      placeholder="0.00"
                      className="w-full h-9 pl-9 pr-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Frequency *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                    <select
                      required
                      value={formData.frequency}
                      onChange={e => setFormData({...formData, frequency: e.target.value})}
                      className="w-full h-9 pl-9 pr-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow appearance-none"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                      <option value="one_time">One Time</option>
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
                    {isSubmitting ? 'Saving...' : 'Save Structure'}
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
