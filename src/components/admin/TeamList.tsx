"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, KeyRound, Loader2, Mail, Search, ShieldCheck, Trash2, UserCheck, UserPlus, UserX, Users } from "lucide-react";
import { formatAdminDate, formatAdminDateTime, formatRelative } from "@/lib/admin-format";
import { emailError, personNameError } from "@/lib/india";
import { EmailInput, NameInput } from "@/components/forms/IndiaInputs";
import { inviteTeamMember, removeTeamMember, sendTeamPasswordReset, updateTeamMember, type TeamActionResult } from "@/app/actions/team";
import { Avatar, Badge, Banner, EmptyState, FieldError, PageHeader, PageSheet, adminInput, adminInvalid, button, td, th } from "@/components/admin/ui";
import { ConfirmDialog, Dialog, RowMenu, type MenuItem } from "@/components/admin/Overlay";

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

const ROLES = [
  { value: "admin", label: "Administrator", description: "Manages clients, leads, billing and the website." },
  { value: "superadmin", label: "Super administrator", description: "Everything an administrator can do, plus managing this team." },
] as const;
const roleLabel = (role: string) => ROLES.find((item) => item.value === role)?.label ?? `${role} (no access)`;

type Tab = "all" | "active" | "invited" | "suspended";
const TABS: { value: Tab; label: string; matches: (member: TeamMember) => boolean }[] = [
  { value: "all", label: "All", matches: () => true },
  { value: "active", label: "Active", matches: (member) => member.status === "active" && !member.invited },
  { value: "invited", label: "Invitation pending", matches: (member) => member.status === "active" && member.invited },
  { value: "suspended", label: "Suspended", matches: (member) => member.status !== "active" },
];

type Pending = { kind: "role" | "suspend" | "reactivate" | "remove"; member: TeamMember };

function StatusBadge({ member }: { member: TeamMember }) {
  if (member.status !== "active") return <Badge tone="red" dot>{member.status === "suspended" ? "Suspended" : member.status}</Badge>;
  if (member.invited) return <Badge tone="amber" dot>Invitation pending</Badge>;
  return <Badge tone="green" dot>Active</Badge>;
}

