"use client";

import { useState } from "react";
import { Save, Globe, EyeOff, Archive, Check, Plus, Trash2 } from "lucide-react";
import { clsx } from "clsx";
import { createClient } from "@/lib/supabase-browser";
import { useAdminStore } from "@/store/adminStore";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { AmountInput } from "@/components/forms/IndiaInputs";
import { amountError } from "@/lib/india";

const tabs = ["General", "Features", "Pricing", "SEO", "Publishing"];

export function SuiteEditor({ initialData, isNew, onClose }: { initialData: any, isNew: boolean, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState("General");
  const { addSuite, updateSuite, setIsSaving } = useAdminStore();
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    subtitle: "",
    tagline: "",
    category: "",
    status: "draft",
    visibility: "public",
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    features: [],
    pricing: [],
    ...initialData,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addFeature = () => setFormData({ ...formData, features: [...formData.features, { title: "", description: "" }] });
  const updateFeature = (index: number, field: string, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index][field] = value;
    setFormData({ ...formData, features: newFeatures });
  };
  const removeFeature = (index: number) => {
    const newFeatures = [...formData.features];
    newFeatures.splice(index, 1);
    setFormData({ ...formData, features: newFeatures });
  };

  const addPricing = () => setFormData({ ...formData, pricing: [...formData.pricing, { plan: "", price: "", features: "" }] });
  const updatePricing = (index: number, field: string, value: string) => {
    const newPricing = [...formData.pricing];
    newPricing[index][field] = value;
    setFormData({ ...formData, pricing: newPricing });
  };
  const removePricing = (index: number) => {
    const newPricing = [...formData.pricing];
    newPricing.splice(index, 1);
    setFormData({ ...formData, pricing: newPricing });
  };

  const handleSave = async () => {
    const badPrice = formData.pricing.find((plan: any) => amountError(plan.price, { required: false }));
    if (badPrice) {
      toast.error(`Plan "${badPrice.plan || "untitled"}": ${amountError(badPrice.price, { required: false })}`);
      return;
    }
    if (!formData.title || !formData.slug) {
      toast.error("Title and URL Slug are required");
      return;
    }

    try {
      setIsSaving(true);
      const supabase = createClient();
      let recordId = formData.id;

      if (isNew) {
        recordId = uuidv4();
        const optimisticSuite = { ...formData, id: recordId, created_at: new Date().toISOString() };
        addSuite(optimisticSuite);
        toast.success("Suite created optimistically!");
        onClose();

        const { error } = await supabase.from("suites").insert([optimisticSuite]);
        if (error) throw error;
      } else {
        const previousSuite = initialData;
        updateSuite(formData.id, formData);
        toast.success("Changes saved optimistically!");
        onClose();

        const { error } = await supabase.from("suites").update(formData).eq("id", formData.id);
        if (error) {
          updateSuite(formData.id, previousSuite); // Rollback
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
      <div className="flex overflow-x-auto border-b border-gray-200 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "whitespace-nowrap px-4 py-2 text-sm font-bold rounded-t-lg transition-all",
              activeTab === tab 
                ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-b-2 border-transparent"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === "General" && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Suite Name *</label>
              <input 
                type="text" name="title" value={formData.title} onChange={handleChange}
                className="w-full rounded border border-gray-300 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">URL Slug *</label>
              <input 
                type="text" name="slug" value={formData.slug} onChange={handleChange}
                className="w-full rounded border border-gray-300 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Subtitle</label>
              <input 
                type="text" name="subtitle" value={formData.subtitle} onChange={handleChange}
                className="w-full rounded border border-gray-300 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Category</label>
              <input 
                type="text" name="category" value={formData.category} onChange={handleChange}
                className="w-full rounded border border-gray-300 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 font-medium"
              />
            </div>
          </div>
        )}

        {activeTab === "Features" && (
          <div className="space-y-4 animate-in fade-in">
            <button onClick={addFeature} className="inline-flex items-center gap-1.5 rounded bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700 hover:bg-blue-100 transition-colors">
              <Plus className="h-4 w-4" /> Add Feature
            </button>
            {formData.features.map((feature: any, idx: number) => (
              <div key={idx} className="flex gap-4 p-4 border border-gray-200 rounded-lg bg-slate-50 relative group">
                <div className="flex-1 space-y-3">
                  <input 
                    type="text" value={feature.title} onChange={(e) => updateFeature(idx, "title", e.target.value)}
                    placeholder="Feature Title"
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500"
                  />
                  <textarea 
                    value={feature.description} onChange={(e) => updateFeature(idx, "description", e.target.value)}
                    placeholder="Description" rows={2}
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500"
                  />
                </div>
                <button onClick={() => removeFeature(idx)} className="text-slate-400 hover:text-red-600 transition-colors">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Pricing" && (
          <div className="space-y-4 animate-in fade-in">
            <button onClick={addPricing} className="inline-flex items-center gap-1.5 rounded bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700 hover:bg-blue-100 transition-colors">
              <Plus className="h-4 w-4" /> Add Plan
            </button>
            {formData.pricing.map((plan: any, idx: number) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg bg-slate-50 space-y-3 relative">
                <button onClick={() => removePricing(idx)} className="absolute top-4 right-4 text-slate-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
                <input 
                  type="text" value={plan.plan} onChange={(e) => updatePricing(idx, "plan", e.target.value)}
                  placeholder="Plan Name" className="w-full pr-10 rounded border border-gray-300 bg-white px-3 py-2 text-sm font-bold text-slate-900"
                />
<AmountInput required={false} value={plan.price} onValueChange={(value) => updatePricing(idx, "price", value)} placeholder="Price in rupees (empty = on request)" className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900" />
              </div>
            ))}
          </div>
        )}

        {activeTab === "SEO" && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Meta Title</label>
              <input 
                type="text" name="seo_title" value={formData.seo_title} onChange={handleChange}
                className="w-full rounded border border-gray-300 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Meta Description</label>
              <textarea 
                name="seo_description" value={formData.seo_description} onChange={handleChange} rows={3}
                className="w-full rounded border border-gray-300 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 font-medium"
              />
            </div>
          </div>
        )}

        {activeTab === "Publishing" && (
          <div className="space-y-4 animate-in fade-in">
            {[
              { value: "published", label: "Published", desc: "Visible publicly.", icon: Globe, color: "text-emerald-600" },
              { value: "draft", label: "Draft", desc: "Visible only in admin.", icon: Archive, color: "text-amber-600" },
              { value: "disabled", label: "Disabled", desc: "Temporarily unavailable.", icon: EyeOff, color: "text-red-600" },
            ].map((status) => {
              const Icon = status.icon;
              const isActive = formData.status === status.value;
              return (
                <div 
                  key={status.value}
                  onClick={() => setFormData({ ...formData, status: status.value })}
                  className={clsx(
                    "cursor-pointer rounded-lg border p-4 transition-all",
                    isActive ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className={clsx("h-5 w-5", status.color)} />
                      <div>
                        <span className="font-bold text-slate-900 block">{status.label}</span>
                        <span className="text-sm text-slate-500">{status.desc}</span>
                      </div>
                    </div>
                    {isActive && <Check className="h-5 w-5 text-blue-600" />}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 mt-6">
        <button 
          onClick={handleSave}
          className="w-full inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-sm"
        >
          <Save className="h-4 w-4" />
          {isNew ? "Create Suite" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
