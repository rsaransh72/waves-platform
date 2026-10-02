"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Check, CheckCircle2, Info, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useAdminStore } from "@/store/adminStore";
import { formatMoney, rupeePrice } from "@/lib/money";
import { formatDate, formatPhone } from "@/lib/india";
import { schoolToday } from "@/lib/school-date";
import { ADDRESS_MAX, PLAN_NAME_MAX, SLUG_MAX, shiftDate, slugError, slugify, validateOnboarding, type OnboardingErrors, type OnboardingField, type OnboardingInput } from "@/lib/client-onboarding";
import { AmountInput, CityInput, EmailInput, PhoneInput, PincodeInput, StateSelect } from "@/components/forms/IndiaInputs";
import { FieldError, PageHeader, adminHint as hintClass, adminInput as inputClass, adminInvalid as invalidInputClass, button, pageSheet } from "@/components/admin/ui";

export type OnboardingPlan = { name: string; price?: string | number | null; period?: string };
export type OnboardingProduct = { slug: string; title: string; pricing: OnboardingPlan[] };

type Section = { id: string; title: string; fields: OnboardingField[]; optional?: boolean };
const SECTIONS: Section[] = [
  { id: "client", title: "Client information", fields: ["name", "slug"] },
  { id: "subscription", title: "Subscription", fields: ["productSlug", "planName", "planAmount", "subscriptionStatus", "termEnd"] },
  { id: "administrator", title: "Administrator", fields: ["email", "phone"] },
  { id: "address", title: "Address", fields: ["address", "city", "state", "pincode"], optional: true },
  { id: "review", title: "Review", fields: [] },
];

const FIELD_LABELS: Record<OnboardingField, string> = {
  name: "Organization name",
  slug: "Web address",
  productSlug: "Product",
  planName: "Plan",
  planAmount: "Annual amount",
  subscriptionStatus: "Start as",
  termEnd: "Term ends",
  email: "Administrator email",
  phone: "Phone",
  address: "Address",
  city: "City",
  state: "State / UT",
  pincode: "PIN code",
};

const FIELD_ORDER = SECTIONS.flatMap((section) => section.fields);
const TERM_PRESETS = [["30 days", { days: 30 }], ["6 months", { months: 6 }], ["1 year", { months: 12 }], ["2 years", { months: 24 }]] as const;
const fieldId = (field: OnboardingField) => `onboard-${field}`;
const sectionId = (id: string) => `section-${id}`;

// Annual amount implied by a plan price, when the plan states a numeric price.
function annualAmount(plan: OnboardingPlan): number | null {
  const price = rupeePrice(plan.price);
  if (price === null) return null;
  const period = (plan.period ?? "").toLowerCase();
  if (period.includes("student")) return null; // depends on the number of students
  if (period.includes("month")) return price * 12;
  return price;
}

function planPriceLabel(plan: OnboardingPlan) {
  const price = rupeePrice(plan.price);
  if (price === null) return "price on request";
  return `${formatMoney(price)}${plan.period ? ` / ${plan.period}` : ""}`;
}

function scrollToSection(id: string) {
  document.getElementById(sectionId(id))?.scrollIntoView({ block: "start", behavior: "smooth" });
}

function focusField(field: OnboardingField) {
  const element = document.getElementById(fieldId(field));
  element?.scrollIntoView({ block: "center", behavior: "smooth" });
  element?.focus({ preventScroll: true });
}

// One form row: label on the left from md up (as in Zoho's record forms), on top below.
function Field({ field, label, required, wide, as = "label", children }: { field?: OnboardingField; label: string; required?: boolean; wide?: boolean; as?: "label" | "span"; children: React.ReactNode }) {
  const Label = as;
  return (
    <div className={`grid gap-1.5 md:grid-cols-[160px_minmax(0,1fr)] md:gap-6 ${wide ? "min-[1700px]:col-span-2" : ""}`}>
      <Label {...(as === "label" && field ? { htmlFor: fieldId(field) } : { id: field ? `${fieldId(field)}-label` : undefined })} className="text-[13px] font-medium text-slate-600 md:pt-2 md:text-right">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </Label>
      <div className={`min-w-0 ${wide ? "max-w-[760px] min-[1700px]:max-w-none" : "max-w-[520px]"}`}>{children}</div>
    </div>
  );
}

