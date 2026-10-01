import { useState } from "react";
import { Loader2, CheckCircle, RotateCcw, AlertTriangle, Send, FileText } from "lucide-react";
import { useAdminStore } from "@/store/adminStore";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase-browser";
import { formatAdminDate } from "@/lib/admin-format";

interface InvoiceEditorProps {
  initialData: any;
  onClose: () => void;
}

export function InvoiceEditor({ initialData, onClose }: InvoiceEditorProps) {
  const { updateInvoice } = useAdminStore();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  if (!initialData) return null;

  const handleAction = async (action: string, newStatus: string, successMessage: string) => {
    if (!window.confirm(`Are you sure you want to ${action.toLowerCase()}?`)) return;
    
    setIsProcessing(action);
    try {
      const supabase = createClient();
      
      const updates = { status: newStatus };
      updateInvoice(initialData.id, updates);
      
      const { error } = await supabase.from("invoices").update(updates).eq("id", initialData.id);
      if (error) throw error;
      
      toast.success(successMessage);
      onClose();
    } catch (e: any) {
      toast.error(`Error: ${e.message}`);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleSendReminder = async () => {
    setIsProcessing("reminder");
    // Simulate sending email
    await new Promise(res => setTimeout(res, 800));
    toast.success(`Payment reminder sent to ${initialData.organization_name}`);
    setIsProcessing(null);
  };

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-400" />
          {initialData.invoice_number}
        </h2>
        <div className="flex items-center gap-3 text-sm mt-2">
          <span className="font-medium text-slate-700">{initialData.organization_name}</span>
          <span className="text-slate-300">•</span>
          <span className="font-bold text-slate-900">${parseFloat(initialData.amount).toFixed(2)}</span>
          <span className="text-slate-300">•</span>
          <span className={`font-bold uppercase ${initialData.status === 'paid' ? 'text-emerald-600' : initialData.status === 'pending' ? 'text-amber-600' : 'text-red-600'}`}>
            {initialData.status}
          </span>
        </div>
        <div className="mt-2 text-sm text-slate-500">
          Due Date: <strong className="text-slate-700">{formatAdminDate(initialData.due_date)}</strong>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* ACTION: Mark as Paid */}
        {initialData.status === 'pending' && (
          <div className="bg-white border border-emerald-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-sm">Record Manual Payment</h3>
                <p className="text-xs text-slate-500 mt-1 mb-3">Mark this invoice as paid. Use this if the customer paid via wire transfer or check.</p>
                <button 
                  onClick={() => handleAction("Mark as Paid", "paid", "Invoice marked as paid.")}
                  disabled={isProcessing !== null}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-md text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing === "Mark as Paid" && <Loader2 className="w-3.5 h-3.5 animate-spin"/>}
                  Mark as Paid
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ACTION: Send Reminder */}
        {(initialData.status === 'pending' || initialData.status === 'overdue' || initialData.status === 'failed') && (
          <div className="bg-white border border-blue-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                <Send className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-sm">Send Payment Reminder</h3>
                <p className="text-xs text-slate-500 mt-1 mb-3">Send an automated email reminder to the billing contact for this organization.</p>
                <button 
                  onClick={handleSendReminder}
                  disabled={isProcessing !== null}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing === "reminder" && <Loader2 className="w-3.5 h-3.5 animate-spin"/>}
                  Send Reminder
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ACTION: Refund */}
        {initialData.status === 'paid' && (
          <div className="bg-white border border-amber-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-sm">Issue Full Refund</h3>
                <p className="text-xs text-slate-500 mt-1 mb-3">Reverse the payment and return funds to the customer's original payment method.</p>
                <button 
                  onClick={() => handleAction("Issue Refund", "refunded", "Refund processed successfully.")}
                  disabled={isProcessing !== null}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-1.5 rounded-md text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing === "Issue Refund" && <Loader2 className="w-3.5 h-3.5 animate-spin"/>}
                  Process Refund
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ACTION: Void */}
        {(initialData.status === 'pending' || initialData.status === 'failed') && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 text-red-600 rounded-lg shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-red-900 text-sm">Void Invoice</h3>
                <p className="text-xs text-red-700 mt-1 mb-3">Cancel this invoice permanently. This action cannot be undone.</p>
                <button 
                  onClick={() => handleAction("Void Invoice", "voided", "Invoice voided.")}
                  disabled={isProcessing !== null}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing === "Void Invoice" && <Loader2 className="w-3.5 h-3.5 animate-spin"/>}
                  Void Invoice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
