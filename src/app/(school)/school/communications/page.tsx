import { createServerSupabaseClient } from "@/lib/supabase-server";
import { CommunicationsList } from "@/components/school/CommunicationsList";

export const metadata = {
  title: "Communications | Waves School ERP",
};

export default async function CommunicationsPage() {
  const supabase = await createServerSupabaseClient();

  const { data: messages } = await supabase
    .from("school_communications")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-[20px] font-semibold text-[#111111] tracking-tight">Notice Board</h1>
              <p className="text-[14px] text-[#555555] mt-1">
                Notices for your school, kept here for staff to read. They are not sent to phones or email.
              </p>
            </div>
          </div>
          
          <CommunicationsList initialData={messages || []} />
        </div>
      </main>
    </div>
  );
}
