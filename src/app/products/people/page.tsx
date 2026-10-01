import Navbar from "@/components/Navbar";
import Link from "next/link";
import { 
  Users, Building2, Calendar, Target, Award, BarChart3,
  CheckCircle2, Clock, MapPin, Briefcase, FileText, Globe,
  Shield, Heart, Smile, Sparkles, TrendingUp
} from "lucide-react";

export const metadata = {
  title: "Waves People | Modern HR Management Software",
  description: "Take care of your most important asset: your people. Comprehensive HR software to manage onboarding, attendance, performance, and more."
};

export default function PeoplePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      <Navbar />

      {/* ─── People Specific Nav Bar ─── */}
      <div className="sticky top-[64px] z-40 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-sm">
        <div className="w-full max-w-[1280px] mx-auto px-[5%] h-[56px] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                <Users className="w-4 h-4" />
              </div>
              <span className="font-bold text-[18px] text-slate-900">Waves People</span>
            </div>
            <nav className="hidden lg:flex items-center gap-6 text-[14px] font-semibold text-slate-600">
              <a href="#core-hr" className="hover:text-purple-600 transition-colors py-[16px]">Core HR</a>
              <a href="#talent" className="hover:text-purple-600 transition-colors py-[16px]">Talent</a>
              <a href="#analytics" className="hover:text-purple-600 transition-colors py-[16px]">Analytics</a>
              <a href="#pricing" className="hover:text-purple-600 transition-colors py-[16px]">Pricing</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/signup" className="text-[13px] font-bold px-5 py-2 rounded-full bg-slate-900 text-white hover:bg-purple-600 transition-all shadow-md">
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1 w-full overflow-hidden">
        
        {/* ═══════════════════════════════════════════════════════════
            HERO SECTION (HR / People Theme)
        ═══════════════════════════════════════════════════════════ */}
        <section className="relative w-full pt-20 pb-32 overflow-hidden bg-purple-50">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-purple-200/50 to-indigo-200/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-60"></div>
          
          <div className="relative z-10 max-w-[1280px] mx-auto px-[5%] grid lg:grid-cols-2 gap-12 items-center">
            
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-purple-700 text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
                <Heart className="w-3.5 h-3.5" /> Human Resources
              </div>
              
              <h1 className="text-[44px] sm:text-[56px] font-bold text-slate-900 tracking-[-1.5px] leading-[1.1] mb-6">
                Build a workplace where people <span className="text-purple-600 relative inline-block">thrive.<svg className="absolute w-full h-3 -bottom-1 left-0 text-purple-300" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none"/></svg></span>
              </h1>
              
              <p className="text-[18px] leading-[1.6] text-slate-600 mb-8">
                From recruitment to retirement, Waves People simplifies HR operations so you can focus on building a great culture.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/signup"
                  className="font-bold text-white text-[15px] px-8 py-4 rounded-full bg-purple-600 hover:bg-purple-700 transition-all shadow-lg text-center"
                >
                  GET STARTED FREE
                </Link>
                <Link
                  href="/book-demo"
                  className="font-bold text-slate-700 text-[15px] px-8 py-4 rounded-full bg-white hover:bg-slate-50 transition-all text-center shadow-sm"
                >
                  Request a Demo
                </Link>
              </div>

              <p className="text-sm text-slate-500 font-medium">No credit card required. Free 30-day trial.</p>
            </div>

            {/* UI Mockup - HR Dashboard */}
            <div className="relative lg:h-[600px] flex items-center">
              <div className="relative w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100 p-6 z-10">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="font-bold text-xl text-slate-800">Good morning, Sarah 👋</h2>
                    <p className="text-sm text-slate-500">Here's what's happening today.</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center border-2 border-white shadow-sm">
                    <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Sarah" alt="Avatar" className="w-8 h-8 rounded-full" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                    <div className="flex items-center gap-2 text-orange-600 text-sm font-bold mb-2">
                      <Clock className="w-4 h-4" /> Pending Approvals
                    </div>
                    <div className="text-3xl font-bold text-slate-800">4</div>
                    <div className="text-xs text-slate-500 mt-1">Leave requests</div>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                    <div className="flex items-center gap-2 text-blue-600 text-sm font-bold mb-2">
                      <TrendingUp className="w-4 h-4" /> Headcount
                    </div>
                    <div className="text-3xl font-bold text-slate-800">142</div>
                    <div className="text-xs text-blue-500 mt-1 font-medium">+12 this quarter</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm">New Joinees (This Week)</h3>
                  <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 p-1"><img src="https://api.dicebear.com/7.x/notionists/svg?seed=Mike" className="rounded-full" /></div>
                      <div>
                        <div className="font-bold text-sm text-slate-800">Michael Chang</div>
                        <div className="text-xs text-slate-500">Product Designer</div>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Onboarding: 80%</div>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-pink-100 p-1"><img src="https://api.dicebear.com/7.x/notionists/svg?seed=Emma" className="rounded-full" /></div>
                      <div>
                        <div className="font-bold text-sm text-slate-800">Emma Watson</div>
                        <div className="text-xs text-slate-500">Marketing Lead</div>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">Onboarding: 30%</div>
                  </div>
                </div>
              </div>
              
              {/* Floating Element */}
              <div className="absolute top-10 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 z-20 flex flex-col gap-2">
                <div className="flex items-center gap-3 text-sm font-bold text-slate-800">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Smile className="w-4 h-4 text-purple-600" />
                  </div>
                  Employee eNPS
                </div>
                <div className="text-2xl font-bold text-purple-600">76 <span className="text-xs text-slate-400 font-normal">Excellent</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            CORE HR SECTION
        ═══════════════════════════════════════════════════════════ */}
        <section id="core-hr" className="py-24 bg-white">
          <div className="max-w-[1280px] mx-auto px-[5%]">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Core HR, simplified.</h2>
              <p className="text-lg text-slate-600">Manage all your employee data, time off, and attendance in one secure, centralized database.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Employee Database</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">Maintain a secure, centralized directory for all employee information, documents, and assets.</p>
                <ul className="space-y-2 text-sm font-medium text-slate-700">
                  <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-purple-500" /> Custom fields</li>
                  <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-purple-500" /> Organization chart</li>
                  <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-purple-500" /> Document vault</li>
                </ul>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Leave Management</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">Create custom leave policies, automate accruals, and handle approvals from anywhere.</p>
                <ul className="space-y-2 text-sm font-medium text-slate-700">
                  <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-purple-500" /> Multiple holiday calendars</li>
                  <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-purple-500" /> Shift-based policies</li>
                  <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-purple-500" /> Mobile approvals</li>
                </ul>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Time & Attendance</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">Track hours accurately with web check-ins, biometric integration, and geolocation tracking.</p>
                <ul className="space-y-2 text-sm font-medium text-slate-700">
                  <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-purple-500" /> IP & Geo-restrictions</li>
                  <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-purple-500" /> Timesheets</li>
                  <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-purple-500" /> Payroll export ready</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            TALENT MANAGEMENT
        ═══════════════════════════════════════════════════════════ */}
        <section id="talent" className="py-24 bg-slate-900 text-white">
          <div className="max-w-[1280px] mx-auto px-[5%] grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="order-2 lg:order-1">
              <div className="relative p-8 bg-slate-800 rounded-3xl border border-slate-700">
                <div className="flex gap-4 items-center mb-8 pb-8 border-b border-slate-700">
                  <div className="w-16 h-16 rounded-2xl bg-slate-700 flex items-center justify-center">
                    <Target className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Performance</div>
                    <div className="text-2xl font-bold">Goal Setting</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="font-bold text-white mb-1">Q3 OKR: Increase User Retention</div>
                        <div className="text-xs text-slate-400">Assigned to: Product Team</div>
                      </div>
                      <div className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded">On Track</div>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 w-[75%] h-full rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="font-bold text-white mb-1">Q3 OKR: Launch Mobile App</div>
                        <div className="text-xs text-slate-400">Assigned to: Engineering Team</div>
                      </div>
                      <div className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded">At Risk</div>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-yellow-500 w-[40%] h-full rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Develop and retain your top talent.</h2>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                Move beyond annual reviews. Enable continuous feedback, align goals, and foster a culture of high performance.
              </p>
              
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <Sparkles className="w-6 h-6 text-purple-400 shrink-0" />
                  <div>
                    <h4 className="text-lg font-bold mb-1">360-Degree Feedback</h4>
                    <p className="text-slate-400 text-sm">Gather comprehensive insights from peers, managers, and subordinates to eliminate bias.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Target className="w-6 h-6 text-purple-400 shrink-0" />
                  <div>
                    <h4 className="text-lg font-bold mb-1">OKRs & Goal Tracking</h4>
                    <p className="text-slate-400 text-sm">Align individual goals with organizational objectives. Track progress transparently across the company.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Award className="w-6 h-6 text-purple-400 shrink-0" />
                  <div>
                    <h4 className="text-lg font-bold mb-1">Learning Management</h4>
                    <p className="text-slate-400 text-sm">Create courses, assign training, and track employee skill development directly within the platform.</p>
                  </div>
                </li>
              </ul>
            </div>
            
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            CTA
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-white text-center border-t border-slate-100">
          <div className="max-w-3xl mx-auto px-[5%]">
            <div className="w-20 h-20 rounded-3xl bg-purple-100 flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Users className="w-10 h-10 text-purple-600" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-slate-900">Empower your workforce today.</h2>
            <p className="text-xl font-medium mb-10 text-slate-600">Join forward-thinking companies building better cultures with Waves People.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="px-8 py-4 bg-purple-600 text-white font-bold text-[15px] rounded-full hover:bg-purple-700 transition-colors shadow-lg"
              >
                Start Your Free Trial
              </Link>
            </div>
          </div>
        </section>

      </main>
      
      <footer className="bg-slate-50 border-t border-slate-200 py-10 text-center">
        <p className="text-sm text-slate-500">© 2026 Waves Enterprise Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
