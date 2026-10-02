"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Building2, Clock, Loader2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { saveSiteSettings } from "@/app/actions/site-settings";
import { formatPhone } from "@/lib/india";
import { EMAIL_SETTINGS, SITE_SETTING_KEYS, SITE_SETTING_LIMITS, toSiteSettings, validateSiteSettings, type SiteSettingErrors, type SiteSettingKey, type SiteSettings } from "@/lib/site-settings";
import { EmailInput, PhoneInput } from "@/components/forms/IndiaInputs";
import { Banner, FieldError, FormRow, FormSection, PageHeader, adminHint, adminInput, adminInvalid, adminTextarea, button, pageSheet } from "@/components/admin/ui";

type FieldKind = "text" | "textarea" | "email" | "landline" | "mobile";
type FieldSpec = { key: SiteSettingKey; label: string; kind: FieldKind; required?: boolean; placeholder?: string; hint?: string };
type Section = { id: string; title: string; description: string; fields: FieldSpec[] };

const SECTIONS: Section[] = [
  {
    id: "company",
    title: "Company",
    description: "Shown in the website header, footer and page titles.",
    fields: [
      { key: "company_name", label: "Company name", kind: "text", required: true, placeholder: "e.g. Waves Technologies" },
      { key: "tagline", label: "Tagline", kind: "text", placeholder: "One line about what you do", hint: "Shown under the home page heading and in the footer." },
    ],
  },
  {
    id: "contact",
    title: "Public contact details",
    description: "Shown on the Contact page, next to enquiry forms and in the footer. Leave a field empty to hide it.",
    fields: [
      { key: "phone", label: "Phone", kind: "landline", hint: "Mobile, or landline with STD code. +91 is added for you." },
      { key: "whatsapp", label: "WhatsApp", kind: "mobile", hint: "The mobile number that has WhatsApp." },
      { key: "sales_email", label: "Sales email", kind: "email", placeholder: "sales@company.in" },
      { key: "support_email", label: "Support email", kind: "email", placeholder: "support@company.in", hint: "For existing customers." },
      { key: "address", label: "Office address", kind: "textarea", placeholder: "Building, street, area, city, PIN code" },
      { key: "business_hours", label: "Business hours", kind: "text", placeholder: "Mon–Sat, 9:30 am – 6:30 pm" },
    ],
  },
  {
    id: "alerts",
    title: "Lead alerts",
    description: "Every website enquiry appears in Leads. When email sending is configured (RESEND_API_KEY and RESEND_FROM_EMAIL), an alert is also emailed.",
    fields: [
      { key: "lead_notification_email", label: "Send alerts to", kind: "email", placeholder: "sales-team@company.in", hint: "When empty, alerts go to the sales email." },
    ],
  },
];

const LABELS = Object.fromEntries(SECTIONS.flatMap((section) => section.fields.map((field) => [field.key, field.label]))) as Record<SiteSettingKey, string>;
const fieldId = (key: SiteSettingKey) => `setting-${key}`;

function focusField(key: SiteSettingKey) {
  const element = document.getElementById(fieldId(key));
  element?.scrollIntoView({ block: "center", behavior: "smooth" });
  element?.focus({ preventScroll: true });
}

