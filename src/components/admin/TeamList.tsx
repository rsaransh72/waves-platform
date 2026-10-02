"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { KeyRound, Loader2, Trash2, UserPlus } from "lucide-react";
import { formatAdminDate, formatAdminDateTime } from "@/lib/admin-format";
import { EmailInput, NameInput } from "@/components/forms/IndiaInputs";
import { inviteTeamMember, removeTeamMember, sendTeamPasswordReset, updateTeamMember, type TeamActionResult } from "@/app/actions/team";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  lastSignInAt: string | null;
  invited: boolean;
};

const ROLE_LABELS: Record<string, string> = { superadmin: "Super administrator", admin: "Administrator" };
const inputClass = "w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

export function TeamList({ members, currentEmail }: { members: TeamMember[]; currentEmail: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "admin" });

  const run = (id: string, action: () => Promise<TeamActionResult>, onSuccess?: () => void) => {
    setBusyId(id);
    startTransition(async () => {
      const result = await action();
      setBusyId(null);
      if (result.error) return void toast.error(result.error);
      toast.success(result.message ?? "Done.");
      onSuccess?.();
      router.refresh();
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Platform team</h1>
        <p className="text-sm text-slate-500">People at your company who can sign in to this admin console. Administrators manage clients, leads and the website; super administrators can also manage this team.</p>
      </div>

      <form
        className="rounded-lg border border-slate-200 bg-white p-5"
        onSubmit={(event) => {
          event.preventDefault();
          run("invite", () => inviteTeamMember(form), () => setForm({ name: "", email: "", role: "admin" }));
        }}
      >
        <h2 className="flex items-center gap-2 font-bold text-slate-900"><UserPlus className="h-4 w-4 text-blue-600" /> Invite a team member</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_200px_auto] sm:items-end">
          <div>
            <label htmlFor="team-name" className="mb-1 block text-xs font-bold text-slate-600">Name</label>
            <NameInput id="team-name" value={form.name} onValueChange={(name) => setForm((current) => ({ ...current, name }))} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="team-email" className="mb-1 block text-xs font-bold text-slate-600">Work email</label>
            <EmailInput id="team-email" value={form.email} onValueChange={(email) => setForm((current) => ({ ...current, email }))} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="team-role" className="mb-1 block text-xs font-bold text-slate-600">Role</label>
            <select id="team-role" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className={inputClass}>
              <option value="admin">Administrator</option>
              <option value="superadmin">Super administrator</option>
            </select>
          </div>
          <button type="submit" disabled={isPending} className="inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50">
            {busyId === "invite" && <Loader2 className="h-4 w-4 animate-spin" />} Send invitation
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-500">They receive an email to set a password, then sign in at /login.</p>
      </form>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Person</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Access</th>
              <th className="px-4 py-3">Last sign-in</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map((member) => {
              const isSelf = member.email.toLowerCase() === currentEmail.toLowerCase();
              const busy = isPending && busyId === member.id;
              return (
                <tr key={member.id}>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{member.name}{isSelf && <span className="ml-2 text-xs font-normal text-slate-400">(you)</span>}</div>
                    <div className="text-xs text-slate-500">{member.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={member.role}
                      disabled={isSelf || busy}
                      onChange={(event) => run(member.id, () => updateTeamMember(member.id, { role: event.target.value }))}
                      className="rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 disabled:bg-slate-50"
                      aria-label={`Role for ${member.email}`}
                    >
                      {!ROLE_LABELS[member.role] && <option value={member.role}>{member.role} (no access)</option>}
                      <option value="admin">Administrator</option>
                      <option value="superadmin">Super administrator</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    {member.invited ? (
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">Invitation pending</span>
                    ) : member.status === "active" ? (
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">Active</span>
                    ) : (
                      <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold capitalize text-red-700">{member.status}</span>
                    )}
                    <div className="mt-1 text-[11px] text-slate-400">Added {formatAdminDate(member.created_at)}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{member.lastSignInAt ? formatAdminDateTime(member.lastSignInAt) : "Never"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button type="button" disabled={busy} onClick={() => run(member.id, () => sendTeamPasswordReset(member.id))} className="inline-flex items-center gap-1.5 rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40">
                        <KeyRound className="h-3.5 w-3.5" /> {member.invited ? "Resend link" : "Password reset"}
                      </button>
                      {!isSelf && (
                        <>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => run(member.id, () => updateTeamMember(member.id, { status: member.status === "active" ? "suspended" : "active" }))}
                            className={`rounded border px-2.5 py-1.5 text-xs font-semibold disabled:opacity-40 ${member.status === "active" ? "border-red-200 text-red-700 hover:bg-red-50" : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"}`}
                          >
                            {member.status === "active" ? "Suspend" : "Reactivate"}
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => { if (window.confirm(`Remove ${member.email} from the platform team?`)) run(member.id, () => removeTeamMember(member.id)); }}
                            className="rounded border border-red-200 p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-40"
                            aria-label={`Remove ${member.email}`}
                            title="Remove"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
