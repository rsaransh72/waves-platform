import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { endImpersonation } from "@/app/actions/impersonation";
import { ShieldAlert, LogOut, Ticket } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export default async function ClientDashboardPage() {
  const cookieStore = await cookies();
  const impersonationSession = cookieStore.get("impersonation_session");

  if (!impersonationSession) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to Your Portal</h1>
        <p className="text-slate-500 max-w-sm mb-6">
          This is the standard client portal. There is no active impersonation session detected.
        </p>
        <a href="/admin" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
          Go to Admin Portal
        </a>
      </div>
    );
  }

  // Parse session
  let sessionData;
  try {
    sessionData = JSON.parse(impersonationSession.value);
  } catch (e) {
    redirect("/admin");
  }

  const supabase = await createServerSupabaseClient();
  const { data: tickets } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("customer_email", sessionData.userEmail)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50 relative">
      
      {/* WARNING BANNER */}
      <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-between shadow-md relative z-50">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 animate-pulse" />
          <span className="font-bold text-sm">
            ADMIN IMPERSONATION MODE
          </span>
          <span className="text-sm border-l border-red-500 pl-3 ml-1 opacity-90">
            You are logged in as <strong className="font-black text-white">{sessionData.userName}</strong> ({sessionData.userId})
          </span>
        </div>
        
        <form action={endImpersonation}>
          <button type="submit" className="flex items-center gap-2 bg-red-800 hover:bg-red-900 px-4 py-1.5 rounded-full text-xs font-bold transition-colors">
            <LogOut className="w-3.5 h-3.5" />
            End Impersonation
          </button>
        </form>
      </div>

      <div className="max-w-5xl mx-auto py-12 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">
            Hello, {sessionData.userName}!
          </h1>
          <p className="text-slate-500">
            Welcome to your real customer dashboard.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
               <h2 className="font-bold text-slate-800">My Support Tickets</h2>
             </div>
             <div className="p-0">
               {tickets && tickets.length > 0 ? (
                 <ul className="divide-y divide-slate-100">
                   {tickets.map(ticket => (
                     <li key={ticket.id} className="p-4 hover:bg-slate-50">
                       <div className="flex justify-between items-start mb-1">
                         <span className="font-semibold text-slate-900">{ticket.subject}</span>
                         <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${
                           ticket.status === 'open' ? 'bg-amber-100 text-amber-700' :
                           ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                           'bg-emerald-100 text-emerald-700'
                         }`}>
                           {ticket.status}
                         </span>
                       </div>
                       <p className="text-sm text-slate-500 mb-2 truncate max-w-sm">{ticket.description}</p>
                       <p className="text-xs text-slate-400">Created: {new Date(ticket.created_at).toLocaleDateString()}</p>
                     </li>
                   ))}
                 </ul>
               ) : (
                 <div className="p-12 text-center flex flex-col items-center">
                   <Ticket className="w-12 h-12 text-slate-300 mb-3" />
                   <p className="text-slate-500">You don't have any support tickets yet.</p>
                 </div>
               )}
             </div>
          </div>
          
        </div>
      </div>

    </div>
  );
}
