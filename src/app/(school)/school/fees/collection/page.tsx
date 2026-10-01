import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SchoolHeader } from "@/components/school/SchoolHeader";
import { FeeCollectionList } from "@/components/school/FeeCollectionList";

export const metadata = {
  title: "Fee Collection | Waves School ERP",
};

export default async function FeeCollectionPage() {
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

  // Fetch Student Fees (Invoices)
  const { data: invoices } = await supabase
    .from("school_student_fees")
    .select(`
      *,
      school_students (id, first_name, last_name, roll_number),
      school_fee_structures (id, name, amount)
    `)
    .order("created_at", { ascending: false });

  // Fetch Students for dropdown
  const { data: students } = await supabase
    .from("school_students")
    .select("id, first_name, last_name, roll_number")
    .order("first_name");

  // Fetch Fee Structures for dropdown
  const { data: structures } = await supabase
    .from("school_fee_structures")
    .select("id, name, amount")
    .order("name");

  return (
    <div className="flex-1 flex flex-col bg-[#f9f9fa] h-[100dvh] overflow-hidden">
      <SchoolHeader title="Fee Collections" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-[20px] font-semibold text-[#111111] tracking-tight">Fee Collection & Invoicing</h2>
              <p className="text-[14px] text-[#555555] mt-1">
                Generate student invoices and record payments (Cash, Online, Card).
              </p>
            </div>
          </div>
          
          <FeeCollectionList 
            initialInvoices={invoices || []} 
            students={students || []} 
            structures={structures || []} 
          />
        </div>
      </main>
    </div>
  );
}
