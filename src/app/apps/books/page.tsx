import Navbar from "@/components/Navbar";
import Link from "next/link";
import { 
  Receipt, Building2, Wallet, FileText, ArrowRight, CheckCircle2,
  PieChart, Search, Calculator, Cloud, ShieldCheck, Download,
  Smartphone, BarChart3, Banknote, Percent
} from "lucide-react";

export const metadata = {
  title: "Waves Books | GST-Compliant Accounting Software for India",
  description: "End-to-end online accounting software that helps you manage your finances, automate business workflows, and work collectively across departments."
};

export default function BooksPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col antialiased">
      <Navbar />

      {/* ─── Books Specific Nav Bar ─── */}
      <div className="sticky top-[64px] z-40 bg-white border-b border-[#e6e9f0] shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
        <div className="w-full max-w-[1280px] mx-auto px-[5%] h-[56px] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#ca8a04] flex items-center justify-center text-white font-bold text-lg">
                <Receipt className="w-5 h-5" />
              </div>
              <span className="font-bold text-[18px] text-[#111]">Waves Books</span>
            </div>
            <nav className="hidden lg:flex items-center gap-6 text-[14px] font-semibold text-[#555]">
              <a href="#features" className="hover:text-[#ca8a04] transition-colors border-b-2 border-transparent hover:border-[#ca8a04] py-[16px]">Features</a>
              <a href="#gst" className="hover:text-[#ca8a04] transition-colors border-b-2 border-transparent hover:border-[#ca8a04] py-[16px]">GST & E-Invoicing</a>
              <a href="#banking" className="hover:text-[#ca8a04] transition-colors border-b-2 border-transparent hover:border-[#ca8a04] py-[16px]">Banking</a>
              <a href="#pricing" className="hover:text-[#ca8a04] transition-colors border-b-2 border-transparent hover:border-[#ca8a04] py-[16px]">Pricing</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/signup" className="text-[13px] font-bold px-5 py-2 rounded bg-[#ca8a04] text-white hover:bg-[#a16207] transition-all shadow-md shadow-yellow-500/20">
              SIGN UP FOR FREE
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1 w-full overflow-hidden">
        
        {/* ═══════════════════════════════════════════════════════════
            HERO SECTION (Finance Theme)
        ═══════════════════════════════════════════════════════════ */}
        <section className="relative w-full pt-20 pb-24 overflow-hidden bg-[#1e293b]">
          {/* Abstract Finance Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute right-0 top-0 w-3/4 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-500 via-[#1e293b] to-transparent"></div>
          </div>
          
          <div className="relative z-10 max-w-[1280px] mx-auto px-[5%] text-center">
            <h1 className="text-[44px] sm:text-[56px] lg:text-[72px] font-bold text-white tracking-[-2px] leading-[1.05] max-w-[900px] mx-auto mb-6 text-balance">
              Smart accounting software. <br />
              <span className="text-yellow-400">Designed for growing businesses.</span>
            </h1>
            
            <p className="text-[18px] sm:text-[20px] leading-[1.6] text-slate-300 max-w-[700px] mx-auto mb-10 text-balance">
              Manage your finances, keep you GST compliant, automate business workflows, and work collectively across departments.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                href="/signup"
                className="font-bold text-slate-900 text-[15px] px-8 py-4 rounded-lg bg-yellow-400 hover:bg-yellow-300 transition-all shadow-lg"
              >
                START 14-DAY FREE TRIAL
              </Link>
              <div className="flex items-center gap-2 text-slate-300 text-[14px]">
                <CheckCircle2 className="w-5 h-5 text-yellow-400" />
                No credit card required
              </div>
            </div>

            {/* Dashboard Mockup - Rising up from bottom */}
            <div className="relative max-w-[1000px] mx-auto translate-y-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl blur opacity-30"></div>
              <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                {/* Mock Header */}
                <div className="h-14 bg-slate-50 border-b border-slate-200 flex items-center px-6 gap-4">
                  <div className="font-bold text-slate-800 text-lg">Waves Books</div>
                  <div className="flex-1"></div>
                  <div className="w-64 h-8 bg-white border border-slate-200 rounded text-slate-400 flex items-center px-3 text-sm">
                    <Search className="w-4 h-4 mr-2" /> Search customers, invoices...
                  </div>
                </div>
                {/* Mock Content */}
                <div className="p-6 grid grid-cols-12 gap-6 bg-slate-50">
                  <div className="col-span-3 space-y-2">
                    <div className="h-10 bg-yellow-50 rounded text-yellow-700 font-medium flex items-center px-4">Dashboard</div>
                    <div className="h-10 hover:bg-white rounded text-slate-600 font-medium flex items-center px-4">Invoices</div>
                    <div className="h-10 hover:bg-white rounded text-slate-600 font-medium flex items-center px-4">Expenses</div>
                    <div className="h-10 hover:bg-white rounded text-slate-600 font-medium flex items-center px-4">Banking</div>
                    <div className="h-10 hover:bg-white rounded text-slate-600 font-medium flex items-center px-4">Reports</div>
                  </div>
                  <div className="col-span-9 space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded border border-slate-200 shadow-sm">
                        <div className="text-sm text-slate-500 mb-1">Total Receivables</div>
                        <div className="text-2xl font-bold text-slate-800">₹4,25,000</div>
                        <div className="text-xs text-green-600 mt-2 font-medium">↑ 12% vs last month</div>
                      </div>
                      <div className="bg-white p-4 rounded border border-slate-200 shadow-sm">
                        <div className="text-sm text-slate-500 mb-1">Total Payables</div>
                        <div className="text-2xl font-bold text-slate-800">₹1,12,400</div>
                        <div className="text-xs text-red-600 mt-2 font-medium">↓ 5% vs last month</div>
                      </div>
                      <div className="bg-white p-4 rounded border border-slate-200 shadow-sm">
                        <div className="text-sm text-slate-500 mb-1">Cash Flow</div>
                        <div className="text-2xl font-bold text-slate-800">₹8,45,200</div>
                        <div className="text-xs text-green-600 mt-2 font-medium">↑ Healthy</div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded border border-slate-200 shadow-sm h-64 flex flex-col justify-end gap-2 pb-0 px-8">
                      {/* Bar chart mock */}
                      <div className="flex items-end justify-between h-48 border-b border-slate-100 pb-2">
                        {[40, 70, 30, 85, 60, 95].map((h, i) => (
                          <div key={i} className="flex gap-1 w-12">
                            <div className="w-1/2 bg-yellow-400 rounded-t-sm" style={{ height: `${h}%` }}></div>
                            <div className="w-1/2 bg-slate-300 rounded-t-sm" style={{ height: `${h * 0.6}%` }}></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            TRUST BAR
        ═══════════════════════════════════════════════════════════ */}
        <section className="bg-white border-b border-slate-200 py-10 mt-8">
          <div className="max-w-[1280px] mx-auto px-[5%]">
            <p className="text-center text-sm font-bold text-slate-400 tracking-widest uppercase mb-6">
              Connected with leading Indian banks
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
              <div className="text-xl font-bold text-slate-800">HDFC BANK</div>
              <div className="text-xl font-bold text-slate-800">ICICI Bank</div>
              <div className="text-xl font-bold text-slate-800">Axis Bank</div>
              <div className="text-xl font-bold text-slate-800">SBI</div>
              <div className="text-xl font-bold text-slate-800">Kotak</div>
              <div className="text-xl font-bold text-slate-800">Standard Chartered</div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            END-TO-END FEATURES (Bento Grid Style)
        ═══════════════════════════════════════════════════════════ */}
        <section id="features" className="py-24 bg-[#fafbfc]">
          <div className="max-w-[1280px] mx-auto px-[5%]">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">End-to-end accounting. Done right.</h2>
              <p className="text-lg text-slate-600">From negotiating deals to raising sales orders and invoicing, Waves Books handles mundane accounting tasks so you can focus on your business.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Receivables</h3>
                <p className="text-slate-600 mb-4 leading-relaxed">Create professional invoices, send payment reminders automatically, and get paid faster online.</p>
                <ul className="space-y-2 text-sm text-slate-700 font-medium">
                  <li>• Estimates & Quotes</li>
                  <li>• Retainer Invoices</li>
                  <li>• Payment Gateways</li>
                </ul>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center mb-6">
                  <Wallet className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Payables</h3>
                <p className="text-slate-600 mb-4 leading-relaxed">Stay on top of your bills and know where your money goes. Track expenses and automate recurring bills.</p>
                <ul className="space-y-2 text-sm text-slate-700 font-medium">
                  <li>• Vendor Management</li>
                  <li>• Purchase Orders</li>
                  <li>• Expense Tracking</li>
                </ul>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-6">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Inventory</h3>
                <p className="text-slate-600 mb-4 leading-relaxed">Capture goods and services, set reorder points, and replenish stock before it runs out.</p>
                <ul className="space-y-2 text-sm text-slate-700 font-medium">
                  <li>• Item Adjustments</li>
                  <li>• Custom Price Lists</li>
                  <li>• Multi-warehouse tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            GST & COMPLIANCE (Dark Theme Section)
        ═══════════════════════════════════════════════════════════ */}
        <section id="gst" className="py-24 bg-slate-900 text-white">
          <div className="max-w-[1280px] mx-auto px-[5%] grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-yellow-400 text-xs font-bold tracking-widest uppercase mb-6 border border-slate-700">
                <ShieldCheck className="w-4 h-4" /> India specific
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
                100% GST Compliant. <br />
                <span className="text-slate-400">Zero headaches.</span>
              </h2>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Stay on top of India's tax regulations effortlessly. Waves Books automatically calculates GST, generates e-invoices, and pushes data directly to the GST portal.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center shrink-0">
                    <Receipt className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">Direct GST Filing</h4>
                    <p className="text-slate-400">Generate GSTR-1, GSTR-3B, and GSTR-9 returns and push them directly to the portal.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">E-Invoicing & E-Way Bills</h4>
                    <p className="text-slate-400">Generate IRNs and QR codes instantly. Create E-Way bills directly from your invoices.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center shrink-0">
                    <Percent className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">TDS & TCS</h4>
                    <p className="text-slate-400">Automatically calculate and deduct TDS/TCS on your transactions as per the latest IT Act rules.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* GST Mockup Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full"></div>
              <div className="relative bg-slate-800 rounded-xl border border-slate-700 shadow-2xl p-6">
                <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-4">
                  <div className="font-bold text-white">GSTR-3B Summary</div>
                  <div className="text-sm bg-slate-700 px-3 py-1 rounded text-slate-300">August 2026</div>
                </div>
                <div className="space-y-4">
                  <div className="bg-slate-900 rounded p-4 border border-slate-700 flex justify-between items-center">
                    <div>
                      <div className="text-slate-400 text-sm mb-1">Outward Supplies</div>
                      <div className="text-xl font-bold text-white">₹14,50,000</div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-400 text-sm mb-1">Tax Liability</div>
                      <div className="text-xl font-bold text-red-400">₹2,61,000</div>
                    </div>
                  </div>
                  <div className="bg-slate-900 rounded p-4 border border-slate-700 flex justify-between items-center">
                    <div>
                      <div className="text-slate-400 text-sm mb-1">Eligible ITC</div>
                      <div className="text-xl font-bold text-white">₹8,20,000</div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-400 text-sm mb-1">ITC Amount</div>
                      <div className="text-xl font-bold text-green-400">₹1,47,600</div>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded mt-4 transition-colors">
                    Push to GST Portal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            BANKING SECTION
        ═══════════════════════════════════════════════════════════ */}
        <section id="banking" className="py-24 bg-white">
          <div className="max-w-[1280px] mx-auto px-[5%] text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Connected Banking</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-16">
              Skip data entry. Connect your bank accounts to fetch feeds automatically, reconcile transactions in a flash, and pay vendors directly from Waves Books.
            </p>

            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="p-6">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <Cloud className="w-6 h-6 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Automatic Bank Feeds</h3>
                <p className="text-slate-600">Securely connect your bank accounts and fetch transactions automatically every day without manual CSV imports.</p>
              </div>
              <div className="p-6 border-x border-slate-100">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-6 h-6 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Reconciliation</h3>
                <p className="text-slate-600">Our intelligent engine automatically matches bank transactions with invoices and bills, saving hours of manual work.</p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <Banknote className="w-6 h-6 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Direct Payments</h3>
                <p className="text-slate-600">Initiate NEFT/RTGS/IMPS payments to your vendors directly from within Waves Books via supported partner banks.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            PRICING
        ═══════════════════════════════════════════════════════════ */}
        <section id="pricing" className="py-24 bg-[#fafbfc] border-y border-slate-200">
          <div className="max-w-[1280px] mx-auto px-[5%]">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Transparent pricing. No hidden fees.</h2>
              <p className="text-lg text-slate-600">Choose the plan that fits your business needs.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              
              {/* Free Plan */}
              <div className="bg-white rounded-2xl p-8 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Free</h3>
                <p className="text-slate-500 text-sm mb-6">For businesses with revenue &lt; ₹25 Lakhs per annum</p>
                <div className="mb-8">
                  <span className="text-4xl font-extrabold text-slate-900">₹0</span>
                </div>
                <Link href="/signup" className="block w-full py-3 px-4 text-center border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:border-slate-300 transition-colors mb-8">
                  SIGN UP
                </Link>
                <div className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Includes:</div>
                <ul className="space-y-4 text-sm text-slate-700">
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" /> 1 User + 1 Accountant</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" /> Manage up to 1,000 invoices</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" /> Client portal</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" /> Offline/Online Payments</li>
                </ul>
              </div>

              {/* Standard Plan */}
              <div className="bg-white rounded-2xl p-8 border-2 border-yellow-500 shadow-xl relative scale-105">
                <div className="absolute top-0 right-6 -translate-y-1/2 bg-yellow-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full">
                  Most Popular
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Standard</h3>
                <p className="text-slate-500 text-sm mb-6">For growing businesses managing daily finances</p>
                <div className="mb-8">
                  <span className="text-4xl font-extrabold text-slate-900">₹749</span>
                  <span className="text-slate-500"> / organization / month</span>
                </div>
                <Link href="/signup" className="block w-full py-3 px-4 text-center bg-yellow-500 text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors mb-8">
                  START FREE TRIAL
                </Link>
                <div className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Includes everything in Free +</div>
                <ul className="space-y-4 text-sm text-slate-700">
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" /> 3 Users (Admin + 2 others)</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" /> Unlimited invoices</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" /> Direct GST Filing & E-way bills</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" /> Custom Roles & Permissions</li>
                </ul>
              </div>

              {/* Professional Plan */}
              <div className="bg-white rounded-2xl p-8 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Professional</h3>
                <p className="text-slate-500 text-sm mb-6">For established businesses needing advanced workflows</p>
                <div className="mb-8">
                  <span className="text-4xl font-extrabold text-slate-900">₹1,499</span>
                  <span className="text-slate-500"> / organization / month</span>
                </div>
                <Link href="/signup" className="block w-full py-3 px-4 text-center border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:border-slate-300 transition-colors mb-8">
                  START FREE TRIAL
                </Link>
                <div className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Includes everything in Standard +</div>
                <ul className="space-y-4 text-sm text-slate-700">
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" /> 5 Users</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" /> Multi-currency invoicing</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" /> Purchase Orders & Approvals</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" /> Advanced Inventory</li>
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            CTA
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-yellow-500 text-slate-900 text-center">
          <div className="max-w-3xl mx-auto px-[5%]">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Ready to take control of your finances?</h2>
            <p className="text-xl font-medium mb-10 text-slate-800">Join thousands of Indian businesses growing with Waves Books.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="px-8 py-4 bg-slate-900 text-white font-bold text-[15px] rounded-lg hover:bg-slate-800 transition-colors shadow-lg uppercase tracking-wider"
              >
                Access Waves Books
              </Link>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-white border-t border-slate-200 py-10 text-center">
        <p className="text-sm text-slate-500">© 2026 Waves Enterprise Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