// How the details appear in the website footer, updated as you type.
function Preview({ values, errors }: { values: SiteSettings; errors: SiteSettingErrors }) {
  const show = (key: SiteSettingKey) => values[key].trim() && !errors[key];
  const rows: [React.ComponentType<{ className?: string }>, SiteSettingKey, string][] = [
    [Phone, "phone", formatPhone(values.phone)],
    [MessageCircle, "whatsapp", `WhatsApp ${formatPhone(values.whatsapp)}`],
    [Mail, "sales_email", values.sales_email.trim().toLowerCase()],
    [Mail, "support_email", `Support: ${values.support_email.trim().toLowerCase()}`],
    [MapPin, "address", values.address.trim()],
    [Clock, "business_hours", values.business_hours.trim()],
  ];
  const visible = rows.filter(([, key]) => show(key));
  const alertsTo = (show("lead_notification_email") && values.lead_notification_email) || (show("sales_email") && values.sales_email) || "";

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Website preview</p>
        <div className="mt-2 overflow-hidden rounded-lg border border-slate-200 shadow-sm">
          <div className="bg-slate-900 px-5 py-5 text-slate-300">
            <p className="flex items-center gap-2 text-base font-semibold text-white">
              <Building2 className="h-4 w-4 text-blue-400" />
              {show("company_name") ? values.company_name.trim() : <span className="text-slate-500">Company name</span>}
            </p>
            {show("tagline") && <p className="mt-1 text-[13px] leading-relaxed text-slate-400">{values.tagline.trim()}</p>}
            <ul className="mt-4 space-y-2 text-[13px]">
              {visible.map(([Icon, key, text]) => (
                <li key={key} className="flex items-start gap-2.5">
                  <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
                  <span className="min-w-0 whitespace-pre-line break-words">{text}</span>
                </li>
              ))}
            </ul>
            {visible.length === 0 && <p className="mt-4 text-xs text-slate-500">No contact details are shown.</p>}
          </div>
          <p className="border-t border-slate-200 bg-white px-5 py-2.5 text-xs text-slate-500">Footer and Contact page, as visitors see them.</p>
        </div>
      </div>
      <div className="rounded-lg border border-slate-200 px-4 py-3 text-[13px]">
        <p className="font-medium text-slate-900">New-lead alerts</p>
        <p className="mt-0.5 break-all text-slate-500">{alertsTo ? <>Emailed to <span className="font-medium text-slate-700">{alertsTo.trim().toLowerCase()}</span></> : "No address set: alerts are not emailed. Leads still appear in Leads."}</p>
      </div>
    </div>
  );
}

