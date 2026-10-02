import { useState } from "react";
import { Loader2, CheckCircle, RotateCcw, AlertTriangle, FileText } from "lucide-react";
import { useAdminStore } from "@/store/adminStore";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase-browser";
import { formatAdminDate } from "@/lib/admin-format";
import { formatMoney } from "@/lib/money";

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
      
      const updates = newStatus === "paid" ? { status: newStatus, paid_at: new Date().toISOString() } : { status: newStatus };
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
          <span className="font-bold text-slate-900">{formatMoney(initialData.amount)}</span>
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
                <p className="text-xs text-slate-500 mt-1 mb-3">Mark this invoice as paid today. To record the method and UTR/reference, use Record payment on the client page.</p>
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

        {/* ACTION: Refund */}
        {initialData.status === 'paid' && (
          <div className="bg-white border border-amber-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-sm">Mark as Refunded</h3>
                <p className="text-xs text-slate-500 mt-1 mb-3">Record that this payment was refunded. Return the money to the client separately.</p>
                <button 
                  onClick={() => handleAction("Mark as Refunded", "refunded", "Invoice marked as refunded.")}
                  disabled={isProcessing !== null}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-1.5 rounded-md text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing === "Mark as Refunded" && <Loader2 className="w-3.5 h-3.5 animate-spin"/>}
                  Mark as Refunded
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
                  onClick={() => handleAction("Void Invoice", "void", "Invoice voided.")}
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
