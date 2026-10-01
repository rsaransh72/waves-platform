import { createServerSupabaseClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { Building2, ArrowLeft, Users, CreditCard, Receipt } from "lucide-react";
import Link from "next/link";
import { SubscriptionEditor } from "@/components/admin/SubscriptionEditor";
import { formatAdminDate } from "@/lib/admin-format";

export const revalidate = 0;

export default async function OrganizationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", id)
    .single();

  if (orgError || !org) {
    return notFound();
  }

  // Fetch Subscriptions
  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("organization_id", org.id);
  
  // Fetch Invoices
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("organization_id", org.id)
    .order("created_at", { ascending: false });

  const { data: members } = await supabase
    .from("organization_members")
    .select("user_id, role, created_at")
    .eq("organization_id", org.id)
    .order("created_at", { ascending: true });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/organizations" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-slate-400" />
            {org.name}
          </h1>
          <p className="text-sm text-slate-500">Managed Organization Details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Org Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Organization Profile</h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Primary Email</label>
                <div className="text-sm text-slate-900">{org.email || "N/A"}</div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Slug</label>
                <div className="text-sm text-slate-900 font-mono bg-slate-100 p-1 rounded inline-block mt-1">{org.slug}</div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Status</label>
                <div className="mt-1">
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 uppercase">
                    {org.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Manager Component */}
          {subscriptions && subscriptions.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-400" />
                <h3 className="font-bold text-slate-800">Active Subscription</h3>
              </div>
              {/* Here we reuse the action panel but style it for inline */}
              <div className="h-[600px] overflow-hidden">
                 <SubscriptionEditor initialData={subscriptions[0]} />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center text-center">
               <CreditCard className="w-12 h-12 text-slate-300 mb-3" />
               <h4 className="font-bold text-slate-700">No Subscription</h4>
               <p className="text-sm text-slate-500 mt-1">This organization does not have an active subscription.</p>
               <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-bold transition-colors">
                 Create Subscription
               </button>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Invoices List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-slate-400" />
                <h3 className="font-bold text-slate-800">Billing History</h3>
              </div>
              <button className="text-sm font-bold text-blue-600 hover:text-blue-700">Generate Invoice</button>
            </div>
            
            <div className="divide-y divide-slate-100">
              {!invoices || invoices.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">No invoices found for this organization.</div>
              ) : (
                invoices.map((inv) => (
                  <div key={inv.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        inv.status === 'paid' ? 'bg-emerald-100 text-emerald-600' : 
                        inv.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                      }`}>
                        <Receipt className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{inv.invoice_number}</div>
                        <div className="text-xs text-slate-500">Due {formatAdminDate(inv.due_date)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-bold text-slate-900">${inv.amount}</div>
                        <div className={`text-xs font-bold uppercase ${
                          inv.status === 'paid' ? 'text-emerald-600' : 
                          inv.status === 'pending' ? 'text-amber-600' : 'text-red-600'
                        }`}>{inv.status}</div>
                      </div>
                      {/* Navigate to full invoice page instead of drawer */}
                      <Link href={`/admin/billing?invoice=${encodeURIComponent(inv.id)}`} className="text-sm font-bold text-blue-600 hover:text-blue-800">
                        Manage
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <h3 className="font-bold text-slate-800">School Access ({members?.length ?? 0})</h3>
            </div>
            {!members?.length ? (
              <div className="p-8 text-center text-slate-500 text-sm">No school users are linked to this client yet.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {members.map((member) => (
                  <div key={member.user_id} className="flex items-center justify-between gap-4 p-4">
                    <div>
                      <div className="text-sm font-semibold capitalize text-slate-900">{member.role}</div>
                      <div className="mt-1 font-mono text-xs text-slate-500">User {member.user_id}</div>
                    </div>
                    <div className="text-xs text-slate-500">Added {formatAdminDate(member.created_at)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
