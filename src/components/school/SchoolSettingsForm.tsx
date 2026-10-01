"use client";

import { useState } from "react";
import { Save, UploadCloud, Building2, MapPin, Mail, Phone, CreditCard, Building } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { toast } from "sonner";
import { describeError } from "@/lib/error-message";
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
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const supabase = createClient();

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
