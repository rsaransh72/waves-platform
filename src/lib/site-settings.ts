// The company details shown on the public website. The settings form and the
// saveSiteSettings action both validate with these rules.
import { collectErrors, emailError, phoneError, textError } from "@/lib/india";

export const SITE_SETTING_KEYS = [
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

export type SiteSettingKey = (typeof SITE_SETTING_KEYS)[number];
export type SiteSettings = Record<SiteSettingKey, string>;
export type SiteSettingErrors = Partial<Record<SiteSettingKey, string>>;

export const SITE_SETTING_LIMITS: Record<SiteSettingKey, number> = {
  company_name: 120,
  tagline: 200,
  phone: 20,
  whatsapp: 20,
  sales_email: 254,
  support_email: 254,
  address: 500,
  business_hours: 100,
  lead_notification_email: 254,
};

export const EMAIL_SETTINGS = new Set<SiteSettingKey>(["sales_email", "support_email", "lead_notification_email"]);

export function toSiteSettings(input: Record<string, unknown> | null | undefined): SiteSettings {
  return Object.fromEntries(SITE_SETTING_KEYS.map((key) => [key, typeof input?.[key] === "string" ? String(input[key]) : ""])) as SiteSettings;
}

export function validateSiteSettings(values: SiteSettings): SiteSettingErrors {
  return collectErrors<SiteSettingKey>({
    company_name: textError(values.company_name, { label: "Company name", required: true, max: SITE_SETTING_LIMITS.company_name }),
    tagline: textError(values.tagline, { label: "Tagline", min: 3, max: SITE_SETTING_LIMITS.tagline }),
    phone: phoneError(values.phone, { kind: "landline" }),
    whatsapp: phoneError(values.whatsapp, { kind: "mobile" }),
    sales_email: emailError(values.sales_email),
    support_email: emailError(values.support_email),
    // The address is multi-line; line breaks are fine there.
    address: textError(values.address.replace(/\r?\n/g, " "), { label: "Office address", min: 5, max: SITE_SETTING_LIMITS.address }),
    business_hours: textError(values.business_hours, { label: "Business hours", min: 3, max: SITE_SETTING_LIMITS.business_hours }),
    lead_notification_email: emailError(values.lead_notification_email),
  });
}
