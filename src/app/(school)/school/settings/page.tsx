import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SchoolHeader } from "@/components/school/SchoolHeader";
import { SchoolSettingsForm } from "@/components/school/SchoolSettingsForm";

export const metadata = {
  title: "School Settings | Waves School ERP",
};

export default async function SchoolSettingsPage() {
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

  const { data: settings } = await supabase
    .from("school_settings")
    .select("*")
    .single();

  return (
    <div className="flex-1 flex flex-col bg-[#f9f9fa] h-[100dvh] overflow-hidden">
      <SchoolHeader title="School Settings" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-[20px] font-semibold text-[#111111] tracking-tight">Organization Profile</h2>
              <p className="text-[14px] text-[#555555] mt-1">
                Manage your school's details, logo, and payment preferences.
              </p>
            </div>
          </div>
          
          <SchoolSettingsForm initialSettings={settings || {}} />
        </div>
      </main>
    </div>
  );
}
