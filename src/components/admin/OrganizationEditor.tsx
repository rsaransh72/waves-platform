"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { useAdminStore } from "@/store/adminStore";
import { toast } from "sonner";
import { describeError } from "@/lib/error-message";
import { formatMoney } from "@/lib/money";
import { workspaceLabel } from "@/lib/product-workspaces";

type OrganizationFormData = {
  id?: string;
  name: string;
  slug: string;
  type: "school" | "hospital" | "pharmacy" | "other";
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  status: string;
};

export type OnboardingPlan = { name: string; price?: string | number | null; period?: string };
export type OnboardingProduct = { slug: string; title: string; pricing: OnboardingPlan[] };

const inputClass = "w-full rounded border border-gray-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-600";
const labelClass = "block text-sm font-bold text-slate-700 mb-1.5";

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

// Annual amount implied by a plan price, when the plan states a numeric price.
function annualAmount(plan: OnboardingPlan): number | null {
  const raw = String(plan.price ?? "").trim();
  const price = typeof plan.price === "number" ? plan.price : Number(raw.replace(/[,\s₹]/g, ""));
  if (raw === "" || !Number.isFinite(price)) return null;
  const period = (plan.period ?? "").toLowerCase();
  if (period.includes("student")) return null; // depends on the number of students
  if (period.includes("month")) return price * 12;
  return price;
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4 border-t border-slate-200 pt-5 first:border-t-0 first:pt-0">
      <legend className="text-sm font-bold text-slate-900">{title}</legend>
      {description && <p className="text-xs text-slate-500">{description}</p>}
      {children}
    </fieldset>
  );
}