function SectionBlock({ section, problems, description, columns = "min-[1700px]:grid-cols-2", children }: { section: Section; problems: number; description?: string; columns?: string; children: React.ReactNode }) {
  return (
    <section id={sectionId(section.id)} aria-labelledby={`${sectionId(section.id)}-title`} className="scroll-mt-20 border-b border-slate-200 py-8 last:border-b-0">
      <div className="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 id={`${sectionId(section.id)}-title`} className="!text-[15px] font-semibold text-slate-900">{section.title}</h2>
        {section.optional && <span className="text-xs text-slate-400">Optional</span>}
        {problems > 0 && <span className="text-xs font-semibold text-red-600">{problems === 1 ? "1 field to fix" : `${problems} fields to fix`}</span>}
        {description && <p className="w-full text-[13px] text-slate-500">{description}</p>}
      </div>
      <div className={`grid grid-cols-1 gap-x-12 gap-y-5 ${columns}`}>{children}</div>
    </section>
  );
}

type SlugCheck = { slug: string; status: "available" | "taken" | "error" };

export function OnboardingForm({
  initialData,
  leadId,
  lead,
  products,
}: {
  products: OnboardingProduct[];
  initialData: Partial<Pick<OnboardingInput, "name" | "slug" | "email" | "phone" | "city">> & { type?: "school" | "other" };
  /** The enquiry this client is being created from, if any. */
  lead?: { name: string; converted: boolean };
  /** Set only when the lead should be marked converted once the client exists. */
  leadId?: string;
}) {
  const router = useRouter();
  const { addOrganization } = useAdminStore();
  const backHref = lead ? "/admin/leads" : "/admin/organizations";
  const today = schoolToday();

  const [initialForm] = useState<OnboardingInput>(() => {
    const product = (initialData.type === "school" ? products.find((item) => item.slug === "school-erp") : undefined) ?? products[0];
    const plan = product?.pricing[0];
    const amount = plan ? annualAmount(plan) : null;
    return {
      name: initialData.name ?? "",
      slug: initialData.slug ?? "",
      productSlug: product?.slug ?? "",
      planName: plan?.name ?? "",
      planAmount: amount === null ? "" : String(amount),
      subscriptionStatus: "active",
      termEnd: shiftDate(today, { months: 12 }),
      email: initialData.email ?? "",
      phone: initialData.phone ?? "",
      address: "",
      city: initialData.city ?? "",
      state: "",
      pincode: "",
    };
  });
  const [form, setForm] = useState(initialForm);
  const [planChoice, setPlanChoice] = useState(() => (products.find((item) => item.slug === initialForm.productSlug)?.pricing.length ? "0" : "custom"));
  const [slugEdited, setSlugEdited] = useState(Boolean(initialData.slug));
  const [touched, setTouched] = useState<Partial<Record<OnboardingField, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [serverErrors, setServerErrors] = useState<OnboardingErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [slugCheck, setSlugCheck] = useState<SlugCheck | null>(null);
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  const product = products.find((item) => item.slug === form.productSlug);
  const selectedPlan = planChoice === "custom" ? undefined : product?.pricing[Number(planChoice)];
  const isTrial = form.subscriptionStatus === "trialing";
  const slug = form.slug.trim();
  const slugIsValid = !slugError(slug);
  const slugStatus = !slugIsValid ? "idle" : slugCheck?.slug === slug ? slugCheck.status : "checking";

  const errors = useMemo<OnboardingErrors>(() => {
    const found = validateOnboarding(form, today);
    if (!found.slug && slugStatus === "taken") found.slug = "Another client already uses this web address. Choose a different one.";
    return { ...found, ...serverErrors };
  }, [form, today, slugStatus, serverErrors]);
  const problemFields = FIELD_ORDER.filter((field) => errors[field]);
  const visibleError = (field: OnboardingField) => (submitted || touched[field] || serverErrors[field] ? errors[field] : undefined);
  const sectionProblems = (section: Section) => section.fields.filter((field) => errors[field]).length;
  const isDirty = JSON.stringify(form) !== JSON.stringify(initialForm);
  const requiredSections = SECTIONS.filter((section) => section.fields.length && !section.optional);
  const completeCount = requiredSections.filter((section) => sectionProblems(section) === 0).length;

  // Is the web address still free? Checked shortly after typing stops.
  useEffect(() => {
    if (!slugIsValid) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/admin/school-clients?slug=${encodeURIComponent(slug)}`, { signal: controller.signal });
        const result = await response.json();
        setSlugCheck({ slug, status: !response.ok ? "error" : result.available ? "available" : "taken" });
      } catch {
        if (!controller.signal.aborted) setSlugCheck({ slug, status: "error" });
      }
    }, 400);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [slug, slugIsValid]);

  // Highlights the section being read in the left-hand list.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const top = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top) setActiveSection(top.target.id.replace("section-", ""));
      },
      { root: document.querySelector("main"), rootMargin: "-80px 0px -60% 0px" },
    );
    for (const section of SECTIONS) {
      const element = document.getElementById(sectionId(section.id));
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, []);

  // Ask before leaving with details typed in.
  useEffect(() => {
    if (!isDirty || isDone) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty, isDone]);

  const update = (changes: Partial<OnboardingInput>) => {
    setForm((current) => ({ ...current, ...changes }));
    const changed = Object.keys(changes) as OnboardingField[];
    if (changed.some((field) => serverErrors[field])) {
      setServerErrors((current) => Object.fromEntries(Object.entries(current).filter(([field]) => !changed.includes(field as OnboardingField))));
    }
  };
  const set = (field: OnboardingField) => (value: string) => update({ [field]: value });
  const touch = (field: OnboardingField) => () => setTouched((current) => (current[field] ? current : { ...current, [field]: true }));
  const errorProps = (field: OnboardingField) => ({
    "aria-invalid": Boolean(visibleError(field)),
    "aria-describedby": visibleError(field) ? `${fieldId(field)}-error` : undefined,
  });

  const changeName = (name: string) => update(slugEdited ? { name } : { name, slug: slugify(name) });

  const planChanges = (plan: OnboardingPlan | undefined) => {
    const amount = plan ? annualAmount(plan) : null;
    return { planName: plan?.name ?? "", planAmount: amount === null ? "" : String(amount) };
  };

  const choosePlan = (choice: string) => {
    setPlanChoice(choice);
    update(planChanges(choice === "custom" ? undefined : product?.pricing[Number(choice)]));
  };

  const chooseProduct = (productSlug: string) => {
    const plan = products.find((item) => item.slug === productSlug)?.pricing[0];
    setPlanChoice(plan ? "0" : "custom");
    update({ productSlug, ...planChanges(plan) });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setSubmitted(true);
    setFormError(null);
    // Marks every invalid field so each shows its reason (the form has noValidate).
    const browserValid = event.currentTarget.checkValidity();
    const firstProblem = problemFields[0];
    if (firstProblem || !browserValid) {
      if (firstProblem) focusField(firstProblem);
      else (event.currentTarget.querySelector(":invalid") as HTMLElement | null)?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/school-clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, leadId }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        const fieldErrors: OnboardingErrors = result.fieldErrors ?? {};
        setServerErrors(fieldErrors);
        setFormError(result.error || `The client could not be created (error ${response.status}). Nothing was saved.`);
        const firstField = FIELD_ORDER.find((field) => fieldErrors[field]);
        if (firstField) focusField(firstField);
        else document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      setIsDone(true);
      addOrganization(result.organization);
      toast.success(`${result.organization.name} is set up. An invitation was sent to ${form.email.trim().toLowerCase()}.`);
      router.push(`/admin/organizations/${result.organization.id}`);
    } catch {
      setFormError("The request did not complete. Check your connection, then look in Clients before trying again in case the client was created.");
      document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const slugAdornment = {
    idle: null,
    checking: <span className="flex items-center gap-1 text-slate-400"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Checking</span>,
    available: <span className="flex items-center gap-1 font-medium text-emerald-600"><CheckCircle2 className="h-3.5 w-3.5" /> Available</span>,
    taken: <span className="flex items-center gap-1 font-medium text-red-600"><XCircle className="h-3.5 w-3.5" /> Taken</span>,
    error: null,
  }[slugStatus];

  const review: [string, string | null][] = [
    ["Organization", form.name.trim() || null],
    ["Web address", slug && !errors.slug ? slug : null],
    ["Product", product?.title ?? null],
    ["Plan", form.planName.trim() || null],
    ["Annual amount", form.planAmount && !errors.planAmount ? formatMoney(Number(form.planAmount)) : null],
    ["Start as", isTrial ? "Trial / pilot" : "Paying client"],
    ["Term ends", !errors.termEnd ? formatDate(form.termEnd) : null],
    ["Invitation to", form.email.trim() && !errors.email ? form.email.trim().toLowerCase() : null],
    ["Phone", form.phone && !errors.phone ? formatPhone(form.phone) : null],
    ["Location", [form.city.trim(), form.state].filter(Boolean).join(", ") || null],
  ];

  const submitLabel = isSubmitting ? "Creating…" : isDone ? "Opening client…" : "Create and invite";

  return (
    <form id="onboard-form" noValidate onSubmit={handleSubmit} className={pageSheet}>
      <PageHeader
        backHref={backHref}
        title="Onboard client"
        description="Creates the workspace and subscription, then emails the administrator an invitation."
        actions={
          <>
            <Link href={backHref} className={`${button.secondary} max-sm:hidden`}>Cancel</Link>
            <button type="submit" disabled={isSubmitting || isDone || products.length === 0} className={button.primary}>
              {(isSubmitting || isDone) && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitLabel}
            </button>
          </>
        }
      />

      <div className="flex flex-1">
        {/* Section list with progress. */}
        <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-slate-50/70 lg:block">
          <nav aria-label="Form sections" className="sticky top-[41px] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Progress</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-blue-600 transition-all duration-300" style={{ width: `${(completeCount / requiredSections.length) * 100}%` }} />
              </div>
              <span className="text-xs tabular-nums text-slate-500">{completeCount}/{requiredSections.length}</span>
            </div>

            <ol className="mt-5 space-y-0.5">
              {SECTIONS.map((section, index) => {
                const count = sectionProblems(section);
                const active = activeSection === section.id;
                const done = section.fields.length > 0 && count === 0 && (!section.optional || section.fields.some((field) => form[field].trim()));
                const failing = submitted && count > 0;
                return (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => { setActiveSection(section.id); scrollToSection(section.id); }}
                      aria-current={active ? "step" : undefined}
                      className={`relative flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-[13px] transition-colors ${active ? "bg-white font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200" : "text-slate-600 hover:bg-white/70 hover:text-slate-900"}`}
                    >
                      {active && <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-blue-600" />}
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${failing ? "bg-red-100 text-red-600" : done ? "bg-emerald-500 text-white" : active ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                        {failing ? "!" : done ? <Check className="h-3 w-3" strokeWidth={3} /> : index + 1}
                      </span>
                      <span className="flex-1 truncate">{section.title}</span>
                      {failing && <span className="text-[11px] font-semibold text-red-600">{count}</span>}
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="mt-6 border-t border-slate-200 pt-4 text-xs leading-relaxed text-slate-500">
              <p className="font-semibold text-slate-700">After you create</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-4">
                <li>The {product?.slug === "school-erp" ? "school workspace" : "client workspace"} and subscription are set up.</li>
                <li>The administrator gets an email to set a password.</li>
                {leadId && <li>The lead is marked converted.</li>}
              </ul>
              <p className="mt-2">If any step fails, nothing is kept.</p>
            </div>
          </nav>
        </aside>

        <div className="min-w-0 flex-1 px-4 pb-16 md:px-8 xl:px-10">
          <div className="mx-auto max-w-[1180px]">
            {(lead || formError || (submitted && problemFields.length > 0) || products.length === 0) && (
              <div className="space-y-3 pt-6">
                {lead && (
                  <div className={`flex items-start gap-2.5 rounded border px-4 py-3 text-[13px] ${lead.converted ? "border-amber-200 bg-amber-50 text-amber-900" : "border-blue-200 bg-blue-50 text-blue-900"}`}>
                    <Info className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>
                      {lead.converted
                        ? <>The lead from <strong>{lead.name}</strong> was already converted. A client created here will not be linked to it.</>
                        : <>Details are filled in from <strong>{lead.name}</strong>&apos;s enquiry. Check the administrator email: the invitation goes there.</>}
                    </p>
                  </div>
                )}
                {products.length === 0 && (
                  <div className="flex items-start gap-2.5 rounded border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>No product is published, so no client can be onboarded. <Link href="/admin/products" className="font-semibold underline">Publish a product</Link> first.</p>
                  </div>
                )}
                {formError && (
                  <div role="alert" className="flex items-start gap-2.5 rounded border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-800">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>{formError}</p>
                  </div>
                )}
                {submitted && problemFields.length > 0 && !formError && (
                  <div role="alert" className="rounded border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-800">
                    <p className="flex items-center gap-2 font-semibold">
                      <AlertCircle className="h-4 w-4" />
                      {problemFields.length === 1 ? "Fix 1 field to continue" : `Fix ${problemFields.length} fields to continue`}
                    </p>
                    <ul className="mt-1.5 flex flex-wrap gap-x-1 gap-y-1 pl-6">
                      {problemFields.map((field, index) => (
                        <li key={field}>
                          <button type="button" onClick={() => focusField(field)} className="font-medium underline decoration-red-300 underline-offset-2 hover:decoration-red-700">
                            {FIELD_LABELS[field]}
                          </button>
                          {index < problemFields.length - 1 && <span className="text-red-300">,</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <SectionBlock section={SECTIONS[0]} problems={submitted ? sectionProblems(SECTIONS[0]) : 0}>
              <Field field="name" label="Organization name" required>
                <input
                  id={fieldId("name")}
                  value={form.name}
                  maxLength={200}
                  autoComplete="organization"
                  placeholder="e.g. Green Valley Public School"
                  onChange={(event) => changeName(event.target.value)}
                  onBlur={touch("name")}
                  {...errorProps("name")}
                  className={`${inputClass} ${visibleError("name") ? invalidInputClass : ""}`}
                />
                <FieldError id={`${fieldId("name")}-error`} message={visibleError("name")} />
              </Field>
              <Field field="slug" label="Web address" required>
                <div className="relative">
                  <input
                    id={fieldId("slug")}
                    value={form.slug}
                    maxLength={SLUG_MAX}
                    spellCheck={false}
                    autoCapitalize="none"
                    placeholder="green-valley-public-school"
                    onChange={(event) => { setSlugEdited(true); update({ slug: event.target.value.toLowerCase().replace(/\s+/g, "-") }); }}
                    onBlur={touch("slug")}
                    {...errorProps("slug")}
                    className={`${inputClass} pr-28 font-mono text-[13px] ${visibleError("slug") ? invalidInputClass : ""}`}
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs" aria-live="polite">{slugAdornment}</span>
                </div>
                <FieldError id={`${fieldId("slug")}-error`} message={visibleError("slug")} />
                <p className={hintClass}>
                  Unique short name, filled in from the organization name.
                  {slugEdited && form.name.trim() && slugify(form.name) !== form.slug && (
                    <> <button type="button" onClick={() => { setSlugEdited(false); update({ slug: slugify(form.name) }); }} className="font-medium text-blue-600 hover:underline">Match the name</button></>
                  )}
                </p>
              </Field>
            </SectionBlock>

            <SectionBlock section={SECTIONS[1]} problems={submitted ? sectionProblems(SECTIONS[1]) : 0} description="What was agreed with the client. It can be renewed or changed later from the client page.">
              <Field field="productSlug" label="Product" required>
                <select
                  id={fieldId("productSlug")}
                  value={form.productSlug}
                  onChange={(event) => chooseProduct(event.target.value)}
                  disabled={products.length === 0}
                  {...errorProps("productSlug")}
                  className={`${inputClass} ${visibleError("productSlug") ? invalidInputClass : ""}`}
                >
                  {products.length === 0 && <option value="">No published product</option>}
                  {products.map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}
                </select>
                <FieldError id={`${fieldId("productSlug")}-error`} message={visibleError("productSlug")} />
              </Field>

              <Field field={planChoice === "custom" ? "planName" : undefined} label="Plan" required as={planChoice === "custom" ? "span" : "label"}>
                <select
                  id={planChoice === "custom" ? "onboard-plan-choice" : fieldId("planName")}
                  aria-label="Plan"
                  value={planChoice}
                  onChange={(event) => choosePlan(event.target.value)}
                  disabled={!product}
                  className={inputClass}
                >
                  {product?.pricing.map((plan, index) => (
                    <option key={`${plan.name}-${index}`} value={String(index)}>{plan.name} — {planPriceLabel(plan)}</option>
                  ))}
                  <option value="custom">Custom plan…</option>
                </select>
                {planChoice === "custom" && (
                  <input
                    id={fieldId("planName")}
                    aria-label="Custom plan name"
                    value={form.planName}
                    maxLength={PLAN_NAME_MAX}
                    placeholder="Plan name, e.g. Annual – 600 students"
                    onChange={(event) => update({ planName: event.target.value })}
                    onBlur={touch("planName")}
                    {...errorProps("planName")}
                    className={`${inputClass} mt-2 ${visibleError("planName") ? invalidInputClass : ""}`}
                  />
                )}
                <FieldError id={`${fieldId("planName")}-error`} message={visibleError("planName")} />
                {product && product.pricing.length === 0 && <p className={hintClass}>{product.title} has no published plans. Name the plan agreed with the client.</p>}
              </Field>

              <Field field="subscriptionStatus" label="Start as" as="span">
                <div role="radiogroup" aria-labelledby={`${fieldId("subscriptionStatus")}-label`} className="flex h-9 items-center gap-6">
                  {([["active", "Paying client"], ["trialing", "Trial / pilot"]] as const).map(([value, label]) => (
                    <label key={value} className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-800">
                      <input
                        id={value === "active" ? fieldId("subscriptionStatus") : undefined}
                        type="radio"
                        name="onboard-status"
                        checked={form.subscriptionStatus === value}
                        onChange={() => update({ subscriptionStatus: value })}
                        className="h-4 w-4 accent-blue-600"
                      />
                      {label}
                    </label>
                  ))}
                </div>
                <p className={hintClass}>{isTrial ? "A pilot may be free (₹0). The client's access is marked as trial." : "Billed as agreed; the amount must be above ₹0."}</p>
              </Field>

              <Field field="planAmount" label="Annual amount" required>
                <AmountInput id={fieldId("planAmount")} allowZero={isTrial} value={form.planAmount} onValueChange={set("planAmount")} placeholder="Agreed amount per year" className={inputClass} />
                {selectedPlan && annualAmount(selectedPlan) === null && rupeePrice(selectedPlan.price) !== null && (
                  <p className={hintClass}>This plan is priced {planPriceLabel(selectedPlan)}. Enter the agreed yearly total.</p>
                )}
              </Field>

              <Field field="termEnd" label="Term ends" required>
                <input
                  id={fieldId("termEnd")}
                  type="date"
                  value={form.termEnd}
                  min={shiftDate(today, { days: 1 })}
                  onChange={(event) => update({ termEnd: event.target.value })}
                  onBlur={touch("termEnd")}
                  {...errorProps("termEnd")}
                  className={`${inputClass} ${visibleError("termEnd") ? invalidInputClass : ""}`}
                />
                <FieldError id={`${fieldId("termEnd")}-error`} message={visibleError("termEnd")} />
                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-slate-500">Quick set:</span>
                  {TERM_PRESETS.map(([label, offset]) => {
                    const date = shiftDate(today, offset);
                    const selected = form.termEnd === date;
                    return (
                      <button
                        key={label}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => update({ termEnd: date })}
                        className={`rounded px-2 py-0.5 font-medium transition-colors ${selected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </Field>
            </SectionBlock>

            <SectionBlock section={SECTIONS[2]} problems={submitted ? sectionProblems(SECTIONS[2]) : 0} description="This person receives the invitation and can then invite their own staff.">
              <Field field="email" label="Email" required>
                <EmailInput id={fieldId("email")} required value={form.email} onValueChange={set("email")} placeholder="principal@school.in" className={`${inputClass} ${serverErrors.email ? invalidInputClass : ""}`} />
                <FieldError id={`${fieldId("email")}-server-error`} message={serverErrors.email} />
              </Field>
              <Field field="phone" label="Phone">
                <PhoneInput id={fieldId("phone")} kind="landline" value={form.phone} onValueChange={set("phone")} className={inputClass} />
                <p className={hintClass}>Mobile, or landline with STD code (0120 4567890 → 1204567890).</p>
              </Field>
            </SectionBlock>

            <SectionBlock section={SECTIONS[3]} problems={submitted ? sectionProblems(SECTIONS[3]) : 0} description="Shown on invoices and the client page.">
              <Field field="address" label="Street address" wide>
                <input
                  id={fieldId("address")}
                  value={form.address}
                  maxLength={ADDRESS_MAX}
                  autoComplete="street-address"
                  placeholder="Building, street, area"
                  onChange={(event) => update({ address: event.target.value })}
                  onBlur={touch("address")}
                  {...errorProps("address")}
                  className={`${inputClass} ${visibleError("address") ? invalidInputClass : ""}`}
                />
                <FieldError id={`${fieldId("address")}-error`} message={visibleError("address")} />
              </Field>
              <Field field="city" label="City">
                <CityInput id={fieldId("city")} value={form.city} onValueChange={set("city")} className={inputClass} />
              </Field>
              <Field field="state" label="State / UT">
                <StateSelect id={fieldId("state")} value={form.state} onValueChange={set("state")} className={inputClass} />
              </Field>
              <Field field="pincode" label="PIN code">
                <PincodeInput id={fieldId("pincode")} value={form.pincode} onValueChange={set("pincode")} className={inputClass} />
              </Field>
            </SectionBlock>

            <SectionBlock section={SECTIONS[4]} problems={0} columns="xl:grid-cols-2" description="Check these before creating the client.">
              {review.map(([label, value]) => (
                <div key={label} className="grid gap-1 md:grid-cols-[160px_minmax(0,1fr)] md:gap-6">
                  <p className="text-[13px] font-medium text-slate-500 md:text-right">{label}</p>
                  <p className={`truncate text-sm ${value ? "font-medium text-slate-900" : "text-slate-400"}`} title={value ?? undefined}>{value ?? "Not set"}</p>
                </div>
              ))}
            </SectionBlock>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
              <Link href={backHref} className="inline-flex h-9 items-center justify-center rounded border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || isDone || products.length === 0}
                className="inline-flex h-9 items-center justify-center gap-2 rounded bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {(isSubmitting || isDone) && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting || isDone ? submitLabel : "Create client and send invitation"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
