import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SchoolHeader } from "@/components/school/SchoolHeader";
import { FeesList } from "@/components/school/FeesList";

export const metadata = {
  title: "Fee Management | Waves School ERP",
};

export default async function FeesPage() {
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

  // Fetch Fee Structures
  const { data: structures } = await supabase
    .from("school_fee_structures")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex-1 flex flex-col bg-[#f9f9fa] h-[100dvh] overflow-hidden">
      <SchoolHeader title="Fee Management" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-[20px] font-semibold text-[#111111] tracking-tight">Fee Structures</h2>
              <p className="text-[14px] text-[#555555] mt-1">
                Manage tuition fees, term fees, and payment structures.
              </p>
            </div>
          </div>
          
          <FeesList initialData={structures || []} />
        </div>
      </main>
    </div>
  );
}