export function OrganizationEditor({
  initialData,
  isNew,
  onClose,
  leadId,
  products = [],
}: {
  initialData: Partial<OrganizationFormData>;
  isNew: boolean;
  onClose: () => void;
  leadId?: string;
  products?: OnboardingProduct[];
}) {
  const { addOrganization, updateOrganization, setIsSaving } = useAdminStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugEdited, setSlugEdited] = useState(Boolean(initialData.slug));

  const firstProduct = (initialData.type === "school" ? products.find((item) => item.slug === "school-erp") : undefined) ?? products[0];
  const firstPlan = firstProduct?.pricing[0];
  const [productSlug, setProductSlug] = useState(firstProduct?.slug ?? "");
  const product = products.find((item) => item.slug === productSlug);
  const [planChoice, setPlanChoice] = useState(firstPlan ? "0" : "custom");
  const [planName, setPlanName] = useState(firstPlan?.name ?? "");
  const [planAmount, setPlanAmount] = useState(() => {
    const amount = firstPlan ? annualAmount(firstPlan) : null;
    return amount === null ? "" : String(amount);
  });
  const [subscriptionStatus, setSubscriptionStatus] = useState("active");
  const [termEnd, setTermEnd] = useState(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().slice(0, 10);
  });

  const [formData, setFormData] = useState<OrganizationFormData>({
    name: "",
    slug: "",
    type: "school",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    status: "active",
    ...initialData,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (name === "slug") setSlugEdited(true);
    setFormData((current) => ({
      ...current,
      [name]: value,
      ...(name === "name" && !slugEdited ? { slug: slugify(value) } : {}),
    }));
  };

  const applyPlan = (plan: OnboardingPlan | undefined) => {
    setPlanName(plan?.name ?? "");
    const amount = plan ? annualAmount(plan) : null;
    setPlanAmount(amount === null ? "" : String(amount));
  };

  const choosePlan = (choice: string) => {
    setPlanChoice(choice);
    applyPlan(choice === "custom" ? undefined : product?.pricing[Number(choice)]);
  };

  const chooseProduct = (slug: string) => {
    setProductSlug(slug);
    const plan = products.find((item) => item.slug === slug)?.pricing[0];
    setPlanChoice(plan ? "0" : "custom");
    applyPlan(plan);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    const name = formData.name.trim();
    const slug = formData.slug.trim().toLowerCase();
    if (!name || !slug) return void toast.error("Organization name and web address are required.");
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return void toast.error("Use lowercase letters, numbers and single hyphens in the web address.");
    if (isNew) {
      if (!productSlug) return void toast.error("Choose the product the client is buying.");
      if (!formData.email?.trim()) return void toast.error("Enter the administrator's email; the invitation is sent there.");
      if (!planName.trim()) return void toast.error("Choose or enter a plan.");
      if (planAmount.trim() === "" || !Number.isFinite(Number(planAmount)) || Number(planAmount) < 0) {
        return void toast.error("Enter the annual amount agreed with the client (0 only for a free pilot).");
      }
    }
    if (isSubmitting) return;

    const organization = {
      name,
      slug,
      email: formData.email?.trim() || null,
      phone: formData.phone?.trim() || null,
      address: formData.address?.trim() || null,
      city: formData.city?.trim() || null,
      state: formData.state?.trim() || null,
      pincode: formData.pincode?.trim() || null,
    };

    setIsSubmitting(true);
    setIsSaving(true);
    try {
      if (isNew) {
        const response = await fetch("/api/admin/school-clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...organization,
            productSlug,
            leadId,
            planName: planName.trim(),
            planAmount: Number(planAmount),
            subscriptionStatus,
            nextBillingDate: new Date(`${termEnd}T12:00:00.000Z`).toISOString(),
          }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "The client could not be created.");
        addOrganization(result.organization);
        toast.success(`Client created. An invitation was sent to ${organization.email}.`);
      } else {
        if (!formData.id) throw new Error("Cannot update a client without its organization ID.");
        const { data, error } = await createClient()
          .from("organizations")
          .update({ ...organization, status: formData.status })
          .eq("id", formData.id)
          .select("*")
          .single();
        if (error) throw error;
        updateOrganization(formData.id, data);
        toast.success("Client updated.");
      }
      onClose();
    } catch (error) {
      toast.error(`Save failed: ${describeError(error, "That web address or administrator email is already in use.")}`);
    } finally {
      setIsSubmitting(false);
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-in fade-in">
      <Section title="Client">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="org-name" className={labelClass}>Organization name *</label>
            <input id="org-name" type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="org-slug" className={labelClass}>Web address *</label>
            <input id="org-slug" type="text" name="slug" value={formData.slug} onChange={handleChange} required pattern="[a-z0-9]+(-[a-z0-9]+)*" className={inputClass} />
            <p className="mt-1 text-xs text-slate-500">Short unique name for this client, filled in from the name.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="org-product" className={labelClass}>{isNew ? "Product *" : "Product"}</label>
            {isNew ? (
              products.length === 0 ? (
                <p className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">No product is published. Publish one in Products first.</p>
              ) : (
                <select id="org-product" value={productSlug} onChange={(event) => chooseProduct(event.target.value)} disabled={products.length === 1} className={inputClass}>
                  {products.map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}
                </select>
              )
            ) : (
              <input id="org-product" value={workspaceLabel(formData.type)} disabled className={inputClass} />
            )}
          </div>
          {!isNew && (
            <div>
              <label htmlFor="org-status" className={labelClass}>Access</label>
              <select id="org-status" name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                <option value="active">Active</option>
                <option value="trial">Trial</option>
                <option value="suspended">Suspended (users cannot sign in)</option>
                <option value="inactive">Inactive (users cannot sign in)</option>
              </select>
            </div>
          )}
        </div>
      </Section>

      <Section title={isNew ? "First administrator" : "Contact"} description={isNew ? "This person receives the invitation email and can then invite their own staff." : undefined}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="org-email" className={labelClass}>{isNew ? "Administrator email *" : "Primary email"}</label>
            <input id="org-email" type="email" name="email" value={formData.email ?? ""} onChange={handleChange} required={isNew} className={inputClass} />
          </div>
          <div>
            <label htmlFor="org-phone" className={labelClass}>Phone</label>
            <input id="org-phone" type="tel" name="phone" value={formData.phone ?? ""} onChange={handleChange} className={inputClass} />
          </div>
        </div>
      </Section>

      {isNew && (
        <Section title="Subscription" description="What was agreed with the client. You can renew or change it later on the client page.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="org-plan" className={labelClass}>Plan *</label>
              <select id="org-plan" value={planChoice} onChange={(event) => choosePlan(event.target.value)} className={inputClass}>
                {product?.pricing.map((plan, index) => (
                  <option key={`${plan.name}-${index}`} value={String(index)}>
                    {plan.name}
                    {plan.price !== undefined && plan.price !== null && plan.price !== "" ? ` (${typeof plan.price === "number" ? formatMoney(plan.price) : plan.price}${plan.period ? ` / ${plan.period}` : ""})` : ""}
                  </option>
                ))}
                <option value="custom">Custom plan</option>
              </select>
              {planChoice === "custom" && (
                <input type="text" value={planName} onChange={(event) => setPlanName(event.target.value)} placeholder="Plan name, e.g. Annual – 600 students" className={`${inputClass} mt-2`} />
              )}
              {product && product.pricing.length === 0 && (
                <p className="mt-1 text-xs text-slate-500">This product has no published plans; enter the plan agreed with the client.</p>
              )}
            </div>
            <div>
              <label htmlFor="org-amount" className={labelClass}>Annual amount (₹) *</label>
              <input id="org-amount" type="number" min="0" step="0.01" value={planAmount} onChange={(event) => setPlanAmount(event.target.value)} required placeholder="Agreed amount per year" className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="org-sub-status" className={labelClass}>Start as</label>
              <select id="org-sub-status" value={subscriptionStatus} onChange={(event) => setSubscriptionStatus(event.target.value)} className={inputClass}>
                <option value="active">Paying client</option>
                <option value="trialing">Trial / pilot</option>
              </select>
            </div>
            <div>
              <label htmlFor="org-term" className={labelClass}>Term ends *</label>
              <input id="org-term" type="date" value={termEnd} onChange={(event) => setTermEnd(event.target.value)} required className={inputClass} />
              <p className="mt-1 text-xs text-slate-500">Access is suspended automatically after this date unless renewed.</p>
            </div>
          </div>
        </Section>
      )}

      <Section title="Address">
        <div>
          <label htmlFor="org-address" className={labelClass}>Address</label>
          <input id="org-address" type="text" name="address" value={formData.address ?? ""} onChange={handleChange} className={inputClass} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="org-city" className={labelClass}>City</label>
            <input id="org-city" type="text" name="city" value={formData.city ?? ""} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="org-state" className={labelClass}>State</label>
            <input id="org-state" type="text" name="state" value={formData.state ?? ""} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="org-pincode" className={labelClass}>Pincode</label>
            <input id="org-pincode" type="text" name="pincode" inputMode="numeric" value={formData.pincode ?? ""} onChange={handleChange} className={inputClass} />
          </div>
        </div>
      </Section>

      <div className="border-t border-gray-200 pt-5">
        <button
          type="submit"
          disabled={isSubmitting || (isNew && products.length === 0)}
          className="w-full inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isSubmitting ? "Saving..." : isNew ? "Create client and send invitation" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
