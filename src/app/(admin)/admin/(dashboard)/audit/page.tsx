import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { AuditLogsList } from "@/components/admin/AuditLogsList";

export const metadata = {
  title: "Audit Logs | Waves Admin",
};

export const revalidate = 0;

export default async function AuditLogsPage() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: logs, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) console.error("Error fetching audit logs:", error);

  return (
    <div className="flex flex-col bg-[#f9f9fa] h-full overflow-hidden">
      <div className="px-6 py-4 shrink-0 bg-white border-b border-gray-200">
        <h1 className="text-[30px] font-bold text-gray-900 tracking-tight leading-tight">Security & Audit Logs</h1>
        <p className="text-sm text-gray-500 mt-1">
          Comprehensive, immutable record of all system activities and security events.
        </p>
      </div>
      
      <main className="flex-1 overflow-hidden p-4">
        <AuditLogsList initialLogs={logs || []} />
      </main>
    </div>
  );
}
