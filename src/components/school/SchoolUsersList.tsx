"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { KeyRound, Loader2, Mail, Trash2, UserPlus } from "lucide-react";
import { formatAdminDateTime } from "@/lib/admin-format";
import {
  changeSchoolUserRole,
  inviteSchoolUser,
  removeSchoolUser,
  resendSchoolInvite,
  sendSchoolPasswordReset,
  type SchoolActionResult,
} from "@/app/actions/school-users";

type Member = {
  userId: string;
  role: string;
  email: string | null;
  name: string | null;
  accountStatus: "active" | "invited" | "unknown";
  lastSignInAt: string | null;
};

const ROLE_OPTIONS = [
  { value: "admin", label: "Administrator", description: "Everything, including fees, settings and users." },
  { value: "teacher", label: "Teacher", description: "Attendance, exams and grades, notices. Cannot see fees." },
  { value: "staff", label: "Office staff", description: "Students, fee collection, library, transport, notices." },
];

const inputClass = "w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";
const secondaryButton = "inline-flex items-center gap-1.5 rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40";

export function SchoolUsersList({ members, currentUserId, loadError }: { members: Member[]; currentUserId: string; loadError: string | null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("teacher");

  const run = (key: string, action: () => Promise<SchoolActionResult>, onSuccess?: () => void) => {
    setActiveKey(key);
    startTransition(async () => {
      const result = await action();
      setActiveKey(null);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      if (result.message) toast.success(result.message);
      onSuccess?.();
      router.refresh();
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Users & Access</h1>
        <p className="mt-1 text-sm text-slate-500">Invite your teachers and office staff. Each person signs in with their own account and sees only what their role allows.</p>
      </div>

      <form
        className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
        onSubmit={(event) => {
          event.preventDefault();
          run("invite", () => inviteSchoolUser(email, role), () => setEmail(""));
        }}
      >
        <h2 className="flex items-center gap-2 font-bold text-slate-900"><UserPlus className="h-4 w-4 text-blue-600" /> Invite a user</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_200px_auto] sm:items-end">
          <div>
            <label htmlFor="invite-email" className="mb-1 block text-xs font-bold text-slate-600">Email</label>
            <input id="invite-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="teacher@school.edu" className={inputClass} />
          </div>
          <div>
            <label htmlFor="invite-role" className="mb-1 block text-xs font-bold text-slate-600">Role</label>
            <select id="invite-role" value={role} onChange={(event) => setRole(event.target.value)} className={inputClass}>
              {ROLE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
          <button type="submit" disabled={isPending} className="inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50">
            {activeKey === "invite" && <Loader2 className="h-4 w-4 animate-spin" />} Send invitation
          </button>
        </div>
        <dl className="mt-4 grid grid-cols-1 gap-2 border-t border-slate-100 pt-4 text-xs sm:grid-cols-3">
          {ROLE_OPTIONS.map((option) => (
            <div key={option.value}>
              <dt className="font-bold text-slate-700">{option.label}</dt>
              <dd className="text-slate-500">{option.description}</dd>
            </div>
          ))}
        </dl>
      </form>

      {loadError && <div role="alert" className="border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-900">{loadError}</div>}

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4 font-bold text-slate-900">People with access ({members.length})</div>
        {members.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">No users yet.</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {members.map((member) => {
              const isSelf = member.userId === currentUserId;
              const busy = isPending && activeKey?.endsWith(member.userId);
              return (
                <li key={member.userId} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-slate-900">
                      {member.name || member.email || "Unknown account"}{isSelf && <span className="ml-2 text-xs font-normal text-slate-400">(you)</span>}
                    </div>
                    {member.name && member.email && <div className="truncate text-xs text-slate-500">{member.email}</div>}
                    <div className="mt-1 text-xs text-slate-400">
                      {member.accountStatus === "invited"
                        ? <span className="font-semibold text-amber-700">Invitation pending</span>
                        : `Last sign-in: ${member.lastSignInAt ? formatAdminDateTime(member.lastSignInAt) : "Never"}`}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={member.role === "owner" ? "admin" : member.role}
                      disabled={busy || isSelf}
                      title={isSelf ? "Ask another administrator to change your role." : undefined}
                      onChange={(event) => run(`role-${member.userId}`, () => changeSchoolUserRole(member.userId, event.target.value))}
                      className="rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 disabled:bg-slate-50"
                      aria-label={`Role for ${member.email ?? "user"}`}
                    >
                      {!["admin", "teacher", "staff", "owner"].includes(member.role) && <option value={member.role}>{member.role}</option>}
                      {ROLE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                    {member.accountStatus === "invited" ? (
                      <button type="button" disabled={busy} onClick={() => run(`invite-${member.userId}`, () => resendSchoolInvite(member.userId))} className={secondaryButton}>
                        <Mail className="h-3.5 w-3.5" /> Resend invite
                      </button>
                    ) : (
                      <button type="button" disabled={busy || !member.email} onClick={() => run(`reset-${member.userId}`, () => sendSchoolPasswordReset(member.userId))} className={secondaryButton}>
                        <KeyRound className="h-3.5 w-3.5" /> Password reset
                      </button>
                    )}
                    {!isSelf && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => {
                          if (window.confirm(`Remove ${member.email ?? "this user"}'s access to the school?`)) {
                            run(`remove-${member.userId}`, () => removeSchoolUser(member.userId));
                          }
                        }}
                        className="inline-flex items-center rounded border border-red-200 bg-white p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-40"
                        aria-label={`Remove ${member.email ?? "user"}`}
                        title="Remove access"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
