"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  CreditCard, 
  FileText,
  IndianRupee,
  X,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  Users
} from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { toast } from "sonner";
import { describeError } from "@/lib/error-message";
import { useRouter } from "next/navigation";
import { formatMoney } from "@/lib/money";
import { schoolToday } from "@/lib/school-date";
import { AmountInput } from "@/components/forms/IndiaInputs";
import { formatDate } from "@/lib/india";
import { AssignFeeDrawer } from "@/components/school/AssignFeeDrawer";

const INVOICE_SELECT = "*, school_students(id, first_name, last_name, roll_number), school_fee_structures(id, name, amount), school_fee_payments(id, receipt_number, amount_paid, payment_date, payment_method)";

const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "bank_transfer", label: "Bank transfer / NEFT" },
  { value: "cheque", label: "Cheque" },
  { value: "card", label: "Card" },
  { value: "other", label: "Other" },
];

function openReceipt(paymentId: string) {
  window.open(`/school/fees/receipts/${paymentId}`, "_blank", "noopener");
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export function FeeCollectionList({ initialInvoices, students, structures, classes }: { initialInvoices: any[], students: any[], structures: any[], classes: any[] }) {
  const router = useRouter();
  const [invoices, setInvoices] = useState<any[]>(initialInvoices);
  const [filteredInvoices, setFilteredInvoices] = useState<any[]>(initialInvoices);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Drawer states
  const [isInvoiceDrawerOpen, setIsInvoiceDrawerOpen] = useState(false);
  const [isPaymentDrawerOpen, setIsPaymentDrawerOpen] = useState(false);
  const [isAssignDrawerOpen, setIsAssignDrawerOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  
  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({ student_id: "", fee_structure_id: "", due_date: "" });
  const [paymentForm, setPaymentForm] = useState({ amount_paid: "", payment_method: "cash", transaction_id: "", paid_on: schoolToday() });

  const supabase = createClient();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = invoices.filter(inv => 
      inv.school_students?.first_name.toLowerCase().includes(query) ||
      inv.school_students?.last_name.toLowerCase().includes(query) ||
      inv.school_fee_structures?.name.toLowerCase().includes(query)
    );
    setFilteredInvoices(filtered);
  };

  // After a bulk assignment, load the list again (it holds its own copy of the rows).
  const reloadInvoices = async () => {
    const { data, error } = await supabase.from("school_student_fees").select(INVOICE_SELECT).order("created_at", { ascending: false });
    if (error) {
      toast.error(`Could not reload the fee list: ${describeError(error)}`);
      return;
    }
    setInvoices(data ?? []);
    setFilteredInvoices(data ?? []);
    setSearchQuery("");
    router.refresh();
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Find amount due from structure
    const structure = structures.find(s => s.id === invoiceForm.fee_structure_id);
    const amountDue = structure ? structure.amount : 0;

    try {
      const { data, error } = await supabase
        .from('school_student_fees')
        .insert([{
          student_id: invoiceForm.student_id,
          fee_structure_id: invoiceForm.fee_structure_id,
          due_date: invoiceForm.due_date,
          amount_due: amountDue,
          amount_paid: 0,
          status: 'pending'
        }])
        .select(INVOICE_SELECT)
        .single();

      if (error) throw error;
      if (data) {
        toast.success("Invoice generated.");
        const newData = [data, ...invoices];
        setInvoices(newData);
        setFilteredInvoices(newData);
        setIsInvoiceDrawerOpen(false);
        setInvoiceForm({ student_id: "", fee_structure_id: "", due_date: "" });
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to generate invoice: ${describeError(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // One database call records the payment, issues the receipt number and updates
      // the invoice together, so concurrent collections cannot double-count.
      const { data: payment, error: paymentError } = await supabase
        .rpc("record_fee_payment", {
          p_student_fee_id: selectedInvoice.id,
          p_amount: Number(paymentForm.amount_paid),
          p_method: paymentForm.payment_method,
          p_reference: paymentForm.transaction_id.trim() || null,
          p_paid_on: paymentForm.paid_on || null,
        })
        .single<{ payment_id: string; receipt_number: string }>();
      if (paymentError) throw paymentError;

      const { data: updatedInvoice, error: updateError } = await supabase
        .from("school_student_fees")
        .select(INVOICE_SELECT)
        .eq("id", selectedInvoice.id)
        .single();
      if (updateError) throw updateError;

      const newData = invoices.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv);
      setInvoices(newData);
      setFilteredInvoices(newData);
      setIsPaymentDrawerOpen(false);
      setPaymentForm({ amount_paid: "", payment_method: "cash", transaction_id: "", paid_on: schoolToday() });
      toast.success(`Payment recorded. Receipt ${payment.receipt_number}.`, {
        action: { label: "Print receipt", onClick: () => openReceipt(payment.payment_id) },
        duration: 10000,
      });
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error(`Failed to record payment: ${describeError(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openPaymentDrawer = (invoice: any) => {
    setSelectedInvoice(invoice);
    const balance = Number(invoice.amount_due) - Number(invoice.amount_paid);
    setPaymentForm({ ...paymentForm, amount_paid: String(Math.round(balance * 100) / 100) });
    setIsPaymentDrawerOpen(true);
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
              placeholder="Search by student or fee name..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full h-9 pl-9 pr-4 rounded-md border border-[#cccccc] bg-white text-[13px] text-[#111111] focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] transition-shadow placeholder:text-[#888888]"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsAssignDrawerOpen(true)}
              className="h-9 px-4 bg-[#0066cc] hover:bg-[#0055bb] text-white text-[13px] font-medium rounded-md flex items-center justify-center gap-2 transition-colors shadow-sm whitespace-nowrap"
            >
              <Users className="w-4 h-4" />
              <span>Assign to classes</span>
            </button>
            <button
              onClick={() => setIsInvoiceDrawerOpen(true)}
              className="h-9 px-4 bg-white hover:bg-[#f4f4f5] border border-[#cccccc] text-[#111111] text-[13px] font-medium rounded-md flex items-center justify-center gap-2 transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>One student</span>
            </button>
          </div>
        </div>

        <AssignFeeDrawer
          isOpen={isAssignDrawerOpen}
          onClose={() => setIsAssignDrawerOpen(false)}
          onAssigned={reloadInvoices}
          students={students}
          classes={classes}
          structures={structures}
          existingFees={invoices}
        />

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f4f4f5] border-b border-[#e5e5e5]">
                <th className="py-3 px-4 text-[12px] font-semibold text-[#555555] uppercase tracking-wider">Student</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-[#555555] uppercase tracking-wider">Fee Details</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-[#555555] uppercase tracking-wider">Amount Due</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-[#555555] uppercase tracking-wider">Balance</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-[#555555] uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-[#555555] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e5]">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#555555] text-[14px]">
                    No invoices found. Generate one to get started.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const balance = Number(inv.amount_due) - Number(inv.amount_paid);
                  return (
                    <tr key={inv.id} className="hover:bg-[#fafafa] transition-colors group">
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#111111] text-[14px]">
                          {inv.school_students?.first_name} {inv.school_students?.last_name}
                        </div>
                        <div className="text-[12px] text-[#888888]">Roll: {inv.school_students?.roll_number || 'N/A'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-[14px] text-[#111111]">{inv.school_fee_structures?.name}</div>
                        <div className="text-[12px] text-[#888888]">Due: {inv.due_date}</div>
                      </td>
                      <td className="py-3 px-4 text-[14px] text-[#111111] font-medium">
                        {formatMoney(inv.amount_due)}
                      </td>
                      <td className="py-3 px-4 text-[14px] text-[#e42525] font-semibold">
                        {formatMoney(balance)}
                        {(inv.school_fee_payments ?? []).filter((payment: any) => payment.receipt_number).length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-x-2 text-[11px] font-normal">
                            {(inv.school_fee_payments ?? []).filter((payment: any) => payment.receipt_number).map((payment: any) => (
                              <button key={payment.id} type="button" onClick={() => openReceipt(payment.id)} className="text-[#0066cc] hover:underline" title={`${formatMoney(payment.amount_paid)} on ${formatDate(payment.payment_date)}`}>
                                {payment.receipt_number}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={
                          `inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[12px] font-medium capitalize border ` +
                          (inv.status === 'paid' ? 'bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]' : 
                           inv.status === 'partial' ? 'bg-[#fffbeb] text-[#b45309] border-[#fde68a]' :
                           inv.status === 'pending_approval' ? 'bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]' :
                           'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]')
                        }>
                          {inv.status === 'paid' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {inv.status === 'pending_approval' ? 'Proof Uploaded' : inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {inv.status !== 'paid' ? (
                          <button 
                            onClick={() => openPaymentDrawer(inv)}
                            className="h-8 px-3 bg-[#e42525] hover:bg-[#d60012] text-white text-[12px] font-medium rounded transition-colors shadow-sm inline-flex items-center gap-1.5"
                          >
                            <IndianRupee className="w-3.5 h-3.5" />
                            Pay Now
                          </button>
                        ) : (
                          <span className="text-[12px] text-[#888888] italic">Settled</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Generation Drawer */}
      {isInvoiceDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setIsInvoiceDrawerOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e5e5e5]">
              <h3 className="text-[18px] font-semibold text-[#111111]">Generate Invoice</h3>
              <button onClick={() => setIsInvoiceDrawerOpen(false)} className="text-[#888888] hover:text-[#111111] p-1 rounded-md hover:bg-[#f4f4f5] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateInvoice} className="flex-1 flex flex-col overflow-y-auto">
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Student *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                    <select
                      required
                      value={invoiceForm.student_id}
                      onChange={e => setInvoiceForm({...invoiceForm, student_id: e.target.value})}
                      className="w-full h-9 pl-9 pr-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow appearance-none"
                    >
                      <option value="">Select Student...</option>
                      {students.map(s => (
                        <option key={s.id} value={s.id}>{s.first_name} {s.last_name}{s.roll_number ? ` (${s.roll_number})` : ""}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Fee Structure *</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                    <select
                      required
                      value={invoiceForm.fee_structure_id}
                      onChange={e => setInvoiceForm({...invoiceForm, fee_structure_id: e.target.value})}
                      className="w-full h-9 pl-9 pr-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow appearance-none"
                    >
                      <option value="">Select Fee Template...</option>
                      {structures.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({formatMoney(s.amount)})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Due Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                    <input
                      type="date"
                      required
                      value={invoiceForm.due_date}
                      onChange={e => setInvoiceForm({...invoiceForm, due_date: e.target.value})}
                      className="w-full h-9 pl-9 pr-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-auto p-6 border-t border-[#e5e5e5] bg-[#fafafa]">
                <div className="flex gap-3">
                  <button type="button" onClick={() => setIsInvoiceDrawerOpen(false)} className="flex-1 h-10 border rounded-md">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 h-10 bg-[#0066cc] text-white rounded-md">{isSubmitting ? 'Generating...' : 'Generate'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Drawer */}
      {isPaymentDrawerOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setIsPaymentDrawerOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e5e5e5] bg-[#0066cc]">
              <h3 className="text-[18px] font-semibold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5" /> Record Payment
              </h3>
              <button onClick={() => setIsPaymentDrawerOpen(false)} className="text-white/80 hover:text-white p-1 rounded-md transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleRecordPayment} className="flex-1 flex flex-col overflow-y-auto">
              <div className="p-6 space-y-6">
                
                {/* Invoice Summary Card */}
                <div className="bg-[#f8fafc] rounded-lg p-4 border border-[#e2e8f0]">
                  <div className="text-[12px] font-medium text-[#64748b] uppercase tracking-wider mb-2">Invoice Summary</div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[14px] text-[#334155]">Student</span>
                    <span className="text-[14px] font-medium text-[#0f172a]">{selectedInvoice.school_students.first_name} {selectedInvoice.school_students.last_name}</span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[14px] text-[#334155]">Fee Type</span>
                    <span className="text-[14px] font-medium text-[#0f172a]">{selectedInvoice.school_fee_structures.name}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 mt-2 border-t border-[#cbd5e1]">
                    <span className="text-[14px] font-medium text-[#e42525]">Balance Due</span>
                    <span className="text-[16px] font-bold text-[#e42525]">{formatMoney(Number(selectedInvoice.amount_due) - Number(selectedInvoice.amount_paid))}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Payment Method *</label>
                  <select
                    required
                    value={paymentForm.payment_method}
                    onChange={e => setPaymentForm({...paymentForm, payment_method: e.target.value})}
                    className="w-full h-11 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                  >
                    {PAYMENT_METHODS.map((method) => <option key={method.value} value={method.value}>{method.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Amount received *</label>
                  <AmountInput
                    id="payment-amount"
                    max={Math.round((Number(selectedInvoice.amount_due) - Number(selectedInvoice.amount_paid)) * 100) / 100}
                    value={paymentForm.amount_paid}
                    onValueChange={(amount_paid) => setPaymentForm((current) => ({ ...current, amount_paid }))}
                    className="w-full h-11 pr-3 rounded-md border border-[#cccccc] bg-white text-[16px] font-medium focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Paid on *</label>
                  <input
                    type="date"
                    required
                    max={schoolToday()}
                    value={paymentForm.paid_on}
                    onChange={e => setPaymentForm({...paymentForm, paid_on: e.target.value})}
                    className="w-full h-11 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                  />
                </div>

                {paymentForm.payment_method !== "cash" && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-[13px] font-medium text-[#333333] mb-1.5">{paymentForm.payment_method === "cheque" ? "Cheque number" : "UTR / transaction reference"} (optional)</label>
                    <input
                      type="text"
                      value={paymentForm.transaction_id}
                      onChange={e => setPaymentForm({...paymentForm, transaction_id: e.target.value.toUpperCase().replace(/[^A-Z0-9/-]/g, "")})}
                      maxLength={30}
                      placeholder={paymentForm.payment_method === "cheque" ? "e.g. 004512" : "e.g. 412345678901"}
                      className="w-full h-11 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                    />
                  </div>
                )}
              </div>
              
              <div className="mt-auto p-6 border-t border-[#e5e5e5] bg-[#fafafa]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-[#10b981] hover:bg-[#059669] text-white text-[15px] font-bold rounded-md flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-70"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {isSubmitting ? 'Processing...' : `Confirm payment of ${formatMoney(Number(paymentForm.amount_paid) || 0)}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
