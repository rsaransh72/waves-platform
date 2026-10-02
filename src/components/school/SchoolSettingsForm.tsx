"use client";

import { useState } from "react";
import { Save, UploadCloud, Building2, MapPin, Mail, Phone, CreditCard, Building } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { toast } from "sonner";
import { describeError } from "@/lib/error-message";
import { useRouter } from "next/navigation";
import { EmailInput, PhoneInput } from "@/components/forms/IndiaInputs";
import { toStoredPhone } from "@/lib/india";

/* eslint-disable @typescript-eslint/no-explicit-any */

const LOGO_TYPES: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };

export function SchoolSettingsForm({ initialSettings }: { initialSettings: any }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    school_name: initialSettings?.school_name || "",
    logo_url: initialSettings?.logo_url || "",
    address: initialSettings?.address || "",
    contact_email: initialSettings?.contact_email || "",
    contact_phone: initialSettings?.contact_phone || "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const supabase = createClient();

  const uploadLogo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!LOGO_TYPES[file.type]) {
      toast.error("Choose a PNG, JPEG or WebP image.");
      return;
    }
    if (file.size > 1024 * 1024) {
      toast.error(`That image is ${(file.size / 1024 / 1024).toFixed(1)} MB. Use one under 1 MB.`);
      return;
    }
    setIsUploading(true);
    try {
      const { data: organizationId, error: idError } = await supabase.rpc("get_auth_organization_id");
      if (idError || !organizationId) throw idError ?? new Error("Your school account could not be found.");
      // A new name for every upload, so browsers and receipts never show a cached old logo.
      const path = `${organizationId}/logo-${Date.now()}.${LOGO_TYPES[file.type]}`;
      const { error } = await supabase.storage.from("school-logos").upload(path, file, { contentType: file.type, cacheControl: "31536000" });
      if (error) throw error;
      const { data } = supabase.storage.from("school-logos").getPublicUrl(path);
      setFormData((current) => ({ ...current, logo_url: data.publicUrl }));
      toast.success("Logo uploaded. Press Save Settings to use it.");
    } catch (error) {
      toast.error(`Could not upload the logo: ${describeError(error)}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let record;
    try {
      record = {
      ...formData,
      school_name: formData.school_name.trim(),
      address: formData.address.trim(),
      contact_email: formData.contact_email.trim().toLowerCase(),
      contact_phone: toStoredPhone(formData.contact_phone, { kind: "landline" }),
      };
    } catch (error) {
      toast.error(describeError(error));
      return;
    }
    setIsSubmitting(true);
    setSaveMessage("");

    try {
      if (initialSettings?.id) {
        const { error } = await supabase
          .from('school_settings')
          .update(record)
          .eq('id', initialSettings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('school_settings')
          .insert([record]);
        if (error) throw error;
      }

      setSaveMessage("Settings saved.");
      toast.success("School settings saved.");
      router.refresh();
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast.error(`Could not save settings: ${describeError(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#e5e5e5] shadow-sm overflow-hidden">
      <form onSubmit={handleSubmit} className="divide-y divide-[#e5e5e5]">
        
        {/* General Info */}
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="w-5 h-5 text-[#0066cc]" />
            <h3 className="text-[16px] font-semibold text-[#111111]">General Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-[13px] font-medium text-[#333333] mb-1.5">School Name *</label>
              <input
                type="text"
                required
                minLength={2}
                maxLength={200}
                value={formData.school_name}
                onChange={e => setFormData({...formData, school_name: e.target.value})}
                className="w-full h-10 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none"
              />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <span id="logo-label" className="block text-[13px] font-medium text-[#333333] mb-1.5">School logo</span>
              <div className="flex gap-4 items-start">
                {formData.logo_url ? (
                  <div className="w-16 h-16 rounded-lg border border-[#e5e5e5] flex items-center justify-center bg-white overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element -- logos live in Supabase Storage */}
                    <img src={formData.logo_url} alt="Current school logo" className="max-w-full max-h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg border border-dashed border-[#cccccc] flex items-center justify-center bg-[#f9f9fa] shrink-0 text-[#888888]">
                    <Building className="w-6 h-6" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    <label className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-[#cccccc] bg-white px-4 text-[13px] font-medium text-[#333333] hover:bg-[#f4f4f5] focus-within:ring-2 focus-within:ring-[#0066cc] ${isUploading ? "pointer-events-none opacity-60" : ""}`}>
                      <UploadCloud className="w-4 h-4" />
                      {isUploading ? "Uploading..." : formData.logo_url ? "Replace logo" : "Upload logo"}
                      <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" aria-labelledby="logo-label" onChange={uploadLogo} disabled={isUploading} />
                    </label>
                    {formData.logo_url && (
                      <button type="button" onClick={() => setFormData({ ...formData, logo_url: "" })} className="h-10 rounded-md px-3 text-[13px] font-medium text-red-700 hover:bg-red-50">Remove</button>
                    )}
                  </div>
                  <p className="mt-1.5 text-[12px] text-[#888888]">PNG, JPEG or WebP, up to 1 MB. A square image looks best on fee receipts.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="p-6 sm:p-8 bg-[#fafafa]">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-[#0066cc]" />
            <h3 className="text-[16px] font-semibold text-[#111111]">Contact & Address</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Physical Address</label>
              <textarea
                rows={3}
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                placeholder="Building, street, area, city, state – PIN code" maxLength={500}
                className="w-full p-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none resize-none"
              />
            </div>
            
            <div>
              <label className="block text-[13px] font-medium text-[#333333] mb-1.5 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#888888]" /> Support Email</label>
              <EmailInput
                value={formData.contact_email}
                onValueChange={(contact_email) => setFormData((current) => ({ ...current, contact_email }))}
                placeholder="office@school.in"
                className="w-full h-10 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none"
              />
            </div>
            
            <div>
              <label className="block text-[13px] font-medium text-[#333333] mb-1.5 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#888888]" /> Contact Phone</label>
              <PhoneInput
                kind="landline"
                value={formData.contact_phone}
                onValueChange={(contact_phone) => setFormData((current) => ({ ...current, contact_phone }))}
                className="w-full h-10 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none"
              />
              <p className="mt-1 text-[12px] text-[#888888]">Mobile, or landline with STD code (e.g. 1204567890).</p>
            </div>
          </div>
        </div>

        {/* Payments */}
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <CreditCard className="w-5 h-5 text-[#0066cc]" />
            <h3 className="text-[16px] font-semibold text-[#111111]">Payments & Currency</h3>
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
            <div><dt className="text-[13px] text-[#555555]">Currency</dt><dd className="font-medium text-[#111111]">Indian Rupee (₹ INR)</dd></div>
            <div><dt className="text-[13px] text-[#555555]">Number format</dt><dd className="font-medium text-[#111111]">₹1,25,000.00 (lakh / crore)</dd></div>
          </dl>
          <p className="mt-3 text-[12px] text-[#888888]">All fees, payments and receipts are recorded in rupees. Receipts print the amount in words, e.g. &quot;Rupees One Lakh Twenty Five Thousand Only&quot;.</p>
        </div>
        
        {/* Footer Actions */}
        <div className="p-6 border-t border-[#e5e5e5] bg-[#fafafa] flex items-center justify-between">
          <div className="text-[13px] font-medium text-[#15803d]">
            {saveMessage}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-10 px-6 bg-[#111111] hover:bg-[#333333] text-white text-[14px] font-medium rounded-md flex items-center justify-center gap-2 transition-colors disabled:opacity-70 shadow-sm"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
