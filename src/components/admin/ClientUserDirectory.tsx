"use client";

import { useEffect, useMemo, useState } from "react";
import { KeyRound, RefreshCw, Search, ShieldAlert, Users } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { toast } from "sonner";
import { formatAdminDateTime } from "@/lib/admin-format";

type DirectoryUser = {
  userId: string;
  email: string | null;
  name: string;
  role: string;
  product: string;
  clientName: string;
  clientSlug: string;
  clientStatus: string;
  accountStatus: string;
  lastSignInAt: string | null;
  membershipCreatedAt: string;
  canSendReset: boolean;
};

type ClientGroup = { name: string; users: DirectoryUser[] };
type ProductGroup = { name: string; clients: ClientGroup[] };

function formatDate(value: string | null) {
  return value ? formatAdminDateTime(value) : "Never";
}

function statusClass(status: string) {
  if (status === "active") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (status === "invited" || status === "trial") return "border-amber-200 bg-amber-50 text-amber-800";
  return "border-slate-200 bg-slate-100 text-slate-700";
}

export function ClientUserDirectory() {
  const [users, setUsers] = useState<DirectoryUser[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [resettingUserId, setResettingUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    const response = await fetch("/api/admin/client-users", { cache: "no-store" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not load the user directory.");
    return result.users as DirectoryUser[];
  };

  const loadUsers = async () => {
    setIsLoading(true);
    setError("");
    try {
      setUsers(await fetchUsers());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load the user directory.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isCurrent = true;
    void fetchUsers()
      .then((directory) => {
        if (!isCurrent) return;
        setUsers(directory);
        setIsLoading(false);
      })
      .catch((loadError: unknown) => {
        if (!isCurrent) return;
        setError(loadError instanceof Error ? loadError.message : "Could not load the user directory.");
        setIsLoading(false);
      });
    return () => { isCurrent = false; };
  }, []);

  const productGroups = useMemo<ProductGroup[]>(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = normalizedQuery
      ? users.filter((user) => [user.name, user.email, user.userId, user.role, user.product, user.clientName]
          .some((value) => value?.toLowerCase().includes(normalizedQuery)))
      : users;
    const products = new Map<string, Map<string, DirectoryUser[]>>();

    for (const user of filtered) {
      const clients = products.get(user.product) ?? new Map<string, DirectoryUser[]>();
      const clientUsers = clients.get(user.clientName) ?? [];
      clientUsers.push(user);
      clients.set(user.clientName, clientUsers);
      products.set(user.product, clients);
    }

    return Array.from(products, ([name, clients]) => ({
      name,
      clients: Array.from(clients, ([clientName, clientUsers]) => ({ name: clientName, users: clientUsers })),
    }));
  }, [query, users]);

  const sendPasswordReset = async (user: DirectoryUser) => {
    if (!user.email || !user.canSendReset || resettingUserId) return;
    setResettingUserId(user.userId);
    const { error: resetError } = await createClient().auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/account/reset-password`,
    });
    setResettingUserId(null);
    if (resetError) {
      toast.error(`Could not send recovery email: ${resetError.message}`);
      return;
    }
    toast.success(`If ${user.email} is eligible, a password recovery email has been sent.`);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-blue-700">Access directory</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Client Users</h1>
          <p className="mt-1 text-sm text-slate-500">Everyone who signs in to a client workspace, grouped by product and client. Add or remove users on the client&apos;s page.</p>
        </div>
        <div className="flex gap-2">
          <label className="relative min-w-0 flex-1 sm:w-72 sm:flex-none">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users, clients, roles..." className="h-10 w-full rounded border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
          </label>
          <button type="button" onClick={() => void loadUsers()} disabled={isLoading} title="Refresh directory" aria-label="Refresh directory" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
        <span className="inline-flex items-center gap-2"><Users className="h-4 w-4" />{users.length} accounts</span>
        <span>{productGroups.length} products</span>
        <span>Password values are never visible. Send recovery emails to let users choose a new password.</span>
      </div>

      {error && (
        <div role="alert" className="flex gap-3 border-l-4 border-amber-500 bg-amber-50 p-4 text-sm text-amber-950">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          <div><p className="font-semibold">User directory unavailable</p><p className="mt-1">{error}</p></div>
        </div>
      )}

      {isLoading && <p className="py-8 text-center text-sm text-slate-500">Loading account directory...</p>}
      {!isLoading && !error && productGroups.length === 0 && (
        <div className="border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
          <Users className="mx-auto h-7 w-7 text-slate-400" />
          <p className="mt-3 font-semibold text-slate-900">No matching user accounts</p>
          <p className="mt-1 text-sm text-slate-500">{users.length === 0 ? "Users appear here once you onboard a client and its administrator accepts the invitation." : "Try another search."}</p>
        </div>
      )}

      <div className="min-h-0 flex-1 space-y-6 overflow-auto pb-6">
        {productGroups.map((product) => (
          <section key={product.name} aria-label={product.name}>
            <div className="flex items-baseline justify-between border-b-2 border-slate-900 pb-2">
              <h2 className="text-lg font-bold text-slate-900">{product.name}</h2>
              <span className="text-xs font-semibold text-slate-500">{product.clients.reduce((total, client) => total + client.users.length, 0)} accounts</span>
            </div>
            <div className="mt-3 space-y-3">
              {product.clients.map((client) => (
                <details key={client.name} open className="border border-slate-200 bg-white">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-slate-50 px-4 py-3 hover:bg-slate-100">
                    <span className="min-w-0 truncate font-semibold text-slate-900">{client.name}</span>
                    <span className="shrink-0 text-xs font-medium text-slate-500">{client.users.length} {client.users.length === 1 ? "user" : "users"}</span>
                  </summary>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                      <thead className="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                        <tr>
                          <th className="px-4 py-3">User</th>
                          <th className="px-4 py-3">Role</th>
                          <th className="px-4 py-3">Account</th>
                          <th className="px-4 py-3">Last sign-in</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {client.users.map((user) => (
                          <tr key={`${user.userId}-${user.role}`} className="align-top hover:bg-slate-50">
                            <td className="px-4 py-3">
                              <div className="font-semibold text-slate-900">{user.name}</div>
                              <div className="mt-0.5 text-xs text-slate-500">{user.email || "Email unavailable"}</div>
                              <div className="mt-1 text-[11px] text-slate-400">Client status: {user.clientStatus}</div>
                            </td>
                            <td className="px-4 py-3 capitalize text-slate-700">{user.role.replaceAll("_", " ")}</td>
                            <td className="px-4 py-3"><span className={`inline-flex rounded border px-2 py-1 text-xs font-semibold capitalize ${statusClass(user.accountStatus)}`}>{user.accountStatus}</span></td>
                            <td className="px-4 py-3 whitespace-nowrap text-slate-600">{formatDate(user.lastSignInAt)}</td>
                            <td className="px-4 py-3 text-right">
                              <button type="button" disabled={!user.canSendReset || resettingUserId === user.userId || user.clientStatus === "suspended"} onClick={() => void sendPasswordReset(user)} className="inline-flex items-center gap-1.5 rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 disabled:cursor-not-allowed disabled:opacity-40">
                                <KeyRound className="h-3.5 w-3.5" />{resettingUserId === user.userId ? "Sending..." : "Send reset"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}