import { useState } from "react";
import { Loader2, MessageSquare, CheckCircle, RotateCcw, AlertTriangle } from "lucide-react";
import { useAdminStore } from "@/store/adminStore";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase-browser";
import { formatAdminDateTime } from "@/lib/admin-format";

interface TicketEditorProps {
  initialData: any;
  onClose: () => void;
}

export function TicketEditor({ initialData, onClose }: TicketEditorProps) {
  const { updateTicket } = useAdminStore();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  if (!initialData) return null;

  const handleAction = async (action: string, updates: any, successMessage: string) => {
    setIsProcessing(action);
    try {
      const supabase = createClient();
      updateTicket(initialData.id, updates);
      
      const { error } = await supabase.from("support_tickets").update(updates).eq("id", initialData.id);
      if (error) throw error;
      
      toast.success(successMessage);
      if (action === "resolve" || action === "reply") onClose();
    } catch (e: any) {
      toast.error(`Error: ${e.message}`);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return toast.error("Please enter a reply.");
    setIsProcessing("reply");
    // Simulate sending email
    await new Promise(res => setTimeout(res, 800));
    
    if (initialData.status === 'open') {
      await handleAction("reply", { status: 'pending' }, "Reply sent to customer. Status marked as pending.");
    } else {
      toast.success("Reply sent to customer.");
      onClose();
    }
    setIsProcessing(null);
  };

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <h2 className="text-lg font-bold text-slate-900 mb-1">
          {initialData.subject}
        </h2>
        <div className="flex items-center gap-3 text-sm mt-2">
          <span className="font-medium text-slate-700">{initialData.customer_email}</span>
          <span className="text-slate-300">•</span>
          <span className={`font-bold uppercase ${initialData.priority === 'urgent' ? 'text-red-600' : initialData.priority === 'high' ? 'text-amber-600' : 'text-blue-600'}`}>
            {initialData.priority} Priority
          </span>
          <span className="text-slate-300">•</span>
          <span className={`font-bold capitalize ${initialData.status === 'resolved' ? 'text-emerald-600' : initialData.status === 'open' ? 'text-red-600' : 'text-amber-600'}`}>
            {initialData.status}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Customer Issue */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Original Message</h3>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{initialData.description}</p>
          <div className="mt-4 text-xs text-slate-400">Received on {formatAdminDateTime(initialData.created_at)}</div>
        </div>

        {/* Reply Box */}
        {initialData.status !== 'resolved' && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
            <h3 className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Reply to Customer
            </h3>
            <textarea
              className="w-full rounded-md border border-blue-200 p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[100px] mb-3"
              placeholder="Type your response here. This will be sent as an email to the customer..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <button 
              onClick={handleReply}
              disabled={isProcessing !== null || !replyText.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing === "reply" && <Loader2 className="w-3.5 h-3.5 animate-spin"/>}
              Send Reply
            </button>
          </div>
        )}

        {/* Action Panel */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ticket Actions</h3>
          
          <div className="flex gap-3">
            {initialData.status !== 'resolved' && (
              <button 
                onClick={() => handleAction("resolve", { status: 'resolved' }, "Ticket marked as resolved.")}
                disabled={isProcessing !== null}
                className="flex-1 bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 p-4 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors group shadow-sm"
              >
                <CheckCircle className="w-6 h-6 text-slate-400 group-hover:text-emerald-600" />
                <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-700">Mark Resolved</span>
              </button>
            )}

            {initialData.priority !== 'urgent' && (
              <button 
                onClick={() => handleAction("escalate", { priority: 'urgent' }, "Ticket escalated to urgent.")}
                disabled={isProcessing !== null}
                className="flex-1 bg-white border border-slate-200 hover:border-red-500 hover:bg-red-50 p-4 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors group shadow-sm"
              >
                <AlertTriangle className="w-6 h-6 text-slate-400 group-hover:text-red-600" />
                <span className="text-sm font-bold text-slate-700 group-hover:text-red-700">Escalate to Urgent</span>
              </button>
            )}
            
            {initialData.status === 'resolved' && (
              <button 
                onClick={() => handleAction("reopen", { status: 'open' }, "Ticket reopened.")}
                disabled={isProcessing !== null}
                className="flex-1 bg-white border border-slate-200 hover:border-amber-500 hover:bg-amber-50 p-4 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors group shadow-sm"
              >
                <RotateCcw className="w-6 h-6 text-slate-400 group-hover:text-amber-600" />
                <span className="text-sm font-bold text-slate-700 group-hover:text-amber-700">Reopen Ticket</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
