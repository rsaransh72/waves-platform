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

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

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
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e6e9f0] shadow-sm">
      <div className="w-full flex justify-between items-center h-[64px] px-6 lg:px-10">
          
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-8 xl:gap-10">
            
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="grid grid-cols-2 gap-0.5 w-6 h-6 shrink-0">
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#e42525] group-hover:scale-110 transition-transform" />
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#226eb4] group-hover:scale-110 transition-transform" />
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#10b981] group-hover:scale-110 transition-transform" />
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#f59e0b] group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-xl font-bold tracking-tight text-black leading-none">
                WAVES
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-7 text-[15px] font-medium text-[#111111]">
              
              {/* Products Dropdown */}
              <div 
                className="relative py-5 cursor-pointer"
                onMouseEnter={() => { setProductsOpen(true); setServicesOpen(false); }}
                onMouseLeave={() => setProductsOpen(false)}
              >
                <div className="flex items-center gap-1 hover:text-black transition-colors">
                  <span>Products</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${productsOpen ? "rotate-180 text-[#226eb4]" : "text-[#7d7d7d]"}`} />
                </div>

                {/* Products Dropdown - Zoho Full Screen Mega Menu */}
                {productsOpen && (
                  <div className="fixed left-0 w-full bg-white border-b border-[#e6e9f0] shadow-xl z-40 cursor-default" style={{ top: "64px", height: "550px" }}>
                    <MegaMenuContent setProductsOpen={setProductsOpen} />
                  </div>
                )}
              </div>

              <Link href="/erp" className="hover:text-black transition-colors font-medium">ERP</Link>
              <Link href="/pricing" className="hover:text-black transition-colors">Pricing</Link>
              <Link href="/services" className="hover:text-black transition-colors">Services</Link>
              <Link href="/contact" className="hover:text-black transition-colors">Contact</Link>
            </nav>
          </div>

          {/* Right: Auth Buttons */}
          <div className="hidden lg:flex items-center gap-5">
            <Link 
              href="/login" 
              className="text-[14px] font-medium text-[#e42525] hover:underline transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="zw-cta-outlined text-[13px] !py-1.5 !px-4"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Controls */}
          <div className="lg:hidden flex items-center gap-3">
            <Link href="/signup" className="zw-cta-outlined !py-1 !px-3 text-xs">
              Sign Up
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
                      <Link href="/school-erp" onClick={() => setMobileMenuOpen(false)} className="flex items-start gap-4">
                        <div className="text-[#0066cc] mt-0.5"><GraduationCap className="w-6 h-6" strokeWidth={1.5}/></div>
                        <div>
                          <div className="text-[16px] font-medium text-[#111111]">School Suite</div>
                          <div className="text-[13px] text-[#555]">Academic LMS & Attendance</div>
                        </div>
                      </Link>
                      
                      <Link href="/hospital-erp" onClick={() => setMobileMenuOpen(false)} className="flex items-start gap-4">
                        <div className="text-[#008f52] mt-0.5"><Hospital className="w-6 h-6" strokeWidth={1.5}/></div>
                        <div>
                          <div className="text-[16px] font-medium text-[#111111]">Health Suite</div>
                          <div className="text-[13px] text-[#555]">OPD Queues & Digital Rx</div>
                        </div>
                      </Link>

                      <Link href="/pharmacy-pos" onClick={() => setMobileMenuOpen(false)} className="flex items-start gap-4">
                        <div className="text-[#d88900] mt-0.5"><Store className="w-6 h-6" strokeWidth={1.5}/></div>
                        <div>
                          <div className="text-[16px] font-medium text-[#111111]">Pharmacy POS</div>
                          <div className="text-[13px] text-[#555]">Barcode Billing & Expiry</div>
                        </div>
                      </Link>

                      <Link href="/erp" onClick={() => setMobileMenuOpen(false)} className="flex items-start gap-4">
                        <div className="text-[#8445e8] mt-0.5"><Layers className="w-6 h-6" strokeWidth={1.5}/></div>
                        <div>
                          <div className="text-[16px] font-medium text-[#111111]">Waves ERP</div>
                          <div className="text-[13px] text-[#555]">Ledger & Supply Chain</div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="block w-full py-3 text-center border border-[#0066cc] text-[#0066cc] rounded text-[14px] font-bold uppercase tracking-wider">
                    Explore All Products
                  </Link>

                </div>
              )}
            </div>

            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="block border-b border-[#e6e9f0] px-6 py-5 text-[18px] font-medium text-[#111111] hover:bg-gray-50">
              Pricing
            </Link>
            
            <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="block border-b border-[#e6e9f0] px-6 py-5 text-[18px] font-medium text-[#111111] hover:bg-gray-50">
              Services
            </Link>

            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block border-b border-[#e6e9f0] px-6 py-5 text-[18px] font-medium text-[#111111] hover:bg-gray-50">
              Contact & Demo
            </Link>

            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block border-b border-[#e6e9f0] px-6 py-5 text-[18px] font-medium text-[#e42525] hover:bg-red-50">
              Sign In
            </Link>

            {/* Bottom Sticky CTA */}
            <div className="mt-auto p-6 bg-white border-t border-[#e6e9f0]">
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="zw-cta-main w-full text-center block !py-3 !text-[15px] shadow-lg shadow-red-500/20"
              >
                Get Started For Free
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
function MegaMenuContent({ setProductsOpen }: { setProductsOpen: (v: boolean) => void }) {
  const [activeCategory, setActiveCategory] = useState("Recent Launches");
  const [activeTab, setActiveTab] = useState("Apps"); // Tabs: "Apps" | "Suites"

  const suitesData = [
    { href: "/erp", icon: Layers, color: "text-[#0ea5e9]", label: "Waves One", desc: "The Operating System for Business. 40+ integrated applications." },
    { href: "/erp", icon: Store, color: "text-[#8b5cf6]", label: "CRM Plus", desc: "Unified customer experience platform." },
    { href: "/erp", icon: Layers, color: "text-[#eab308]", label: "Finance Plus", desc: "Unified finance platform for growing businesses." },
    { href: "/erp", icon: Users, color: "text-[#f43f5e]", label: "People Plus", desc: "Unified HR platform to manage the employee journey." },
    { href: "/erp", icon: Globe, color: "text-[#10b981]", label: "Marketing Plus", desc: "Unified marketing platform for your entire team." },
    { href: "/erp", icon: Cpu, color: "text-[#64748b]", label: "IT Management", desc: "Unified IT Operations and Service Management." },
  ];

  // Define dynamic content based on hovered category
  const megaMenuData: Record<string, { title: string, cards: any[] }> = {
    "Recent Launches": {
      title: "Recent Launches",
      cards: [
        { href: "/erp", icon: Layers, color: "text-[#9333ea]", bg: "bg-[#f3e8ff]", label: "Waves ERP", desc: "Unified cloud ERP with core financials and supply chain management." },
        { href: "/school-erp", icon: GraduationCap, color: "text-[#0284c7]", bg: "bg-[#e0f2fe]", label: "Waves School Suite", desc: "AI-powered academic LMS for modern teaching, grading, and learning." },
        { href: "/hospital-erp", icon: Hospital, color: "text-[#16a34a]", bg: "bg-[#dcfce7]", label: "Waves Health Suite", desc: "Manage OPD queues, digital prescriptions, and IPD bed allocations." },
        { href: "/pharmacy-pos", icon: Store, color: "text-[#ca8a04]", bg: "bg-[#fef9c3]", label: "Waves Pharmacy POS", desc: "High-speed barcode billing with automatic batch expiry alerts." },
        { href: "/apps/agents", icon: Sparkles, color: "text-[#2563eb]", bg: "bg-[#eff6ff]", label: "Waves AI Agents", desc: "Autonomous AI agents that execute tasks across every department." },
        { href: "/services", icon: Users, color: "text-[#dc2626]", bg: "bg-[#fee2e2]", label: "Waves Services", desc: "Expert onboarding, cloud migration, and ERP implementation." },
      ]
    },
    "Sales": {
      title: "Sales",
      cards: [
        { href: "/apps/crm", icon: Store, color: "text-[#0284c7]", bg: "bg-[#e0f2fe]", label: "Waves CRM", desc: "Comprehensive omnichannel sales and pipeline management." },
        { href: "/apps/bigin", icon: Users, color: "text-[#16a34a]", bg: "bg-[#dcfce7]", label: "Waves Bigin", desc: "Pipeline-centric CRM for small and growing businesses." },
        { href: "/apps/bookings", icon: Sparkles, color: "text-[#9333ea]", bg: "bg-[#f3e8ff]", label: "Waves Bookings", desc: "Smart scheduling and appointment booking software." },
        { href: "/apps/contactmanager", icon: Users, color: "text-[#2563eb]", bg: "bg-[#eff6ff]", label: "Waves ContactManager", desc: "Simple contact management for micro-businesses." }
      ]
    },
    "Marketing": {
      title: "Marketing",
      cards: [
        { href: "/apps/campaigns", icon: Sparkles, color: "text-[#ca8a04]", bg: "bg-[#fef9c3]", label: "Waves Campaigns", desc: "Drive email marketing automation with AI-powered analytics." },
        { href: "/apps/social", icon: Users, color: "text-[#dc2626]", bg: "bg-[#fee2e2]", label: "Waves Social", desc: "Schedule and manage your social media presence across platforms." },
        { href: "/apps/marketingplus", icon: Sparkles, color: "text-[#e42525]", bg: "bg-[#fee2e2]", label: "Waves Marketing Plus", desc: "Unified marketing platform for your entire team." },
        { href: "/apps/sites", icon: Globe, color: "text-[#16a34a]", bg: "bg-[#dcfce7]", label: "Waves Sites", desc: "Website builder to create beautiful sites without code." },
        { href: "/apps/pagesense", icon: Sparkles, color: "text-[#2563eb]", bg: "bg-[#eff6ff]", label: "Waves PageSense", desc: "Website optimization and personalization platform." },
        { href: "/apps/backstage", icon: Users, color: "text-[#ca8a04]", bg: "bg-[#fef9c3]", label: "Waves Backstage", desc: "End-to-end event management software." },
      ]
    },
    "Commerce and POS": {
      title: "Commerce and POS",
      cards: [
        { href: "/apps/commerce", icon: Store, color: "text-[#0284c7]", bg: "bg-[#e0f2fe]", label: "Waves Commerce", desc: "Build an online store and accept orders effortlessly." },
        { href: "/pharmacy-pos", icon: Store, color: "text-[#9333ea]", bg: "bg-[#f3e8ff]", label: "Waves Pharmacy POS", desc: "High-speed barcode billing with automatic batch expiry alerts." },
        { href: "/apps/inventory", icon: Layers, color: "text-[#2563eb]", bg: "bg-[#eff6ff]", label: "Waves Inventory", desc: "Multi-channel inventory management and order fulfillment." }
      ]
    },
    "Service": {
      title: "Service",
      cards: [
        { href: "/apps/desk", icon: Headphones, color: "text-[#0284c7]", bg: "bg-[#e0f2fe]", label: "Waves Desk", desc: "Omnichannel customer service helpdesk and ticketing system." },
        { href: "/apps/assist", icon: Headphones, color: "text-[#16a34a]", bg: "bg-[#dcfce7]", label: "Waves Assist", desc: "Remote IT support and remote access software." },
        { href: "/apps/salesiq", icon: Sparkles, color: "text-[#2563eb]", bg: "bg-[#eff6ff]", label: "Waves SalesIQ", desc: "Live chat and customer tracking for your website." },
        { href: "/apps/lens", icon: Sparkles, color: "text-[#9333ea]", bg: "bg-[#f3e8ff]", label: "Waves Lens", desc: "Interactive remote assistance with augmented reality." }
      ]
    },
    "Finance": {
      title: "Finance",
      cards: [
        { href: "/apps/books", icon: Layers, color: "text-[#ca8a04]", bg: "bg-[#fef9c3]", label: "Waves Books", desc: "GST-compliant online accounting for growing businesses." },
        { href: "/apps/invoice", icon: Layers, color: "text-[#dc2626]", bg: "bg-[#fee2e2]", label: "Waves Invoice", desc: "Fast and easy invoicing, estimations, and payment gateways." },
        { href: "/apps/expense", icon: Layers, color: "text-[#0284c7]", bg: "bg-[#e0f2fe]", label: "Waves Expense", desc: "Automate expense reporting and streamline approvals." },
        { href: "/apps/subscriptions", icon: Layers, color: "text-[#16a34a]", bg: "bg-[#dcfce7]", label: "Waves Subscriptions", desc: "Manage recurring billing and subscriptions easily." },
        { href: "/apps/checkout", icon: Layers, color: "text-[#9333ea]", bg: "bg-[#f3e8ff]", label: "Waves Checkout", desc: "Create custom payment pages and collect payments securely." },
        { href: "/apps/payroll", icon: Users, color: "text-[#2563eb]", bg: "bg-[#eff6ff]", label: "Waves Payroll", desc: "Automated payroll processing with statutory compliance." }
      ]
    },
    "Human Resources": {
      title: "Human Resources",
      cards: [
        { href: "/apps/people", icon: Users, color: "text-[#ca8a04]", bg: "bg-[#fef9c3]", label: "Waves People", desc: "Core HR, attendance, payroll, and performance management." },
        { href: "/apps/recruit", icon: Users, color: "text-[#dc2626]", bg: "bg-[#fee2e2]", label: "Waves Recruit", desc: "Applicant tracking system (ATS) for modern hiring teams." },
        { href: "/apps/workerly", icon: Users, color: "text-[#0284c7]", bg: "bg-[#e0f2fe]", label: "Waves Workerly", desc: "Temp workforce management and scheduling." },
        { href: "/apps/shifts", icon: Users, color: "text-[#16a34a]", bg: "bg-[#dcfce7]", label: "Waves Shifts", desc: "Employee scheduling and time clock software." }
      ]
    },
    "Security and IT Management": {
      title: "Security and IT Management",
      cards: [
        { href: "/apps/directory", icon: Users, color: "text-[#444444]", bg: "bg-[#f8f9fa]", label: "Waves Directory", desc: "Workforce identity and access management." },
        { href: "/apps/vault", icon: ShieldCheck, color: "text-[#dc2626]", bg: "bg-[#fee2e2]", label: "Waves Vault", desc: "Secure password manager and team access control." }
      ]
    },
    "Developer Platforms": {
      title: "Developer Platforms",
      cards: [
        { href: "/apps/creator", icon: Cpu, color: "text-[#16a34a]", bg: "bg-[#dcfce7]", label: "Waves Creator", desc: "Low-code application development platform for custom ERP modules." },
        { href: "/apps/flow", icon: Layers, color: "text-[#9333ea]", bg: "bg-[#f3e8ff]", label: "Waves Flow", desc: "Integrate your apps and automate complex business workflows." }
      ]
    },
    "BI and Analytics": {
      title: "BI and Analytics",
      cards: [
        { href: "/apps/analytics", icon: Sparkles, color: "text-[#0284c7]", bg: "bg-[#e0f2fe]", label: "Waves Analytics", desc: "Modern BI and reporting platform for deep business insights." }
      ]
    },
    "Email, Storage, and Collaboration": {
      title: "Email, Storage, and Collaboration",
      cards: [
        { href: "/apps/mail", icon: Sparkles, color: "text-[#9333ea]", bg: "bg-[#f3e8ff]", label: "Waves Mail", desc: "Secure, ad-free business email for your organization." },
        { href: "/apps/workdrive", icon: Layers, color: "text-[#2563eb]", bg: "bg-[#eff6ff]", label: "Waves WorkDrive", desc: "Secure document management and team collaboration." },
        { href: "/apps/writer", icon: Layers, color: "text-[#0284c7]", bg: "bg-[#e0f2fe]", label: "Waves Writer", desc: "Powerful word processor for collaborative teams." },
        { href: "/apps/sheet", icon: Layers, color: "text-[#16a34a]", bg: "bg-[#dcfce7]", label: "Waves Sheet", desc: "Collaborative spreadsheet software for data analysis." },
        { href: "/apps/show", icon: Sparkles, color: "text-[#ca8a04]", bg: "bg-[#fef9c3]", label: "Waves Show", desc: "Create beautiful presentations and broadcast them anywhere." },
        { href: "/apps/cliq", icon: Users, color: "text-[#2563eb]", bg: "bg-[#eff6ff]", label: "Waves Cliq", desc: "Team communication and instant messaging software." },
        { href: "/apps/meeting", icon: Users, color: "text-[#0284c7]", bg: "bg-[#e0f2fe]", label: "Waves Meeting", desc: "Secure online meetings and webinar solutions." },
        { href: "/apps/connect", icon: Users, color: "text-[#0284c7]", bg: "bg-[#e0f2fe]", label: "Waves Connect", desc: "Enterprise social network and team intranet." },
        { href: "/apps/sign", icon: Sparkles, color: "text-[#2563eb]", bg: "bg-[#eff6ff]", label: "Waves Sign", desc: "Secure digital signature software for business." }
      ]
    },
    "Project Management": {
      title: "Project Management",
      cards: [
        { href: "/apps/projects", icon: Layers, color: "text-[#dc2626]", bg: "bg-[#fee2e2]", label: "Waves Projects", desc: "Comprehensive project management and tracking." },
        { href: "/apps/sprints", icon: Layers, color: "text-[#9333ea]", bg: "bg-[#f3e8ff]", label: "Waves Sprints", desc: "Agile project management for software development teams." }
      ]
    },
    "Education": {
      title: "Education",
      cards: [
        { href: "/school-erp", icon: GraduationCap, color: "text-[#9333ea]", bg: "bg-[#f3e8ff]", label: "Waves School Suite", desc: "AI-powered academic LMS for modern teaching, grading, and learning." },
        { href: "/apps/learn", icon: GraduationCap, color: "text-[#2563eb]", bg: "bg-[#eff6ff]", label: "Waves Learn", desc: "Create, distribute, and monetize online training courses." }
      ]
    },
    "ERP": {
      title: "Enterprise Resource Planning",
      cards: [
        { href: "/erp", icon: Layers, color: "text-[#0284c7]", bg: "bg-[#e0f2fe]", label: "Waves ERP", desc: "Unified cloud ERP with core financials and supply chain management." }
      ]
    },
    "Legal": {
      title: "Legal",
      cards: [
        { href: "/apps/contracts", icon: Layers, color: "text-[#dc2626]", bg: "bg-[#fee2e2]", label: "Waves Contracts", desc: "Comprehensive contract lifecycle management for legal teams." }
      ]
    },
    "IoT": {
      title: "IoT",
      cards: [
        { href: "/apps/iot", icon: Cpu, color: "text-[#2563eb]", bg: "bg-[#eff6ff]", label: "Waves IoT", desc: "Industrial IoT platform for smart devices and fleet tracking." },
        { href: "/apps/facilities", icon: Sparkles, color: "text-[#16a34a]", bg: "bg-[#dcfce7]", label: "Waves Facilities", desc: "Smart building and facilities management using IoT sensors." }
      ]
    }
  };

  const currentData = megaMenuData[activeCategory] || megaMenuData["Recent Launches"];

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
      {/* Top Tabs (Zoho Style Minimal) */}
      <div className="w-full bg-[#f8f9fa] border-b border-[#e6e9f0]">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center h-[46px] gap-8 text-[14px] font-medium text-[#444]">
          <div 
            className={`h-full flex items-center cursor-pointer hover:text-black transition-colors ${activeTab === "Apps" ? "border-b-[2.5px] border-[#e42525] text-black font-semibold mb-[-2.5px]" : ""}`}
            onClick={() => setActiveTab("Apps")}
          >
            Apps
          </div>
          <div 
            className={`h-full flex items-center cursor-pointer hover:text-black transition-colors ${activeTab === "Suites" ? "border-b-[2.5px] border-[#e42525] text-black font-semibold mb-[-2.5px]" : ""}`}
            onClick={() => setActiveTab("Suites")}
          >
            Suites
          </div>
          <div 
            className={`h-full flex items-center cursor-pointer hover:text-black transition-colors ${activeTab === "Marketplace" ? "border-b-[2.5px] border-[#e42525] text-black font-semibold mb-[-2.5px]" : ""}`}
            onClick={() => setActiveTab("Marketplace")}
          >
            Marketplace
          </div>
          <div 
            className={`h-full flex items-center cursor-pointer hover:text-black transition-colors gap-1.5 ${
              activeTab === "AI" 
                ? "border-b-[2.5px] border-[#e42525] text-purple-700 font-semibold mb-[-2.5px]" 
                : "text-purple-700"
            }`}
            onClick={() => setActiveTab("AI")}
          >
            <Sparkles className="w-4 h-4" /> AI
          </div>
          
          <div className="ml-auto flex items-center gap-4">
            <Link href="/pricing" onClick={() => setProductsOpen(false)} className="text-[#0066cc] text-[12px] font-bold tracking-wider hover:underline uppercase">
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
        <div className="w-full max-w-[1400px] mx-auto flex h-[calc(100%-46px)] bg-white px-6 lg:px-10">
          
          {/* Left Sidebar (Categories) - Zoho Style */}
          <div className="w-[280px] shrink-0 py-6 bg-white flex flex-col h-full border-r border-[#e6e9f0]">
            {/* Zoho Style Search */}
            <div className="px-5 mb-6">
              <div className="relative">
                <Search className="absolute left-0 top-1.5 w-[18px] h-[18px] text-[#555]" strokeWidth={2} />
                <input 
                  type="text" 
                  placeholder="I'm looking for..." 
                  className="w-full pl-8 pr-3 py-1 text-[14px] text-[#111] bg-transparent border-b border-[#ccc] focus:border-[#0066cc] focus:outline-none transition-colors placeholder:text-[#888]" 
                />
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1 custom-scrollbar space-y-0 pb-4">
              {Object.keys(megaMenuData).map((category) => (
                <div 
                  key={category}
                  onMouseEnter={() => setActiveCategory(category)}
                  className={`px-5 py-3 text-[14px] cursor-pointer transition-all ${
                    activeCategory === category 
                      ? "text-[#0066cc] bg-[#f8f9fa] border-l-[3px] border-[#0066cc]" 
                      : "text-[#444] border-l-[3px] border-transparent hover:text-[#111] hover:bg-[#f8f9fa]"
                  }`}
                >
                  {category}
                </div>
              ))}
            </div>

            <div className="px-5 mt-auto pt-4">
              <Link href="/pricing" onClick={() => setProductsOpen(false)} className="block w-full bg-[#0066cc] hover:bg-[#005bb5] text-white text-center py-2.5 rounded-[4px] text-[13px] font-bold transition-colors">
                EXPLORE ALL PRODUCTS <ChevronRight className="inline-block w-3.5 h-3.5 mb-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Content Area (4-Column Grid) - Zoho Style */}
          <div className="flex-1 p-8 overflow-y-auto bg-white custom-scrollbar">
            <h2 className="text-[22px] text-[#111] mb-6">{activeCategory}</h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentData.cards.map((card, idx) => (
                <Link 
                  key={idx} 
                  href={card.href} 
                  onClick={() => setProductsOpen(false)} 
                  className="group border border-[#e6e9f0] rounded-[6px] p-5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all bg-white flex flex-col h-[185px]"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <card.icon className={`w-5 h-5 ${card.color}`} strokeWidth={2} />
                    <h4 className="font-semibold text-[#111] text-[15px]">
                      Waves {card.label.replace("Waves ", "")}
                    </h4>
                  </div>
                  
                  <p className="text-[13px] text-[#666] leading-[1.6] line-clamp-3">
                    {card.desc}
                  </p>
                  
                  <div className="mt-auto pt-4">
                    <span className="text-[#0066cc] text-[12px] font-bold tracking-wide uppercase flex items-center gap-1 group-hover:gap-2 transition-all">
                      TRY NOW <ChevronRight className="w-3.5 h-3.5" strokeWidth={3} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      )}

      {activeTab === "Suites" && (
        <div className="w-full max-w-[1400px] mx-auto h-[calc(100%-46px)] bg-[#f9fafb] py-10 px-6 lg:px-10 overflow-y-auto custom-scrollbar flex gap-12">
          {/* Suites Dedicated Layout (Zoho Categorized Style) */}
          
          {/* Left Column: Enterprise Suites */}
          <div className="w-[350px] shrink-0">
            <h3 className="text-[13px] font-bold text-[#888] uppercase tracking-wider mb-5">Enterprise Suites</h3>
            
            <Link 
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
              {[
                { href: "/erp", icon: Store, color: "text-[#8b5cf6]", label: "CRM Plus", desc: "Unified customer experience platform." },
                { href: "/erp", icon: Layers, color: "text-[#eab308]", label: "Finance Plus", desc: "Unified finance platform for growing businesses." },
                { href: "/erp", icon: Users, color: "text-[#f43f5e]", label: "People Plus", desc: "Unified HR platform to manage the employee journey." },
                { href: "/erp", icon: Globe, color: "text-[#10b981]", label: "Marketing Plus", desc: "Unified marketing platform for your entire team." },
                { href: "/erp", icon: Cpu, color: "text-[#64748b]", label: "IT Management", desc: "Unified IT Operations and Service Management." },
                { href: "/erp", icon: Sparkles, color: "text-[#0ea5e9]", label: "Workplace", desc: "Unified communication and collaboration platform." },
              ].map((suite, idx) => (
                <Link 
                  key={idx}
                  href={suite.href}
                  onClick={() => setProductsOpen(false)}
                  className="bg-white p-5 rounded-2xl border border-[#e5e7eb] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-transparent transition-all group flex items-start gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <suite.icon className={`w-6 h-6 ${suite.color}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111] text-[16px] mb-1 group-hover:text-[#2563eb] transition-colors">{suite.label}</h4>
                    <p className="text-[13px] text-[#555] leading-relaxed">{suite.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      )}

      {activeTab === "Marketplace" && (
        <div className="w-full max-w-[1400px] mx-auto h-[calc(100%-46px)] bg-[#f9fafb] p-12 px-6 lg:px-10 overflow-y-auto custom-scrollbar flex flex-col justify-center">
          {/* Marketplace Dedicated Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full">
            
            <Link 
              href="/services"
              onClick={() => setProductsOpen(false)}
              className="bg-white p-8 rounded-2xl border border-[#e5e7eb] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:border-[#3b82f6] transition-all group flex flex-col items-start text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#eff6ff] flex items-center justify-center shrink-0 group-hover:-translate-y-1 transition-transform duration-300 mb-6">
                <Layers className="w-7 h-7 text-[#2563eb]" />
              </div>
              <h4 className="font-bold text-[#111] text-[18px] mb-3 group-hover:text-[#2563eb] transition-colors">Extensions & Integrations</h4>
              <p className="text-[14px] text-[#555] leading-relaxed mb-6 flex-1">
                Enhance your Waves apps with thousands of ready-to-use third-party tools and direct software integrations.
              </p>
              <span className="text-[#2563eb] text-[13.5px] font-bold flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                Explore Marketplace <ChevronRight className="w-4 h-4" />
              </span>
            </Link>

            <Link 
              href="/services"
              onClick={() => setProductsOpen(false)}
              className="bg-white p-8 rounded-2xl border border-[#e5e7eb] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:border-[#8b5cf6] transition-all group flex flex-col items-start text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#f5f3ff] flex items-center justify-center shrink-0 group-hover:-translate-y-1 transition-transform duration-300 mb-6">
                <Users className="w-7 h-7 text-[#8b5cf6]" />
              </div>
              <h4 className="font-bold text-[#111] text-[18px] mb-3 group-hover:text-[#8b5cf6] transition-colors">Find a Partner</h4>
              <p className="text-[14px] text-[#555] leading-relaxed mb-6 flex-1">
                Connect with certified Waves experts and consultants to help implement, train, and customize your solutions.
              </p>
              <span className="text-[#8b5cf6] text-[13.5px] font-bold flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                Find Experts <ChevronRight className="w-4 h-4" />
              </span>
            </Link>

            <Link 
              href="/services"
              onClick={() => setProductsOpen(false)}
              className="bg-white p-8 rounded-2xl border border-[#e5e7eb] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:border-[#10b981] transition-all group flex flex-col items-start text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#ecfdf5] flex items-center justify-center shrink-0 group-hover:-translate-y-1 transition-transform duration-300 mb-6">
                <Cpu className="w-7 h-7 text-[#10b981]" />
              </div>
              <h4 className="font-bold text-[#111] text-[18px] mb-3 group-hover:text-[#10b981] transition-colors">Developer Hub</h4>
              <p className="text-[14px] text-[#555] leading-relaxed mb-6 flex-1">
                Access powerful APIs, SDKs, and comprehensive documentation to build and monetize your own custom extensions.
              </p>
              <span className="text-[#10b981] text-[13.5px] font-bold flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                Start Building <ChevronRight className="w-4 h-4" />
              </span>
            </Link>

          </div>
        </div>
      )}

      {activeTab === "AI" && (
        <div className="w-full max-w-[1400px] mx-auto h-[calc(100%-46px)] bg-[#f9fafb] p-12 px-6 lg:px-10 overflow-y-auto custom-scrollbar flex items-center justify-center">
          {/* AI Dedicated Layout */}
          <Link 
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
