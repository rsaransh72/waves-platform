"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { saveSiteSettings } from "@/app/actions/site-settings";

const SECTIONS: Array<{ title: string; description: string; fields: Array<{ key: string; label: string; hint?: string; type?: string; multiline?: boolean }> }> = [
  {
    title: "Company",
    description: "Shown in the website header, footer and page titles.",
    fields: [
      { key: "company_name", label: "Company name *" },
      { key: "tagline", label: "Tagline", hint: "One sentence under the home page heading and in the footer." },
    ],
  },
  {
    title: "Public contact details",
    description: "Shown on the Contact page, next to enquiry forms and in the footer. Leave a field empty to hide it.",
    fields: [
      { key: "phone", label: "Phone", type: "tel", hint: "Include the country code, e.g. +91 ..." },
      { key: "whatsapp", label: "WhatsApp number", type: "tel" },
      { key: "sales_email", label: "Sales email", type: "email" },
      { key: "support_email", label: "Support email for customers", type: "email" },
      { key: "address", label: "Office address", multiline: true },
      { key: "business_hours", label: "Business hours", hint: "e.g. Mon–Sat, 9:30 am – 6:30 pm" },
    ],
  },
  {
    title: "Lead alerts",
    description: "Every enquiry from the website appears in Leads. If email sending is configured (RESEND_API_KEY and RESEND_FROM_EMAIL), an alert is also sent here; otherwise to the sales email.",
    fields: [
      { key: "lead_notification_email", label: "Send new-lead alerts to", type: "email" },
    ],
  },
];

const inputClass = "w-full rounded border border-gray-300 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

export function SiteSettingsForm({ initialValues }: { initialValues: Record<string, string> }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({ company_name: "Waves", ...initialValues });
  const [isPending, startTransition] = useTransition();

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await saveSiteSettings(values);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message ?? "Saved.");
      router.refresh();
    });
  };

  return (
    <form onSubmit={save} className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Website & company settings</h1>
          <p className="text-sm font-medium text-slate-500">Everything here appears on the public website.</p>
        </div>
        <button type="submit" disabled={isPending} className="inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-sm disabled:opacity-60">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save changes
        </button>
      </div>

      {SECTIONS.map((section) => (
        <section key={section.title} className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 bg-slate-50 px-6 py-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">{section.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{section.description}</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {section.fields.map((field) => (
              <div key={field.key} className={field.multiline ? "md:col-span-2" : undefined}>
                <label htmlFor={`setting-${field.key}`} className="block text-sm font-bold text-slate-700 mb-1.5">{field.label}</label>
                {field.multiline ? (
                  <textarea id={`setting-${field.key}`} rows={3} value={values[field.key] ?? ""} onChange={(event) => setValues({ ...values, [field.key]: event.target.value })} className={inputClass} />
                ) : (
                  <input id={`setting-${field.key}`} type={field.type ?? "text"} value={values[field.key] ?? ""} onChange={(event) => setValues({ ...values, [field.key]: event.target.value })} className={inputClass} />
                )}
                {field.hint && <p className="mt-1 text-xs text-slate-500">{field.hint}</p>}
              </div>
            ))}
          </div>
        </section>
      ))}
    </form>
  );
}
