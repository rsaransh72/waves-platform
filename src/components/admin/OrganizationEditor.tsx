"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { useAdminStore } from "@/store/adminStore";
import { toast } from "sonner";

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

export function OrganizationEditor({ initialData, isNew, onClose }: { initialData: Partial<OrganizationFormData>, isNew: boolean, onClose: () => void }) {
  const { addOrganization, updateOrganization, setIsSaving } = useAdminStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const defaultBillingDate = new Date();
  defaultBillingDate.setFullYear(defaultBillingDate.getFullYear() + 1);
  const [planName, setPlanName] = useState("Basic Plan");
  const [planAmount, setPlanAmount] = useState("0");
  const [subscriptionStatus, setSubscriptionStatus] = useState("active");
  const [nextBillingDate, setNextBillingDate] = useState(defaultBillingDate.toISOString().slice(0, 10));
  
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const name = formData.name.trim();
    const slug = formData.slug.trim().toLowerCase();
    if (!name || !slug) {
      toast.error("Name and Slug are required");
      return;
    }
    if (isNew && !formData.email?.trim()) {
      toast.error("Enter the school administrator email to send the invitation.");
      return;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      toast.error("Use lowercase letters, numbers, and single hyphens in the slug.");
      return;
    }
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setIsSaving(true);
      const supabase = createClient();
      const organization = {
        name,
        slug,
        type: formData.type,
        email: formData.email?.trim() || null,
        phone: formData.phone?.trim() || null,
        address: formData.address?.trim() || null,
        city: formData.city?.trim() || null,
        state: formData.state?.trim() || null,
        pincode: formData.pincode?.trim() || null,
        status: isNew ? (subscriptionStatus === "trialing" ? "trial" : "active") : formData.status,
      };

      if (isNew) {
        const response = await fetch("/api/admin/school-clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...organization,
            planName,
            planAmount: Number(planAmount),
            subscriptionStatus,
            nextBillingDate: new Date(`${nextBillingDate}T12:00:00.000Z`).toISOString(),
          }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "School invitation failed.");
        addOrganization(result.organization);
      } else {
        if (!formData.id) throw new Error("Cannot update a school without its organization ID.");
        const { data, error } = await supabase
          .from("organizations")
          .update(organization)
          .eq("id", formData.id)
          .eq("type", "school")
          .select("*")
          .single();
        if (error) throw error;
        updateOrganization(formData.id, data);
      }
      toast.success(isNew ? "School client created." : "School client updated.");
      onClose();
    } catch (err: unknown) {
      toast.error(`Save failed: ${err instanceof Error ? err.message : "Unexpected error"}`);
    } finally {
      setIsSubmitting(false);
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in">
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Organization Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 font-medium"/>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Slug *</label>
            <input type="text" name="slug" value={formData.slug} onChange={handleChange} required pattern="[a-z0-9]+(-[a-z0-9]+)*" className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 font-medium"/>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Type</label>
            <select name="type" value={formData.type} onChange={handleChange} disabled={!isNew} className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 font-medium disabled:bg-slate-50 disabled:text-slate-600">
              <option value="school">School ERP</option>
              <option value="hospital">Hospital ERP</option>
              <option value="pharmacy">Pharmacy POS</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Status</label>
            <select name="status" value={isNew ? (subscriptionStatus === "trialing" ? "trial" : "active") : formData.status} onChange={handleChange} disabled={isNew} className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 font-medium disabled:bg-slate-50 disabled:text-slate-600">
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              {!isNew && <option value="inactive">Inactive</option>}
              {!isNew && <option value="suspended">Suspended</option>}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">{isNew ? "Client administrator invitation email *" : "Primary email"}</label>
          <input type="email" name="email" value={formData.email ?? ""} onChange={handleChange} required={isNew} className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 font-medium"/>
          {isNew && <p className="mt-1 text-xs text-slate-500">An invitation link will be sent to this address.</p>}
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone</label>
          <input type="text" name="phone" value={formData.phone ?? ""} onChange={handleChange} className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 font-medium"/>
        </div>
        {isNew && (
          <fieldset className="space-y-4 border-t border-slate-200 pt-5">
            <legend className="px-1 text-sm font-bold text-slate-900">Subscription</legend>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Plan *</label>
                <input type="text" value={planName} onChange={(event) => setPlanName(event.target.value)} required className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 font-medium" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Annual amount *</label>
                <input type="number" min="0" step="0.01" value={planAmount} onChange={(event) => setPlanAmount(event.target.value)} required className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 font-medium" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Subscription status</label>
                <select value={subscriptionStatus} onChange={(event) => setSubscriptionStatus(event.target.value)} className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 font-medium">
                  <option value="active">Active</option>
                  <option value="trialing">Trial</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Term ends *</label>
                <input type="date" value={nextBillingDate} onChange={(event) => setNextBillingDate(event.target.value)} required className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 font-medium" />
              </div>
            </div>
          </fieldset>
        )}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">Address</label>
          <input type="text" name="address" value={formData.address ?? ""} onChange={handleChange} className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 font-medium"/>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-bold text-slate-700 mb-1.5">City</label>
            <input type="text" name="city" value={formData.city ?? ""} onChange={handleChange} className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 font-medium"/>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-bold text-slate-700 mb-1.5">State</label>
            <input type="text" name="state" value={formData.state ?? ""} onChange={handleChange} className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 font-medium"/>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Pincode</label>
            <input type="text" name="pincode" value={formData.pincode ?? ""} onChange={handleChange} className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 font-medium"/>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 mt-6">
        <button 
          onClick={handleSave}
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? "Saving..." : isNew ? "Create & Invite School Admin" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
