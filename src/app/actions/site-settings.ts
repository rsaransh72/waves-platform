"use server";

import { revalidatePath } from "next/cache";
import { requirePlatformAdmin } from "@/lib/supabase-server";
import { toStoredPhone } from "@/lib/india";
import { EMAIL_SETTINGS, SITE_SETTING_KEYS, toSiteSettings, validateSiteSettings, type SiteSettingErrors, type SiteSettings } from "@/lib/site-settings";

export type SaveSiteSettingsResult = { error?: string; fieldErrors?: SiteSettingErrors; message?: string; saved?: SiteSettings };

export async function saveSiteSettings(input: Record<string, string>): Promise<SaveSiteSettingsResult> {
  try {
    const { supabase } = await requirePlatformAdmin();
    const values = toSiteSettings(input);
    for (const key of SITE_SETTING_KEYS) values[key] = values[key].trim();

    const fieldErrors = validateSiteSettings(values);
    if (Object.keys(fieldErrors).length) return { error: "Some details need attention. Nothing was saved.", fieldErrors };

    const value: SiteSettings = {
      ...values,
      phone: toStoredPhone(values.phone, { kind: "landline" }) ?? "",
      whatsapp: toStoredPhone(values.whatsapp) ?? "",
    };
    for (const key of EMAIL_SETTINGS) value[key] = value[key].toLowerCase();

    const { error } = await supabase
      .from("settings")
      .upsert({ key: "site_general", value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) throw error;

    // Every public page shows these details.
    revalidatePath("/", "layout");
    return { message: "Settings saved. The website now shows these details.", saved: value };
  } catch (error) {
    console.error("Could not save site settings:", error);
    return { error: error instanceof Error ? error.message : "Settings could not be saved. Try again." };
  }
}
