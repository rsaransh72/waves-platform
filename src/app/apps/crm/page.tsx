import Navbar from "@/components/Navbar";
import Link from "next/link";
import { 
  Bot, 
  Workflow, 
  Target, 
  Zap, 
  Users, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  Plug,
  Star
} from "lucide-react";

export const metadata = {
  title: "Waves CRM | Built-in AI Agents",
  description: "Waves CRM is the best CRM to grow with. It comes with built-in AI agents, advanced automation, powerful reporting capability, and integrates with more than 1,200 business apps."
};

export default function CrmPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col antialiased">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-16 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-full overflow-hidden z-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/80 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        </div>

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-[5%] grid lg:grid-cols-2 gap-8 items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15] mb-5">
              Close more <br className="hidden lg:block"/>
              deals with <br className="hidden lg:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                free AI agents
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
              Millions of salespeople trust Waves CRM to respond faster to leads, close more deals, and run leaner sales operations. Join them, start free.
            </p>
            
            {/* Compact Zoho-Style Form */}
            <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-6 max-w-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Start your flexible free trial</h3>
              <form className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
                <div className="flex items-start text-xs text-gray-500 pt-1">
                  <input type="checkbox" className="mt-1 mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" required />
                  <span>I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.</span>
                </div>
                <button 
                  type="submit" 
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md transition-colors text-sm uppercase tracking-wide mt-2"
                >
                  Get Started
                </button>
              </form>
              <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600 text-center">
                Already a customer? <Link href="/login" className="text-blue-600 font-semibold hover:underline">Sign in &rarr;</Link>
              </div>
            </div>
          </div>
          
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl transform rotate-3 scale-105 opacity-10 blur-xl"></div>
            <div className="relative bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden p-3">
              {/* Compact Mock Dashboard UI */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>
                <div className="w-1/3 h-4 bg-gray-100 rounded"></div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="h-20 bg-blue-50 rounded-lg border border-blue-100 p-3">
                  <div className="w-6 h-6 rounded-full bg-blue-200 mb-2"></div>
                  <div className="w-12 h-1.5 bg-blue-300 rounded-full mb-1.5"></div>
                  <div className="w-20 h-2.5 bg-blue-600 rounded-full"></div>
                </div>
                <div className="h-20 bg-purple-50 rounded-lg border border-purple-100 p-3">
                  <div className="w-6 h-6 rounded-full bg-purple-200 mb-2"></div>
                  <div className="w-12 h-1.5 bg-purple-300 rounded-full mb-1.5"></div>
                  <div className="w-20 h-2.5 bg-purple-600 rounded-full"></div>
                </div>
                <div className="h-20 bg-emerald-50 rounded-lg border border-emerald-100 p-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-200 mb-2"></div>
                  <div className="w-12 h-1.5 bg-emerald-300 rounded-full mb-1.5"></div>
                  <div className="w-20 h-2.5 bg-emerald-600 rounded-full"></div>
                </div>
              </div>
              <div className="h-48 bg-gray-50 rounded-lg border border-gray-100 flex items-end justify-between p-3 space-x-1.5">
                {[40, 70, 45, 90, 65, 80, 55, 100].map((h, i) => (
                  <div key={i} className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm" style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-8 bg-gray-50 border-y border-gray-200">
        <div className="max-w-[1280px] mx-auto px-[5%] text-center flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-widest mb-4 md:mb-0">
            Serving 350K businesses for 21 years
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 opacity-60 grayscale">
            <div className="text-lg font-bold font-serif">Amazon</div>
            <div className="text-lg font-bold font-sans">Netflix</div>
            <div className="text-lg font-bold font-mono">Spotify</div>
            <div className="text-lg font-bold font-serif italic">Toyota</div>
            <div className="text-lg font-bold font-sans">Sony</div>
          </div>
        </div>
      </section>

      {/* Feature Slider Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-[5%]">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Attract more leads</h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Deploy AI agents that prospect, research, and qualify, so your team can focus on the right leads.
              </p>
              <Link href="/crm/lead-management" className="text-blue-600 text-sm font-semibold inline-flex items-center hover:gap-1.5 transition-all">
                Read more <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="p-6 rounded-xl bg-white border border-gray-200 hover:border-purple-500 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Workflow className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Build better pipelines</h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Intelligent sales automation for follow-ups, approvals, and contextual suggestions, so your team always know what to do next.
              </p>
              <Link href="/crm/automation" className="text-purple-600 text-sm font-semibold inline-flex items-center hover:gap-1.5 transition-all">
                Read more <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="p-6 rounded-xl bg-white border border-gray-200 hover:border-emerald-500 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Close more deals</h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                From queries to quotes, engage each critical touchpoint with thoughtful automation — just ask our AI assistant!
              </p>
              <Link href="/crm/deals" className="text-emerald-600 text-sm font-semibold inline-flex items-center hover:gap-1.5 transition-all">
                Read more <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Platform Section */}
      <section className="py-16 bg-slate-900 text-white relative">
        <div className="relative z-10 max-w-[1280px] mx-auto px-[5%]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-3">
                Contextual AI agents built in, <br />
                or a wide open MCP platform
              </h2>
            </div>
            <Link href="/agents" className="text-blue-400 text-sm font-semibold inline-flex items-center hover:text-blue-300 pb-2">
              Learn more about AI <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center mb-4 border border-blue-500/30">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Pre-built agents</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Our Agent Store has an agent for every business use case. Discover, hire, and deploy in minutes.
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center mb-4 border border-purple-500/30">
                <Workflow className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Custom agents</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Build custom agents in the Studio. Also works via CLI with Cursor, VS Code, Claude Code, and more.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center mb-4 border border-emerald-500/30">
                <Plug className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Connect via MCP</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Access Waves CRM directly with Claude, ChatGPT, or your own LLM for bespoke sales operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-[5%] text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            <span className="text-blue-600">1,200+ integrations,</span> zero disruptions
          </h2>
          <p className="text-base text-gray-600 mb-10 max-w-2xl mx-auto">
            Connect your favorite tools seamlessly with native integrations designed to keep your data flowing.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {['QuickBooks', 'Adobe Sign', 'PandaDoc', 'Mailchimp', 'Shopify', 'Zapier', 'Dropbox', 'WhatsApp'].map((app, idx) => (
              <div key={idx} className="flex items-center px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:border-blue-300 transition-all cursor-pointer">
                <Plug className="w-4 h-4 mr-2 text-blue-500" />
                {app}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-[1280px] mx-auto px-[5%]">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Real stories, lasting impact</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 text-center flex flex-col items-center">
              <div className="text-3xl font-extrabold text-gray-900 mb-1">4.1<span className="text-base text-gray-500 font-medium">/5</span></div>
              <div className="flex text-amber-400 mb-1">
                <Star className="fill-current w-4 h-4"/><Star className="fill-current w-4 h-4"/><Star className="fill-current w-4 h-4"/><Star className="fill-current w-4 h-4"/><Star className="w-4 h-4"/>
              </div>
              <div className="text-xs text-gray-500 mb-3">3,000+ reviews</div>
              <div className="font-bold text-gray-800">G2</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 text-center flex flex-col items-center">
              <div className="text-3xl font-extrabold text-gray-900 mb-1">4.3<span className="text-base text-gray-500 font-medium">/5</span></div>
              <div className="flex text-amber-400 mb-1">
                <Star className="fill-current w-4 h-4"/><Star className="fill-current w-4 h-4"/><Star className="fill-current w-4 h-4"/><Star className="fill-current w-4 h-4"/><Star className="fill-current w-4 h-4 opacity-50"/>
              </div>
              <div className="text-xs text-gray-500 mb-3">7,000+ reviews</div>
              <div className="font-bold text-gray-800">Capterra</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 text-center flex flex-col items-center">
              <div className="text-3xl font-extrabold text-gray-900 mb-1">4.4<span className="text-base text-gray-500 font-medium">/5</span></div>
              <div className="flex text-amber-400 mb-1">
                <Star className="fill-current w-4 h-4"/><Star className="fill-current w-4 h-4"/><Star className="fill-current w-4 h-4"/><Star className="fill-current w-4 h-4"/><Star className="fill-current w-4 h-4 opacity-50"/>
              </div>
              <div className="text-xs text-gray-500 mb-3">1,400+ ratings</div>
              <div className="font-bold text-gray-800">Gartner</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-[5%]">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Whoever you are and wherever you're going, there's a plan for you
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
            {/* Bigin Express */}
            <div className="border border-gray-200 rounded-2xl p-6 bg-white flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Bigin Express</h3>
              <p className="text-gray-500 text-xs mb-4">First-timer, moving from spreadsheets</p>
              <div className="mb-6">
                <span className="text-3xl font-extrabold text-gray-900">₹1,400</span>
                <span className="text-gray-500 text-sm">/user/month</span>
              </div>
              <ul className="space-y-3 mb-6 flex-1 text-sm">
                {['Sales pipeline', 'Built-in calling', 'Appointment scheduling', 'Payment collection'].map((feat, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feat}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="w-full py-2 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 text-center text-sm transition-colors">
                GET STARTED
              </Link>
            </div>

            {/* Standard */}
            <div className="border border-gray-200 rounded-2xl p-6 bg-white flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Waves CRM Standard</h3>
              <p className="text-gray-500 text-xs mb-4">Small team, getting started</p>
              <div className="mb-6">
                <span className="text-3xl font-extrabold text-gray-900">₹800</span>
                <span className="text-gray-500 text-sm">/user/month</span>
              </div>
              <ul className="space-y-3 mb-6 flex-1 text-sm">
                {['Email integration & mass emails', 'Multiple sales pipelines', 'Sales forecasting', 'Data enrichment'].map((feat, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feat}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="w-full py-2 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 text-center text-sm transition-colors">
                GET STARTED
              </Link>
            </div>

            {/* Professional (Featured) */}
            <div className="border-2 border-blue-600 rounded-2xl p-6 bg-blue-600 text-white relative shadow-lg">
              <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-amber-400 text-amber-950 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-1">Waves CRM Professional</h3>
              <p className="text-blue-100 text-xs mb-4">Growing team, needs automation</p>
              <div className="mb-6">
                <span className="text-3xl font-extrabold">₹1,400</span>
                <span className="text-blue-200 text-sm">/user/month</span>
              </div>
              <ul className="space-y-3 mb-6 flex-1 text-sm">
                {['AI agents', 'Process management', 'Inventory management', 'Predictive intelligence', 'Unlimited reports'].map((feat, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-blue-200 mr-2 shrink-0 mt-0.5" />
                    <span className="text-white">{feat}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="w-full py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 text-center text-sm transition-colors">
                GET STARTED
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Switch CTA */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-[5%] text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Switching from Salesforce or Hubspot?</h2>
          <p className="text-base text-gray-600 mb-8">
            We'll make it effortless with free migration assistance, and if you're locked mid-contract, Waves CRM is on us for 6 months.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/switch" className="px-6 py-2.5 bg-white border border-gray-300 text-gray-900 text-sm font-semibold rounded-md hover:bg-gray-50 transition-colors w-full sm:w-auto">
              Switch Today
            </Link>
            <Link href="/signup" className="px-6 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors w-full sm:w-auto shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}
