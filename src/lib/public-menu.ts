export const CORE_PRODUCT_ROUTES: Record<string, string> = {
  "school-erp": "/school-erp",
  "hospital-erp": "/hospital-erp",
  "pharmacy-pos": "/pharmacy-pos",
  erp: "/erp",
};

export const STATIC_PUBLIC_PATHS = [
  "/",
  "/book-demo",
  "/contact",
  "/erp",
  "/hospital-erp",
  "/login",
  "/pharmacy-pos",
  "/pricing",
  "/school-erp",
  "/school/login",
  "/school/signup",
  "/services",
  "/signin",
  "/signup",
  "/products/books",
  "/products/campaigns",
  "/products/crm",
  "/products/desk",
  "/products/people",
] as const;

export function canonicalizeMenuPath(href: string): string {
  const normalized = href.trim();
  if (!normalized) return "";

  const productPath = normalized.match(/^\/products\/([^/?#]+)(.*)$/);
  if (!productPath) return normalized.split(/[?#]/)[0] || "/";

  const coreRoute = CORE_PRODUCT_ROUTES[productPath[1]];
  return coreRoute ? `${coreRoute}${productPath[2]}` : normalized.split(/[?#]/)[0] || "/";
}

export function normalizePublicMenuPath(href: unknown): string | null {
  if (typeof href !== "string") return null;
  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith("//") || !trimmed.startsWith("/")) {
    return null;
  }

  const canonical = canonicalizeMenuPath(trimmed);
  return canonical || null;
}

export function buildPublicMenuPathSet({
  products = [],
  suites = [],
  marketplace = [],
  extraPaths = [],
}: {
  products?: Array<{ slug?: string | null }>;
  suites?: Array<{ slug?: string | null }>;
  marketplace?: Array<{ slug?: string | null }>;
  extraPaths?: Array<string | null | undefined>;
} = {}) {
  const validPaths = new Set<string>([...STATIC_PUBLIC_PATHS]);

  for (const path of extraPaths) {
    const normalized = normalizePublicMenuPath(path);
    if (normalized) validPaths.add(normalized);
  }

  for (const product of products) {
    const slug = typeof product?.slug === "string" ? product.slug.trim() : "";
    if (!slug) continue;
    validPaths.add(`/products/${slug}`);
  }

  for (const suite of suites) {
    const slug = typeof suite?.slug === "string" ? suite.slug.trim() : "";
    if (!slug) continue;
    validPaths.add(`/suites/${slug}`);
  }

  for (const item of marketplace) {
    const slug = typeof item?.slug === "string" ? item.slug.trim() : "";
    if (!slug) continue;
    validPaths.add(`/marketplace/${slug}`);
  }

  return validPaths;
}

export function sanitizeMenuItems(
  items: any[] | null | undefined,
  validPaths: Set<string> | string[]
) {
  const pathSet = validPaths instanceof Set ? validPaths : new Set(validPaths);

  return (items || []).filter((item) => {
    const label = typeof item?.label === "string" ? item.label.trim() : "";
    const href = normalizePublicMenuPath(item?.href);
    return label.length > 0 && !!href && pathSet.has(href);
  }).map((item) => ({
    ...item,
    href: normalizePublicMenuPath(item?.href) || item?.href,
  }));
}
