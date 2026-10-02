import { createServerSupabaseClient } from "@/lib/supabase-server";
import { FeeCollectionList } from "@/components/school/FeeCollectionList";

export const metadata = {
  title: "Fee Collection | Waves School ERP",
};

export default async function FeeCollectionPage() {
  const supabase = await createServerSupabaseClient();

  // Fetch Student Fees (Invoices)
  const { data: invoices } = await supabase
    .from("school_student_fees")
    .select(`
      *,
      school_students (id, first_name, last_name, roll_number),
      school_fee_structures (id, name, amount),
      school_fee_payments (id, receipt_number, amount_paid, payment_date, payment_method)
    `)
    .order("created_at", { ascending: false });

  // Fetch Students for dropdown
  const { data: students } = await supabase
    .from("school_students")
    .select("id, first_name, last_name, roll_number, class_id")
    .eq("status", "active")
    .order("first_name");

  const { data: classes } = await supabase
    .from("school_classes")
    .select("id, name, section")
    .order("name")
    .order("section");

  // Fetch Fee Structures for dropdown
  const { data: structures } = await supabase
    .from("school_fee_structures")
    .select("id, name, amount")
    .is("archived_at", null)
    .order("name");

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-[20px] font-semibold text-[#111111] tracking-tight">Fee Collection & Invoicing</h1>
              <p className="text-[14px] text-[#555555] mt-1">
                Generate student invoices and record payments (Cash, Online, Card).
              </p>
            </div>
          </div>
          
          <FeeCollectionList 
            initialInvoices={invoices || []} 
            students={students || []} 
            structures={structures || []} 
            classes={classes || []}
          />
        </div>
      </main>
    </div>
  );
}
