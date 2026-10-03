"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, Eye, EyeOff, GraduationCap, LinkIcon, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { openEmailLink, readEmailLink, type EmailLink } from "@/lib/email-link";
import { SCHOOL_ROLE_LABELS, normalizeSchoolRole } from "@/lib/school-permissions";

const MIN_PASSWORD = 12;

type Invitee = { email: string; organizationName: string | null; organizationType: string | null; roleLabel: string | null };
type Step =
  | { name: "loading" }
  | { name: "welcome"; link: EmailLink }
  | { name: "password"; invitee: Invitee }
  | { name: "invalid"; message: string };

async function loadInvitee(supabase: ReturnType<typeof createClient>): Promise<Invitee | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return null;
  const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;
  const text = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : null);
  const role = text(metadata.invited_role);
  return {
    email: user.email,
    organizationName: text(metadata.organization_name),
    organizationType: text(metadata.organization_type),
    roleLabel: role ? SCHOOL_ROLE_LABELS[normalizeSchoolRole(role)] : null,
  };
}

async function openInvitation(link: EmailLink): Promise<Step> {
  const supabase = createClient();
  const error = await openEmailLink(supabase, link);
  const invitee = error ? null : await loadInvitee(supabase);
  return invitee ? { name: "password", invitee } : { name: "invalid", message: error ?? "This invitation is missing or has expired." };
}

// tokenLink is the ?token_hash link from the email, read on the server. A fresh
// invitation waits for the click, so email scanners cannot use up the one-time link.
export function SchoolInviteAcceptance({ tokenLink }: { tokenLink: EmailLink }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(tokenLink.kind === "token" ? { name: "welcome", link: tokenLink } : { name: "loading" });
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    // Older links carry the session (or an error) in the URL hash, which only the browser sees.
    if (tokenLink.kind !== "token") void openInvitation(readEmailLink()).then(setStep);
  }, [tokenLink.kind]);

  const accept = async (link: EmailLink) => {
    setIsWorking(true);
    setStep(await openInvitation(link));
    setIsWorking(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-5 py-12">
      <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Waves Technologies</p>
      <section className="w-full max-w-md border-t-4 border-blue-700 bg-white p-8 shadow-sm">
        {step.name === "loading" && (
          <div className="flex items-center gap-3 py-10 text-sm text-slate-600" role="status">
            <Loader2 className="h-5 w-5 animate-spin text-blue-700" />Checking your invitation...
          </div>
        )}

        {step.name === "welcome" && (
          <>
            <Badge />
            <p className="mt-6 text-xs font-bold uppercase text-blue-700">Step 1 of 2</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">You&apos;re invited</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Accept your invitation to open your account. Next you&apos;ll choose a password, and then you&apos;re in.
            </p>
            <button type="button" onClick={() => void accept(step.link)} disabled={isWorking} className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 bg-blue-700 px-4 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60">
              {isWorking ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              {isWorking ? "Opening invitation..." : "Accept invitation"}
            </button>
          </>
        )}

        {step.name === "password" && (
          <PasswordStep invitee={step.invitee} onDone={(path) => { router.replace(path); router.refresh(); }} />
        )}

        {step.name === "invalid" && (
          <>
            <div className="flex h-11 w-11 items-center justify-center bg-amber-100 text-amber-800"><LinkIcon className="h-5 w-5" /></div>
            <h1 className="mt-6 text-2xl font-bold text-slate-900">This invitation can&apos;t be used</h1>
            <p role="alert" className="mt-2 text-sm leading-6 text-slate-600">{step.message}</p>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Ask whoever invited you to send it again. School staff can be re-invited by their school administrator from <strong>Users &amp; Access</strong>.
            </p>
            <p className="mt-4 text-sm text-slate-600">
              Already set your password? <Link href="/login" className="font-semibold text-blue-700 hover:text-blue-900">Sign in</Link>
            </p>
          </>
        )}
      </section>
    </main>
  );
}

function Badge() {
  return (
    <div className="flex h-11 w-11 items-center justify-center bg-blue-700 text-white">
      <GraduationCap className="h-6 w-6" />
    </div>
  );
}

function PasswordStep({ invitee, onDone }: { invitee: Invitee; onDone: (path: string) => void }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const longEnough = password.length >= MIN_PASSWORD;
  const matches = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!longEnough) return setError(`Use a password with at least ${MIN_PASSWORD} characters.`);
    if (!matches) return setError("The passwords do not match.");

    setIsSaving(true);
    const { error: passwordError } = await createClient().auth.updateUser({ password, data: { password_set_at: new Date().toISOString() } });
    if (passwordError) {
      setError(passwordError.message);
      setIsSaving(false);
      return;
    }
    onDone(invitee.organizationType === "school" ? "/school" : "/client");
  };

  const inputClass = "h-11 w-full rounded border border-slate-300 px-3 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100";

  return (
    <>
      <Badge />
      <p className="mt-6 text-xs font-bold uppercase text-blue-700">Step 2 of 2</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">
        {invitee.organizationName ? <>Welcome to {invitee.organizationName}</> : "Set your password"}
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {invitee.roleLabel ? <>You&apos;re joining as <strong className="text-slate-800">{invitee.roleLabel}</strong>. </> : null}
        Choose a password to activate your account.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && <p role="alert" className="border-l-4 border-red-600 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
          Email
          <input type="email" autoComplete="username" readOnly value={invitee.email} className={`${inputClass} bg-slate-50 text-slate-600`} />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
          New password
          <span className="relative">
            <input type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={MIN_PASSWORD} required autoFocus value={password} onChange={(event) => setPassword(event.target.value)} className={`${inputClass} pr-11`} />
            <button type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 hover:text-slate-800">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </span>
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
          Confirm password
          <input type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={MIN_PASSWORD} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className={inputClass} />
        </label>
        <ul className="space-y-1 text-xs">
          <Requirement met={longEnough}>At least {MIN_PASSWORD} characters</Requirement>
          <Requirement met={matches}>Both passwords match</Requirement>
        </ul>
        <button type="submit" disabled={isSaving} className="inline-flex h-11 w-full items-center justify-center gap-2 bg-blue-700 px-4 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          {isSaving ? "Activating account..." : "Activate account"}
        </button>
      </form>
    </>
  );
}

function Requirement({ met, children }: { met: boolean; children: React.ReactNode }) {
  return (
    <li className={`flex items-center gap-2 ${met ? "text-emerald-700" : "text-slate-500"}`}>
      <Check className={`h-3.5 w-3.5 ${met ? "opacity-100" : "opacity-30"}`} />{children}
    </li>
  );
}
