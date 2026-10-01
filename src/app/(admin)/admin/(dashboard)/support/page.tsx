import { createServerSupabaseClient } from "@/lib/supabase-server";
import { TicketList } from "@/components/admin/TicketList";

export const revalidate = 0;

export default async function SupportPage() {
  const supabase = await createServerSupabaseClient();
  const { data: tickets, error } = await supabase
    .from("support_tickets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) console.error("Error fetching tickets:", error);

  return <TicketList initialData={tickets || []} />;
}
