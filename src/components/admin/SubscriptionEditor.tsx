"use client";

import { useState, useEffect } from "react";
import { Loader2, CalendarPlus, ArrowUpCircle, Ban, AlertCircle } from "lucide-react";
import { useAdminStore } from "@/store/adminStore";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase-browser";
import { formatAdminDate } from "@/lib/admin-format";

interface SubscriptionEditorProps {
  initialData: any;
}

export function SubscriptionEditor({ initialData }: SubscriptionEditorProps) {
  const { updateSubscription } = useAdminStore();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  
  const [extendYears, setExtendYears] = useState(1);
  const [newPlan, setNewPlan] = useState("");

  useEffect(() => {
    if (initialData) {
      setNewPlan(initialData.plan_name);
    }
  }, [initialData]);

  if (!initialData) return null;

  const handleExtendTerm = async () => {
    setIsProcessing("extend");
    try {
      const supabase = createClient();
      const currentEnd = new Date(initialData.current_period_end || initialData.next_billing_date);
      currentEnd.setFullYear(currentEnd.getFullYear() + extendYears);
      
      const updates = { 
        current_period_end: currentEnd.toISOString(),
        next_billing_date: currentEnd.toISOString(), // Keep legacy field updated too
        status: 'active', 
        cancel_at_period_end: false,
        reminder_sent_at: null,
      };
      
      updateSubscription(initialData.id, updates);
      
      const { error } = await supabase.from("subscriptions").update(updates).eq("id", initialData.id);
      if (error) throw error;

      const { error: organizationError } = await supabase
        .from("organizations")
        .update({ status: "active" })
        .eq("id", initialData.organization_id)
        .eq("status", "suspended");
      if (organizationError) throw organizationError;
      
      toast.success(`Term extended by ${extendYears} year(s). Invoice generated.`);
    } catch (e: any) {
      toast.error(`Error: ${e.message}`);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleChangePlan = async () => {
    if (newPlan === initialData.plan_name) return;
    setIsProcessing("plan");
    try {
      const supabase = createClient();
      
      const updates = { plan_name: newPlan };
      updateSubscription(initialData.id, updates);
      
      const { error } = await supabase.from("subscriptions").update(updates).eq("id", initialData.id);
      if (error) throw error;
      
      toast.success(`Plan updated to ${newPlan}. Prorated charges applied.`);
    } catch (e: any) {
      toast.error(`Error: ${e.message}`);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this subscription at the end of the current term?")) return;
    setIsProcessing("cancel");
    try {
      const supabase = createClient();
      
      const updates = { cancel_at_period_end: true };
      updateSubscription(initialData.id, updates);
      
      const { error } = await supabase.from("subscriptions").update(updates).eq("id", initialData.id);
      if (error) throw error;
      
      toast.success(`Subscription set to cancel at term end.`);
    } catch (e: any) {
      toast.error(`Error: ${e.message}`);
    } finally {
      setIsProcessing(null);
    }
  };

  const currentEndDate = initialData.current_period_end || initialData.next_billing_date;

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <h2 className="text-lg font-bold text-slate-900 mb-1">
          {initialData.organization_name}
        </h2>
        <div className="flex items-center gap-3 text-sm">
          <span className="font-medium text-slate-700">{initialData.plan_name}</span>
          <span className="text-slate-300">•</span>
          <span className={`font-bold ${initialData.status === 'active' ? 'text-emerald-600' : 'text-red-600'}`}>
            {initialData.status.toUpperCase()}
          </span>
          {initialData.cancel_at_period_end && (
            <>
              <span className="text-slate-300">•</span>
              <span className="text-amber-600 font-bold flex items-center gap-1">
                <AlertCircle className="w-3 h-3"/> Cancels at term end
              </span>
            </>
          )}
        </div>
        <div className="mt-2 text-sm text-slate-500">
          Current term ends on: <strong className="text-slate-700">{formatAdminDate(currentEndDate)}</strong>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* ACTION: Extend Term */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <CalendarPlus className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 text-sm">Extend Subscription Term</h3>
              <p className="text-xs text-slate-500 mt-1 mb-3">Add years to the current contract. This will generate a pending renewal invoice.</p>
              
              <div className="flex items-center gap-3">
                <select 
                  value={extendYears}
                  onChange={(e) => setExtendYears(Number(e.target.value))}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value={1}>1 Year</option>
                  <option value={2}>2 Years</option>
                  <option value={3}>3 Years</option>
                </select>
                <button 
                  onClick={handleExtendTerm}
                  disabled={isProcessing !== null}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing === "extend" && <Loader2 className="w-3.5 h-3.5 animate-spin"/>}
                  Process Extension
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION: Change Plan */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
              <ArrowUpCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 text-sm">Change Plan Tier</h3>
              <p className="text-xs text-slate-500 mt-1 mb-3">Upgrading mid-term will instantly calculate and charge a prorated amount.</p>
              
              <div className="flex items-center gap-3">
                <select 
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                >
                  <option value="Basic Plan">Basic Plan</option>
                  <option value="Pro Plan">Pro Plan</option>
                  <option value="Enterprise Plan">Enterprise Plan</option>
                </select>
                <button 
                  onClick={handleChangePlan}
                  disabled={isProcessing !== null || newPlan === initialData.plan_name}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing === "plan" && <Loader2 className="w-3.5 h-3.5 animate-spin"/>}
                  Update Plan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION: Cancel */}
        <div className="bg-red-50 border border-red-100 rounded-lg p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg shrink-0">
              <Ban className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-red-900 text-sm">Cancel Subscription</h3>
              <p className="text-xs text-red-700 mt-1 mb-3">
                Set this subscription to automatically cancel at the end of its current term ({formatAdminDate(currentEndDate)}).
              </p>
              <button 
                onClick={handleCancel}
                disabled={isProcessing !== null || initialData.cancel_at_period_end}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing === "cancel" && <Loader2 className="w-3.5 h-3.5 animate-spin"/>}
                {initialData.cancel_at_period_end ? "Already Scheduled for Cancellation" : "Cancel at Term End"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
