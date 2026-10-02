"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { CityInput, EmailInput, NameInput, PhoneInput, TextInput } from "@/components/forms/IndiaInputs";

export type LeadInquiryType = "demo" | "contact" | "consultation" | "pricing" | "access";

type ProductOption = { slug: string; title: string };

const COPY: Record<LeadInquiryType, { title: string; description: string; submit: string; done: string }> = {
  demo: {
    title: "Request a demo",
    description: "Tell us a little about your organization. We will call you to schedule a live walkthrough.",
    submit: "Request demo",
    done: "Your demo request has been received. Our team will call you to schedule a time that suits you.",
  },
  contact: {
    title: "Send us a message",
    description: "Questions about our products, services or your account. We reply to every message.",
    submit: "Send message",
    done: "Your message has been received. We will reply by email or phone.",
  },
  consultation: {
    title: "Book a consultation",
    description: "Describe what you need set up, migrated or trained. We will scope it with you before any work starts.",
    submit: "Request consultation",
    done: "Your consultation request has been received. We will contact you to understand your requirements.",
  },
  pricing: {
    title: "Get a quote",
    description: "Pricing depends on the size of your organization and what you need. Share a few details and we will send you a quote.",
    submit: "Request quote",
    done: "Your quote request has been received. We will send a quote based on your details.",
  },
  access: {
    title: "Request access",
    description: "Accounts are set up by our team after a short call, so your data and users are configured correctly from day one.",
    submit: "Request access",
    done: "Your request has been received. Our onboarding team will contact you to set up your account.",
  },
};

const inputClass = "w-full h-[40px] px-3 border border-[#cccccc] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] rounded-[3px] text-[14px] outline-none transition bg-white text-[#111111]";
const labelClass = "block text-[13px] font-semibold text-[#111111] mb-1.5";

function Required() {
  return <span className="text-[#e42525]">*</span>;
}

export default function LeadForm({
  inquiryType = "demo",
  products,
  defaultProduct = "",
  source,
  title,
  description,
}: {
  inquiryType?: LeadInquiryType;
  products: ProductOption[];
  defaultProduct?: string;
  source?: string;
  title?: string;
  description?: string;
}) {
  const copy = COPY[inquiryType];
  const askProduct = inquiryType !== "contact" && products.length > 1;
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    organizationName: "",
    city: "",
    teamSize: "",
    message: "",
    product: defaultProduct || (products.length === 1 ? products[0].slug : ""),
    website: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const update = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));
  const set = (field: keyof typeof form) => (value: string) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, inquiryType, source: source ?? `website_${inquiryType}` }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "We could not submit your request. Please try again.");
      setConfirmationSent(Boolean(data.confirmationSent));
      setSuccess(true);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "We could not submit your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white border border-[#e6e9f0] rounded-[4px] p-8 text-center animate-in fade-in duration-300">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-[20px] font-bold text-[#111111] tracking-tight">Thank you, {form.name.split(" ")[0]}</h3>
        <p className="text-[14px] text-[#404040] mt-2 leading-relaxed">{copy.done}</p>
        {confirmationSent && <p className="text-[13px] text-[#555555] mt-3">A confirmation has been sent to <span className="font-semibold text-[#111111]">{form.email}</span>.</p>}
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e6e9f0] rounded-[4px] p-6 sm:p-8 shadow-xs">
      <div className="mb-6">
        <h3 className="text-[24px] font-semibold text-[#111111] tracking-tight">{title ?? copy.title}</h3>
        <p className="text-[14px] text-[#555555] mt-1.5">{description ?? copy.description}</p>
      </div>

      {errorMsg && (
        <div role="alert" className="mb-5 p-3 rounded-[4px] bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Hidden from people; bots that fill it are ignored. */}
        <div className="hidden" aria-hidden="true">
          <label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={update("website")} /></label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor={`${inquiryType}-name`} className={labelClass}>Full name <Required /></label>
            <NameInput id={`${inquiryType}-name`} required value={form.name} onValueChange={set("name")} className={inputClass} />
          </div>
          <div>
            <label htmlFor={`${inquiryType}-phone`} className={labelClass}>Mobile number <Required /></label>
            <PhoneInput id={`${inquiryType}-phone`} required value={form.phone} onValueChange={set("phone")} className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor={`${inquiryType}-email`} className={labelClass}>Email <Required /></label>
          <EmailInput id={`${inquiryType}-email`} required value={form.email} onValueChange={set("email")} className={inputClass} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor={`${inquiryType}-org`} className={labelClass}>
              {inquiryType === "contact" ? "Organization" : <>Organization <Required /></>}
            </label>
            <TextInput id={`${inquiryType}-org`} label="Organization" required={inquiryType !== "contact"} max={200} autoComplete="organization" value={form.organizationName} onValueChange={set("organizationName")} className={inputClass} />
          </div>
          <div>
            <label htmlFor={`${inquiryType}-city`} className={labelClass}>City</label>
            <CityInput id={`${inquiryType}-city`} value={form.city} onValueChange={set("city")} className={inputClass} />
          </div>
        </div>

        {askProduct && (
          <div>
            <label htmlFor={`${inquiryType}-product`} className={labelClass}>Product <Required /></label>
            <select id={`${inquiryType}-product`} required value={form.product} onChange={update("product")} className={inputClass}>
              <option value="">Select a product</option>
              {products.map((product) => <option key={product.slug} value={product.slug}>{product.title}</option>)}
            </select>
          </div>
        )}

        {(inquiryType === "demo" || inquiryType === "pricing" || inquiryType === "access") && (
          <div>
            <label htmlFor={`${inquiryType}-size`} className={labelClass}>Size</label>
            <input id={`${inquiryType}-size`} type="text" maxLength={50} value={form.teamSize} onChange={update("teamSize")} placeholder="e.g. 800 students, 40 staff, 2 branches" className={inputClass} />
          </div>
        )}

        <div>
          <label htmlFor={`${inquiryType}-message`} className={labelClass}>
            {inquiryType === "contact" ? <>How can we help? <Required /></> : "Anything we should know?"}
          </label>
          <textarea
            id={`${inquiryType}-message`}
            rows={inquiryType === "contact" || inquiryType === "consultation" ? 4 : 3}
            required={inquiryType === "contact"}
            minLength={inquiryType === "contact" ? 10 : undefined}
            maxLength={2000}
            value={form.message}
            onChange={update("message")}
            className="w-full px-3 py-2 border border-[#cccccc] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] rounded-[3px] text-[14px] outline-none transition bg-white text-[#111111]"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 h-[44px] bg-[#e42525] hover:bg-[#d60012] text-white font-semibold text-[14px] uppercase tracking-wide rounded-[3px] transition flex items-center justify-center cursor-pointer disabled:opacity-70 shadow-sm"
          >
            {loading ? (
              <span className="flex items-center space-x-2"><Loader2 className="w-4 h-4 animate-spin" /><span>Please wait...</span></span>
            ) : (
              <span>{copy.submit}</span>
            )}
          </button>
          <p className="mt-3 text-[12px] text-[#777777]">We use these details only to respond to your request.</p>
        </div>
      </form>
    </div>
  );
}