export function SiteSettingsForm({ initialValues }: { initialValues: Record<string, string> }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [saved, setSaved] = useState<SiteSettings>(() => {
    const values = toSiteSettings(initialValues);
    return { ...values, company_name: values.company_name || "Waves" };
  });
  const [values, setValues] = useState<SiteSettings>(saved);
  const [touched, setTouched] = useState<Partial<Record<SiteSettingKey, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [serverErrors, setServerErrors] = useState<SiteSettingErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const errors = useMemo(() => ({ ...validateSiteSettings(values), ...serverErrors }), [values, serverErrors]);
  const problems = SITE_SETTING_KEYS.filter((key) => errors[key]);
  const changed = SITE_SETTING_KEYS.filter((key) => values[key] !== saved[key]);
  const isDirty = changed.length > 0;
  const visibleError = (key: SiteSettingKey) => (submitted || touched[key] || serverErrors[key] ? errors[key] : undefined);

  // Ask before leaving with unsaved changes; Ctrl/⌘+S saves.
  useEffect(() => {
    if (!isDirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        formRef.current?.requestSubmit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const setValue = (key: SiteSettingKey) => (value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    if (serverErrors[key]) setServerErrors((current) => Object.fromEntries(Object.entries(current).filter(([field]) => field !== key)));
  };

  const discard = () => {
    setValues(saved);
    setTouched({});
    setSubmitted(false);
    setServerErrors({});
    setFormError(null);
  };

  const save = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;
    setSubmitted(true);
    setFormError(null);
    event.currentTarget.checkValidity(); // shows each India input's own message
    if (problems.length) return void focusField(problems[0]);
    if (!isDirty) return void toast.info("There are no changes to save.");

    startTransition(async () => {
      const result = await saveSiteSettings(values);
      if (result.error) {
        setServerErrors(result.fieldErrors ?? {});
        setFormError(result.error);
        const first = SITE_SETTING_KEYS.find((key) => result.fieldErrors?.[key]);
        if (first) focusField(first);
        else document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const next = toSiteSettings(result.saved);
      setSaved(next);
      setValues(next);
      setSubmitted(false);
      setTouched({});
      toast.success(result.message ?? "Saved.");
      router.refresh();
    });
  };

  const renderInput = (field: FieldSpec) => {
    const id = fieldId(field.key);
    const value = values[field.key];
    const invalid = visibleError(field.key);
    const common = { id, placeholder: field.placeholder, onBlur: () => setTouched((current) => ({ ...current, [field.key]: true })) };
    switch (field.kind) {
      case "landline":
      case "mobile":
        return <PhoneInput {...common} kind={field.kind} value={value} onValueChange={setValue(field.key)} className={adminInput} />;
      case "email":
        return (
          <>
            <EmailInput {...common} value={value} onValueChange={setValue(field.key)} className={`${adminInput} ${serverErrors[field.key] ? adminInvalid : ""}`} />
            <FieldError message={serverErrors[field.key]} />
          </>
        );
      case "textarea":
        return (
          <>
            <textarea {...common} rows={3} maxLength={SITE_SETTING_LIMITS[field.key]} value={value} onChange={(event) => setValue(field.key)(event.target.value)} aria-invalid={Boolean(invalid)} className={`${adminTextarea} ${invalid ? adminInvalid : ""}`} />
            <FieldError id={`${id}-error`} message={invalid} />
          </>
        );
      default:
        return (
          <>
            <input {...common} required={field.required} maxLength={SITE_SETTING_LIMITS[field.key]} value={value} onChange={(event) => setValue(field.key)(event.target.value)} aria-invalid={Boolean(invalid)} className={`${adminInput} ${invalid ? adminInvalid : ""}`} />
            <FieldError id={`${id}-error`} message={invalid} />
          </>
        );
    }
  };

  return (
    <form ref={formRef} noValidate onSubmit={save} className={pageSheet}>
      <PageHeader
        title="Website & company settings"
        description="Everything here appears on the public website."
        actions={
          <>
            {isDirty && (
              <span className="hidden items-center gap-1.5 text-xs font-medium text-amber-700 md:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                {changed.length === 1 ? "1 unsaved change" : `${changed.length} unsaved changes`}
              </span>
            )}
            <button type="button" onClick={discard} disabled={!isDirty || isPending} className={`${button.secondary} max-sm:hidden`}>Discard</button>
            <button type="submit" disabled={isPending} className={button.primary} title="Save (Ctrl+S)">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? "Saving…" : "Save changes"}
            </button>
          </>
        }
      />

      <div className="flex flex-1">
        <div className="min-w-0 flex-1 px-4 pb-16 md:px-8 xl:px-10">
          <div className="mx-auto max-w-[860px]">
            {(formError || (submitted && problems.length > 0)) && (
              <div className="space-y-3 pt-6">
                {formError && !problems.length && <Banner tone="error" role="alert">{formError}</Banner>}
                {submitted && problems.length > 0 && (
                  <Banner tone="error" role="alert" title={problems.length === 1 ? "Fix 1 field to save" : `Fix ${problems.length} fields to save`}>
                    <ul className="flex flex-wrap gap-x-1">
                      {problems.map((key, index) => (
                        <li key={key}>
                          <button type="button" onClick={() => focusField(key)} className="font-medium underline decoration-red-300 underline-offset-2 hover:decoration-red-700">{LABELS[key]}</button>
                          {index < problems.length - 1 && <span className="text-red-300">,</span>}
                        </li>
                      ))}
                    </ul>
                  </Banner>
                )}
              </div>
            )}

            {SECTIONS.map((section) => {
              const count = section.fields.filter((field) => errors[field.key]).length;
              return (
                <FormSection
                  key={section.id}
                  id={`settings-${section.id}`}
                  title={section.title}
                  description={section.description}
                  columns=""
                  badge={submitted && count > 0 ? <span className="text-xs font-semibold text-red-600">{count === 1 ? "1 field to fix" : `${count} fields to fix`}</span> : undefined}
                >
                  {section.fields.map((field) => (
                    <FormRow key={field.key} label={field.label} htmlFor={fieldId(field.key)} required={field.required} wide={field.kind === "textarea"}>
                      {renderInput(field)}
                      {field.hint && <p className={adminHint}>{field.hint}</p>}
                      {EMAIL_SETTINGS.has(field.key) && values[field.key] && values[field.key] !== values[field.key].toLowerCase() && !errors[field.key] && (
                        <p className={adminHint}>Saved in lowercase: {values[field.key].trim().toLowerCase()}</p>
                      )}
                    </FormRow>
                  ))}
                </FormSection>
              );
            })}
          </div>
        </div>

        <aside className="hidden w-[360px] shrink-0 border-l border-slate-200 bg-slate-50/70 xl:block">
          <div className="sticky top-[41px] p-6">
            <Preview values={values} errors={errors} />
          </div>
        </aside>
      </div>
    </form>
  );
}
