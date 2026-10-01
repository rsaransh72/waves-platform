"use client";

import { useState } from "react";
import { Save, UploadCloud, Building2, MapPin, Mail, Phone, CreditCard, Building } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function SchoolSettingsForm({ initialSettings }: { initialSettings: any }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    school_name: initialSettings?.school_name || "",
    logo_url: initialSettings?.logo_url || "",
    address: initialSettings?.address || "",
    contact_email: initialSettings?.contact_email || "",
    contact_phone: initialSettings?.contact_phone || "",
    currency: initialSettings?.currency || "USD",
    stripe_account_id: initialSettings?.stripe_account_id || ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSaveMessage("");

    try {
      if (initialSettings?.id) {
        const { error } = await supabase
          .from('school_settings')
          .update(formData)
          .eq('id', initialSettings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('school_settings')
          .insert([formData]);
        if (error) throw error;
      }

      setSaveMessage("Settings saved successfully!");
      router.refresh();
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error: any) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings: " + error.message);
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
                value={formData.school_name}
                onChange={e => setFormData({...formData, school_name: e.target.value})}
                className="w-full h-10 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none"
              />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label className="block text-[13px] font-medium text-[#333333] mb-1.5">School Logo URL</label>
              <div className="flex gap-4 items-start">
                {formData.logo_url ? (
                  <div className="w-16 h-16 rounded-lg border border-[#e5e5e5] flex items-center justify-center bg-white overflow-hidden shrink-0">
                    <img src={formData.logo_url} alt="Logo" className="max-w-full max-h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg border border-dashed border-[#cccccc] flex items-center justify-center bg-[#f9f9fa] shrink-0 text-[#888888]">
                    <Building className="w-6 h-6" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="url"
                    value={formData.logo_url}
                    onChange={e => setFormData({...formData, logo_url: e.target.value})}
                    placeholder="https://example.com/logo.png"
                    className="w-full h-10 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none mb-1.5"
                  />
                  <p className="text-[12px] text-[#888888]">Provide a direct URL to a square PNG or JPEG image.</p>
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
                placeholder="123 Education Lane..."
                className="w-full p-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none resize-none"
              />
            </div>
            
            <div>
              <label className="block text-[13px] font-medium text-[#333333] mb-1.5 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#888888]" /> Support Email</label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={e => setFormData({...formData, contact_email: e.target.value})}
                className="w-full h-10 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none"
              />
            </div>
            
            <div>
              <label className="block text-[13px] font-medium text-[#333333] mb-1.5 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#888888]" /> Contact Phone</label>
              <input
                type="tel"
                value={formData.contact_phone}
                onChange={e => setFormData({...formData, contact_phone: e.target.value})}
                className="w-full h-10 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Payments */}
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <CreditCard className="w-5 h-5 text-[#0066cc]" />
            <h3 className="text-[16px] font-semibold text-[#111111]">Payments & Currency</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Base Currency</label>
              <select
                value={formData.currency}
                onChange={e => setFormData({...formData, currency: e.target.value})}
                className="w-full h-10 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Stripe Connected Account ID</label>
              <input
                type="text"
                value={formData.stripe_account_id}
                onChange={e => setFormData({...formData, stripe_account_id: e.target.value})}
                placeholder="acct_1Ou..."
                className="w-full h-10 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none"
              />
              <p className="text-[12px] text-[#888888] mt-1.5">Required to receive online fee payments directly to your bank.</p>
            </div>
          </div>
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
