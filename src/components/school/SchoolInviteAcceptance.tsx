"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

export function SchoolInviteAcceptance() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setError("This invitation is missing or expired. Ask your platform administrator to send a new one.");
      setIsSaving(false);
      return;
    }

    const { error: passwordError } = await supabase.auth.updateUser({ password });
    if (passwordError) {
      setError(passwordError.message);
      setIsSaving(false);
      return;
    }

    const organizationType = user.user_metadata?.organization_type;
    router.replace(organizationType === "school" ? "/school" : "/client");
    router.refresh();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12">
      <section className="w-full max-w-md border-t-4 border-blue-700 bg-white p-8 shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center bg-blue-700 text-white">
          <GraduationCap className="h-6 w-6" />
        </div>
        <p className="mt-6 text-xs font-bold uppercase text-blue-700">Client workspace invitation</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Set your administrator password</h1>
        <p className="mt-2 text-sm text-slate-600">Choose a password with at least 12 characters to activate your client account.</p>
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
          <button type="submit" disabled={isSaving} className="inline-flex h-11 w-full items-center justify-center gap-2 bg-blue-700 px-4 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60">
            <Check className="h-4 w-4" />{isSaving ? "Activating account..." : "Activate account"}
          </button>
        </form>
        <Link href="/login" className="mt-5 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900">Back to sign in</Link>
      </section>
    </main>
  );
}