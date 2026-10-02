import { createServerSupabaseClient } from "@/lib/supabase-server";
import { InvoiceList } from "@/components/admin/InvoiceList";

export const revalidate = 0;

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ invoice?: string | string[] }>;
}) {
  const supabase = await createServerSupabaseClient();
  const query = await searchParams;
  const initialInvoiceId = typeof query.invoice === "string" ? query.invoice : undefined;
  const { data: invoices, error } = await supabase
    .from("invoices")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) console.error("Error fetching invoices:", error);

  return <InvoiceList initialData={invoices || []} initialInvoiceId={initialInvoiceId} />;
}
