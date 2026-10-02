"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { 
  Search, Plus, Building, Users, Receipt, PhoneCall, Loader2
} from "lucide-react";
import { adminNavigation } from "@/lib/admin-navigation";
import { createClient } from "@/lib/supabase-browser";
import { formatMoney } from "@/lib/money";
import { formatPhone } from "@/lib/india";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  const [results, setResults] = useState<{
    orgs: any[];
    users: any[];
    invs: any[];
    tics: any[];
  } | null>(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Perform search against DB
  useEffect(() => {
    if (!debouncedSearch || debouncedSearch.length < 2) {
      setResults(null);
      setIsSearching(false);
      return;
    }

    let isMounted = true;
    const fetchResults = async () => {
      setIsSearching(true);
      const query = `%${debouncedSearch}%`;
      
      try {
        const [
          { data: orgs },
          { data: users },
          { data: invs },
          { data: tics }
        ] = await Promise.all([
          supabase.from("organizations").select("id, name, email").ilike("name", query).limit(5),
          supabase.from("team_members").select("id, name, email").ilike("name", query).limit(5),
          supabase.from("invoices").select("id, invoice_number, amount, organization_id").ilike("invoice_number", query).limit(5),
          supabase.from("leads").select("id, name, organization_name, phone").or(`name.ilike.${query},organization_name.ilike.${query},phone.ilike.${query}`).limit(5),
        ]);

        if (isMounted) {
          setResults({
            orgs: orgs || [],
            users: users || [],
            invs: invs || [],
            tics: tics || []
          });
        }
      } catch (err) {
        console.error("Search error", err);
      } finally {
        if (isMounted) setIsSearching(false);
      }
    };

    fetchResults();

    return () => {
      isMounted = false;
    };
  }, [debouncedSearch, supabase]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
    setSearch("");
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm transition-all flex items-start justify-center pt-[10vh]">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <Command className="w-full" shouldFilter={false}>
              <div className="flex items-center border-b border-slate-100 px-4">
                <Search className="h-5 w-5 text-slate-400 mr-2" />
                <Command.Input 
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Search pages, organizations, invoices, users..." 
                  className="w-full bg-transparent border-0 py-4 text-base outline-none text-slate-900 placeholder:text-slate-400"
                />
                {isSearching && <Loader2 className="h-4 w-4 text-slate-400 animate-spin" />}
              </div>

              <Command.List className="max-h-[60vh] overflow-y-auto p-2">
                
                {search.length >= 2 && !isSearching && results && 
                  results.orgs.length === 0 && results.users.length === 0 && 
                  results.invs.length === 0 && results.tics.length === 0 && (
                  <Command.Empty className="py-6 text-center text-sm text-slate-500">
                    No results found for "{search}".
                  </Command.Empty>
                )}

                {/* Default State (No Search) */}
                {!results && (
                  <>
                    <Command.Group heading="Navigation" className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {adminNavigation.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Command.Item 
                            key={item.href}
                            value={`nav-${item.label}`}
                            onSelect={() => runCommand(() => router.push(item.href))}
                            className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer hover:bg-slate-100 hover:text-slate-900 aria-selected:bg-slate-100 aria-selected:text-slate-900"
                          >
                            <Icon className="h-4 w-4 mr-3 text-slate-400" />
                            {item.label}
                          </Command.Item>
                        );
                      })}
                    </Command.Group>

                    <Command.Group heading="Actions" className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-2">
                      <Command.Item 
                        value="create-organization"
                        onSelect={() => runCommand(() => router.push("/admin/onboarding"))}
                        className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer hover:bg-slate-100 hover:text-slate-900 aria-selected:bg-slate-100 aria-selected:text-slate-900"
                      >
                        <Plus className="h-4 w-4 mr-3 text-slate-400" />
                        Create Organization
                      </Command.Item>
                    </Command.Group>
                  </>
                )}

                {/* Search Results State */}
                {results && (
                  <>
                    {results.orgs.length > 0 && (
                      <Command.Group heading="Organizations" className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {results.orgs.map((o: any) => (
                          <Command.Item 
                            key={o.id}
                            value={`org-${o.id}`}
                            onSelect={() => runCommand(() => router.push(`/admin/organizations/${o.id}`))}
                            className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer hover:bg-slate-100 hover:text-slate-900 aria-selected:bg-slate-100 aria-selected:text-slate-900"
                          >
                            <Building className="h-4 w-4 mr-3 text-blue-500" />
                            <div className="flex flex-col">
                              <span>{o.name}</span>
                              <span className="text-xs text-slate-400">{o.email}</span>
                            </div>
                          </Command.Item>
                        ))}
                      </Command.Group>
                    )}
                    
                    {results.users.length > 0 && (
                      <Command.Group heading="Users" className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-2">
                        {results.users.map((u: any) => (
                          <Command.Item 
                            key={u.id}
                            value={`usr-${u.id}`}
                            onSelect={() => runCommand(() => router.push(`/admin/users`))}
                            className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer hover:bg-slate-100 hover:text-slate-900 aria-selected:bg-slate-100 aria-selected:text-slate-900"
                          >
                            <Users className="h-4 w-4 mr-3 text-emerald-500" />
                            <div className="flex flex-col">
                              <span>{u.name}</span>
                              <span className="text-xs text-slate-400">{u.email}</span>
                            </div>
                          </Command.Item>
                        ))}
                      </Command.Group>
                    )}

                    {results.invs.length > 0 && (
                      <Command.Group heading="Invoices" className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-2">
                        {results.invs.map((i: any) => (
                          <Command.Item 
                            key={i.id}
                            value={`inv-${i.id}`}
                            onSelect={() => runCommand(() => router.push(i.organization_id ? `/admin/organizations/${i.organization_id}` : `/admin/billing`))}
                            className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer hover:bg-slate-100 hover:text-slate-900 aria-selected:bg-slate-100 aria-selected:text-slate-900"
                          >
                            <Receipt className="h-4 w-4 mr-3 text-amber-500" />
                            <span>{i.invoice_number}</span>
                            <span className="ml-auto font-bold text-slate-600">{formatMoney(i.amount)}</span>
                          </Command.Item>
                        ))}
                      </Command.Group>
                    )}

                    {results.tics.length > 0 && (
                      <Command.Group heading="Leads" className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-2">
                        {results.tics.map((t: any) => (
                          <Command.Item 
                            key={t.id}
                            value={`tic-${t.id}`}
                            onSelect={() => runCommand(() => router.push(`/admin/leads`))}
                            className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer hover:bg-slate-100 hover:text-slate-900 aria-selected:bg-slate-100 aria-selected:text-slate-900"
                          >
                            <PhoneCall className="h-4 w-4 mr-3 text-orange-500" />
                            <div className="flex flex-col">
                              <span className="truncate max-w-sm">{t.organization_name || t.name}</span>
                              <span className="text-xs text-slate-400">{t.name}{t.phone ? ` · ${formatPhone(t.phone)}` : ""}</span>
                            </div>
                          </Command.Item>
                        ))}
                      </Command.Group>
                    )}
                  </>
                )}
              </Command.List>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}
