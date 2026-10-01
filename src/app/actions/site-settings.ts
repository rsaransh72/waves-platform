"use server";

import { revalidatePath } from "next/cache";
import { requirePlatformAdmin } from "@/lib/supabase-server";

const FIELDS = [
  "company_name",
  "tagline",
  "phone",
  "whatsapp",
  "sales_email",
  "support_email",
  "address",
  "business_hours",
  "lead_notification_email",
] as const;

const EMAIL_FIELDS = new Set(["sales_email", "support_email", "lead_notification_email"]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function saveSiteSettings(input: Record<string, string>): Promise<{ error?: string; message?: string }> {
  try {
    const { supabase } = await requirePlatformAdmin();
    const value: Record<string, string> = {};
    for (const field of FIELDS) {
      const text = typeof input[field] === "string" ? input[field].trim().slice(0, field === "address" ? 500 : 200) : "";
      if (text && EMAIL_FIELDS.has(field) && !EMAIL_PATTERN.test(text)) {
        return { error: `Enter a valid email address for ${field.replaceAll("_", " ")}.` };
      }
      value[field] = text;
    }
    if (!value.company_name) return { error: "Company name is required." };

    const { error } = await supabase
      .from("settings")
      .upsert({ key: "site_general", value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) throw error;

    // Every public page shows these details.
    revalidatePath("/", "layout");
    return { message: "Settings saved. The website now shows these details." };
  } catch (error) {
    console.error("Could not save site settings:", error);
    return { error: error instanceof Error ? error.message : "Settings could not be saved." };
  }
}
