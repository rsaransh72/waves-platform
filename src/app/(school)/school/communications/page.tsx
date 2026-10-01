import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SchoolHeader } from "@/components/school/SchoolHeader";
import { CommunicationsList } from "@/components/school/CommunicationsList";

export const metadata = {
  title: "Communications | Waves School ERP",
};

export default async function CommunicationsPage() {
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

  const { data: messages } = await supabase
    .from("school_communications")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex-1 flex flex-col bg-[#f9f9fa] h-[100dvh] overflow-hidden">
      <SchoolHeader title="Communications" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-[20px] font-semibold text-[#111111] tracking-tight">Notice Board & Alerts</h2>
              <p className="text-[14px] text-[#555555] mt-1">
                Send SMS, Email, and Portal notices to students, parents, and staff.
              </p>
            </div>
          </div>
          
          <CommunicationsList initialData={messages || []} />
        </div>
      </main>
    </div>
  );
}
