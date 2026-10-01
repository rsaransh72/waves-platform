"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const [loading, setLoading] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [workspacePath, setWorkspacePath] = useState("/school");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      const { data: isPlatformAdmin, error: adminRoleError } = await supabase.rpc("is_platform_admin");
      if (adminRoleError) {
        await supabase.auth.signOut();
        throw new Error("Workspace access is not configured yet. Contact your Waves administrator.");
      }

      let workspace = isPlatformAdmin ? "admin" : "school";
      if (!isPlatformAdmin) {
        const { data: organizationId, error: membershipError } = await supabase.rpc("get_auth_client_organization_id");
        if (membershipError || !organizationId) {
          await supabase.auth.signOut();
          throw new Error("This account is not linked to an active client workspace. Contact your organization administrator.");
        }
        const { data: organization, error: organizationError } = await supabase
          .from("organizations")
          .select("type")
          .eq("id", organizationId)
          .single();
        if (organizationError || !organization) {
          await supabase.auth.signOut();
          throw new Error("The linked client workspace could not be loaded. Contact your Waves administrator.");
        }
        workspace = organization.type === "school" ? "school" : "client";
      }

      const requestedPath = new URLSearchParams(window.location.search).get("next");
      const allowedPrefix = workspace === "admin" ? "/admin" : workspace === "school" ? "/school" : "/client";
      const isAllowedNextPath = requestedPath === allowedPrefix || requestedPath?.startsWith(`${allowedPrefix}/`);
      const destination = isAllowedNextPath && requestedPath ? requestedPath : allowedPrefix;

      setWorkspacePath(destination);
      setSignedIn(true);
      router.replace(destination);
      router.refresh();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#111111] antialiased">
      {/* Top Header - Matching Zoho Style */}
      <header className="w-full bg-white py-6 px-6 sm:px-12 lg:px-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2.5">
          <div className="grid grid-cols-2 gap-1 w-7 h-7 shrink-0">
            <span className="w-3 h-3 rounded-[2px] bg-[#e42525]" />
            <span className="w-3 h-3 rounded-[2px] bg-[#226eb4]" />
            <span className="w-3 h-3 rounded-[2px] bg-[#10b981]" />
            <span className="w-3 h-3 rounded-[2px] bg-[#f59e0b]" />
          </div>
          <span className="text-[22px] font-medium tracking-tight text-black leading-none">
            WAVES
          </span>
        </Link>

        <div className="text-[14px] text-[#333333]">
          <span className="hidden sm:inline">Need a client workspace? </span>
          <Link 
            href="/book-demo" 
            className="text-[#0066cc] font-bold hover:underline ml-1 sm:ml-1 uppercase text-[13px]"
          >
            REQUEST A DEMO
          </Link>
        </div>
      </header>

      {/* Main Centered Form Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-6 pb-16">
        <div className="w-full max-w-[460px] mx-auto">
          
          {signedIn ? (
            <div className="text-center py-10 animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-200">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
                Authentication Successful
              </h1>
              <p className="text-[14px] text-[#404040] mt-3 leading-relaxed">
                Signed in as <strong className="text-[#111111]">{email}</strong>. Launching your institutional dashboard...
              </p>
              <div className="mt-8 space-y-3">
                <Link
                  href={workspacePath}
                  className="w-full h-[52px] bg-[#e42525] hover:bg-[#d60012] text-white font-bold text-[14px] uppercase tracking-wider rounded-[4px] transition flex items-center justify-center cursor-pointer shadow-xs"
                >
                  OPEN WORKSPACE &gt;
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Heading */}
              <div className="text-center mb-8">
                <h1 className="text-[28px] sm:text-[32px] font-bold text-[#111111] tracking-tight">
                  Sign in
                </h1>
                <p className="text-[14px] text-[#404040] mt-1.5">
                  for client teams and platform administrators
                </p>
              </div>

              {errorMsg && (
                <div className="mb-5 p-3.5 rounded-[4px] bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email / Mobile Field */}
                <div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address *"
                    className="w-full h-[54px] px-4 rounded-[6px] border border-[#cccccc] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] text-[15px] outline-none transition placeholder:text-[#888888] bg-white text-[#111111]"
                  />
                </div>

                {/* Password Field with Eye Toggle */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password *"
                    className="w-full h-[54px] px-4 pr-12 rounded-[6px] border border-[#cccccc] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] text-[15px] outline-none transition placeholder:text-[#888888] bg-white text-[#111111]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7d7d7d] hover:text-[#333333] cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Remember & Forgot Password Links */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="w-4 h-4 rounded-[3px] border-[#cccccc] text-[#e42525] focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="remember" className="text-[13px] text-[#444444] cursor-pointer select-none">
                      Keep me signed in
                    </label>
                  </div>

                  <a href="#forgot" className="text-[13px] text-[#0066cc] hover:underline font-medium">
                    Forgot Password?
                  </a>
                </div>

                {/* Big Red Button - Exact Zoho Style */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-[52px] bg-[#e42525] hover:bg-[#d60012] text-white font-bold text-[14px] uppercase tracking-wider rounded-[4px] transition flex items-center justify-center cursor-pointer shadow-xs disabled:opacity-70"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>SIGNING IN...</span>
                      </span>
                    ) : (
                      <span>SIGN IN</span>
                    )}
                  </button>
                </div>
              </form>

              {/* Social Login Options */}
              <div className="mt-8 text-center">
                <div className="flex items-center justify-center space-x-2.5 text-[13px] text-[#404040]">
                  <span>or sign in using</span>
                  
                  {/* Google */}
                  <button 
                    onClick={() => alert("Google SSO is configured in production.")}
                    className="w-8 h-8 rounded border border-[#dddddd] flex items-center justify-center hover:bg-slate-50 transition cursor-pointer"
                    title="Sign in with Google"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                  </button>

                  {/* LinkedIn */}
                  <button 
                    onClick={() => alert("LinkedIn SSO is configured in production.")}
                    className="w-8 h-8 rounded border border-[#dddddd] flex items-center justify-center hover:bg-slate-50 transition cursor-pointer"
                    title="Sign in with LinkedIn"
                  >
                    <svg className="w-4 h-4 fill-[#0a66c2]" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v7.6h2.8v-7.6h-2.8M7.86 6.5a1.63 1.63 0 1 0 1.63 1.63A1.63 1.63 0 0 0 7.86 6.5z"/>
                    </svg>
                  </button>

                  {/* Microsoft */}
                  <button 
                    onClick={() => alert("Microsoft SSO is configured in production.")}
                    className="w-8 h-8 rounded border border-[#dddddd] flex items-center justify-center hover:bg-slate-50 transition cursor-pointer"
                    title="Sign in with Microsoft"
                  >
                    <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
                      <span className="w-1.5 h-1.5 bg-[#f25022]" />
                      <span className="w-1.5 h-1.5 bg-[#7fba00]" />
                      <span className="w-1.5 h-1.5 bg-[#00a4ef]" />
                      <span className="w-1.5 h-1.5 bg-[#ffb900]" />
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}

        </div>
      </main>

      {/* Centered Footer */}
      <footer className="mt-auto py-8 text-center text-[12px] text-[#7d7d7d]">
        <p>&copy; 2026, Waves Technologies Pvt. Ltd. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
