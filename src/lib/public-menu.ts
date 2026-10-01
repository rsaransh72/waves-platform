// Public pages that always exist. Product, suite, marketplace and content pages are
// added from what is published, so a menu can never link to a page that is not there.
export const STATIC_PUBLIC_PATHS = [
  "/",
  "/products",
  "/services",
  "/pricing",
  "/contact",
  "/book-demo",
  "/signup",
  "/login",
] as const;

export function canonicalizeMenuPath(href: string): string {
  const normalized = href.trim();
  if (!normalized) return "";

  const productPath = normalized.match(/^\/products\/([^/?#]+)(.*)$/);
  if (!productPath) return normalized.split(/[?#]/)[0] || "/";

  // Products live at /{slug}; old /products/{slug} links are treated the same way.
  return `/${productPath[1]}${productPath[2]}`.split(/[?#]/)[0] || "/";
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
  pages = [],
  extraPaths = [],
}: {
  products?: Array<{ slug?: string | null }>;
  suites?: Array<{ slug?: string | null }>;
  marketplace?: Array<{ slug?: string | null }>;
  pages?: Array<{ slug?: string | null }>;
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
    validPaths.add(`/${slug}`);
  }

  for (const page of pages) {
    const slug = typeof page?.slug === "string" ? page.slug.trim() : "";
    if (!slug) continue;
    validPaths.add(`/${slug}`);
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
