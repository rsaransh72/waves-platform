"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

export function PasswordRecoveryForm() {
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
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      setError("This password recovery link is invalid or expired. Request a new one from your administrator.");
      setIsSaving(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });
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
        <p className="mt-6 text-xs font-bold uppercase text-blue-700">Account recovery</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Set a new password</h1>
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
            {isSaving ? "Updating password..." : "Update password"}
          </button>
        </form>
      </section>
    </main>
  );
}