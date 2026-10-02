"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  X,
  Bus,
  MapPin,
  Clock,
  Phone,
  User,
  ChevronRight
} from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { toast } from "sonner";
import { describeError } from "@/lib/error-message";
import { NameInput, PhoneInput, VehicleNumberInput } from "@/components/forms/IndiaInputs";
import { formatPhone, formatTime, normalizeVehicleNumber, toStoredPhone } from "@/lib/india";
import { useRouter } from "next/navigation";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

export function TransportList({ initialRoutes }: { initialRoutes: any[] }) {
  const router = useRouter();
  const [routes, setRoutes] = useState<any[]>(initialRoutes);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isRouteDrawerOpen, setIsRouteDrawerOpen] = useState(false);
  const [isStopDrawerOpen, setIsStopDrawerOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  
  const [routeForm, setRouteForm] = useState({ route_name: "", vehicle_number: "", driver_name: "", driver_phone: "" });
  const [stopForm, setStopForm] = useState({ stop_name: "", pickup_time: "", drop_time: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createClient();

  const filteredRoutes = routes.filter(r => 
    r.route_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.vehicle_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = routeForm.route_name.trim();
    if (routes.some((route) => route.route_name.trim().toLowerCase() === name.toLowerCase())) {
      toast.error(`There is already a route called "${name}". Give this one a different name.`);
      return;
    }
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('school_transport_routes')
        .insert([{ ...routeForm, route_name: routeForm.route_name.trim(), vehicle_number: normalizeVehicleNumber(routeForm.vehicle_number), driver_name: routeForm.driver_name.trim() || null, driver_phone: toStoredPhone(routeForm.driver_phone) }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        data.school_transport_stops = [];
        const newData = [data, ...routes];
        setRoutes(newData);
        setIsRouteDrawerOpen(false);
        setRouteForm({ route_name: "", vehicle_number: "", driver_name: "", driver_phone: "" });
        toast.success(`Route "${data.route_name}" added. Add its stops next.`);
        router.refresh();
      }
    } catch (error) {
      console.error("Error creating route:", error);
      toast.error(`Could not add route: ${describeError(error, "There is already a route with this name.")}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddStop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (stopForm.drop_time <= stopForm.pickup_time) {
      toast.error("Drop time must be later than pickup time.");
      return;
    }
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('school_transport_stops')
        .insert([{ ...stopForm, route_id: selectedRoute.id }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const updatedRoutes = routes.map(r => {
          if (r.id === selectedRoute.id) {
            return {
              ...r,
              school_transport_stops: [...(r.school_transport_stops || []), data]
            };
          }
          return r;
        });
        setRoutes(updatedRoutes);
        setIsStopDrawerOpen(false);
        setStopForm({ stop_name: "", pickup_time: "", drop_time: "" });
        toast.success(`Stop "${data.stop_name}" added to ${selectedRoute.route_name}.`);
      }
    } catch (err) {
      console.error("Error adding stop:", err);
      toast.error(`Could not add stop: ${describeError(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-[#e5e5e5] shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#e5e5e5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fafafa]">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
            <input
              type="text"
              placeholder="Search routes or vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-md border border-[#cccccc] bg-white text-[13px] text-[#111111] focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] transition-shadow placeholder:text-[#888888]"
            />
          </div>
          
          <button
            onClick={() => setIsRouteDrawerOpen(true)}
            className="h-9 px-4 bg-[#0066cc] hover:bg-[#0055bb] text-white text-[13px] font-medium rounded-md flex items-center justify-center gap-2 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Route</span>
          </button>
        </div>

        {/* Routes Grid */}
        <div className="p-6 bg-[#f9f9fa] min-h-[400px]">
          {filteredRoutes.length === 0 ? (
            <div className="py-12 text-center text-[#555555] text-[14px]">
              No transport routes found.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredRoutes.map((route) => (
                <div key={route.id} className="bg-white rounded-xl border border-[#e5e5e5] shadow-sm overflow-hidden flex flex-col">
                  <div className="p-5 border-b border-[#e5e5e5] bg-[#fafafa]">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                          <Bus className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#111111] text-[16px]">{route.route_name}</h3>
                          <span className="text-[12px] font-medium text-[#888888] bg-white border border-[#e5e5e5] px-2 py-0.5 rounded">
                            {route.vehicle_number}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => { setSelectedRoute(route); setIsStopDrawerOpen(true); }}
                        className="text-[12px] font-medium text-[#0066cc] hover:text-[#0055bb] bg-[#f0f9ff] px-2.5 py-1.5 rounded-md hover:bg-[#e0f2fe] transition-colors"
                      >
                        + Add Stop
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-4 text-[13px] text-[#555555]">
                      <div className="flex items-center gap-1.5"><User className="w-4 h-4 text-[#888888]" /> {route.driver_name || 'No driver'}</div>
                      {route.driver_phone && <div className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-[#888888]" /> {formatPhone(route.driver_phone)}</div>}
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1">
                    <h4 className="text-[12px] font-bold text-[#888888] uppercase tracking-wider mb-3">Stops & Schedule</h4>
                    {(!route.school_transport_stops || route.school_transport_stops.length === 0) ? (
                      <p className="text-[13px] text-[#888888] italic">No stops added to this route yet.</p>
                    ) : (
                      <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-[7px] before:w-[2px] before:bg-[#e5e5e5]">
                        {route.school_transport_stops.sort((a:any,b:any) => a.pickup_time.localeCompare(b.pickup_time)).map((stop:any, idx:number) => (
                          <div key={stop.id} className="relative pl-6">
                            <div className="absolute w-4 h-4 bg-white border-2 border-[#0066cc] rounded-full -left-[1px] top-1" />
                            <div className="font-semibold text-[#333333] text-[14px]">{stop.stop_name}</div>
                            <div className="flex items-center gap-3 text-[12px] text-[#555555] mt-0.5">
                              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Pick: {formatTime(stop.pickup_time)}</span>
                              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Drop: {formatTime(stop.drop_time)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Route Drawer */}
      {isRouteDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setIsRouteDrawerOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e5e5e5]">
              <h3 className="text-[18px] font-semibold text-[#111111]">Add Transport Route</h3>
              <button onClick={() => setIsRouteDrawerOpen(false)} className="text-[#888888] hover:text-[#111111] p-1 rounded-md hover:bg-[#f4f4f5] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddRoute} className="flex-1 flex flex-col overflow-y-auto">
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Route Name *</label>
                  <input
                    type="text"
                    required
                    value={routeForm.route_name}
                    onChange={e => setRouteForm({...routeForm, route_name: e.target.value})}
                    placeholder="e.g. Route 1 – Sector 62" minLength={2} maxLength={80}
                    className="w-full h-9 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Vehicle Number *</label>
                  <VehicleNumberInput
                    required
                    value={routeForm.vehicle_number}
                    onValueChange={(vehicle_number) => setRouteForm((current) => ({ ...current, vehicle_number }))}
                    className="w-full h-9 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Driver Name (Optional)</label>
                  <NameInput
                    value={routeForm.driver_name}
                    onValueChange={(driver_name) => setRouteForm((current) => ({ ...current, driver_name }))}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full h-9 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Driver Mobile (Optional)</label>
                  <PhoneInput
                    value={routeForm.driver_phone}
                    onValueChange={(driver_phone) => setRouteForm((current) => ({ ...current, driver_phone }))}
                    className="w-full h-9 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                  />
                </div>
              </div>
              
              <div className="mt-auto p-6 border-t border-[#e5e5e5] bg-[#fafafa]">
                <div className="flex gap-3">
                  <button type="button" onClick={() => setIsRouteDrawerOpen(false)} className="flex-1 h-10 border rounded-md font-medium text-[14px]">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 h-10 bg-[#0066cc] text-white rounded-md font-medium text-[14px]">{isSubmitting ? 'Saving...' : 'Add Route'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Stop Drawer */}
      {isStopDrawerOpen && selectedRoute && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setIsStopDrawerOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e5e5e5] bg-[#fafafa]">
              <h3 className="text-[18px] font-semibold text-[#111111]">Add Stop for {selectedRoute.route_name}</h3>
              <button onClick={() => setIsStopDrawerOpen(false)} className="text-[#888888] hover:text-[#111111] p-1 rounded-md hover:bg-[#e5e5e5] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddStop} className="flex-1 flex flex-col overflow-y-auto">
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Stop Name/Location *</label>
                  <input
                    type="text"
                    required
                    value={stopForm.stop_name}
                    onChange={e => setStopForm({...stopForm, stop_name: e.target.value})}
                    placeholder="e.g. City Mall Gate 2" minLength={2} maxLength={100}
                    className="w-full h-9 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Pickup Time *</label>
                    <input
                      type="time"
                      required
                      value={stopForm.pickup_time}
                      onChange={e => setStopForm({...stopForm, pickup_time: e.target.value})}
                      className="w-full h-9 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Drop Time *</label>
                    <input
                      type="time"
                      required
                      value={stopForm.drop_time}
                      onChange={e => setStopForm({...stopForm, drop_time: e.target.value})}
                      className="w-full h-9 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-auto p-6 border-t border-[#e5e5e5] bg-[#fafafa]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-[#111111] hover:bg-[#333333] text-white text-[14px] font-medium rounded-md flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? 'Saving...' : 'Save Stop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
