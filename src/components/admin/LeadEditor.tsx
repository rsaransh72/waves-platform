"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { useAdminStore } from "@/store/adminStore";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export function LeadEditor({ initialData, isNew, onClose }: { initialData: any, isNew: boolean, onClose: () => void }) {
  const { addLead, updateLead, setIsSaving } = useAdminStore();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization_name: "",
    product: "",
    city: "",
    team_size: "",
    message: "",
    status: "new",
    source: "website_demo_form",
    ...initialData,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.product) {
      toast.error("Name, Email, Phone, and Product are required");
      return;
    }

    try {
      setIsSaving(true);
      const supabase = createClient();
      let recordId = formData.id;

      if (isNew) {
        recordId = uuidv4();
        const optimisticLead = { ...formData, id: recordId, created_at: new Date().toISOString() };
        addLead(optimisticLead);
        toast.success("Lead created optimistically!");
        onClose();

        const { error } = await supabase.from("leads").insert([optimisticLead]);
        if (error) throw error;
      } else {
        const previousLead = initialData;
        updateLead(formData.id, formData);
        toast.success("Changes saved optimistically!");
        onClose();

        const { error } = await supabase.from("leads").update(formData).eq("id", formData.id);
        if (error) {
          updateLead(formData.id, previousLead);
          throw error;
        }
      }
    } catch (err: any) {
      toast.error(`Save failed: ${err.message || JSON.stringify(err)}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in">
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 font-medium"/>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Organization</label>
            <input type="text" name="organization_name" value={formData.organization_name} onChange={handleChange} className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 font-medium"/>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 font-medium"/>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone *</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 font-medium"/>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Product Interest *</label>
            <input type="text" name="product" value={formData.product} onChange={handleChange} className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 font-medium"/>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 font-medium">
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="demo_scheduled">Demo Scheduled</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">City</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 font-medium"/>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Team Size</label>
            <input type="text" name="team_size" value={formData.team_size} onChange={handleChange} className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 font-medium"/>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">Message / Requirements</label>
          <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 font-medium"/>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 mt-6">
        <button 
          onClick={handleSave}
          className="w-full inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-sm"
        >
          <Save className="h-4 w-4" />
          {isNew ? "Create Lead" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
