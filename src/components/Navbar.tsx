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
  ChevronRight
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

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e6e9f0]">
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
                    
                    {/* Top Tabs */}
                    <div className="w-full border-b border-[#e6e9f0]">
                      <div className="w-full px-6 lg:px-10 flex items-center h-[52px] gap-8 text-[15px] font-medium text-[#404040]">
                        <div className="h-full flex items-center border-b-[3px] border-[#e42525] text-[#111111] mb-[-1.5px]">Apps</div>
                        <div className="h-full flex items-center hover:text-[#111111] cursor-pointer">Suites</div>
                        <div className="h-full flex items-center hover:text-[#111111] cursor-pointer">Marketplace</div>
                        <div className="h-full flex items-center hover:text-[#111111] cursor-pointer text-[#7e22ce] gap-1">
                          <Sparkles className="w-4 h-4" /> AI
                        </div>
                        <div className="h-full flex items-center hover:text-[#0a5c9e] cursor-pointer ml-4 text-[#0066cc] uppercase text-[12px] tracking-[0.5px] font-bold">
                          Explore All Products <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        </div>
                        
                        {/* Close Button on right */}
                        <div className="ml-auto cursor-pointer text-[#7d7d7d] hover:text-[#111111]" onClick={(e) => { e.stopPropagation(); setProductsOpen(false); }}>
                          <X className="w-6 h-6" />
                        </div>
                      </div>
                    </div>

                    <div className="w-full px-6 lg:px-10 flex h-[calc(100%-48px)]">
                      
                      {/* Left Sidebar (Categories) */}
                      <div className="w-[260px] shrink-0 border-r border-[#e6e9f0] py-5 pr-5 flex flex-col h-full bg-white">
                        <div className="relative mb-4">
                          <Search className="absolute left-3 top-2.5 w-[18px] h-[18px] text-[#7d7d7d]" />
                          <input 
                            type="text" 
                            placeholder="I'm looking for..." 
                            className="w-full pl-9 pr-3 py-2 text-[14px] border border-[#cccccc] rounded focus:outline-none focus:border-[#0066cc] placeholder:text-[#888888] text-[#111111]" 
                          />
                        </div>
                        
                        <div className="overflow-y-auto flex-1 space-y-[4px] pr-2 custom-scrollbar">
                          <div className="px-3 py-2 rounded text-[14px] text-[#0066cc] bg-[#f0f5ff] flex justify-between items-center cursor-pointer font-semibold border-l-[3px] border-[#0066cc] -ml-[3px]">
                            Recent Launches <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                          <div className="px-3 py-2 rounded text-[14px] text-[#111111] hover:bg-[#f8f9fa] cursor-pointer">Sales</div>
                          <div className="px-3 py-2 rounded text-[14px] text-[#111111] hover:bg-[#f8f9fa] cursor-pointer">Marketing</div>
                          <div className="px-3 py-2 rounded text-[14px] text-[#111111] hover:bg-[#f8f9fa] cursor-pointer">Commerce and POS</div>
                          <div className="px-3 py-2 rounded text-[14px] text-[#111111] hover:bg-[#f8f9fa] cursor-pointer">Service</div>
                          <div className="px-3 py-2 rounded text-[14px] text-[#111111] hover:bg-[#f8f9fa] cursor-pointer">Finance</div>
                          <div className="px-3 py-2 rounded text-[14px] text-[#111111] hover:bg-[#f8f9fa] cursor-pointer">Education</div>
                          <div className="px-3 py-2 rounded text-[14px] text-[#111111] hover:bg-[#f8f9fa] cursor-pointer">ERP</div>
                          <div className="px-3 py-2 rounded text-[14px] text-[#111111] hover:bg-[#f8f9fa] cursor-pointer">Email, Storage, and Collaboration</div>
                          <div className="px-3 py-2 rounded text-[14px] text-[#111111] hover:bg-[#f8f9fa] cursor-pointer">Human Resources</div>
                          <div className="px-3 py-2 rounded text-[14px] text-[#aaaaaa] cursor-not-allowed">Legal</div>
                        </div>
                        
                        <div className="pt-5 mt-auto">
                          <Link href="/pricing" onClick={() => setProductsOpen(false)} className="w-full flex items-center justify-between px-4 py-3 bg-[#0066cc] hover:bg-[#005bb5] text-white text-[13px] font-bold uppercase tracking-wider rounded-[4px]">
                            Explore All Products <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>

                      {/* Main Content Area (App Cards) */}
                      <div className="flex-1 py-8 pl-10 overflow-y-auto bg-white">
                        <h3 className="text-[24px] font-normal text-[#111111] mb-6 tracking-tight">Recent Launches</h3>
                        
                        <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
                          
                          {/* Card 1 */}
                          <Link href="/services" onClick={() => setProductsOpen(false)} className="group border border-[#e6e9f0] rounded-[6px] p-6 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-transparent transition-all bg-white flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-3">
                               <div className="w-10 h-10 rounded-md bg-[#fef9c3] flex items-center justify-center shrink-0">
                                 <Phone className="w-5 h-5 text-[#ca8a04]" />
                               </div>
                               <span className="font-semibold text-[#111111] text-[16px] leading-tight"><span className="text-[#555555] font-normal mr-1">Waves</span>CPaaS</span>
                            </div>
                            <p className="text-[14px] text-[#444444] mb-5 leading-[1.6] flex-1">Reliable, secure, and compliant multi-channel communication platform.</p>
                            <span className="text-[#0066cc] text-[13px] font-bold uppercase flex items-center gap-1 transition-all group-hover:gap-2">Try Now <ChevronRight className="w-3.5 h-3.5" /></span>
                          </Link>

                          {/* Card 2 */}
                          <Link href="/services" onClick={() => setProductsOpen(false)} className="group border border-[#e6e9f0] rounded-[6px] p-6 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-transparent transition-all bg-white flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-3">
                               <div className="w-10 h-10 rounded-md bg-[#eff6ff] flex items-center justify-center shrink-0">
                                 <Phone className="w-5 h-5 text-[#2563eb]" />
                               </div>
                               <span className="font-semibold text-[#111111] text-[16px] leading-tight"><span className="text-[#555555] font-normal mr-1">Waves</span>Voice</span>
                            </div>
                            <p className="text-[14px] text-[#444444] mb-5 leading-[1.6] flex-1">Business phone and contact center, built into the apps your team already uses.</p>
                            <span className="text-[#0066cc] text-[13px] font-bold uppercase flex items-center gap-1 transition-all group-hover:gap-2">Try Now <ChevronRight className="w-3.5 h-3.5" /></span>
                          </Link>

                          {/* Card 3 */}
                          <Link href="/services" onClick={() => setProductsOpen(false)} className="group border border-[#e6e9f0] rounded-[6px] p-6 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-transparent transition-all bg-white flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-3">
                               <div className="w-10 h-10 rounded-md bg-[#fee2e2] flex items-center justify-center shrink-0">
                                 <Users className="w-5 h-5 text-[#dc2626]" />
                               </div>
                               <span className="font-semibold text-[#111111] text-[16px] leading-tight"><span className="text-[#555555] font-normal mr-1">Waves</span>TouchPoint</span>
                            </div>
                            <p className="text-[14px] text-[#444444] mb-5 leading-[1.6] flex-1">Smart networking tool that helps connect easily, track and drive conversions.</p>
                            <span className="text-[#0066cc] text-[13px] font-bold uppercase flex items-center gap-1 transition-all group-hover:gap-2">Try Now <ChevronRight className="w-3.5 h-3.5" /></span>
                          </Link>

                          {/* Card 4 */}
                          <Link href="/services" onClick={() => setProductsOpen(false)} className="group border border-[#e6e9f0] rounded-[6px] p-6 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-transparent transition-all bg-white flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-3">
                               <div className="w-10 h-10 rounded-md bg-[#f3e8ff] flex items-center justify-center shrink-0">
                                 <ShieldCheck className="w-5 h-5 text-[#9333ea]" />
                               </div>
                               <span className="font-semibold text-[#111111] text-[16px] leading-tight"><span className="text-[#555555] font-normal mr-1">Waves</span>Fortify</span>
                            </div>
                            <p className="text-[14px] text-[#444444] mb-5 leading-[1.6] flex-1">Build your first line of defense with secure coding training.</p>
                            <span className="text-[#0066cc] text-[13px] font-bold uppercase flex items-center gap-1 transition-all group-hover:gap-2">Try Now <ChevronRight className="w-3.5 h-3.5" /></span>
                          </Link>

                          {/* Card 5 */}
                          <Link href="/services" onClick={() => setProductsOpen(false)} className="group border border-[#e6e9f0] rounded-[6px] p-6 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-transparent transition-all bg-white flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-3">
                               <div className="w-10 h-10 rounded-md bg-[#dcfce7] flex items-center justify-center shrink-0">
                                 <Sparkles className="w-5 h-5 text-[#16a34a]" />
                               </div>
                               <span className="font-semibold text-[#111111] text-[16px] leading-tight"><span className="text-[#555555] font-normal mr-1">Waves</span>AI Agents</span>
                            </div>
                            <p className="text-[14px] text-[#444444] mb-5 leading-[1.6] flex-1">Autonomous AI agents that execute tasks across every department, at scale.</p>
                            <span className="text-[#0066cc] text-[13px] font-bold uppercase flex items-center gap-1 transition-all group-hover:gap-2">Try Now <ChevronRight className="w-3.5 h-3.5" /></span>
                          </Link>

                          {/* Card 6 */}
                          <Link href="/school-erp" onClick={() => setProductsOpen(false)} className="group border border-[#e6e9f0] rounded-[6px] p-6 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-transparent transition-all bg-white flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-3">
                               <div className="w-10 h-10 rounded-md bg-[#e0f2fe] flex items-center justify-center shrink-0">
                                 <GraduationCap className="w-5 h-5 text-[#0284c7]" />
                               </div>
                               <span className="font-semibold text-[#111111] text-[16px] leading-tight"><span className="text-[#555555] font-normal mr-1">Waves</span>Classes</span>
                            </div>
                            <p className="text-[14px] text-[#444444] mb-5 leading-[1.6] flex-1">AI-powered academic LMS for modern teaching and learning.</p>
                            <span className="text-[#0066cc] text-[13px] font-bold uppercase flex items-center gap-1 transition-all group-hover:gap-2">Try Now <ChevronRight className="w-3.5 h-3.5" /></span>
                          </Link>

                        </div>
                      </div>

                    </div>
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#e6e9f0] bg-white px-5 py-6 space-y-5 max-h-[calc(100vh-64px)] overflow-y-auto">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#7d7d7d] mb-2" style={{ fontFamily: "var(--font-mono)" }}>Software Suites</p>
            <div className="space-y-1">
              <Link href="/erp" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-2.5 rounded text-sm text-black hover:bg-[#f8f9fa] font-medium">
                <Layers className="w-4 h-4 text-[#226eb4]" />
                <span>Waves ERP</span>
              </Link>
              <Link href="/school-erp" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-2.5 rounded text-sm text-black hover:bg-[#f8f9fa] font-medium">
                <GraduationCap className="w-4 h-4 text-[#226eb4]" />
                <span>School Suite</span>
              </Link>
              <Link href="/hospital-erp" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-2.5 rounded text-sm text-black hover:bg-[#f8f9fa] font-medium">
                <Hospital className="w-4 h-4 text-emerald-600" />
                <span>Health Suite</span>
              </Link>
              <Link href="/pharmacy-pos" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-2.5 rounded text-sm text-black hover:bg-[#f8f9fa] font-medium">
                <Store className="w-4 h-4 text-amber-600" />
                <span>Pharmacy POS</span>
              </Link>
            </div>
          </div>

          <div className="pt-2 border-t border-[#e6e9f0]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#7d7d7d] mb-2" style={{ fontFamily: "var(--font-mono)" }}>Navigation</p>
            <div className="space-y-1">
              <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="block p-2.5 rounded text-sm font-medium text-black hover:bg-[#f8f9fa]">Services</Link>
              <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="block p-2.5 rounded text-sm font-medium text-black hover:bg-[#f8f9fa]">Pricing</Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block p-2.5 rounded text-sm font-medium text-black hover:bg-[#f8f9fa]">Contact & Demo</Link>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block p-2.5 rounded text-sm font-medium text-[#e42525] hover:bg-red-50">Sign In</Link>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="zw-cta-main w-full text-center block"
            >
              Get Started For Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
