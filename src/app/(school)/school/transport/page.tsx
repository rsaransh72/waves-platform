import { createServerSupabaseClient } from "@/lib/supabase-server";
import { TransportList } from "@/components/school/TransportList";

export const metadata = {
  title: "Transport | Waves School ERP",
};

export default async function TransportPage() {
  const supabase = await createServerSupabaseClient();

  const { data: routes } = await supabase
    .from("school_transport_routes")
    .select("*, school_transport_stops(*)")
    .order("route_name", { ascending: true });

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-[20px] font-semibold text-[#111111] tracking-tight">Bus Routes</h2>
              <p className="text-[14px] text-[#555555] mt-1">
                Manage transportation routes, vehicles, and stops.
              </p>
            </div>
          </div>
          
          <TransportList initialRoutes={routes || []} />
        </div>
      </main>
    </div>
  );
}
