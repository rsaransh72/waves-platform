"use client";


import { toast } from "sonner";import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Globe, EyeOff, Archive, Check, Plus, Trash2, GripVertical } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";
import { createClient } from "@/lib/supabase-browser";

const tabs = ["General", "Features", "Pricing", "SEO", "Publishing"];

export function ServiceEditor({ initialData, isNew }: { initialData: any, isNew: boolean }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("General");
  const [isSaving, setIsSaving] = useState(false);
  
  // Initialize with safe defaults for JSONB columns
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    subtitle: "",
    description: "",
    category: "",
    status: "draft",
    visibility: "public",
    seo_title: "",
    seo_description: "",
    benefits: [],
    pricing: [],
    faqs: [],
    ...initialData,
    // Older services stored features as plain text; the editor works with { title, description }.
    features: (initialData?.features ?? []).map((feature: any) => typeof feature === "string" ? { title: feature, description: "" } : feature),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Features Array Management
  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, { title: "", description: "" }] });
  };
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

  // Pricing Array Management
  const addPricing = () => {
    setFormData({ ...formData, pricing: [...formData.pricing, { plan: "", price: "", features: "" }] });
  };
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
    setIsSaving(true);
    try {
      const supabase = createClient();
      
      if (isNew) {
        const { error } = await supabase.from("services").insert([formData]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("services").update(formData).eq("id", formData.id);
        if (error) throw error;
      }
      router.push("/admin/services");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(`Could not save service: ${err.message || JSON.stringify(err)}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/admin/services" className="rounded p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {isNew ? "Create New Service" : `Edit: ${formData.title}`}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-semibold text-slate-500">Status:</span>
              <span className={clsx(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold shadow-sm",
                formData.status === "published" ? "text-emerald-700 bg-emerald-50 border-emerald-200" :
                formData.status === "disabled" ? "text-red-700 bg-red-50 border-red-200" :
                "text-amber-700 bg-amber-50 border-amber-200"
              )}>
                {formData.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-56 flex-shrink-0 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <nav className="flex flex-row lg:flex-col p-2 gap-1 overflow-x-auto lg:overflow-visible">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  "whitespace-nowrap px-4 py-2.5 text-sm font-bold rounded text-left transition-all",
                  activeTab === tab 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Form Content */}
        <div className="flex-1 min-w-0">
          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm min-h-[500px]">
            
            {activeTab === "General" && (
              <div className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-bottom-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">General Information</h3>
                  <p className="text-sm font-medium text-slate-500">Basic details about this product.</p>
                </div>
                
                <div className="space-y-5 pt-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Service Name *</label>
                    <input 
                      type="text" 
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-300 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                      placeholder="e.g. Waves CRM"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">URL Slug *</label>
                    <div className="flex rounded shadow-sm">
                      <span className="inline-flex items-center rounded-l border border-r-0 border-gray-300 bg-slate-50 px-3 text-slate-500 text-sm font-medium">
                        /services/
                      </span>
                      <input 
                        type="text" 
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        className="w-full rounded-none rounded-r border border-gray-300 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                        placeholder="waves-crm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Subtitle / Tagline</label>
                    <input 
                      type="text" 
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-300 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                      placeholder="e.g. The intelligent CRM for modern sales teams"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Category</label>
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-300 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                    >
                      <option value="">Select a category</option>
                      <option value="Sales">Sales</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Commerce and POS">Commerce and POS</option>
                      <option value="Service">Service</option>
                      <option value="Finance">Finance</option>
                      <option value="Education">Education</option>
                      <option value="ERP">ERP</option>
                      <option value="Email, Storage, and Collaboration">Email, Storage, and Collaboration</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Legal">Legal</option>
                      <option value="Security and IT Management">Security and IT Management</option>
                      <option value="BI and Analytics">BI and Analytics</option>
                      <option value="Project Management">Project Management</option>
                      <option value="Developer Platforms">Developer Platforms</option>
                      <option value="IoT">IoT</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Features" && (
              <div className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Service Features</h3>
                    <p className="text-sm font-medium text-slate-500">Key capabilities to highlight on the service page.</p>
                  </div>
                  <button onClick={addFeature} className="inline-flex items-center gap-1.5 rounded bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700 hover:bg-blue-100 transition-colors">
                    <Plus className="h-4 w-4" /> Add Feature
                  </button>
                </div>

                <div className="space-y-4 pt-4">
                  {formData.features.map((feature: any, idx: number) => (
                    <div key={idx} className="flex gap-4 p-4 border border-gray-200 rounded-lg bg-slate-50 relative group">
                      <div className="mt-2 text-slate-400 cursor-grab">
                        <GripVertical className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <input 
                          type="text" 
                          value={feature.title}
                          onChange={(e) => updateFeature(idx, "title", e.target.value)}
                          placeholder="Feature Title (e.g., Advanced Analytics)"
                          className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <textarea 
                          value={feature.description}
                          onChange={(e) => updateFeature(idx, "description", e.target.value)}
                          placeholder="Short description of the feature..."
                          rows={2}
                          className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <button onClick={() => removeFeature(idx)} className="text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  {formData.features.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
                      <p className="text-slate-500 font-medium">No features added yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "Pricing" && (
              <div className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Pricing Plans</h3>
                    <p className="text-sm font-medium text-slate-500">Define the pricing tiers for this service.</p>
                  </div>
                  <button onClick={addPricing} className="inline-flex items-center gap-1.5 rounded bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700 hover:bg-blue-100 transition-colors">
                    <Plus className="h-4 w-4" /> Add Plan
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {formData.pricing.map((plan: any, idx: number) => (
                    <div key={idx} className="p-4 border border-gray-200 rounded-lg bg-slate-50 space-y-3 relative">
                      <button onClick={() => removePricing(idx)} className="absolute top-4 right-4 text-slate-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <input 
                        type="text" 
                        value={plan.plan}
                        onChange={(e) => updatePricing(idx, "plan", e.target.value)}
                        placeholder="Plan Name (e.g., Professional)"
                        className="w-full pr-10 rounded border border-gray-300 bg-white px-3 py-2 text-sm font-bold text-slate-900"
                      />
                      <input 
                        type="text" 
                        value={plan.price}
                        onChange={(e) => updatePricing(idx, "price", e.target.value)}
                        placeholder="Price (e.g., $49/mo)"
                        className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900"
                      />
                      <textarea 
                        value={plan.features}
                        onChange={(e) => updatePricing(idx, "features", e.target.value)}
                        placeholder="Comma separated features..."
                        rows={3}
                        className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900"
                      />
                    </div>
                  ))}
                  {formData.pricing.length === 0 && (
                    <div className="col-span-full text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
                      <p className="text-slate-500 font-medium">No pricing plans defined.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "SEO" && (
              <div className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-bottom-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Search Engine Optimization</h3>
                  <p className="text-sm font-medium text-slate-500">Meta tags for Google and social sharing.</p>
                </div>
                
                <div className="space-y-5 pt-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Meta Title</label>
                    <input 
                      type="text" 
                      name="seo_title"
                      value={formData.seo_title}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-300 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 font-medium"
                      placeholder="e.g. Waves CRM - The Best Sales Tool"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Meta Description</label>
                    <textarea 
                      name="seo_description"
                      value={formData.seo_description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full rounded border border-gray-300 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 font-medium"
                      placeholder="Brief description for search results..."
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Publishing" && (
              <div className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-bottom-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Lifecycle & Visibility</h3>
                  <p className="text-sm font-medium text-slate-500">Control where and how this service appears on the public website.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
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
                          "relative cursor-pointer rounded-lg border p-5 transition-all",
                          isActive ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300 hover:bg-slate-50"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Icon className={clsx("h-5 w-5", status.color)} />
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900">{status.label}</span>
                              <span className="text-sm font-medium text-slate-500">{status.desc}</span>
                            </div>
                          </div>
                          {isActive && <Check className="h-5 w-5 text-blue-600" />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
