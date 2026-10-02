"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { useAdminStore } from "@/store/adminStore";
import { toast } from "sonner";
import { describeError } from "@/lib/error-message";
import { workspaceLabel } from "@/lib/product-workspaces";
import { CityInput, EmailInput, PhoneInput, PincodeInput, StateSelect, TextInput } from "@/components/forms/IndiaInputs";
import { cityError, emailError, phoneError, pincodeError, stateError, textError, toStoredPhone } from "@/lib/india";

// Edits an existing client's details. New clients are created on /admin/onboarding.

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

const inputClass = "w-full rounded border border-gray-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-600";
const labelClass = "block text-sm font-bold text-slate-700 mb-1.5";

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
  onClose,
}: {
  initialData: Partial<OrganizationFormData>;
  onClose: () => void;
}) {
  const { updateOrganization, setIsSaving } = useAdminStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const setField = (name: keyof OrganizationFormData) => (value: string) => setFormData((current) => ({ ...current, [name]: value }));

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    const name = formData.name.trim();
    const slug = formData.slug.trim().toLowerCase();
    const invalid = textError(name, { label: "Organization name", required: true, max: 200 })
      ?? (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? null : "Use lowercase letters, numbers and single hyphens in the web address.")
      ?? emailError(formData.email)
      ?? phoneError(formData.phone, { kind: "landline" })
      ?? cityError(formData.city)
      ?? stateError(formData.state)
      ?? pincodeError(formData.pincode);
    if (invalid) return void toast.error(invalid);
    if (isSubmitting) return;
    if (!formData.id) return void toast.error("Cannot update a client without its organization ID.");

    setIsSubmitting(true);
    setIsSaving(true);
    try {
      const { data, error } = await createClient()
        .from("organizations")
        .update({
          name,
          slug,
          email: formData.email?.trim().toLowerCase() || null,
          phone: toStoredPhone(formData.phone, { kind: "landline" }),
          address: formData.address?.trim() || null,
          city: formData.city?.trim() || null,
          state: formData.state?.trim() || null,
          pincode: formData.pincode?.trim() || null,
          status: formData.status,
        })
        .eq("id", formData.id)
        .select("*")
        .single();
      if (error) throw error;
      updateOrganization(formData.id, data);
      toast.success("Client updated.");
      onClose();
    } catch (error) {
      toast.error(`Save failed: ${describeError(error, "Another client already uses that web address.")}`);
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
            <TextInput id="org-name" label="Organization name" max={200} value={formData.name} onValueChange={setField("name")} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="org-slug" className={labelClass}>Web address *</label>
            <input id="org-slug" type="text" name="slug" value={formData.slug} onChange={handleChange} required pattern="[a-z0-9]+(-[a-z0-9]+)*" className={inputClass} />
            <p className="mt-1 text-xs text-slate-500">Short unique name for this client.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="org-product" className={labelClass}>Product</label>
            <input id="org-product" value={workspaceLabel(formData.type)} disabled className={inputClass} />
          </div>
          <div>
            <label htmlFor="org-status" className={labelClass}>Access</label>
            <select id="org-status" name="status" value={formData.status} onChange={handleChange} className={inputClass}>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="suspended">Suspended (users cannot sign in)</option>
              <option value="inactive">Inactive (users cannot sign in)</option>
            </select>
          </div>
        </div>
      </Section>

      <Section title="Contact">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="org-email" className={labelClass}>Primary email</label>
            <EmailInput id="org-email" value={formData.email ?? ""} onValueChange={setField("email")} className={inputClass} />
          </div>
          <div>
            <label htmlFor="org-phone" className={labelClass}>Phone (mobile or landline with STD code)</label>
            <PhoneInput id="org-phone" kind="landline" value={formData.phone ?? ""} onValueChange={setField("phone")} className={inputClass} />
          </div>
        </div>
      </Section>

      <Section title="Address">
        <div>
          <label htmlFor="org-address" className={labelClass}>Address</label>
          <input id="org-address" type="text" name="address" maxLength={250} autoComplete="street-address" placeholder="Building, street, area" value={formData.address ?? ""} onChange={handleChange} className={inputClass} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="org-city" className={labelClass}>City</label>
            <CityInput id="org-city" value={formData.city ?? ""} onValueChange={setField("city")} className={inputClass} />
          </div>
          <div>
            <label htmlFor="org-state" className={labelClass}>State</label>
            <StateSelect id="org-state" value={formData.state ?? ""} onValueChange={setField("state")} className={inputClass} />
          </div>
          <div>
            <label htmlFor="org-pincode" className={labelClass}>PIN code</label>
            <PincodeInput id="org-pincode" value={formData.pincode ?? ""} onValueChange={setField("pincode")} className={inputClass} />
          </div>
        </div>
      </Section>

      <div className="border-t border-gray-200 pt-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
