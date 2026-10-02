// Every product has its own small website at /{slug}: an overview plus these pages.
// Anything published in Admin → Products gets one automatically.

export const PRODUCT_SECTIONS = ["features", "pricing", "faq", "demo"] as const;
export type ProductSection = typeof PRODUCT_SECTIONS[number];

export function productHref(slug: string, section?: ProductSection) {
  return section ? `/${slug}/${section}` : `/${slug}`;
}

export function isProductSection(value: string): value is ProductSection {
  return (PRODUCT_SECTIONS as readonly string[]).includes(value);
}

// Product slugs share the root of the site with the company pages, so these names
// cannot be used for a product (or a content page).
export const RESERVED_SLUGS = new Set([
  "about", "account", "access-denied", "admin", "api", "book-demo", "client", "contact", "dashboard",
  "login", "marketplace", "portal", "pricing", "privacy", "products", "school", "services", "signin",
  "signup", "suites", "terms",
]);

// Where a product's customers sign in.
export function productSignInHref(slug: string) {
  return slug === "school-erp" ? "/school/login" : "/login";
}
