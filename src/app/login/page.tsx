"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetState, setResetState] = useState<"idle" | "sending" | "sent">("idle");

  const [loading, setLoading] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [workspacePath, setWorkspacePath] = useState("/school");
  const [errorMsg, setErrorMsg] = useState("");

  const sendPasswordReset = async () => {
    setErrorMsg("");
    if (!/^[^s@]+@[^s@]+.[^s@]+$/.test(email.trim())) {
      setErrorMsg("Enter your email address above, then choose Forgot password.");
      return;
    }
    setResetState("sending");
    const { error } = await createClient().auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/account/reset-password`,
    });
    if (error) {
      setResetState("idle");
      setErrorMsg("The reset link could not be sent. Please try again in a few minutes.");
      return;
    }
    setResetState("sent");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const supabase = createClient();

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
                Signed in as <strong className="text-[#111111]">{email}</strong>. Opening your workspace...
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
                  <label htmlFor="login-email" className="mb-1.5 block text-[13px] font-medium text-[#333333]">Email address</label>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@school.in"
                    className="w-full h-[54px] px-4 rounded-[6px] border border-[#cccccc] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] text-[15px] outline-none transition placeholder:text-[#888888] bg-white text-[#111111]"
                  />
                </div>

                {/* Password Field with Eye Toggle */}
                <label htmlFor="login-password" className="-mb-2.5 block text-[13px] font-medium text-[#333333]">Password</label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
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
                <div className="flex items-center justify-end pt-1">
                  <button type="button" onClick={() => void sendPasswordReset()} disabled={resetState === "sending"} className="text-[13px] text-[#0066cc] hover:underline font-medium disabled:opacity-60">
                    {resetState === "sending" ? "Sending reset link..." : "Forgot password?"}
                  </button>
                </div>
                {resetState === "sent" && (
                  <p role="status" className="text-[13px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-[4px] p-3">
                    If an account exists for {email}, a password reset link has been sent to it.
                  </p>
                )}

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

              <p className="mt-8 text-center text-[13px] text-[#555555]">
                New to Waves? <Link href="/signup" className="text-[#0066cc] font-semibold hover:underline">Request an account</Link>
              </p>
            </>
          )}

        </div>
      </main>

      {/* Centered Footer */}
      <footer className="mt-auto py-8 text-center text-[12px] text-[#7d7d7d]">
        <p>&copy; {new Date().getFullYear()} Waves. All rights reserved.</p>
      </footer>
    </div>
  );
}
