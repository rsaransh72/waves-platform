"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { 
  Store, 
  BarChart4, 
  Zap, 
  MessageSquare, 
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Target,
  Users
} from "lucide-react";

export default function CrmPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-blue-200 selection:text-blue-900">
      <Navbar />

      <main className="flex-1 w-full overflow-hidden">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION                                                          */}
        {/* ========================================================================= */}
        <section className="relative w-full bg-[#f8fbff] pt-24 pb-32 overflow-hidden border-b border-blue-100">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[800px] h-[800px] bg-gradient-to-br from-blue-300/20 to-indigo-400/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-300/20 to-blue-200/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="w-full max-w-[1280px] mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left pt-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-blue-200 text-[#0066cc] text-[12px] font-bold uppercase tracking-wider mb-8 shadow-sm">
                <Store className="w-3.5 h-3.5" /> Waves CRM
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold text-[#111] tracking-tight leading-[1.05] mb-6">
                Sell smarter, <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066cc] to-indigo-500">
                  close faster.
                </span>
              </h1>
              
              <p className="text-lg lg:text-xl text-[#555] leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
                Empower your sales team with an omnichannel CRM that acts as a single repository to bring your sales, marketing, and customer support activities together.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link 
                  href="/signup?app=crm"
                  className="px-8 py-4 bg-[#0066cc] hover:bg-[#005bb5] text-white rounded-[4px] font-bold text-[16px] transition-colors shadow-lg shadow-blue-600/20 w-full sm:w-auto"
                >
                  Start 15-Day Free Trial
                </Link>
                <Link 
                  href="/book-demo"
                  className="px-8 py-4 bg-white border-2 border-blue-200 text-[#0066cc] hover:border-[#0066cc] hover:bg-blue-50 rounded-[4px] font-bold text-[16px] transition-all w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  Request Demo <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <p className="text-[13px] text-[#777] mt-5">No credit card required. Cancel anytime.</p>
            </div>

            {/* Right Abstract Graphic (Dashboard Mockup) */}
            <div className="flex-1 w-full max-w-[600px] relative">
              <div className="relative w-full aspect-square bg-white rounded-3xl shadow-[0_30px_60px_rgba(0,102,204,0.15)] border border-blue-100 overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                {/* Mockup Header */}
                <div className="h-12 border-b border-gray-100 flex items-center justify-between px-6 bg-gray-50/50">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="w-24 h-4 bg-gray-200 rounded-full"></div>
                </div>
                {/* Mockup Body */}
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h4 className="font-bold text-gray-800 text-xl">Sales Pipeline</h4>
                      <p className="text-gray-400 text-sm">Q3 Performance</p>
                    </div>
                    <span className="bg-blue-100 text-[#0066cc] font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +24% YoY
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                      <div className="text-blue-600 text-sm font-bold mb-1">Open Deals</div>
                      <div className="text-3xl font-extrabold text-gray-900">$2.4M</div>
                    </div>
                    <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
                      <div className="text-indigo-700 text-sm font-bold mb-1">Win Rate</div>
                      <div className="text-3xl font-extrabold text-gray-900">42%</div>
                    </div>
                  </div>

                  {/* Pipeline visualization */}
                  <div className="space-y-3">
                    <div className="flex gap-2 items-center">
                      <div className="w-1/4 text-xs font-bold text-gray-500 text-right">Leads</div>
                      <div className="h-4 bg-blue-100 rounded-r-md w-full"><div className="h-full bg-blue-500 rounded-r-md" style={{ width: '100%' }}></div></div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="w-1/4 text-xs font-bold text-gray-500 text-right">Qualified</div>
                      <div className="h-4 bg-blue-100 rounded-r-md w-full"><div className="h-full bg-blue-500 rounded-r-md" style={{ width: '70%' }}></div></div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="w-1/4 text-xs font-bold text-gray-500 text-right">Proposal</div>
                      <div className="h-4 bg-indigo-100 rounded-r-md w-full"><div className="h-full bg-indigo-500 rounded-r-md" style={{ width: '45%' }}></div></div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="w-1/4 text-xs font-bold text-gray-500 text-right">Won</div>
                      <div className="h-4 bg-green-100 rounded-r-md w-full"><div className="h-full bg-green-500 rounded-r-md" style={{ width: '25%' }}></div></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Element */}
              <div className="absolute top-1/4 -right-8 bg-white p-5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 animate-bounce-slow" style={{ animationDelay: '1s' }}>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Deal Closed!</div>
                  <div className="text-lg font-bold text-gray-900">$45,000</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. LOGO CLOUD                                                            */}
        {/* ========================================================================= */}
        <section className="w-full bg-white py-10 border-b border-gray-100">
          <div className="w-full max-w-[1280px] mx-auto px-6 text-center">
            <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-8">Empowering sales teams at 250,000+ businesses globally</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale">
              <div className="text-2xl font-black font-serif">Acme Corp</div>
              <div className="text-2xl font-black tracking-tighter">GlobalNet</div>
              <div className="text-2xl font-black italic">SysTech</div>
              <div className="text-2xl font-black tracking-widest">AURA</div>
              <div className="text-2xl font-black font-mono">NEXUS</div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. BENTO GRID FEATURES                                                   */}
        {/* ========================================================================= */}
        <section className="w-full bg-[#fcfcfc] py-24">
          <div className="w-full max-w-[1280px] mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-[#111] tracking-tight mb-6">
                Everything you need to build better customer relationships
              </h2>
              <p className="text-lg text-[#666]">
                From lead scoring to omnichannel communication, Waves CRM equips your team with the tools to sell smarter.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Feature 1 (Large) */}
              <div className="md:col-span-2 bg-white rounded-3xl p-10 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <Target className="w-10 h-10 text-[#0066cc] mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Omnichannel Communication</h3>
                <p className="text-gray-600 leading-relaxed mb-6 max-w-md">
                  Interact with customers across the channels they prefer. Email, telephone, social media, and live chat—all from a single, unified interface.
                </p>
                <div className="w-full h-48 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent"></div>
                  <div className="flex gap-4 p-4 z-10">
                    <div className="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center text-blue-600 border border-blue-200"><MessageSquare className="w-5 h-5"/></div>
                    <div className="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center text-blue-600 border border-blue-200">@</div>
                    <div className="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center text-blue-600 border border-blue-200">📞</div>
                  </div>
                </div>
              </div>

              {/* Feature 2 (Small) */}
              <div className="bg-white rounded-3xl p-10 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center">
                <Zap className="w-10 h-10 text-yellow-500 mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Sales Automation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Automate routine sales, marketing, and support functions that take up valuable time, so your team can focus on closing.
                </p>
              </div>

              {/* Feature 3 (Small) */}
              <div className="bg-white rounded-3xl p-10 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center">
                <Users className="w-10 h-10 text-indigo-500 mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Lead Management</h3>
                <p className="text-gray-600 leading-relaxed">
                  Capture leads, automate lead scoring, identify leads that will convert, and follow up with detailed contact information.
                </p>
              </div>

              {/* Feature 4 (Large) */}
              <div className="md:col-span-2 bg-white rounded-3xl p-10 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <BarChart4 className="w-10 h-10 text-green-500 mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Advanced Analytics</h3>
                <p className="text-gray-600 leading-relaxed mb-6 max-w-md">
                  Make data-driven decisions with real-time reports and dashboards. Track sales cycles, gauge performance, and forecast revenue.
                </p>
                <div className="w-full h-48 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 font-medium overflow-hidden">
                   <div className="w-full h-full flex items-end justify-between p-8 gap-2">
                     <div className="w-full bg-blue-200 rounded-t-md h-[40%]"></div>
                     <div className="w-full bg-blue-300 rounded-t-md h-[60%]"></div>
                     <div className="w-full bg-blue-400 rounded-t-md h-[30%]"></div>
                     <div className="w-full bg-blue-500 rounded-t-md h-[80%]"></div>
                     <div className="w-full bg-blue-600 rounded-t-md h-[100%]"></div>
                   </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. BOTTOM CTA                                                            */}
        {/* ========================================================================= */}
        <section className="w-full bg-[#0066cc] py-20 text-center px-6">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to transform your sales?
          </h2>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Join the millions of users worldwide who trust Waves CRM to drive their business growth.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/signup?app=crm"
              className="px-8 py-4 bg-white text-[#0066cc] hover:bg-gray-50 rounded-[4px] font-bold text-[16px] transition-colors shadow-xl shadow-blue-900/20"
            >
              Sign Up For Free
            </Link>
          </div>
        </section>

      </main>

      {/* Basic Footer */}
      <footer className="w-full bg-[#f8f9fa] py-8 border-t border-[#e6e9f0]">
        <div className="w-full max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-xs text-[#7d7d7d]">
          <p>&copy; {new Date().getFullYear()} Waves Technologies. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/pricing" className="hover:text-black">Pricing</Link>
            <Link href="/contact" className="hover:text-black">Contact</Link>
            <Link href="/privacy" className="hover:text-black">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
