import { createServerSupabaseClient } from "@/lib/supabase-server";
import { SchoolSettingsForm } from "@/components/school/SchoolSettingsForm";

export const metadata = {
  title: "School Settings | Waves School ERP",
};

export default async function SchoolSettingsPage() {
  const supabase = await createServerSupabaseClient();

  const { data: settings } = await supabase
    .from("school_settings")
    .select("*")
    .single();

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-[20px] font-semibold text-[#111111] tracking-tight">Organization Profile</h2>
              <p className="text-[14px] text-[#555555] mt-1">
                Manage your school&apos;s name, logo and contact details shown on receipts.
              </p>
            </div>
          </div>
          
          <SchoolSettingsForm initialSettings={settings || {}} />
        </div>
      </main>
    </div>
  );
}
