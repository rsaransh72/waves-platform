import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";
import { RealtimeProvider } from "@/components/admin/RealtimeProvider";
import { CommandPalette } from "@/components/admin/CommandPalette";
import { Toaster } from "sonner";
import { Metadata } from "next";
import { createServerSupabaseClient, getSessionUser } from "@/lib/supabase-server";
import { schoolToday } from "@/lib/school-date";
import { OPEN_LEAD_STATUSES } from "@/lib/lead-pipeline";
import type { AdminShellData } from "@/lib/admin-shell";

export const metadata: Metadata = {
  title: "Admin Console | Waves Platform",
  description: "Platform administration",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const email = (await getSessionUser(supabase))?.email ?? "";
  const [{ data: member }, { count: newLeads }, { count: dueFollowUps }] = await Promise.all([
    supabase.from("team_members").select("name, role").eq("email", email).maybeSingle(),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .in("status", OPEN_LEAD_STATUSES.filter((status) => status !== "new"))
      .lte("next_follow_up", schoolToday()),
  ]);

  const shell: AdminShellData = {
    admin: { name: member?.name || email || "Administrator", email, role: member?.role ?? "admin" },
    counts: { newLeads: newLeads ?? 0, dueFollowUps: dueFollowUps ?? 0 },
  };

  return (
    <div className="admin-portal h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <RealtimeProvider />
      <CommandPalette />
      <Toaster position="top-right" richColors />
      <Sidebar {...shell} />
      <div className="flex flex-col md:pl-64 h-full">
        <Header {...shell} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 flex flex-col">
          <div className="w-full flex-1 flex flex-col min-h-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
