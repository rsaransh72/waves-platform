"use client";

import { useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { useAdminStore } from "@/store/adminStore";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export function FeatureFlagEditor({ initialData, isNew, onClose }: { initialData: any, isNew: boolean, onClose: () => void }) {
  const { addFeatureFlag, updateFeatureFlag, setIsSaving } = useAdminStore();
  
  const [formData, setFormData] = useState({
    name: "",
    key: "",
    description: "",
    is_enabled: false,
    status: "active",
    ...initialData,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.key) {
      toast.error("Name and Key are required");
      return;
    }

    try {
      setIsSaving(true);
      const supabase = createClient();
      let recordId = formData.id;

      if (isNew) {
        recordId = uuidv4();
        const optimisticFlag = { ...formData, id: recordId, created_at: new Date().toISOString() };
        addFeatureFlag(optimisticFlag);
        toast.success("Feature flag created optimistically!");
        onClose();

        const { error } = await supabase.from("feature_flags").insert([optimisticFlag]);
        if (error) throw error;
      } else {
        const previousFlag = initialData;
        updateFeatureFlag(formData.id, formData);
        toast.success("Changes saved optimistically!");
        onClose();

        const { error } = await supabase.from("feature_flags").update(formData).eq("id", formData.id);
        if (error) {
          updateFeatureFlag(formData.id, previousFlag);
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
    <div className="space-y-6 pb-24">
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">Flag Name *</label>
          <input 
            type="text" name="name" value={formData.name} onChange={handleChange}
            className="w-full rounded border border-gray-300 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 font-medium"
            placeholder="e.g. New Dashboard UI"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">Flag Key *</label>
          <input 
            type="text" name="key" value={formData.key} onChange={handleChange}
            className="w-full rounded border border-gray-300 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 font-medium"
            placeholder="e.g. new_dashboard_ui"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">Description</label>
          <textarea 
            name="description" value={formData.description} onChange={handleChange} rows={3}
            className="w-full rounded border border-gray-300 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 font-medium"
          />
        </div>
        <div className="flex items-center gap-3 mt-4">
          <input 
            type="checkbox" name="is_enabled" checked={formData.is_enabled} onChange={handleChange}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            id="is_enabled"
          />
          <label htmlFor="is_enabled" className="text-sm font-bold text-slate-700">Enable Feature Flag globally</label>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 mt-6">
        <button 
          onClick={handleSave}
          className="w-full inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-sm"
        >
          <Save className="h-4 w-4" />
          {isNew ? "Create Feature Flag" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
