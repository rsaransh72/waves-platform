import { createServerSupabaseClient } from "@/lib/supabase-server";
import { FeesList } from "@/components/school/FeesList";

export const metadata = {
  title: "Fee Management | Waves School ERP",
};

export default async function FeesPage() {
  const supabase = await createServerSupabaseClient();

  const { data: structures } = await supabase
    .from("school_fee_structures")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-[20px] font-semibold text-[#111111] tracking-tight">Fee Structures</h1>
              <p className="text-[14px] text-[#555555] mt-1">
                The fees your school charges, such as tuition, transport and annual charges. Assign them to students from Fee Collection.
              </p>
            </div>
          </div>
          
          <FeesList initialData={structures || []} />
        </div>
      </main>
    </div>
  );
}
