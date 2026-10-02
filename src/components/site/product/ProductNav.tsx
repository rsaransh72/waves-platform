"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { productHref, productSignInHref, type ProductSection } from "@/lib/product-routes";

// The product's own menu, shown under the company header on every page of the
// product's mini-site. Pages without content (no FAQs yet) are left out.
export default function ProductNav({ slug, title, hasFeatures, hasFaqs }: { slug: string; title: string; hasFeatures: boolean; hasFaqs: boolean }) {
  const pathname = usePathname();
  const links: Array<{ label: string; section?: ProductSection }> = [
    { label: "Overview" },
    ...(hasFeatures ? [{ label: "Features", section: "features" as const }] : []),
    { label: "Pricing", section: "pricing" },
    ...(hasFaqs ? [{ label: "FAQs", section: "faq" as const }] : []),
  ];

  return (
    <div className="sticky top-[61px] z-40 bg-white/95 backdrop-blur-md border-b border-[#e6e9f0] shadow-xs">
      <div className="w-full max-w-[1280px] mx-auto px-6 lg:px-[5%] h-[48px] flex items-center justify-between gap-4">
        <div className="flex items-center gap-6 min-w-0">
          <Link href={productHref(slug)} className="font-bold text-[15px] text-[#111] truncate">{title}</Link>
          <nav className="hidden md:flex items-center gap-5 text-[13px] font-medium text-[#555]">
            {links.map((link) => {
              const href = productHref(slug, link.section);
              const active = pathname === href;
              return (
                <Link key={link.label} href={href} className={active ? "text-[#0066cc] font-semibold" : "hover:text-[#111] transition"}>
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href={productSignInHref(slug)} className="hidden sm:inline text-[13px] font-semibold text-[#555] hover:text-[#111]">Sign in</Link>
          <Link href={productHref(slug, "demo")} className="text-[12px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-[3px] text-white bg-[#226eb4] hover:bg-[#1a5a96] transition">
            Request demo
          </Link>
        </div>
      </div>
      <nav className="md:hidden flex gap-5 overflow-x-auto px-6 pb-2 text-[13px] font-medium text-[#555]">
        {links.map((link) => {
          const href = productHref(slug, link.section);
          return <Link key={link.label} href={href} className={`whitespace-nowrap ${pathname === href ? "text-[#0066cc] font-semibold" : ""}`}>{link.label}</Link>;
        })}
      </nav>
    </div>
  );
}
