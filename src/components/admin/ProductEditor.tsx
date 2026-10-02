"use client";

import { useState } from "react";
import { Save, Globe, EyeOff, Archive, Check, Plus, Trash2, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { createClient } from "@/lib/supabase-browser";
import { useAdminStore } from "@/store/adminStore";
import { toast } from "sonner";
import { describeError } from "@/lib/error-message";
import { RESERVED_SLUGS } from "@/lib/product-routes";
import { AmountInput } from "@/components/forms/IndiaInputs";
import { amountError } from "@/lib/india";

const tabs = ["General", "Features", "Use cases", "Pricing", "FAQs", "SEO", "Publishing"];

type Feature = { title: string; desc: string };
type Plan = { name: string; price: string; period: string; description: string; features: string; highlighted: boolean };
type Faq = { question: string; answer: string };

const inputClass = "w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

// Older rows used other key names; read them all so nothing written earlier is lost.
function readFeatures(value: unknown): Feature[] {
  return Array.isArray(value) ? value.map((item) => ({ title: item?.title ?? "", desc: item?.desc ?? item?.description ?? "" })) : [];
}

function readPlans(value: unknown): Plan[] {
  return Array.isArray(value) ? value.map((item) => ({
    name: item?.name ?? item?.plan ?? "",
    price: item?.price === undefined || item?.price === null ? "" : String(item.price),
    period: item?.period ?? "",
    description: item?.description ?? "",
    features: Array.isArray(item?.features) ? item.features.join("\n") : typeof item?.features === "string" ? item.features : "",
    highlighted: Boolean(item?.highlighted),
  })) : [];
}

function readFaqs(value: unknown): Faq[] {
  return Array.isArray(value) ? value.map((item) => ({ question: item?.question ?? item?.q ?? "", answer: item?.answer ?? item?.a ?? "" })) : [];
}

export function ProductEditor({ initialData, isNew, onClose }: { initialData: any, isNew: boolean, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState("General");
  const { addProduct, updateProduct, setIsSaving } = useAdminStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [general, setGeneral] = useState({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    subtitle: initialData?.subtitle ?? "",
    description: initialData?.description ?? "",
    category: initialData?.category ?? "",
    status: initialData?.status ?? "draft",
    visibility: initialData?.visibility ?? "public",
    seo_title: initialData?.seo_title ?? "",
    seo_description: initialData?.seo_description ?? "",
    seo_keywords: initialData?.seo_keywords ?? "",
  });
  const [features, setFeatures] = useState<Feature[]>(readFeatures(initialData?.features));
  const [useCases, setUseCases] = useState<Feature[]>(readFeatures(initialData?.use_cases));
  const [plans, setPlans] = useState<Plan[]>(readPlans(initialData?.pricing));
  const [faqs, setFaqs] = useState<Faq[]>(readFaqs(initialData?.faqs));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setGeneral({ ...general, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const title = general.title.trim();
    const slug = general.slug.trim().toLowerCase();
    if (!title || !slug) {
      toast.error("Product name and URL slug are required.");
      return;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      toast.error("Use lowercase letters, numbers and single hyphens in the slug.");
      return;
    }
    if (RESERVED_SLUGS.has(slug)) {
      toast.error(`"${slug}" is used by a company page. Choose another slug, e.g. "${slug}-app".`);
      return;
    }

    const badPlan = plans.find((plan) => plan.name.trim() && amountError(plan.price, { required: false }));
    if (badPlan) {
      toast.error(`Plan "${badPlan.name}": ${amountError(badPlan.price, { required: false })}`);
      return;
    }

    // Prices are rupee amounts stored as numbers; an empty price shows "Pricing on request".
    const payload = {
      ...general,
      title,
      slug,
      features: features.filter((item) => item.title.trim()).map((item) => ({ title: item.title.trim(), desc: item.desc.trim() })),
      use_cases: useCases.filter((item) => item.title.trim()).map((item) => ({ title: item.title.trim(), desc: item.desc.trim() })),
      pricing: plans.filter((plan) => plan.name.trim()).map((plan) => {
        return {
          name: plan.name.trim(),
          price: plan.price.trim() === "" ? null : Number(plan.price),
          period: plan.period.trim(),
          description: plan.description.trim(),
          features: plan.features.split("\n").map((line) => line.trim()).filter(Boolean),
          highlighted: plan.highlighted,
        };
      }),
      faqs: faqs.filter((item) => item.question.trim() && item.answer.trim()).map((item) => ({ question: item.question.trim(), answer: item.answer.trim() })),
      published_at: general.status === "published" ? (initialData?.published_at ?? new Date().toISOString()) : initialData?.published_at ?? null,
    };

    setIsSubmitting(true);
    setIsSaving(true);
    try {
      const supabase = createClient();
      if (isNew) {
        const { data, error } = await supabase.from("products").insert([payload]).select().single();
        if (error) throw error;
        addProduct(data);
      } else {
        const { data, error } = await supabase.from("products").update(payload).eq("id", initialData.id).select().single();
        if (error) throw error;
        updateProduct(initialData.id, data);
      }
      toast.success(isNew ? "Product created." : "Product saved.");
      onClose();
    } catch (error) {
      toast.error(`Save failed: ${describeError(error, "Another product already uses that slug.")}`);
    } finally {
      setIsSubmitting(false);
      setIsSaving(false);
    }
  };

  const listEditor = (items: Feature[], setItems: (items: Feature[]) => void, noun: string) => (
    <div className="space-y-4 animate-in fade-in">
      <button type="button" onClick={() => setItems([...items, { title: "", desc: "" }])} className="inline-flex items-center gap-1.5 rounded bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700 hover:bg-blue-100 transition-colors">
        <Plus className="h-4 w-4" /> Add {noun}
      </button>
      {items.length === 0 && <p className="text-sm text-slate-500">Nothing added yet. Sections with no entries are not shown on the website.</p>}
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-4 p-4 border border-gray-200 rounded-lg bg-slate-50">
          <div className="flex-1 space-y-3">
            <input type="text" value={item.title} onChange={(e) => setItems(items.map((current, i) => i === idx ? { ...current, title: e.target.value } : current))} placeholder={`${noun} title`} className={inputClass} />
            <textarea value={item.desc} onChange={(e) => setItems(items.map((current, i) => i === idx ? { ...current, desc: e.target.value } : current))} placeholder="Description" rows={2} className={inputClass} />
          </div>
          <button type="button" onClick={() => setItems(items.filter((_, i) => i !== idx))} aria-label={`Remove ${noun}`} className="text-slate-400 hover:text-red-600 transition-colors">
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 pb-24">
      <div className="flex overflow-x-auto border-b border-gray-200 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "whitespace-nowrap px-4 py-2 text-sm font-bold rounded-t-lg transition-all",
              activeTab === tab ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-b-2 border-transparent"
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
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Product name *</label>
              <input type="text" name="title" value={general.title} onChange={handleChange} className={inputClass} placeholder="e.g. School ERP" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Web address *</label>
              <input type="text" name="slug" value={general.slug} onChange={handleChange} className={inputClass} placeholder="school-erp" />
              <p className="mt-1 text-xs text-slate-500">The product's website is at /{general.slug || "slug"}, with /features, /pricing, /faq and /demo pages.</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">One-line summary</label>
              <input type="text" name="subtitle" value={general.subtitle} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Description</label>
              <textarea name="description" value={general.description} onChange={handleChange} rows={4} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Category</label>
              <input type="text" name="category" value={general.category} onChange={handleChange} className={inputClass} placeholder="e.g. Education" />
            </div>
          </div>
        )}

        {activeTab === "Features" && listEditor(features, setFeatures, "Feature")}
        {activeTab === "Use cases" && listEditor(useCases, setUseCases, "Use case")}

        {activeTab === "Pricing" && (
          <div className="space-y-4 animate-in fade-in">
            <p className="text-sm text-slate-500">These plans appear on the product page and the Pricing page. Prices are in rupees (₹). Leave the price empty to show &quot;Pricing on request&quot; and ask visitors for a quote instead.</p>
            <button type="button" onClick={() => setPlans([...plans, { name: "", price: "", period: "year", description: "", features: "", highlighted: false }])} className="inline-flex items-center gap-1.5 rounded bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700 hover:bg-blue-100 transition-colors">
              <Plus className="h-4 w-4" /> Add plan
            </button>
            {plans.map((plan, idx) => {
              const update = (field: keyof Plan, value: string | boolean) => setPlans(plans.map((current, i) => i === idx ? { ...current, [field]: value } : current));
              return (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg bg-slate-50 space-y-3 relative">
                  <button type="button" onClick={() => setPlans(plans.filter((_, i) => i !== idx))} aria-label="Remove plan" className="absolute top-4 right-4 text-slate-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <input type="text" value={plan.name} onChange={(e) => update("name", e.target.value)} placeholder="Plan name, e.g. Standard" className={`${inputClass} pr-10 font-bold`} />
                  <div className="grid grid-cols-2 gap-3">
                    <AmountInput required={false} value={plan.price} onValueChange={(value) => update("price", value)} placeholder="Price in rupees (empty = on request)" className={inputClass} />
                    <input type="text" value={plan.period} onChange={(e) => update("period", e.target.value)} placeholder="Per, e.g. year or student / year" className={inputClass} />
                  </div>
                  <input type="text" value={plan.description} onChange={(e) => update("description", e.target.value)} placeholder="Who this plan is for" className={inputClass} />
                  <textarea value={plan.features} onChange={(e) => update("features", e.target.value)} rows={4} placeholder={"What is included, one per line"} className={inputClass} />
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" checked={plan.highlighted} onChange={(e) => update("highlighted", e.target.checked)} /> Mark as recommended
                  </label>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "FAQs" && (
          <div className="space-y-4 animate-in fade-in">
            <button type="button" onClick={() => setFaqs([...faqs, { question: "", answer: "" }])} className="inline-flex items-center gap-1.5 rounded bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700 hover:bg-blue-100 transition-colors">
              <Plus className="h-4 w-4" /> Add question
            </button>
            {faqs.map((faq, idx) => (
              <div key={idx} className="flex gap-4 p-4 border border-gray-200 rounded-lg bg-slate-50">
                <div className="flex-1 space-y-3">
                  <input type="text" value={faq.question} onChange={(e) => setFaqs(faqs.map((current, i) => i === idx ? { ...current, question: e.target.value } : current))} placeholder="Question" className={inputClass} />
                  <textarea value={faq.answer} onChange={(e) => setFaqs(faqs.map((current, i) => i === idx ? { ...current, answer: e.target.value } : current))} placeholder="Answer" rows={3} className={inputClass} />
                </div>
                <button type="button" onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))} aria-label="Remove question" className="text-slate-400 hover:text-red-600 transition-colors">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "SEO" && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Meta title</label>
              <input type="text" name="seo_title" value={general.seo_title} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Meta description</label>
              <textarea name="seo_description" value={general.seo_description} onChange={handleChange} rows={3} className={inputClass} />
            </div>
          </div>
        )}

        {activeTab === "Publishing" && (
          <div className="space-y-4 animate-in fade-in">
            {[
              { value: "published", label: "Published", desc: "Listed on the website, in menus and in enquiry forms.", icon: Globe, color: "text-emerald-600" },
              { value: "draft", label: "Draft", desc: "Visible only in admin.", icon: Archive, color: "text-amber-600" },
              { value: "disabled", label: "Disabled", desc: "Hidden from the website.", icon: EyeOff, color: "text-red-600" },
            ].map((status) => {
              const Icon = status.icon;
              const isActive = general.status === status.value;
              return (
                <button
                  type="button"
                  key={status.value}
                  onClick={() => setGeneral({ ...general, status: status.value })}
                  className={clsx(
                    "w-full text-left rounded-lg border p-4 transition-all",
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
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 mt-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-sm disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isNew ? "Create product" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
