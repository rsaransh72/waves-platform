"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, GraduationCap, Layers, Menu, X } from "lucide-react";
import { productHref } from "@/lib/product-routes";

type NavProduct = { slug: string; title: string; subtitle: string | null; category: string | null };
type NavCatalogItem = { slug: string; title: string; subtitle: string | null };
type NavLink = { label: string; href: string };

function productIcon(slug: string) {
  return slug === "school-erp" ? GraduationCap : Layers;
}

export default function ClientNavbar({
  requestDemoHref = "/book-demo",
  companyName,
  menuItems,
  products,
  suites,
  marketplace,
}: {
  requestDemoHref?: string;
  companyName: string;
  menuItems: NavLink[];
  products: NavProduct[];
  suites: NavCatalogItem[];
  marketplace: NavCatalogItem[];
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen && !productsOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMobileMenuOpen(false);
      setProductsOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [mobileMenuOpen, productsOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e6e9f0]">
      <div className="w-full flex justify-between items-center gap-3 h-[60px] px-4 sm:px-8 xl:px-12">
        <div className="flex min-w-0 items-center gap-10 xl:gap-14">
          <Link prefetch={false} href="/" className="flex min-w-0 items-center gap-2 group">
            <div className="grid grid-cols-2 gap-[1.5px] w-[22px] h-[22px] shrink-0">
              <span className="w-2.5 h-2.5 rounded-[3px] bg-[#e42525] group-hover:scale-110 transition-transform" />
              <span className="w-2.5 h-2.5 rounded-[3px] bg-[#226eb4] group-hover:scale-110 transition-transform" />
              <span className="w-2.5 h-2.5 rounded-[3px] bg-[#10b981] group-hover:scale-110 transition-transform" />
              <span className="w-2.5 h-2.5 rounded-[3px] bg-[#f59e0b] group-hover:scale-110 transition-transform" />
            </div>
            <span className="truncate text-[15px] sm:text-[19px] font-black tracking-tight text-black leading-none">{companyName.toUpperCase()}</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-[14px] text-[#111111]">
            {products.length > 0 && (
              <div
                className="relative py-5 cursor-pointer"
                onMouseEnter={() => setProductsOpen(true)}
                onMouseLeave={() => setProductsOpen(false)}
              >
                <Link prefetch={false} href="/products" className="flex items-center gap-1.5 hover:text-black transition-colors">
                  <span>Products</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 stroke-[1.5] ${productsOpen ? "rotate-180 text-[#226eb4]" : "text-[#777]"}`} />
                </Link>
                {productsOpen && (
                  <div className="fixed left-0 w-full bg-white border-b border-[#e6e9f0] shadow-xl z-40 cursor-default" style={{ top: "60px" }}>
                    <ProductsMenu products={products} suites={suites} marketplace={marketplace} onNavigate={() => setProductsOpen(false)} />
                  </div>
                )}
              </div>
            )}

            {menuItems.map((item) => (
              <Link prefetch={false} key={item.href} href={item.href} className="flex items-center gap-1.5 hover:text-black transition-colors">
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden lg:flex items-center gap-5">
          <Link prefetch={false} href="/login" className="text-[14px] text-[#e42525] hover:underline transition-colors">
            Sign In
          </Link>
          <Link
            prefetch={false}
            href={requestDemoHref}
            className="text-[14px] text-[#e42525] border border-[#e42525] hover:bg-red-50 rounded-[3px] py-1.5 px-4 transition-colors"
          >
            Request Demo
          </Link>
        </div>

        <div className="lg:hidden flex shrink-0 items-center gap-2 sm:gap-3">
          <Link prefetch={false} href={requestDemoHref} className="zw-cta-outlined whitespace-nowrap !py-1 !px-3 text-xs">
            <span className="hidden min-[420px]:inline">Request </span>Demo
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-black hover:bg-[#f8f9fa] rounded transition cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[61px] z-[9999] bg-white overflow-y-auto" style={{ height: "calc(100vh - 61px)", WebkitOverflowScrolling: "touch" }}>
          <div className="flex flex-col w-full min-h-full">
            {products.length > 0 && (
              <div className="border-b border-[#e6e9f0]">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50"
                  onClick={() => setProductsOpen(!productsOpen)}
                  aria-expanded={productsOpen}
                >
                  <span className="text-[18px] font-medium text-[#111111]">Products</span>
                  <ChevronDown className={`w-5 h-5 text-[#111111] transition-transform ${productsOpen ? "rotate-180" : ""}`} />
                </button>
                {productsOpen && (
                  <div className="bg-[#f8f9fa] px-6 py-4 space-y-4 shadow-inner">
                    {products.map((product) => {
                      const Icon = productIcon(product.slug);
                      return (
                        <Link prefetch={false} key={product.slug} href={productHref(product.slug)} onClick={() => setMobileMenuOpen(false)} className="flex items-start gap-4">
                          <div className="text-[#226eb4] mt-0.5"><Icon className="w-6 h-6" strokeWidth={1.5} /></div>
                          <div>
                            <div className="text-[16px] font-medium text-[#111111]">{product.title}</div>
                            {product.subtitle && <div className="text-[13px] text-[#555]">{product.subtitle}</div>}
                          </div>
                        </Link>
                      );
                    })}
                    <Link prefetch={false} href="/products" onClick={() => setMobileMenuOpen(false)} className="block w-full py-3 text-center border border-[#0066cc] text-[#0066cc] rounded text-[14px] font-bold uppercase tracking-wider">
                      All products
                    </Link>
                  </div>
                )}
              </div>
            )}

            {menuItems.map((item) => (
              <Link key={item.href} prefetch={false} href={item.href} onClick={() => setMobileMenuOpen(false)} className="block border-b border-[#e6e9f0] px-6 py-5 text-[18px] font-medium text-[#111111] hover:bg-gray-50">
                {item.label}
              </Link>
            ))}

            <Link prefetch={false} href="/login" onClick={() => setMobileMenuOpen(false)} className="block border-b border-[#e6e9f0] px-6 py-5 text-[18px] font-medium text-[#e42525] hover:bg-red-50">
              Sign In
            </Link>

            <div className="mt-auto p-6 bg-white border-t border-[#e6e9f0]">
              <Link prefetch={false} href={requestDemoHref} onClick={() => setMobileMenuOpen(false)} className="zw-cta-main w-full text-center block !py-3 !text-[15px] shadow-lg shadow-red-500/20">
                Request a Demo
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function ProductsMenu({
  products,
  suites,
  marketplace,
  onNavigate,
}: {
  products: NavProduct[];
  suites: NavCatalogItem[];
  marketplace: NavCatalogItem[];
  onNavigate: () => void;
}) {
  const tabs = [
    { key: "apps", label: "Products", count: products.length },
    { key: "suites", label: "Suites", count: suites.length },
    { key: "marketplace", label: "Marketplace", count: marketplace.length },
  ].filter((tab) => tab.count > 0);
  const [activeTab, setActiveTab] = useState(tabs[0]?.key ?? "apps");

  const cards = activeTab === "suites"
    ? suites.map((suite) => ({ key: suite.slug, href: `/suites/${suite.slug}`, title: suite.title, desc: suite.subtitle, Icon: Layers }))
    : activeTab === "marketplace"
      ? marketplace.map((item) => ({ key: item.slug, href: `/marketplace/${item.slug}`, title: item.title, desc: item.subtitle, Icon: Layers }))
      : products.map((product) => ({ key: product.slug, href: productHref(product.slug), title: product.title, desc: product.subtitle, Icon: productIcon(product.slug) }));

  return (
    <div className="bg-white shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
      <div className="w-full border-b border-[#e6e9f0]">
        <div className="w-full px-6 lg:px-10 flex items-center h-[50px] gap-8 text-[15px] font-medium text-[#222]">
          {tabs.length > 1 && tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`h-full flex items-center transition-colors ${activeTab === tab.key ? "border-b-[3px] border-[#0066cc] text-[#0066cc] mb-[-3px]" : "hover:text-[#0066cc]"}`}
            >
              {tab.label}
            </button>
          ))}
          {tabs.length <= 1 && <span className="text-[#0066cc]">Products</span>}
          <div className="ml-auto flex items-center gap-4">
            <Link prefetch={false} href="/products" onClick={onNavigate} className="text-[#0066cc] text-[12px] font-bold tracking-wider hover:underline uppercase">
              View all products
            </Link>
            <button type="button" aria-label="Close products menu" className="text-[#888] hover:text-[#111]" onClick={(event) => { event.stopPropagation(); onNavigate(); }}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-10 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {cards.map(({ key, href, title, desc, Icon }) => (
            <Link
              prefetch={false}
              key={key}
              href={href}
              onClick={onNavigate}
              className="group border border-[#e6e9f0] rounded-[6px] p-5 hover:border-[#0066cc] hover:shadow-[0_4px_12px_rgba(0,102,204,0.1)] transition-all bg-white flex flex-col min-h-[170px]"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-md bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                  <Icon className="w-5 h-5 text-[#0284c7]" strokeWidth={2} />
                </div>
                <h4 className="font-semibold text-[#111] text-[16px] leading-tight">{title}</h4>
              </div>
              {desc && <p className="text-[14px] text-[#444] leading-[1.6] line-clamp-3">{desc}</p>}
              <div className="mt-auto pt-4">
                <span className="text-[#0066cc] text-[13px] font-bold uppercase flex items-center gap-1 group-hover:gap-2 transition-all">
                  View details <ChevronRight className="w-4 h-4" strokeWidth={3} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
