"use client";

import { useState } from "react";
import { CreditCard, UploadCloud, CheckCircle2, Clock, IndianRupee, X } from "lucide-react";
import { formatMoney } from "@/lib/money";
import { formatDate } from "@/lib/india";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function ParentPortalView({ student, invoices: initialInvoices }: { student: any, invoices: any[] }) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [paymentMode, setPaymentMode] = useState<'online' | 'offline' | null>(null);
  
  // Offline payment states
  const [receiptUrl, setReceiptUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleOfflineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, we'd use Supabase client here, but since the parent isn't authenticated with the main org, 
      // we would use a public Edge Function or an API route. 
      // For this UI mockup, we will hit a Next.js API route we'll create next.
      const res = await fetch(`/api/portal/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoice_id: selectedInvoice.id,
          amount_paid: Number(selectedInvoice.amount_due) - Number(selectedInvoice.amount_paid),
          receipt_url: receiptUrl,
          payment_method: 'offline_upload'
        })
      });

      if (!res.ok) throw new Error("Failed to submit");
      
      setSuccessMsg("Proof of payment submitted successfully! Awaiting school approval.");
      setTimeout(() => {
        setPaymentMode(null);
        setSelectedInvoice(null);
        setSuccessMsg("");
        // Optimistically update UI
        setInvoices(invoices.map(inv => inv.id === selectedInvoice.id ? { ...inv, status: 'pending_approval' } : inv));
      }, 3000);
    } catch (err) {
      alert("Error submitting payment proof.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOnlinePayment = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/portal/payment/online', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoice_id: selectedInvoice.id,
          amount_paid: Number(selectedInvoice.amount_due) - Number(selectedInvoice.amount_paid),
          success_url: window.location.origin + window.location.pathname,
          cancel_url: window.location.origin + window.location.pathname,
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      if (data.url) {
        window.location.href = data.url; // Redirect to the payment gateway
      }
    } catch (err: any) {
      alert("Failed to initiate payment: " + err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] font-sans text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 py-4 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Waves School</h1>
              <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Parent Portal</p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-slate-900">{student.first_name} {student.last_name}</div>
            <div className="text-xs text-slate-500">Roll No: {student.roll_number}</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto mt-8 px-4 sm:px-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Outstanding Fees & Invoices</h2>
          </div>
          
          <div className="divide-y divide-slate-100">
            {invoices.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No invoices found.</div>
            ) : (
              invoices.map(inv => {
                const balance = Number(inv.amount_due) - Number(inv.amount_paid);
                return (
                  <div key={inv.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-base">{inv.fee_name}</h3>
                      <p className="text-sm text-slate-500 mt-1">Due Date: {formatDate(inv.due_date)}</p>
                      
                      <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border capitalize bg-white shadow-sm">
                        {inv.status === 'paid' && <><CheckCircle2 className="w-3.5 h-3.5 text-green-600"/> <span className="text-green-700">Paid in Full</span></>}
                        {inv.status === 'pending' && <><Clock className="w-3.5 h-3.5 text-red-500"/> <span className="text-red-700">Payment Due</span></>}
                        {inv.status === 'partial' && <><Clock className="w-3.5 h-3.5 text-amber-500"/> <span className="text-amber-700">Partially Paid</span></>}
                        {inv.status === 'pending_approval' && <><Clock className="w-3.5 h-3.5 text-blue-500"/> <span className="text-blue-700">Proof Uploaded (Awaiting Approval)</span></>}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:items-end gap-3">
                      <div className="text-2xl font-bold text-slate-900">
                        {formatMoney(balance)}
                      </div>
                      
                      {(inv.status === 'pending' || inv.status === 'partial') && (
                        <button 
                          onClick={() => setSelectedInvoice(inv)}
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                        >
                          <CreditCard className="w-4 h-4" />
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isSubmitting && setSelectedInvoice(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {!paymentMode ? (
              <>
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-900">Select Payment Method</h3>
                  <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-full"><X className="w-4 h-4"/></button>
                </div>
                <div className="p-6 space-y-4">
                  <button 
                    onClick={() => setPaymentMode('online')}
                    className="w-full p-4 border-2 border-slate-200 hover:border-blue-500 rounded-xl flex items-center gap-4 transition-all group text-left"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-base">Pay Online (UPI / Net Banking / Card)</div>
                      <div className="text-sm text-slate-500 mt-0.5">Instant secure payment by UPI, net banking or card.</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => setPaymentMode('offline')}
                    className="w-full p-4 border-2 border-slate-200 hover:border-emerald-500 rounded-xl flex items-center gap-4 transition-all group text-left"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-base">Upload Offline Receipt</div>
                      <div className="text-sm text-slate-500 mt-0.5">Paid cash at desk or bank transfer? Upload proof here.</div>
                    </div>
                  </button>
                </div>
              </>
            ) : paymentMode === 'offline' ? (
              <form onSubmit={handleOfflineSubmit} className="flex flex-col h-full">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-emerald-600">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2"><UploadCloud className="w-5 h-5"/> Upload Receipt</h3>
                  <button type="button" onClick={() => setPaymentMode(null)} className="text-white/80 hover:text-white p-1 rounded-full"><X className="w-5 h-5"/></button>
                </div>
                
                <div className="p-6 space-y-5">
                  {successMsg ? (
                    <div className="p-4 bg-emerald-50 text-emerald-700 rounded-lg flex items-center gap-3 border border-emerald-200 animate-in fade-in">
                      <CheckCircle2 className="w-6 h-6 shrink-0" />
                      <p className="font-medium text-sm">{successMsg}</p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div className="text-sm text-slate-500">Amount Due</div>
                        <div className="text-xl font-bold text-slate-900">{formatMoney(Number(selectedInvoice.amount_due) - Number(selectedInvoice.amount_paid))}</div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Receipt / Screenshot URL</label>
                        <input
                          type="url"
                          required
                          value={receiptUrl}
                          onChange={e => setReceiptUrl(e.target.value)}
                          placeholder="https://drive.google.com/file/..."
                          className="w-full h-11 px-3 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-shadow text-sm"
                        />
                        <p className="text-xs text-slate-500 mt-2">Please paste a link to your Google Drive, Dropbox, or image hosting receipt.</p>
                      </div>
                    </>
                  )}
                </div>

                {!successMsg && (
                  <div className="p-6 pt-0 mt-auto">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? 'Uploading...' : 'Submit Proof of Payment'}
                    </button>
                  </div>
                )}
              </form>
            ) : (
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-blue-600">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2"><CreditCard className="w-5 h-5"/> Secure Online Checkout</h3>
                  <button type="button" onClick={() => setPaymentMode(null)} className="text-white/80 hover:text-white p-1 rounded-full"><X className="w-5 h-5"/></button>
                </div>
                <div className="p-8 text-center space-y-6">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                    <IndianRupee className="w-10 h-10 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-slate-900">{formatMoney(Number(selectedInvoice.amount_due) - Number(selectedInvoice.amount_paid))}</div>
                    <div className="text-sm text-slate-500 mt-1">{selectedInvoice.fee_name}</div>
                  </div>
                  
                  <button
                    onClick={handleOnlinePayment}
                    disabled={isSubmitting}
                    className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors disabled:opacity-70"
                  >
                    {isSubmitting ? 'Connecting...' : 'Pay now'}
                  </button>
                </div>
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
}
