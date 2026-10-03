"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { openEmailLink, readEmailLink, type EmailLink } from "@/lib/email-link";

const EXPIRED = "This link is invalid or expired. Request a new one from your administrator.";

// tokenLink is the ?token_hash link from the email, read on the server. It is verified
// on submit, so email scanners that open the page cannot use up the one-time link.
export function PasswordRecoveryForm({ tokenLink }: { tokenLink: EmailLink }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const isInvite = tokenLink.kind === "token" && tokenLink.type === "invite";
  const pendingLink = useRef<EmailLink | null>(tokenLink.kind === "token" ? tokenLink : null);

  useEffect(() => {
    // Older links carry the session (or an error) in the URL hash, which only the browser sees.
    // A reset requested from the sign-in page arrives as ?code=, which the client exchanges itself.
    const link = readEmailLink();
    if (link.kind === "error" || link.kind === "session") {
      void openEmailLink(createClient(), link).then((message) => message && setError(`${message} Request a new one from your administrator.`));
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (password.length < 12) {
      setError("Use a password with at least 12 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setIsSaving(true);
    const supabase = createClient();
    if (pendingLink.current) {
      const linkError = await openEmailLink(supabase, pendingLink.current);
      if (linkError) {
        setError(`${linkError} Request a new one from your administrator.`);
        setIsSaving(false);
        return;
      }
      pendingLink.current = null;
    }
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      setError(EXPIRED);
      setIsSaving(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password, data: { password_set_at: new Date().toISOString() } });
    if (updateError) {
      setError(updateError.message);
      setIsSaving(false);
      return;
    }

    await supabase.auth.signOut();
    router.replace("/login?password-updated=1");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12">
      <section className="w-full max-w-md border-t-4 border-blue-700 bg-white p-8 shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center bg-blue-700 text-white"><KeyRound className="h-5 w-5" /></div>
        <p className="mt-6 text-xs font-bold uppercase text-blue-700">{isInvite ? "Welcome to Waves" : "Account recovery"}</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">{isInvite ? "Set your password" : "Set a new password"}</h1>
        <p className="mt-2 text-sm text-slate-600">Choose a password with at least 12 characters.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <p role="alert" className="border-l-4 border-red-600 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
          <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
            New password
            <input type="password" autoComplete="new-password" minLength={12} required value={password} onChange={(event) => setPassword(event.target.value)} className="h-11 rounded border border-slate-300 px-3 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100" />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
            Confirm password
            <input type="password" autoComplete="new-password" minLength={12} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="h-11 rounded border border-slate-300 px-3 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100" />
          </label>
          <button type="submit" disabled={isSaving} className="h-11 w-full bg-blue-700 px-4 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60">
            {isSaving ? "Updating password..." : isInvite ? "Activate account" : "Update password"}
          </button>
        </form>
      </section>
    </main>
  );
}
