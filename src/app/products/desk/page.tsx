import Navbar from "@/components/Navbar";
import Link from "next/link";
import { 
  Headphones, MessageSquare, Mail, Phone, Globe, Users,
  BarChart3, Settings, Shield, Clock, Zap, CheckCircle2,
  Heart, Star, ArrowRight, Bot, Target, Play
} from "lucide-react";

export const metadata = {
  title: "Waves Desk | Help Desk Software for Exceptional Customer Service",
  description: "Provide great customer support with our context-aware help desk software. Prioritize, manage and close a high volume of requests across multiple channels."
};

export default function DeskPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col antialiased">
      <Navbar />

      {/* ─── Desk Specific Nav Bar ─── */}
      <div className="sticky top-[64px] z-40 bg-white/90 backdrop-blur-md border-b border-[#e6e9f0] shadow-sm">
        <div className="w-full max-w-[1280px] mx-auto px-[5%] h-[56px] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#10b981] to-[#047857] flex items-center justify-center text-white font-bold text-lg">
                <Headphones className="w-4 h-4" />
              </div>
              <span className="font-bold text-[18px] text-[#111]">Waves Desk</span>
            </div>
            <nav className="hidden lg:flex items-center gap-6 text-[14px] font-semibold text-[#555]">
              <a href="#channels" className="hover:text-[#10b981] transition-colors py-[16px]">Omnichannel</a>
              <a href="#automation" className="hover:text-[#10b981] transition-colors py-[16px]">Automation</a>
              <a href="#self-service" className="hover:text-[#10b981] transition-colors py-[16px]">Self-Service</a>
              <a href="#pricing" className="hover:text-[#10b981] transition-colors py-[16px]">Pricing</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/signup" className="text-[13px] font-bold px-5 py-2 rounded-md bg-[#10b981] text-white hover:bg-[#059669] transition-all">
              Try For Free
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1 w-full overflow-hidden">
        
        {/* ═══════════════════════════════════════════════════════════
            HERO SECTION (Support/Service Theme)
        ═══════════════════════════════════════════════════════════ */}
        <section className="relative w-full pt-20 pb-32 overflow-hidden bg-white">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
          
          <div className="relative z-10 max-w-[1280px] mx-auto px-[5%] grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold tracking-widest uppercase mb-6 border border-emerald-100">
                <Heart className="w-4 h-4" /> Customer Service Software
              </div>
              
              <h1 className="text-[44px] sm:text-[56px] font-bold text-slate-900 tracking-[-1.5px] leading-[1.1] mb-6">
                Customer support that feels <span className="text-emerald-600">human</span>.
              </h1>
              
              <p className="text-[18px] leading-[1.6] text-slate-600 mb-8">
                Empower your support team to resolve issues faster, deliver personalized experiences, and build lasting relationships with context-aware ticketing.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/signup"
                  className="font-bold text-white text-[15px] px-8 py-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-all shadow-lg text-center"
                >
                  START FREE TRIAL
                </Link>
                <Link
                  href="/book-demo"
                  className="font-bold text-slate-700 text-[15px] px-8 py-4 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all text-center flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" /> Watch Demo
                </Link>
              </div>

              <div className="flex items-center gap-6 text-sm text-slate-500 font-medium">
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free 15-day trial</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Cancel anytime</div>
              </div>
            </div>

            {/* Right: UI Mockup */}
            <div className="relative lg:h-[600px] flex items-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100 to-transparent rounded-full blur-3xl opacity-50"></div>
              
              {/* Main Ticket Interface Mockup */}
              <div className="relative w-full bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden transform translate-x-4 lg:translate-x-12">
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                
                <div className="flex h-[400px]">
                  {/* Sidebar */}
                  <div className="w-[60px] border-r border-slate-100 bg-slate-50 flex flex-col items-center py-4 gap-6 text-slate-400">
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                    <Users className="w-5 h-5" />
                    <BarChart3 className="w-5 h-5" />
                    <Settings className="w-5 h-5 mt-auto" />
                  </div>
                  
                  {/* Ticket List */}
                  <div className="w-[200px] border-r border-slate-100 p-3 overflow-hidden">
                    <div className="h-8 bg-slate-100 rounded mb-4 w-full px-2 flex items-center text-xs text-slate-400">Search tickets...</div>
                    <div className="space-y-3">
                      <div className="p-2 bg-emerald-50 border border-emerald-100 rounded">
                        <div className="text-xs font-bold text-slate-800 mb-1">Login Issue</div>
                        <div className="text-[10px] text-slate-500">Sarah Jenkins</div>
                      </div>
                      <div className="p-2 hover:bg-slate-50 rounded">
                        <div className="text-xs font-bold text-slate-700 mb-1">Billing query</div>
                        <div className="text-[10px] text-slate-500">Acme Corp</div>
                      </div>
                      <div className="p-2 hover:bg-slate-50 rounded">
                        <div className="text-xs font-bold text-slate-700 mb-1">Feature request</div>
                        <div className="text-[10px] text-slate-500">Tom Holland</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Ticket Detail */}
                  <div className="flex-1 p-5 bg-white">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="font-bold text-slate-800 mb-1">Cannot login to dashboard</h3>
                        <div className="text-xs text-slate-500">#TKT-1042 • Created 2 hrs ago via Email</div>
                      </div>
                      <div className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded">High Priority</div>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0"></div>
                        <div className="bg-slate-50 p-3 rounded-lg rounded-tl-none border border-slate-100 text-sm text-slate-600">
                          Hi team, I am trying to login to my account but getting an error 500. Please help!
                        </div>
                      </div>
                      <div className="flex gap-3 flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex-shrink-0 border border-emerald-200"></div>
                        <div className="bg-emerald-50 p-3 rounded-lg rounded-tr-none border border-emerald-100 text-sm text-slate-700">
                          Hi Sarah, we are looking into this immediately. Our engineers are on it.
                        </div>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-lg p-2">
                      <div className="h-16 text-slate-400 text-sm p-2">Type your reply...</div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                        <div className="flex gap-2 text-slate-400">
                          <div className="w-5 h-5 bg-slate-100 rounded"></div>
                          <div className="w-5 h-5 bg-slate-100 rounded"></div>
                        </div>
                        <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded">Send Reply</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Element: CSAT */}
              <div className="absolute bottom-10 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-4 z-20">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-emerald-600 fill-emerald-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Avg. CSAT</div>
                  <div className="text-2xl font-bold text-slate-800">98.4%</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            OMNICHANNEL SECTION
        ═══════════════════════════════════════════════════════════ */}
        <section id="channels" className="py-24 bg-[#f8fafc] border-y border-slate-100">
          <div className="max-w-[1280px] mx-auto px-[5%] text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Be where your customers are</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-16">
              Customers expect support on their favorite channels. Waves Desk brings every conversation into a single, unified interface.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-8 rounded-xl border border-slate-200 hover:shadow-md transition-shadow group">
                <Mail className="w-8 h-8 text-slate-400 group-hover:text-emerald-500 transition-colors mx-auto mb-4" />
                <h3 className="font-bold text-slate-800">Email Support</h3>
              </div>
              <div className="bg-white p-8 rounded-xl border border-slate-200 hover:shadow-md transition-shadow group">
                <Phone className="w-8 h-8 text-slate-400 group-hover:text-emerald-500 transition-colors mx-auto mb-4" />
                <h3 className="font-bold text-slate-800">Telephony</h3>
              </div>
              <div className="bg-white p-8 rounded-xl border border-slate-200 hover:shadow-md transition-shadow group">
                <MessageSquare className="w-8 h-8 text-slate-400 group-hover:text-emerald-500 transition-colors mx-auto mb-4" />
                <h3 className="font-bold text-slate-800">Live Chat</h3>
              </div>
              <div className="bg-white p-8 rounded-xl border border-slate-200 hover:shadow-md transition-shadow group">
                <Globe className="w-8 h-8 text-slate-400 group-hover:text-emerald-500 transition-colors mx-auto mb-4" />
                <h3 className="font-bold text-slate-800">Social Media</h3>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            AUTOMATION & AI
        ═══════════════════════════════════════════════════════════ */}
        <section id="automation" className="py-24 bg-slate-900 text-white">
          <div className="max-w-[1280px] mx-auto px-[5%] grid lg:grid-cols-2 gap-16 items-center">
            {/* Visual */}
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full"></div>
              <div className="relative bg-slate-800 rounded-xl border border-slate-700 p-8">
                <div className="flex items-center gap-3 mb-8">
                  <Bot className="w-6 h-6 text-emerald-400" />
                  <span className="font-bold text-lg">Zia AI Assistant</span>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-slate-900 p-4 rounded border border-slate-700">
                    <div className="text-xs text-slate-400 mb-2">Analyzing incoming ticket...</div>
                    <div className="font-medium">"My payment failed during checkout"</div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-1/2 bg-slate-700/50 p-3 rounded border border-slate-600">
                      <div className="text-[10px] uppercase text-emerald-400 font-bold mb-1">Sentiment</div>
                      <div className="font-medium text-red-300">Frustrated</div>
                    </div>
                    <div className="w-1/2 bg-slate-700/50 p-3 rounded border border-slate-600">
                      <div className="text-[10px] uppercase text-emerald-400 font-bold mb-1">Suggested Tag</div>
                      <div className="font-medium">Billing / Payment</div>
                    </div>
                  </div>
                  
                  <div className="bg-emerald-900/40 p-4 rounded border border-emerald-800/50 mt-4">
                    <div className="text-xs text-emerald-400 mb-2 font-bold">Suggested Macro Action</div>
                    <div className="font-medium text-emerald-100 flex items-center justify-between">
                      Route to Billing Team <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Automate the busywork. <br/><span className="text-slate-400">Focus on the customer.</span></h2>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Don't let manual ticket routing slow down your response times. Use powerful automations and AI to tag, assign, and prioritize tickets instantly.
              </p>
              
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <Zap className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-lg font-bold mb-1">Blueprint & Workflows</h4>
                    <p className="text-slate-400 text-sm">Create visual processes to ensure your team follows standard operating procedures for complex tickets.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Bot className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-lg font-bold mb-1">AI-Powered Context</h4>
                    <p className="text-slate-400 text-sm">Our AI analyzes sentiment and suggests knowledge base articles to agents before they even start typing.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Clock className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-lg font-bold mb-1">SLA Management</h4>
                    <p className="text-slate-400 text-sm">Set response and resolution time targets. Escalate automatically when tickets are approaching breach.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SELF SERVICE
        ═══════════════════════════════════════════════════════════ */}
        <section id="self-service" className="py-24 bg-white">
          <div className="max-w-[1280px] mx-auto px-[5%] text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Help them help themselves</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-16">
              Deflect tickets before they are created. Build a comprehensive knowledge base and let customers find answers instantly.
            </p>

            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                  <Globe className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Branded Help Center</h3>
                <p className="text-slate-600 text-sm">Create a multi-lingual support portal matching your brand identity, completely code-free.</p>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                  <Target className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Community Forums</h3>
                <p className="text-slate-600 text-sm">Allow power users to answer questions and build a vibrant community around your product.</p>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                  <Bot className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Answer Bot</h3>
                <p className="text-slate-600 text-sm">Deploy chatbots that serve knowledge base articles instantly within your app or website.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            CTA
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-emerald-600 text-white text-center">
          <div className="max-w-3xl mx-auto px-[5%]">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Deliver happier customer experiences</h2>
            <p className="text-xl font-medium mb-10 text-emerald-100">Join 100,000+ support teams using Waves Desk to build customer loyalty.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="px-8 py-4 bg-white text-emerald-700 font-bold text-[15px] rounded-lg hover:bg-slate-50 transition-colors shadow-lg uppercase tracking-wider"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </section>

      </main>
      
      <footer className="bg-slate-900 text-slate-400 py-10 text-center">
        <p className="text-sm">© 2026 Waves Enterprise Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
