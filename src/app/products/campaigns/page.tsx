"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { 
  Mail, 
  MousePointer2, 
  BarChart3, 
  Zap, 
  Users, 
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Send,
  Store
} from "lucide-react";

export default function CampaignsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-yellow-200 selection:text-yellow-900">
      <Navbar />

      <main className="flex-1 w-full overflow-hidden">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION                                                          */}
        {/* ========================================================================= */}
        <section className="relative w-full bg-[#fffbf0] pt-24 pb-32 overflow-hidden border-b border-yellow-100">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[800px] h-[800px] bg-gradient-to-br from-yellow-300/20 to-orange-400/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[600px] h-[600px] bg-gradient-to-tr from-orange-300/20 to-yellow-200/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="w-full max-w-[1280px] mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left pt-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-yellow-200 text-orange-700 text-[12px] font-bold uppercase tracking-wider mb-8 shadow-sm">
                <Mail className="w-3.5 h-3.5" /> Waves Campaigns
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold text-[#111] tracking-tight leading-[1.05] mb-6">
                Email marketing <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
                  that drives sales.
                </span>
              </h1>
              
              <p className="text-lg lg:text-xl text-[#555] leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
                Create responsive designs, customize messages, deliver emails to inboxes, trigger automated workflows, and connect with new customers.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link 
                  href="/signup?app=campaigns"
                  className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-[4px] font-bold text-[16px] transition-colors shadow-lg shadow-orange-600/20 w-full sm:w-auto"
                >
                  Start 14-Day Free Trial
                </Link>
                <Link 
                  href="/book-demo"
                  className="px-8 py-4 bg-white border-2 border-orange-200 text-orange-700 hover:border-orange-600 hover:bg-orange-50 rounded-[4px] font-bold text-[16px] transition-all w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  Request Demo <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <p className="text-[13px] text-[#777] mt-5">No credit card required. Cancel anytime.</p>
            </div>

            {/* Right Abstract Graphic (Dashboard Mockup) */}
            <div className="flex-1 w-full max-w-[600px] relative">
              <div className="relative w-full aspect-square bg-white rounded-3xl shadow-[0_30px_60px_rgba(234,88,12,0.15)] border border-orange-100 overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500">
                {/* Mockup Header */}
                <div className="h-12 border-b border-gray-100 flex items-center px-6 gap-2 bg-gray-50/50">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                {/* Mockup Body */}
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h4 className="font-bold text-gray-800 text-xl">Summer Sale Campaign</h4>
                      <p className="text-gray-400 text-sm">Sent to 45,000 subscribers</p>
                    </div>
                    <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-xs">Sent</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
                      <div className="text-orange-600 text-sm font-bold mb-1">Open Rate</div>
                      <div className="text-3xl font-extrabold text-gray-900">34.2%</div>
                      <div className="text-green-600 text-xs mt-2 font-medium">↑ 4.1% vs last campaign</div>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-100">
                      <div className="text-yellow-700 text-sm font-bold mb-1">Click Rate</div>
                      <div className="text-3xl font-extrabold text-gray-900">12.8%</div>
                      <div className="text-green-600 text-xs mt-2 font-medium">↑ 2.3% vs last campaign</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="h-3 bg-gray-100 rounded-full w-full">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full w-4/5">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Element */}
              <div className="absolute -bottom-8 -left-8 bg-white p-5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 animate-bounce-slow">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Send className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Email Delivered</div>
                  <div className="text-lg font-bold text-gray-900">99.8% Rate</div>
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
            <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-8">Trusted by global marketing teams</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale">
              {/* Abstract Logos */}
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
                Everything you need to send better emails
              </h2>
              <p className="text-lg text-[#666]">
                From drag-and-drop design to advanced A/B testing, Waves Campaigns gives you the tools to optimize every send.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Feature 1 (Large) */}
              <div className="md:col-span-2 bg-white rounded-3xl p-10 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <MousePointer2 className="w-10 h-10 text-orange-500 mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Drag-and-drop editor</h3>
                <p className="text-gray-600 leading-relaxed mb-6 max-w-md">
                  Create beautiful, responsive emails in minutes. Choose from hundreds of pre-designed templates or build your own from scratch without writing a single line of code.
                </p>
                <div className="w-full h-48 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 font-medium">
                  [ Interactive Editor Mockup ]
                </div>
              </div>

              {/* Feature 2 (Small) */}
              <div className="bg-white rounded-3xl p-10 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center">
                <Zap className="w-10 h-10 text-yellow-500 mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Marketing Automation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Trigger emails based on user behavior. Send welcome series, cart abandonment reminders, and birthday offers on autopilot.
                </p>
              </div>

              {/* Feature 3 (Small) */}
              <div className="bg-white rounded-3xl p-10 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center">
                <Users className="w-10 h-10 text-blue-500 mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Audience Segmentation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Target the right people. Segment your lists based on location, past purchases, or engagement levels for highly personalized campaigns.
                </p>
              </div>

              {/* Feature 4 (Large) */}
              <div className="md:col-span-2 bg-white rounded-3xl p-10 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <BarChart3 className="w-10 h-10 text-green-500 mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Advanced A/B Testing</h3>
                <p className="text-gray-600 leading-relaxed mb-6 max-w-md">
                  Stop guessing what works. Test subject lines, sender details, and email content to discover what drives the highest open and click rates.
                </p>
                <div className="w-full h-48 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 font-medium overflow-hidden">
                  <div className="w-full h-full flex">
                    <div className="flex-1 bg-orange-50 border-r border-gray-200 flex flex-col items-center justify-center gap-2">
                      <span className="font-bold text-orange-800">Variant A</span>
                      <span className="text-2xl font-black text-orange-600">22% Open</span>
                    </div>
                    <div className="flex-1 bg-green-50 flex flex-col items-center justify-center gap-2 relative">
                      <div className="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">Winner</div>
                      <span className="font-bold text-green-800">Variant B</span>
                      <span className="text-2xl font-black text-green-600">38% Open</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. INTEGRATIONS SECTION                                                    */}
        {/* ========================================================================= */}
        <section className="w-full bg-white py-24 border-t border-gray-100">
          <div className="w-full max-w-[1280px] mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-[#111] mb-6">Plays well with others</h2>
            <p className="text-lg text-[#666] max-w-2xl mx-auto mb-12">
              Waves Campaigns integrates natively with Waves CRM, Bigin, and hundreds of third-party apps via our Marketplace.
            </p>
            <div className="inline-flex items-center gap-8 p-8 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center">
                <Store className="w-8 h-8 text-blue-600" /> {/* CRM */}
              </div>
              <div className="w-8 h-[2px] bg-gray-300"></div>
              <div className="w-20 h-20 bg-orange-100 rounded-2xl shadow-md border-2 border-orange-300 flex items-center justify-center transform scale-110">
                <Mail className="w-10 h-10 text-orange-600" /> {/* Campaigns */}
              </div>
              <div className="w-8 h-[2px] bg-gray-300"></div>
              <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-green-600" /> {/* Analytics */}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. BOTTOM CTA                                                            */}
        {/* ========================================================================= */}
        <section className="w-full bg-orange-600 py-20 text-center px-6">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to grow your audience?
          </h2>
          <p className="text-orange-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Join thousands of marketers who use Waves Campaigns to build relationships and drive revenue.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/signup?app=campaigns"
              className="px-8 py-4 bg-white text-orange-700 hover:bg-gray-50 rounded-[4px] font-bold text-[16px] transition-colors"
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
