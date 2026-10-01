import "server-only";
import { cache } from "react";
import { supabase } from "@/lib/supabase";

// Everything the public website shows comes from the admin console: company details
// from Settings, and products, services and pages that are published there. Nothing
// here is invented, so a section with no data is simply not rendered.

export type SiteSettings = {
  company_name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  sales_email: string;
  support_email: string;
  address: string;
  business_hours: string;
  lead_notification_email: string;
};

const EMPTY_SETTINGS: SiteSettings = {
  company_name: "Waves",
  tagline: "",
  phone: "",
  whatsapp: "",
  sales_email: "",
  support_email: "",
  address: "",
  business_hours: "",
  lead_notification_email: "",
};

export type PricingPlan = {
  name: string;
  price?: string | number;
  period?: string;
  description?: string;
  features?: string[];
  highlighted?: boolean;
};

export type ProductSummary = {
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  category: string | null;
  color: string | null;
  accent_color: string | null;
};

export type Product = ProductSummary & {
  features: Array<{ title: string; desc: string; iconKey?: string }>;
  use_cases: Array<{ title: string; desc: string; iconKey?: string }>;
  target_audience: string[];
  pricing: PricingPlan[];
  integrations: Array<{ name?: string; title?: string; desc?: string } | string>;
  faqs: Array<{ question: string; answer: string }>;
  seo_title: string | null;
  seo_description: string | null;
};

export type Service = {
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  features: string[];
  benefits: string[];
  pricing: PricingPlan[];
};

export type PageSection = { heading?: string; body?: string };
export type ContentPage = {
  slug: string;
  title: string;
  blocks: PageSection[];
  seo_title: string | null;
  seo_description: string | null;
};

// Pages hold an array of { heading, body } sections; anything else is ignored.
function readSections(blocks: unknown): PageSection[] {
  if (!Array.isArray(blocks)) return [];
  return blocks
    .filter((block): block is PageSection => typeof block === "object" && block !== null)
    .map((block) => ({
      heading: typeof block.heading === "string" ? block.heading.trim() : "",
      body: typeof block.body === "string" ? block.body.trim() : "",
    }))
    .filter((section) => section.heading || section.body);
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const { data } = await supabase.from("settings").select("value").eq("key", "site_general").maybeSingle();
  const value = (data?.value ?? {}) as Partial<SiteSettings>;
  const settings = { ...EMPTY_SETTINGS };
  for (const key of Object.keys(EMPTY_SETTINGS) as Array<keyof SiteSettings>) {
    if (typeof value[key] === "string" && value[key]!.trim()) settings[key] = value[key]!.trim();
  }
  return settings;
});

const PRODUCT_SUMMARY_COLUMNS = "slug, title, subtitle, description, category, color, accent_color";

export const getPublishedProducts = cache(async (): Promise<ProductSummary[]> => {
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SUMMARY_COLUMNS)
    .eq("status", "published")
    .eq("visibility", "public")
    .order("title");
  return data ?? [];
});

export const getPublishedProduct = cache(async (slug: string): Promise<Product | null> => {
  const { data } = await supabase
    .from("products")
    .select(`${PRODUCT_SUMMARY_COLUMNS}, features, use_cases, target_audience, pricing, integrations, faqs, seo_title, seo_description`)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (!data) return null;
  return {
    ...data,
    features: readItems(data.features),
    use_cases: readItems(data.use_cases),
    target_audience: Array.isArray(data.target_audience) ? data.target_audience.filter((item: unknown) => typeof item === "string") : [],
    pricing: readPlans(data.pricing),
    integrations: Array.isArray(data.integrations) ? data.integrations : [],
    faqs: readFaqs(data.faqs),
  };
});

export type CatalogTable = "products" | "suites" | "marketplaceitems";

// Suites and marketplace entries share the product shape (they have a tagline in
// place of a description), so one page template serves all three catalogues.
export const getPublishedCatalogItem = cache(async (table: CatalogTable, slug: string): Promise<Product | null> => {
  if (table === "products") return getPublishedProduct(slug);
  const { data } = await supabase.from(table).select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  if (!data) return null;
  return {
    slug: data.slug,
    title: data.title,
    subtitle: data.subtitle ?? null,
    description: data.tagline ?? null,
    category: data.category ?? null,
    color: data.color ?? null,
    accent_color: data.accent_color ?? null,
    features: readItems(data.features),
    use_cases: readItems(data.use_cases),
    target_audience: Array.isArray(data.target_audience) ? data.target_audience.filter((item: unknown) => typeof item === "string") : [],
    pricing: readPlans(data.pricing),
    integrations: Array.isArray(data.integrations) ? data.integrations : [],
    faqs: readFaqs(data.faqs),
    seo_title: data.seo_title ?? null,
    seo_description: data.seo_description ?? null,
  };
});

// Feature lists are stored either as plain strings or as { title } objects.
function readTextList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item : typeof item?.title === "string" ? item.title : ""))
    .map((item) => item.trim())
    .filter(Boolean);
}

// Content written by older editors used other key names (description, plan, q/a).
function readItems(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => ({ title: String(item?.title ?? "").trim(), desc: String(item?.desc ?? item?.description ?? "").trim(), iconKey: item?.iconKey }))
    .filter((item) => item.title);
}

function readPlans(value: unknown): PricingPlan[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => ({
      name: String(item?.name ?? item?.plan ?? "").trim(),
      price: item?.price ?? undefined,
      period: item?.period ?? undefined,
      description: item?.description ?? undefined,
      features: Array.isArray(item?.features)
        ? item.features.filter((feature: unknown) => typeof feature === "string" && feature.trim())
        : typeof item?.features === "string" ? item.features.split(/\n|,/).map((line: string) => line.trim()).filter(Boolean) : [],
      highlighted: Boolean(item?.highlighted),
    }))
    .filter((plan) => plan.name);
}

function readFaqs(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => ({ question: String(item?.question ?? item?.q ?? "").trim(), answer: String(item?.answer ?? item?.a ?? "").trim() }))
    .filter((item) => item.question && item.answer);
}

export const getPublishedServices = cache(async (): Promise<Service[]> => {
  const { data } = await supabase
    .from("services")
    .select("slug, title, subtitle, description, features, benefits, pricing")
    .eq("status", "published")
    .order("title");
  return (data ?? []).map((service) => ({
    ...service,
    features: readTextList(service.features),
    benefits: readTextList(service.benefits),
    pricing: readPlans(service.pricing),
  }));
});

// Only pages that have written content; an empty published page is not linked.
export const getPublishedPages = cache(async (): Promise<ContentPage[]> => {
  const { data } = await supabase
    .from("pages")
    .select("slug, title, blocks, seo_title, seo_description")
    .eq("status", "published")
    .order("title");
  return (data ?? [])
    .map((page) => ({ ...page, blocks: readSections(page.blocks) }))
    .filter((page) => page.blocks.length > 0);
});

export async function getPublishedPage(slug: string): Promise<ContentPage | null> {
  const pages = await getPublishedPages();
  return pages.find((page) => page.slug === slug) ?? null;
}

export { productHref } from "@/lib/product-routes";

export function planPrice(plan: PricingPlan) {
  if (plan.price === undefined || plan.price === null || plan.price === "") return null;
  return plan.price;
}