function InviteDialog({ open, onClose, members, onInvited }: { open: boolean; onClose: () => void; members: TeamMember[]; onInvited: (message: string) => void }) {
  const empty = { name: "", email: "", role: "admin" };
  const [form, setForm] = useState(empty);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const existing = members.find((member) => member.email.toLowerCase() === form.email.trim().toLowerCase());
  const errors = {
    name: personNameError(form.name),
    email: emailError(form.email, true) ?? (existing ? `${existing.name} already uses this email on the team.` : null),
  };
  const invalid = Boolean(errors.name || errors.email);

  const close = () => {
    if (isPending) return;
    setForm(empty);
    setSubmitted(false);
    setServerError(null);
    onClose();
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setServerError(null);
    event.currentTarget.checkValidity(); // shows each field's own message
    if (invalid) {
      document.getElementById(errors.name ? "invite-name" : "invite-email")?.focus();
      return;
    }
    startTransition(async () => {
      const result = await inviteTeamMember(form);
      if (result.error) return void setServerError(result.error);
      setForm(empty);
      setSubmitted(false);
      onInvited(result.message ?? "Invitation sent.");
    });
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      title="Invite a team member"
      description="They get an email to set a password, then sign in at /login."
      footer={
        <>
          <button type="button" onClick={close} className={button.secondary}>Cancel</button>
          <button type="submit" form="invite-form" disabled={isPending} className={button.primary}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            {isPending ? "Sending…" : "Send invitation"}
          </button>
        </>
      }
    >
      <form id="invite-form" noValidate onSubmit={submit} className="space-y-4">
        {serverError && <Banner tone="error" role="alert">{serverError}</Banner>}
        <div>
          <label htmlFor="invite-name" className="mb-1.5 block text-[13px] font-medium text-slate-700">Full name <span className="text-red-500">*</span></label>
          <NameInput id="invite-name" required value={form.name} onValueChange={(name) => setForm((current) => ({ ...current, name }))} placeholder="e.g. Priya Sharma" className={adminInput} />
        </div>
        <div>
          <label htmlFor="invite-email" className="mb-1.5 block text-[13px] font-medium text-slate-700">Work email <span className="text-red-500">*</span></label>
          <EmailInput id="invite-email" required value={form.email} onValueChange={(email) => setForm((current) => ({ ...current, email }))} placeholder="priya@company.in" className={`${adminInput} ${existing ? adminInvalid : ""}`} />
          {existing && <FieldError message={errors.email} />}
        </div>
        <fieldset>
          <legend className="mb-1.5 block text-[13px] font-medium text-slate-700">Role</legend>
          <div className="space-y-2">
            {ROLES.map((role) => {
              const checked = form.role === role.value;
              return (
                <label key={role.value} className={`flex cursor-pointer items-start gap-3 rounded border px-3 py-2.5 transition-colors ${checked ? "border-blue-500 bg-blue-50/60" : "border-slate-200 hover:border-slate-300"}`}>
                  <input type="radio" name="invite-role" checked={checked} onChange={() => setForm((current) => ({ ...current, role: role.value }))} className="mt-0.5 h-4 w-4 accent-blue-600" />
                  <span>
                    <span className="block text-sm font-medium text-slate-900">{role.label}</span>
                    <span className="block text-xs text-slate-500">{role.description}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
        {submitted && invalid && <p className="text-xs font-medium text-red-600">Fix the highlighted fields to send the invitation.</p>}
      </form>
    </Dialog>
  );
}

export function TeamList({ members, currentEmail }: { members: TeamMember[]; currentEmail: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [pending, setPending] = useState<Pending | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const isSelf = (member: TeamMember) => member.email.toLowerCase() === currentEmail.toLowerCase();
  const counts = useMemo(() => Object.fromEntries(TABS.map((item) => [item.value, members.filter(item.matches).length])) as Record<Tab, number>, [members]);
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matches = TABS.find((item) => item.value === tab)!.matches;
    return members.filter((member) => matches(member) && (!needle || member.name.toLowerCase().includes(needle) || member.email.toLowerCase().includes(needle)));
  }, [members, tab, query]);

  const run = (id: string, action: () => Promise<TeamActionResult>, onDone?: () => void) => {
    setBusyId(id);
    setActionError(null);
    startTransition(async () => {
      const result = await action();
      setBusyId(null);
      onDone?.();
      if (result.error) return void setActionError(result.error);
      toast.success(result.message ?? "Done.");
      router.refresh();
    });
  };

  const confirmPending = () => {
    if (!pending) return;
    const { kind, member } = pending;
    const close = () => setPending(null);
    if (kind === "remove") run(member.id, () => removeTeamMember(member.id), close);
    else if (kind === "role") run(member.id, () => updateTeamMember(member.id, { role: member.role === "superadmin" ? "admin" : "superadmin" }), close);
    else run(member.id, () => updateTeamMember(member.id, { status: kind === "suspend" ? "suspended" : "active" }), close);
  };

  const menuFor = (member: TeamMember): MenuItem[] => {
    const reset: MenuItem = { label: member.invited ? "Resend invitation link" : "Send password reset", icon: KeyRound, onSelect: () => run(member.id, () => sendTeamPasswordReset(member.id)) };
    if (isSelf(member)) return [reset];
    return [
      reset,
      { label: member.role === "superadmin" ? "Change to Administrator" : "Make Super administrator", icon: ShieldCheck, onSelect: () => setPending({ kind: "role", member }) },
      "separator",
      member.status === "active"
        ? { label: "Suspend access", icon: UserX, onSelect: () => setPending({ kind: "suspend", member }) }
        : { label: "Reactivate access", icon: UserCheck, onSelect: () => setPending({ kind: "reactivate", member }) },
      { label: "Remove from team", icon: Trash2, danger: true, onSelect: () => setPending({ kind: "remove", member }) },
    ];
  };

  const confirmCopy: Record<Pending["kind"], (member: TeamMember) => { title: string; body: React.ReactNode; label: string; tone: "danger" | "primary" }> = {
    role: (member) => member.role === "superadmin"
      ? { title: "Change to Administrator?", body: <><strong>{member.name}</strong> will no longer be able to manage the platform team.</>, label: "Change role", tone: "primary" }
      : { title: "Make Super administrator?", body: <><strong>{member.name}</strong> will be able to invite, suspend and remove team members, including you.</>, label: "Make Super administrator", tone: "primary" },
    suspend: (member) => ({ title: "Suspend access?", body: <><strong>{member.name}</strong> ({member.email}) will be signed out and cannot sign in until reactivated.</>, label: "Suspend", tone: "danger" }),
    reactivate: (member) => ({ title: "Reactivate access?", body: <><strong>{member.name}</strong> will be able to sign in to the admin console again.</>, label: "Reactivate", tone: "primary" }),
    remove: (member) => ({ title: "Remove from team?", body: <><strong>{member.name}</strong> ({member.email}) loses access to the admin console. Their past changes stay in the audit log.</>, label: "Remove", tone: "danger" }),
  };
  const confirm = pending ? confirmCopy[pending.kind](pending.member) : null;

  return (
    <PageSheet>
      <PageHeader
        title="Platform team"
        description="People at your company who can sign in to this admin console."
        actions={<button type="button" onClick={() => setInviteOpen(true)} className={button.primary}><UserPlus className="h-4 w-4" /> <span className="hidden sm:inline">Invite member</span><span className="sm:hidden">Invite</span></button>}
      />

      <div className="flex flex-col gap-3 border-b border-slate-200 px-4 pt-3 md:flex-row md:items-end md:justify-between md:px-6">
        <nav aria-label="Filter by status" className="-mb-px flex gap-1 overflow-x-auto">
          {TABS.map((item) => {
            const active = tab === item.value;
            return (
              <button
                key={item.value}
                type="button"
                aria-pressed={active}
                onClick={() => setTab(item.value)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-3 pb-2.5 pt-1 text-[13px] font-medium transition-colors ${active ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-900"}`}
              >
                {item.label}
                <span className={`rounded-full px-1.5 text-[11px] tabular-nums ${active ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>{counts[item.value]}</span>
              </button>
            );
          })}
        </nav>
        <div className="relative pb-3 md:w-72">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name or email" aria-label="Search team" className={`${adminInput} pl-9`} />
        </div>
      </div>

      {actionError && (
        <div className="px-4 pt-4 md:px-6">
          <Banner tone="error" role="alert">
            <div className="flex items-start justify-between gap-4">
              <span>{actionError}</span>
              <button type="button" onClick={() => setActionError(null)} className="shrink-0 font-semibold underline">Dismiss</button>
            </div>
          </Banner>
        </div>
      )}

      <div className="flex-1 overflow-x-auto lg:overflow-visible">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr>
              <th className={`${th} md:pl-6`}>Member</th>
              <th className={th}>Role</th>
              <th className={th}>Status</th>
              <th className={th}>Last sign-in</th>
              <th className={th}>Added</th>
              <th className={`${th} w-14 md:pr-6`}><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((member) => {
              const busy = isPending && busyId === member.id;
              return (
                <tr key={member.id} className="transition-colors hover:bg-slate-50/80">
                  <td className={`${td} md:pl-6`}>
                    <div className="flex items-center gap-3">
                      <Avatar name={member.name || member.email} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 font-medium text-slate-900">
                          <span className="truncate">{member.name}</span>
                          {isSelf(member) && <span className="rounded bg-slate-100 px-1.5 text-[11px] font-medium text-slate-500">You</span>}
                        </div>
                        <div className="truncate text-xs text-slate-500">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className={td}>
                    <span className={`inline-flex items-center gap-1.5 text-[13px] ${member.role === "superadmin" ? "font-medium text-violet-700" : "text-slate-700"}`}>
                      {member.role === "superadmin" && <ShieldCheck className="h-3.5 w-3.5" />}
                      {roleLabel(member.role)}
                    </span>
                  </td>
                  <td className={td}><StatusBadge member={member} /></td>
                  <td className={`${td} text-[13px] text-slate-600`}>
                    <span title={member.lastSignInAt ? formatAdminDateTime(member.lastSignInAt) : undefined} suppressHydrationWarning>{formatRelative(member.lastSignInAt)}</span>
                  </td>
                  <td className={`${td} text-[13px] text-slate-600`}>{formatAdminDate(member.created_at)}</td>
                  <td className={`${td} text-right md:pr-6`}>
                    {busy ? <Loader2 className="ml-auto mr-2 h-4 w-4 animate-spin text-slate-400" /> : <RowMenu label={`Actions for ${member.name}`} items={menuFor(member)} />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {visible.length === 0 && (
          <EmptyState icon={Users} title={members.length === 0 ? "No team members yet" : "No one matches"}>
            {members.length === 0 ? "Invite the people who run clients, leads and the website." : query ? <>Nobody matches “{query}” in this view.</> : "Nobody is in this view."}
          </EmptyState>
        )}
      </div>

      <footer className="grid gap-3 border-t border-slate-200 bg-slate-50/70 px-4 py-4 text-xs text-slate-500 md:grid-cols-2 md:px-6">
        {ROLES.map((role) => (
          <p key={role.value} className="flex items-start gap-2">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span><span className="font-semibold text-slate-700">{role.label}:</span> {role.description}</span>
          </p>
        ))}
      </footer>

      <InviteDialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        members={members}
        onInvited={(message) => { setInviteOpen(false); toast.success(message); router.refresh(); }}
      />
      <ConfirmDialog
        open={Boolean(pending)}
        onClose={() => setPending(null)}
        onConfirm={confirmPending}
        busy={isPending}
        title={confirm?.title ?? ""}
        confirmLabel={isPending ? "Working…" : confirm?.label ?? ""}
        tone={confirm?.tone}
      >
        {confirm?.body}
      </ConfirmDialog>
    </PageSheet>
  );
}
