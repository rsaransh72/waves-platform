import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Settings as SettingsIcon, Save } from "lucide-react";

export const revalidate = 0;

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: settingsData, error } = await supabase
    .from("settings")
    .select("*");

  if (error) console.error("Error fetching settings:", error);

  const getSetting = (key: string) => {
    return settingsData?.find(s => s.key === key)?.value || {};
  };

  const general = getSetting("site_general");
  const seo = getSetting("site_seo");

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Platform Settings</h1>
          <p className="text-sm font-medium text-slate-500">Manage global site configurations and SEO.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-sm">
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>

      <div className="space-y-8">
        {/* General Settings */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 bg-slate-50 px-6 py-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">General Information</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Site Name</label>
                <input 
                  type="text" 
                  defaultValue={general.siteName || ""}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Support Email</label>
                <input 
                  type="email" 
                  defaultValue={general.supportEmail || ""}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 bg-slate-50 px-6 py-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">Default SEO</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Default Meta Title</label>
              <input 
                type="text" 
                defaultValue={seo.defaultTitle || ""}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Default Meta Description</label>
              <textarea 
                rows={3}
                defaultValue={seo.defaultDescription || ""}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
