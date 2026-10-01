"use client";

import { useState } from "react";
import { Zap, Plus, Save, X, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { toast } from "sonner";
import { useAdminStore } from "@/store/adminStore";

import { useRouter } from "next/navigation";

export function AutomationBuilder({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const { addAutomationRule, updateAutomationRule } = useAdminStore();
  const [formData, setFormData] = useState<any>(initialData || {
    name: "",
    trigger_event: "USER_CREATED",
    conditions: [],
    actions: [],
    is_active: true
  });

  const handleSave = async () => {
    const supabase = createClient();
    try {
      if (initialData?.id) {
        const { error } = await supabase.from("automation_rules").update(formData).eq("id", initialData.id);
        if (error) throw error;
        toast.success("Rule updated successfully");
      } else {
        const { error } = await supabase.from("automation_rules").insert([formData]);
        if (error) throw error;
        toast.success("Rule created successfully");
      }
      router.push("/admin/automations");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const addCondition = () => {
    setFormData({ ...formData, conditions: [...formData.conditions, { field: "email", operator: "contains", value: "" }] });
  };

  const addAction = () => {
    setFormData({ ...formData, actions: [...formData.actions, { type: "SEND_EMAIL", template: "welcome" }] });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-6 overflow-auto flex-1">
        {/* Basic Info */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 shadow-sm">
          <label className="block text-sm font-bold text-slate-700 mb-1">Rule Name</label>
          <input 
            type="text" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none" 
            placeholder="e.g. VIP User Onboarding"
          />
        </div>

        {/* TRIGGER */}
        <div className="bg-white p-4 rounded-xl border-l-4 border-l-purple-500 border border-slate-200 mb-6 shadow-sm">
          <h3 className="font-black text-slate-800 flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-purple-600" />
            1. When this happens... (Trigger)
          </h3>
          <select 
            value={formData.trigger_event}
            onChange={e => setFormData({...formData, trigger_event: e.target.value})}
            className="w-full border border-slate-300 rounded p-2 text-sm bg-slate-50"
          >
            <optgroup label="User & Identity">
              <option value="USER_CREATED">User Created</option>
              <option value="USER_UPDATED">User Updated</option>
              <option value="USER_SUSPENDED">User Suspended</option>
              <option value="USER_LOGIN">User Logged In</option>
              <option value="PASSWORD_RESET_REQUESTED">Password Reset Requested</option>
              <option value="ACCOUNT_VERIFIED">Account Verified</option>
            </optgroup>
            <optgroup label="Support & Service">
              <option value="TICKET_CREATED">Ticket Created</option>
              <option value="TICKET_UPDATED">Ticket Updated</option>
              <option value="TICKET_RESOLVED">Ticket Resolved</option>
              <option value="TICKET_ESCALATED">Ticket Escalated</option>
              <option value="SLA_BREACHED">SLA Breached</option>
            </optgroup>
            <optgroup label="Billing & Revenue">
              <option value="SUB_CREATED">Subscription Started</option>
              <option value="SUB_CANCELED">Subscription Canceled</option>
              <option value="SUB_UPGRADED">Subscription Upgraded</option>
              <option value="SUB_DOWNGRADED">Subscription Downgraded</option>
              <option value="INVOICE_PAID">Invoice Paid</option>
              <option value="INVOICE_FAILED">Invoice Failed</option>
              <option value="TRIAL_ENDING">Trial Ending Soon</option>
              <option value="PAYMENT_DISPUTED">Payment Disputed (Chargeback)</option>
            </optgroup>
            <optgroup label="Product & Usage">
              <option value="LIMIT_REACHED">Usage Limit Reached</option>
              <option value="FEATURE_USED">Specific Feature Used</option>
              <option value="NPS_SUBMITTED">NPS Score Submitted</option>
            </optgroup>
            <optgroup label="Marketing & Sales">
              <option value="LEAD_CAPTURED">New Lead Captured</option>
              <option value="DEMO_BOOKED">Demo Booked</option>
              <option value="CART_ABANDONED">Cart Abandoned</option>
            </optgroup>
            <optgroup label="System & Security">
              <option value="SECURITY_ALERT">Security Alert</option>
              <option value="SYSTEM_ERROR">System Error</option>
              <option value="NEW_DEVICE_LOGIN">New Device Login</option>
            </optgroup>
          </select>
        </div>

        <div className="flex justify-center -my-3 relative z-10">
          <div className="bg-slate-200 p-1 rounded-full"><ArrowRight className="w-4 h-4 text-slate-400 rotate-90" /></div>
        </div>

        {/* CONDITIONS */}
        <div className="bg-white p-4 rounded-xl border-l-4 border-l-blue-500 border border-slate-200 mt-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-slate-800 flex items-center gap-2">
              2. Only if... (Conditions)
            </h3>
            <button onClick={addCondition} className="text-xs bg-blue-50 text-blue-600 font-bold px-2 py-1 rounded hover:bg-blue-100 transition-colors">
              + Add Condition
            </button>
          </div>
          
          {formData.conditions.length === 0 ? (
            <p className="text-sm text-slate-400 italic">Rule will run every time.</p>
          ) : (
            <div className="space-y-3">
              {formData.conditions.map((c: any, i: number) => (
                <div key={i} className="flex gap-2 items-center">
                  <input type="text" placeholder="Field (e.g. email)" value={c.field} onChange={(e) => {
                    const newC = [...formData.conditions]; newC[i].field = e.target.value; setFormData({...formData, conditions: newC});
                  }} className="flex-1 border border-slate-300 rounded p-1.5 text-sm" />
                  
                  <select value={c.operator} onChange={(e) => {
                    const newC = [...formData.conditions]; newC[i].operator = e.target.value; setFormData({...formData, conditions: newC});
                  }} className="border border-slate-300 rounded p-1.5 text-sm">
                    <option value="eq">Equals (=)</option>
                    <option value="neq">Not Equals (!=)</option>
                    <option value="gt">Greater Than (&gt;)</option>
                    <option value="lt">Less Than (&lt;)</option>
                    <option value="contains">Contains</option>
                    <option value="not_contains">Does Not Contain</option>
                    <option value="starts_with">Starts With</option>
                    <option value="ends_with">Ends With</option>
                    <option value="is_empty">Is Empty / Null</option>
                    <option value="is_not_empty">Is Not Empty</option>
                  </select>

                  <input type="text" placeholder="Value" value={c.value} onChange={(e) => {
                    const newC = [...formData.conditions]; newC[i].value = e.target.value; setFormData({...formData, conditions: newC});
                  }} className="flex-1 border border-slate-300 rounded p-1.5 text-sm" />
                  
                  <button onClick={() => {
                     const newC = formData.conditions.filter((_: any, idx: number) => idx !== i);
                     setFormData({...formData, conditions: newC});
                  }} className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center -my-3 relative z-10 mt-6">
          <div className="bg-slate-200 p-1 rounded-full"><ArrowRight className="w-4 h-4 text-slate-400 rotate-90" /></div>
        </div>

        {/* ACTIONS */}
        <div className="bg-white p-4 rounded-xl border-l-4 border-l-emerald-500 border border-slate-200 mt-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-slate-800 flex items-center gap-2">
              3. Do this... (Actions)
            </h3>
            <button onClick={addAction} className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded hover:bg-emerald-100 transition-colors">
              + Add Action
            </button>
          </div>
          
          {formData.actions.length === 0 ? (
            <p className="text-sm text-red-400 italic">Rule must have at least one action.</p>
          ) : (
            <div className="space-y-3">
              {formData.actions.map((act: any, i: number) => (
                <div key={i} className="flex gap-2 items-center bg-slate-50 p-2 rounded border border-slate-100">
                  <select value={act.type} onChange={(e) => {
                    const newA = [...formData.actions]; newA[i].type = e.target.value; setFormData({...formData, actions: newA});
                  }} className="border border-slate-300 rounded p-1.5 text-sm w-1/3 font-bold">
                    <optgroup label="Communications">
                      <option value="SEND_EMAIL">Send Email</option>
                      <option value="SEND_SMS">Send SMS</option>
                      <option value="SLACK_ALERT">Slack Message</option>
                      <option value="TEAMS_ALERT">MS Teams Alert</option>
                      <option value="DISCORD_WEBHOOK">Discord Webhook</option>
                      <option value="IN_APP_NOTIFICATION">In-App Notification</option>
                    </optgroup>
                    <optgroup label="Data & Integration">
                      <option value="CALL_WEBHOOK">Call Custom Webhook</option>
                      <option value="SYNC_SALESFORCE">Sync to Salesforce</option>
                      <option value="SYNC_HUBSPOT">Sync to HubSpot</option>
                      <option value="ADD_MAILCHIMP">Add to Mailchimp List</option>
                    </optgroup>
                    <optgroup label="Project Management">
                      <option value="CREATE_JIRA_ISSUE">Create Jira Issue</option>
                      <option value="CREATE_LINEAR_ISSUE">Create Linear Issue</option>
                      <option value="CREATE_GITHUB_ISSUE">Create GitHub Issue</option>
                    </optgroup>
                    <optgroup label="Identity & Access (Internal)">
                      <option value="UPDATE_USER_ROLE">Update User Role</option>
                      <option value="SUSPEND_USER">Suspend User</option>
                      <option value="REVOKE_ACCESS">Revoke Access Tokens</option>
                      <option value="REQUIRE_PASSWORD_RESET">Force Password Reset</option>
                      <option value="ADD_TAG">Add Tag</option>
                      <option value="REMOVE_TAG">Remove Tag</option>
                    </optgroup>
                    <optgroup label="Support & Billing (Internal)">
                      <option value="ASSIGN_TICKET">Assign Ticket</option>
                      <option value="ESCALATE_TICKET">Escalate Ticket</option>
                      <option value="GRANT_CREDITS">Grant Account Credits</option>
                      <option value="CANCEL_SUBSCRIPTION">Cancel Subscription</option>
                    </optgroup>
                    <optgroup label="Flow Control">
                      <option value="DELAY">Delay (Wait)</option>
                      <option value="STOP_EXECUTION">Stop Execution</option>
                    </optgroup>
                  </select>

                  {/* Dynamic Inputs based on Action Type */}
                  {act.type === 'SEND_EMAIL' && (
                    <input type="text" placeholder="Template ID (e.g. welcome_email)" value={act.template || ''} onChange={(e) => {
                      const newA = [...formData.actions]; newA[i].template = e.target.value; setFormData({...formData, actions: newA});
                    }} className="flex-1 border border-slate-300 rounded p-1.5 text-sm" />
                  )}
                  {act.type === 'SEND_SMS' && (
                    <>
                      <input type="text" placeholder="Phone (optional)" value={act.phone || ''} onChange={(e) => {
                        const newA = [...formData.actions]; newA[i].phone = e.target.value; setFormData({...formData, actions: newA});
                      }} className="w-1/4 border border-slate-300 rounded p-1.5 text-sm" />
                      <input type="text" placeholder="Message content" value={act.message || ''} onChange={(e) => {
                        const newA = [...formData.actions]; newA[i].message = e.target.value; setFormData({...formData, actions: newA});
                      }} className="flex-1 border border-slate-300 rounded p-1.5 text-sm" />
                    </>
                  )}
                  {['SLACK_ALERT', 'TEAMS_ALERT', 'DISCORD_WEBHOOK'].includes(act.type) && (
                    <input type="text" placeholder={act.type === 'SLACK_ALERT' ? "#channel-name" : "Webhook URL"} value={act.channel || ''} onChange={(e) => {
                      const newA = [...formData.actions]; newA[i].channel = e.target.value; setFormData({...formData, actions: newA});
                    }} className="flex-1 border border-slate-300 rounded p-1.5 text-sm" />
                  )}
                  {act.type === 'CALL_WEBHOOK' && (
                    <>
                      <select value={act.method || 'POST'} onChange={(e) => {
                        const newA = [...formData.actions]; newA[i].method = e.target.value; setFormData({...formData, actions: newA});
                      }} className="w-24 border border-slate-300 rounded p-1.5 text-sm">
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                      </select>
                      <input type="text" placeholder="https://api.example.com/webhook" value={act.url || ''} onChange={(e) => {
                        const newA = [...formData.actions]; newA[i].url = e.target.value; setFormData({...formData, actions: newA});
                      }} className="flex-1 border border-slate-300 rounded p-1.5 text-sm" />
                    </>
                  )}
                  {act.type === 'UPDATE_USER_ROLE' && (
                    <select value={act.role || 'user'} onChange={(e) => {
                      const newA = [...formData.actions]; newA[i].role = e.target.value; setFormData({...formData, actions: newA});
                    }} className="flex-1 border border-slate-300 rounded p-1.5 text-sm">
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="user">User</option>
                    </select>
                  )}
                  {['ASSIGN_TICKET', 'ESCALATE_TICKET'].includes(act.type) && (
                    <input type="text" placeholder="Agent UUID (optional)" value={act.assignee || ''} onChange={(e) => {
                      const newA = [...formData.actions]; newA[i].assignee = e.target.value; setFormData({...formData, actions: newA});
                    }} className="flex-1 border border-slate-300 rounded p-1.5 text-sm" />
                  )}
                  {['CREATE_JIRA_ISSUE', 'CREATE_LINEAR_ISSUE', 'CREATE_GITHUB_ISSUE'].includes(act.type) && (
                    <input type="text" placeholder="Project Key / Repo (e.g. ENG)" value={act.project || ''} onChange={(e) => {
                      const newA = [...formData.actions]; newA[i].project = e.target.value; setFormData({...formData, actions: newA});
                    }} className="flex-1 border border-slate-300 rounded p-1.5 text-sm" />
                  )}
                  {act.type === 'DELAY' && (
                    <input type="number" placeholder="Minutes to wait" value={act.minutes || ''} onChange={(e) => {
                      const newA = [...formData.actions]; newA[i].minutes = Number(e.target.value); setFormData({...formData, actions: newA});
                    }} className="flex-1 border border-slate-300 rounded p-1.5 text-sm" />
                  )}
                  {['ADD_TAG', 'REMOVE_TAG'].includes(act.type) && (
                    <input type="text" placeholder="Tag Name (e.g. VIP)" value={act.tag || ''} onChange={(e) => {
                      const newA = [...formData.actions]; newA[i].tag = e.target.value; setFormData({...formData, actions: newA});
                    }} className="flex-1 border border-slate-300 rounded p-1.5 text-sm" />
                  )}
                  {act.type === 'GRANT_CREDITS' && (
                    <input type="number" placeholder="Amount (e.g. 50)" value={act.amount || ''} onChange={(e) => {
                      const newA = [...formData.actions]; newA[i].amount = Number(e.target.value); setFormData({...formData, actions: newA});
                    }} className="flex-1 border border-slate-300 rounded p-1.5 text-sm" />
                  )}
                  
                  <button onClick={() => {
                     const newA = formData.actions.filter((_: any, idx: number) => idx !== i);
                     setFormData({...formData, actions: newA});
                  }} className="text-red-500 hover:text-red-700 px-2"><X className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
      <div className="border-t border-slate-200 bg-white p-4 flex justify-end gap-2 shrink-0">
        <button onClick={() => router.push("/admin/automations")} className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-100 rounded">Cancel</button>
        <button onClick={handleSave} disabled={!formData.name || formData.actions.length === 0} className="px-6 py-2 bg-purple-600 text-white font-bold flex items-center gap-2 rounded hover:bg-purple-700 disabled:opacity-50">
          <Save className="w-4 h-4" /> Save Rule
        </button>
      </div>
    </div>
  );
}
