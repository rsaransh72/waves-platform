"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  ChevronDown, 
  Menu, 
  X, 
  GraduationCap, 
  Hospital, 
  Store, 
  Database, 
  Users, 
  Cpu, 
  Headphones, 
  ArrowRight,
  Layers,
  Search,
  Phone,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Globe
} from "lucide-react";
import { buildPublicMenuPathSet, sanitizeMenuItems } from "@/lib/public-menu";

const coreProductRoutes: Record<string, string> = {
  "school-erp": "/school-erp",
  "hospital-erp": "/hospital-erp",
  "pharmacy-pos": "/pharmacy-pos",
  erp: "/erp",
};

function getProductHref(slug: unknown) {
  if (typeof slug !== "string" || !slug.trim()) return null;
  return coreProductRoutes[slug] || `/products/${slug}`;
}

export default function Navbar({ 
  requestDemoHref = "/book-demo",
  dynamicMenuItems = [], 
  dynamicProducts = [],
  dynamicSuites = [],
  dynamicMarketplace = []
}: { 
  requestDemoHref?: string;
  dynamicMenuItems?: any[];
  dynamicProducts?: any[];
  dynamicSuites?: any[];
  dynamicMarketplace?: any[];
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const validPublicPaths = buildPublicMenuPathSet({
    products: dynamicProducts,
    suites: dynamicSuites,
    marketplace: dynamicMarketplace,
  });
  const validDynamicMenuItems = sanitizeMenuItems(dynamicMenuItems, validPublicPaths);
  const mobileMenuLinks = validDynamicMenuItems.length > 0
    ? validDynamicMenuItems
    : [
        { label: "School ERP", href: "/school-erp" },
        { label: "Pricing", href: "/pricing" },
        { label: "Services", href: "/services" },
        { label: "Contact & Demo", href: "/contact" },
      ];
  const mobileProductLinks = [
    { href: "/school-erp", label: "School Suite", description: "Academic LMS & Attendance", icon: GraduationCap },
    { href: "/hospital-erp", label: "Health Suite", description: "OPD Queues & Digital Rx", icon: Hospital },
    { href: "/pharmacy-pos", label: "Pharmacy POS", description: "Barcode Billing & Expiry", icon: Store },
    { href: "/erp", label: "Waves ERP", description: "Ledger & Supply Chain", icon: Layers },
    ...dynamicProducts.flatMap((product) => {
      const href = getProductHref(product.slug);
      return href ? [{
        href,
        label: product.title,
        description: product.subtitle || "",
        icon: Layers,
      }] : [];
    }),
    ...dynamicSuites.map((suite) => ({
      href: `/suites/${suite.slug}`,
      label: suite.title,
      description: suite.subtitle || "",
      icon: Layers,
    })),
  ].filter((item, index, items) =>
    items.findIndex((candidate) => candidate.href === item.href) === index
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e6e9f0]">
      <div className="w-full flex justify-between items-center h-[60px] px-8 xl:px-12">
          
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-10 xl:gap-14">
            
            <Link prefetch={false} href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="grid grid-cols-2 gap-[1.5px] w-[22px] h-[22px] shrink-0">
                <span className="w-2.5 h-2.5 rounded-[3px] bg-[#e42525] group-hover:scale-110 transition-transform" />
                <span className="w-2.5 h-2.5 rounded-[3px] bg-[#226eb4] group-hover:scale-110 transition-transform" />
                <span className="w-2.5 h-2.5 rounded-[3px] bg-[#10b981] group-hover:scale-110 transition-transform" />
                <span className="w-2.5 h-2.5 rounded-[3px] bg-[#f59e0b] group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-[19px] font-black tracking-tight text-black leading-none">
                WAVES
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8 text-[14px] text-[#111111]">
              
              {/* Products Dropdown */}
              <div 
                className="relative py-5 cursor-pointer"
                onMouseEnter={() => { setProductsOpen(true); setServicesOpen(false); }}
                onMouseLeave={() => setProductsOpen(false)}
              >
                <div className="flex items-center gap-1.5 hover:text-black transition-colors">
                  <span>Products</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 stroke-[1.5] ${productsOpen ? "rotate-180 text-[#226eb4]" : "text-[#777]"}`} />
                </div>

                {/* Products Dropdown - Zoho Full Screen Mega Menu */}
                {productsOpen && (
                  <div className="fixed left-0 w-full bg-white border-b border-[#e6e9f0] shadow-xl z-40 cursor-default" style={{ top: "60px", height: "calc(100vh - 60px)", maxHeight: "650px" }}>
                    <MegaMenuContent 
                      setProductsOpen={setProductsOpen} 
                      dynamicProducts={dynamicProducts} 
                      dynamicSuites={dynamicSuites}
                      dynamicMarketplace={dynamicMarketplace}
                    />
                  </div>
                )}
              </div>

              {validDynamicMenuItems.length > 0 ? (
                validDynamicMenuItems.map((item, idx) => (
                  <Link prefetch={false} key={idx} href={item.href} className="flex items-center gap-1.5 hover:text-black transition-colors">
                    <span>{item.label}</span>
                  </Link>
                ))
              ) : (
                <>
                  <Link prefetch={false} href="/school-erp" className="flex items-center gap-1.5 hover:text-black transition-colors">
                    <span>School ERP</span>
                  </Link>
                  <Link prefetch={false} href="/erp" className="flex items-center gap-1.5 hover:text-black transition-colors">
                    <span>ERP</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#777] stroke-[1.5]" />
                  </Link>
                  <Link prefetch={false} href="/pricing" className="flex items-center gap-1.5 hover:text-black transition-colors">
                    <span>Pricing</span>
                  </Link>
                  <Link prefetch={false} href="/services" className="flex items-center gap-1.5 hover:text-black transition-colors">
                    <span>Services</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#777] stroke-[1.5]" />
                  </Link>
                  <Link prefetch={false} href="/contact" className="flex items-center gap-1.5 hover:text-black transition-colors">
                    <span>Contact</span>
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Right: Auth Buttons & Icons */}
          <div className="hidden lg:flex items-center gap-5">
            <div className="flex items-center gap-4 text-[#111]">
              <Search className="w-[18px] h-[18px] cursor-pointer hover:text-blue-600 transition-colors stroke-[1.5]" />
              <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors">
                <Globe className="w-[18px] h-[18px] stroke-[1.5]" />
                <span className="text-[14px]">English</span>
              </div>
            </div>
            
            <Link prefetch={false} 
              href="/login" 
              className="text-[14px] text-[#e42525] hover:underline transition-colors ml-2"
            >
              Sign In
            </Link>
            <Link prefetch={false}
              href={requestDemoHref}
              className="text-[14px] text-[#e42525] border border-[#e42525] hover:bg-red-50 rounded-[3px] py-1.5 px-4 transition-colors"
            >
              Request Demo
            </Link>
          </div>

          {/* Mobile Controls */}
          <div className="lg:hidden flex items-center gap-3">
            <Link prefetch={false} href={requestDemoHref} className="zw-cta-outlined !py-1 !px-3 text-xs">
              Request Demo
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="p-2 text-black hover:bg-[#f8f9fa] rounded transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

      </div>

      {/* Mobile Drawer (Zoho Full Screen Style) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[64px] z-[9999] bg-white overflow-y-auto" style={{ height: 'calc(100vh - 64px)', WebkitOverflowScrolling: 'touch' }}>
          <div className="flex flex-col w-full h-full">
            
            {/* Top Level Nav Items */}
            <div className="border-b border-[#e6e9f0]">
              <div 
                className="flex items-center justify-between px-6 py-5 cursor-pointer hover:bg-gray-50"
                onClick={() => setProductsOpen(!productsOpen)}
              >
                <span className="text-[18px] font-medium text-[#111111]">Products</span>
                <ChevronDown className={`w-5 h-5 text-[#111111] transition-transform ${productsOpen ? "rotate-180" : ""}`} />
              </div>
              
              {/* Nested Products Accordion */}
              {productsOpen && (
                <div className="bg-[#f8f9fa] px-6 py-4 space-y-6 shadow-inner">
                  
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-wider text-[#7d7d7d] mb-4">Software Suites</p>
                    <div className="space-y-4">
                      {mobileProductLinks.map((product) => {
                        const Icon = product.icon;
                        return (
                          <Link prefetch={false} key={product.href} href={product.href} onClick={() => setMobileMenuOpen(false)} className="flex items-start gap-4">
                            <div className="text-[#226eb4] mt-0.5"><Icon className="w-6 h-6" strokeWidth={1.5} /></div>
                            <div>
                              <div className="text-[16px] font-medium text-[#111111]">{product.label}</div>
                              <div className="text-[13px] text-[#555]">{product.description}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  <Link prefetch={false} href="/pricing" onClick={() => setMobileMenuOpen(false)} className="block w-full py-3 text-center border border-[#0066cc] text-[#0066cc] rounded text-[14px] font-bold uppercase tracking-wider">
                    Explore All Products
                  </Link>

                </div>
              )}
            </div>

            {mobileMenuLinks.map((item, index) => (
              <Link key={`${item.href}-${index}`} prefetch={false} href={item.href} onClick={() => setMobileMenuOpen(false)} className="block border-b border-[#e6e9f0] px-6 py-5 text-[18px] font-medium text-[#111111] hover:bg-gray-50">
                {item.label}
              </Link>
            ))}

            <Link prefetch={false} href="/login" onClick={() => setMobileMenuOpen(false)} className="block border-b border-[#e6e9f0] px-6 py-5 text-[18px] font-medium text-[#e42525] hover:bg-red-50">
              Sign In
            </Link>

            {/* Bottom Sticky CTA */}
            <div className="mt-auto p-6 bg-white border-t border-[#e6e9f0]">
              <Link prefetch={false}
                href={requestDemoHref}
                onClick={() => setMobileMenuOpen(false)}
                className="zw-cta-main w-full text-center block !py-3 !text-[15px] shadow-lg shadow-red-500/20"
              >
                Request a Demo
              </Link>
            </div>
            
          </div>
        </div>
      )}
    </header>
  );
}

// ----------------------------------------------------------------------
// Stateful Interactive Mega Menu Content (Zoho Tabbed UI Pattern)
// ----------------------------------------------------------------------
function MegaMenuContent({ setProductsOpen, dynamicProducts, dynamicSuites, dynamicMarketplace }: { setProductsOpen: (v: boolean) => void, dynamicProducts?: any[], dynamicSuites?: any[], dynamicMarketplace?: any[] }) {
  const [activeCategory, setActiveCategory] = useState("Recent Launches");
  const [activeTab, setActiveTab] = useState("Apps"); // Tabs: "Apps" | "Suites"

  // Fallback static data if no dynamic products exist
  const staticMegaMenuData: Record<string, { title: string, cards: any[] }> = {
    "Recent Launches": {
      title: "Recent Launches",
      cards: [
        { href: "/erp", icon: Layers, color: "text-[#9333ea]", bg: "bg-[#f3e8ff]", label: "Waves ERP", desc: "Unified cloud ERP with core financials and supply chain management." },
        { href: "/school-erp", icon: GraduationCap, color: "text-[#0284c7]", bg: "bg-[#e0f2fe]", label: "Waves School Suite", desc: "AI-powered academic LMS for modern teaching, grading, and learning." },
        { href: "/hospital-erp", icon: Hospital, color: "text-[#16a34a]", bg: "bg-[#dcfce7]", label: "Waves Health Suite", desc: "Manage OPD queues, digital prescriptions, and IPD bed allocations." },
      ]
    },
    "Sales": {
      title: "Sales",
      cards: [
        { href: "/products/crm", icon: Store, color: "text-[#0284c7]", bg: "bg-[#e0f2fe]", label: "Waves CRM", desc: "Comprehensive omnichannel sales and pipeline management." },
      ]
    },
  };

  // Define the exact category order matching Zoho
  const categoryOrder = [
    "Sales",
    "Marketing",
    "Commerce and POS",
    "Service",
    "Finance",
    "Education",
    "ERP",
    "Email, Storage, and Collaboration",
    "Human Resources",
    "Legal",
    "Security and IT Management",
    "BI and Analytics",
    "Project Management",
    "Developer Platforms",
    "IoT"
  ];

  // Construct dynamic megaMenuData
  const megaMenuData: Record<string, { title: string, cards: any[] }> = {};
  
  if (dynamicProducts && dynamicProducts.length > 0) {
    const productCategories = [...new Set([
      ...categoryOrder.filter((category) => dynamicProducts.some((product) => product.category === category)),
      ...dynamicProducts
        .map((product) => product.category)
        .filter((category): category is string => typeof category === "string" && category.trim().length > 0),
    ])];
    productCategories.forEach(cat => {
      megaMenuData[cat] = { title: cat, cards: [] };
    });

    dynamicProducts.forEach(prod => {
      const cat = prod.category;
      if (megaMenuData[cat]) {
        megaMenuData[cat].cards.push({
          href: getProductHref(prod.slug) || "/pricing",
          icon: Layers, // Fallback icon
          color: "text-[#0284c7]",
          bg: "bg-[#e0f2fe]",
          label: prod.title,
          desc: prod.subtitle || "No description provided."
        });
      }
    });

    productCategories.forEach(cat => {
      if (megaMenuData[cat].cards.length === 0) {
        delete megaMenuData[cat];
      }
    });
  } else {
    Object.assign(megaMenuData, staticMegaMenuData);
  }

  // Ensure activeCategory defaults safely if it doesn't exist in the new dynamic data
  const availableCategories = Object.keys(megaMenuData);
  if (!availableCategories.includes(activeCategory) && availableCategories.length > 0) {
    setActiveCategory(availableCategories[0]);
  }

  const currentData = megaMenuData[activeCategory] || megaMenuData[availableCategories[0]] || { title: "", cards: [] };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
      {/* Top Tabs (Zoho Style Minimal) */}
      <div className="w-full bg-white border-b border-[#e6e9f0]">
        <div className="w-full px-6 lg:px-10 flex items-center h-[50px] gap-8 text-[15px] font-medium text-[#222]">
          <div 
            className={`h-full flex items-center cursor-pointer transition-colors ${activeTab === "Apps" ? "border-b-[3px] border-[#0066cc] text-[#0066cc] mb-[-3px]" : "hover:text-[#0066cc]"}`}
            onClick={() => setActiveTab("Apps")}
          >
            Apps
          </div>
          <div 
            className={`h-full flex items-center cursor-pointer transition-colors ${activeTab === "Suites" ? "border-b-[3px] border-[#0066cc] text-[#0066cc] mb-[-3px]" : "hover:text-[#0066cc]"}`}
            onClick={() => setActiveTab("Suites")}
          >
            Suites
          </div>
          <div 
            className={`h-full flex items-center cursor-pointer transition-colors ${activeTab === "Marketplace" ? "border-b-[3px] border-[#0066cc] text-[#0066cc] mb-[-3px]" : "hover:text-[#0066cc]"}`}
            onClick={() => setActiveTab("Marketplace")}
          >
            Marketplace
          </div>
          <div 
            className={`h-full flex items-center cursor-pointer transition-colors gap-1.5 ${
              activeTab === "AI" 
                ? "border-b-[3px] border-[#9333ea] text-[#9333ea] mb-[-3px]" 
                : "text-[#9333ea] hover:text-[#7e22ce]"
            }`}
            onClick={() => setActiveTab("AI")}
          >
            <Sparkles className="w-4 h-4" /> AI
          </div>
          
          <div className="ml-auto flex items-center gap-4">
            <Link prefetch={false} href="/pricing" onClick={() => setProductsOpen(false)} className="text-[#0066cc] text-[12px] font-bold tracking-wider hover:underline uppercase">
              EXPLORE ALL PRODUCTS
            </Link>
            <div className="w-[1px] h-4 bg-[#ccc]"></div>
            <div className="cursor-pointer text-[#888] hover:text-[#111]" onClick={(e) => { e.stopPropagation(); setProductsOpen(false); }}>
              <X className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {activeTab === "Apps" && (
        <div className="w-full flex h-[calc(100%-50px)] bg-white px-6 lg:px-10">
          
          {/* Left Sidebar (Categories) - Zoho Style */}
          <div className="w-[240px] shrink-0 py-6 bg-white flex flex-col h-full border-r border-[#e6e9f0] pr-4">
            {/* Zoho Style Search */}
            <div className="mb-6">
              <div className="relative border border-[#e6e9f0] rounded-[4px] bg-white flex items-center focus-within:border-[#0066cc] transition-colors">
                <Search className="absolute left-3 w-[15px] h-[15px] text-[#888]" strokeWidth={2} />
                <input 
                  type="text" 
                  placeholder="I'm looking for..." 
                  className="w-full pl-9 pr-3 py-2.5 text-[15px] text-[#111] bg-transparent focus:outline-none placeholder:text-[#777]" 
                />
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1 custom-scrollbar space-y-0 pb-4 pr-1">
              {Object.keys(megaMenuData).map((category) => (
                <div 
                  key={category}
                  onMouseEnter={() => setActiveCategory(category)}
                  className={`py-3 px-4 text-[15px] cursor-pointer transition-all border-l-[3px] ${
                    activeCategory === category 
                      ? "text-[#0066cc] font-semibold bg-[#f0f6ff] border-[#0066cc]" 
                      : "text-[#222] hover:text-[#0066cc] border-transparent"
                  }`}
                >
                  {category}
                </div>
              ))}
            </div>

            <div className="mt-auto pt-4">
              <Link prefetch={false} href="/pricing" onClick={() => setProductsOpen(false)} className="block w-full bg-[#0066cc] hover:bg-[#005bb5] text-white text-center py-2.5 rounded-[4px] text-[13px] font-bold transition-colors">
                EXPLORE ALL PRODUCTS <ChevronRight className="inline-block w-3.5 h-3.5 mb-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Content Area (4-Column Grid) - Zoho Style */}
          <div className="flex-1 py-6 pl-10 overflow-y-auto bg-white custom-scrollbar">
            <h2 className="text-[26px] font-normal text-[#111] mb-8">{activeCategory}</h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {currentData.cards.map((card, idx) => (
                <Link prefetch={false} 
                  key={idx} 
                  href={card.href} 
                  onClick={() => setProductsOpen(false)} 
                  className="group border border-[#e6e9f0] rounded-[6px] p-5 hover:border-[#0066cc] hover:shadow-[0_4px_12px_rgba(0,102,204,0.1)] transition-all bg-white flex flex-col h-[190px]"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-md bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                      <card.icon className={`w-5 h-5 ${card.color}`} strokeWidth={2} />
                    </div>
                    <h4 className="font-semibold text-[#111] text-[16px] leading-tight">
                      Waves {card.label.replace("Waves ", "")}
                    </h4>
                  </div>
                  
                  <p className="text-[14px] text-[#444] leading-[1.6] line-clamp-3">
                    {card.desc}
                  </p>
                  
                  <div className="mt-auto pt-4">
                    <span className="text-[#0066cc] text-[13px] font-bold uppercase flex items-center gap-1 group-hover:gap-2 transition-all">
                      VIEW DETAILS <ChevronRight className="w-4 h-4" strokeWidth={3} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      )}

      {activeTab === "Suites" && (
        <div className="w-full h-[calc(100%-46px)] bg-[#f9fafb] py-10 px-6 lg:px-10 overflow-y-auto custom-scrollbar flex gap-12">
          {/* Suites Dedicated Layout (Zoho Categorized Style) */}
          
          {/* Left Column: Enterprise Suites */}
          <div className="w-[350px] shrink-0">
            <h3 className="text-[13px] font-bold text-[#888] uppercase tracking-wider mb-5">Enterprise Suites</h3>
            
            <Link prefetch={false} 
              href="/erp"
              onClick={() => setProductsOpen(false)}
              className="bg-white p-7 rounded-2xl border border-[#e5e7eb] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-[#3b82f6] transition-all group flex flex-col items-start gap-4"
            >
              <div className="w-14 h-14 rounded-xl bg-[#eff6ff] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Layers className="w-7 h-7 text-[#2563eb]" />
              </div>
              <div>
                <h4 className="font-bold text-[#111] text-[20px] mb-2 group-hover:text-[#2563eb] transition-colors">Waves One</h4>
                <p className="text-[14px] text-[#555] leading-relaxed">
                  The Operating System for Business. A comprehensive suite of 40+ integrated applications to run your entire organization.
                </p>
              </div>
              <span className="text-[#2563eb] text-[13.5px] font-bold flex items-center gap-1 mt-2 group-hover:gap-2 transition-all">
                Explore Waves One <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

          {/* Right Column: Departmental Suites */}
          <div className="flex-1 border-l border-[#e5e7eb] pl-12">
            <h3 className="text-[13px] font-bold text-[#888] uppercase tracking-wider mb-5">Departmental Suites</h3>
            
            <div className="grid grid-cols-2 gap-6">
              {dynamicSuites && dynamicSuites.length > 0 ? dynamicSuites.map((suite, idx) => (
                <Link prefetch={false} 
                  key={idx}
                  href={`/suites/${suite.slug}`}
                  onClick={() => setProductsOpen(false)}
                  className="bg-white p-5 rounded-2xl border border-[#e5e7eb] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-transparent transition-all group flex items-start gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Layers className={`w-6 h-6 ${suite.color || 'text-[#8b5cf6]'}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111] text-[16px] mb-1 group-hover:text-[#2563eb] transition-colors">{suite.title}</h4>
                    <p className="text-[13px] text-[#555] leading-relaxed line-clamp-2">{suite.subtitle}</p>
                  </div>
                </Link>
              )) : (
                <div className="col-span-2 text-sm text-gray-500">No suites found.</div>
              )}
            </div>
          </div>

        </div>
      )}

      {activeTab === "Marketplace" && (
        <div className="w-full h-[calc(100%-46px)] bg-[#f9fafb] py-12 px-6 lg:px-10 overflow-y-auto custom-scrollbar flex flex-col justify-center">
          {/* Marketplace Dedicated Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full">
            {dynamicMarketplace && dynamicMarketplace.length > 0 ? dynamicMarketplace.map((item, idx) => (
              <Link prefetch={false} 
                key={idx}
                href={`/marketplace/${item.slug}`}
                onClick={() => setProductsOpen(false)}
                className="bg-white p-8 rounded-2xl border border-[#e5e7eb] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:border-[#3b82f6] transition-all group flex flex-col items-start text-left"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#eff6ff] flex items-center justify-center shrink-0 group-hover:-translate-y-1 transition-transform duration-300 mb-6">
                  <Layers className={`w-7 h-7 ${item.color || 'text-[#2563eb]'}`} />
                </div>
                <h4 className="font-bold text-[#111] text-[18px] mb-3 group-hover:text-[#2563eb] transition-colors">{item.title}</h4>
                <p className="text-[14px] text-[#555] leading-relaxed mb-6 flex-1 line-clamp-3">
                  {item.subtitle}
                </p>
                <span className="text-[#2563eb] text-[13.5px] font-bold flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                  Explore <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            )) : (
              <div className="col-span-3 text-center text-gray-500">No marketplace items found.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === "AI" && (
        <div className="w-full h-[calc(100%-46px)] bg-[#f9fafb] py-12 px-6 lg:px-10 overflow-y-auto custom-scrollbar flex items-center justify-center">
          {/* AI Dedicated Layout */}
          <Link prefetch={false} 
            href="/services"
            onClick={() => setProductsOpen(false)}
            className="w-full max-w-5xl mx-auto bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 rounded-3xl p-12 relative overflow-hidden group shadow-[0_20px_50px_rgba(88,28,135,0.25)] flex items-center gap-10 border border-purple-700/50 hover:border-purple-500 transition-colors"
          >
            {/* Background glowing effects */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-purple-500 rounded-full blur-[100px] opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-500 rounded-full blur-[100px] opacity-30 group-hover:opacity-50 transition-opacity"></div>
            
            {/* Content */}
            <div className="relative z-10 flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-purple-100 text-[12px] font-bold uppercase tracking-wider mb-6 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" /> Introducing Waves AI
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                Generative AI for your entire business.
              </h3>
              <p className="text-purple-100/80 text-[16px] leading-relaxed mb-8 max-w-2xl">
                Draft emails, analyze sales data, write code, and resolve support tickets automatically. Waves AI works natively across all 40+ enterprise apps to help you work smarter.
              </p>
              
              <div className="flex items-center gap-4">
                <span className="bg-white text-purple-900 px-6 py-3 rounded-lg font-bold text-[14px] hover:bg-purple-50 transition-colors shadow-lg">
                  Meet the AI Assistant
                </span>
                <span className="text-white text-[14px] font-semibold flex items-center gap-2 hover:gap-3 transition-all opacity-80 hover:opacity-100">
                  Read the announcement <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Right side abstract graphic */}
            <div className="hidden lg:flex relative z-10 w-48 h-48 shrink-0 items-center justify-center bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md group-hover:scale-105 transition-transform duration-500">
              <Cpu className="w-20 h-20 text-purple-200 opacity-80" strokeWidth={1} />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
