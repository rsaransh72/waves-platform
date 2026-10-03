"use client";


import { toast } from "sonner";import { useState } from "react";
import { Search, Filter, Edit2, Trash2, EyeOff, CheckCircle, Eye } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/india";
import { refreshPublicSite } from "@/app/actions/public-site";

export function ServiceList({ initialServices }: { initialServices: any[] }) {
  const router = useRouter();
  const [services, setServices] = useState(initialServices);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);

  const categories = Array.from(new Set(services.map(p => p.category).filter(Boolean))).sort();
  const statuses = ["published", "draft", "disabled", "archived"];

  const filteredServices = services.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || p.category === filterCategory;
    const matchesStatus = filterStatus === "All" || p.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }

    setIsDeleting(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
      setServices(services.filter(p => p.id !== id));
      void refreshPublicSite();
      router.refresh();
    } catch (err: any) {
      toast.error(`Error deleting service: ${err.message}`);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "disabled" : "published";
    setIsToggling(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("services").update({ status: newStatus }).eq("id", id);
      if (error) throw error;
      setServices(services.map(p => p.id === id ? { ...p, status: newStatus } : p));
      void refreshPublicSite();
      router.refresh();
    } catch (err: any) {
      toast.error(`Error updating service status: ${err.message}`);
    } finally {
      setIsToggling(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services..." 
            className="w-full rounded border border-gray-300 bg-slate-50 py-2 pl-9 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded border border-gray-300 bg-slate-50 py-2 px-3 text-sm font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat as string} value={cat as string}>{cat as string}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded border border-gray-300 bg-slate-50 py-2 px-3 text-sm font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              {statuses.map(stat => (
                <option key={stat} value={stat}>{stat.charAt(0).toUpperCase() + stat.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-left text-sm text-slate-600">
            <thead className="border-b border-gray-200 bg-slate-50 text-xs uppercase font-bold tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Service Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
                <th className="sticky right-0 z-20 min-w-32 border-l border-slate-200 bg-slate-50 px-6 py-4 text-right shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.65)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No services found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => {
                  const statusColors: Record<string, string> = {
                    published: "text-emerald-700 bg-emerald-50 border-emerald-200",
                    draft: "text-amber-700 bg-amber-50 border-amber-200",
                    disabled: "text-red-700 bg-red-50 border-red-200",
                    archived: "text-slate-600 bg-slate-100 border-slate-300",
                  };
                  const sColor = statusColors[service.status] || statusColors.draft;
                  const isPublished = service.status === "published";

                  return (
                    <tr key={service.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{service.title}</span>
                          {service.status === "published" ? (
                            <a href={`/services#${service.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-blue-600 hover:underline">/services#{service.slug} · view on site ↗</a>
                          ) : (
                            <span className="text-xs font-medium text-slate-500">Not on the website</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {service.category ? (
                          <span className="inline-flex items-center rounded bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 border border-slate-200">
                            {service.category}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-bold">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={clsx("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold shadow-sm", sColor)}>
                          {service.status === "published" && <CheckCircle className="h-3 w-3" />}
                          {service.status === "disabled" && <EyeOff className="h-3 w-3" />}
                          {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-500" suppressHydrationWarning>
                        {formatDate(service.created_at)}
                      </td>
                      <td className="sticky right-0 z-[5] border-l border-slate-200 bg-white px-6 py-4 text-right group-hover:bg-slate-50 shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.65)]">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleStatus(service.id, service.status)}
                            disabled={isToggling === service.id}
                            title={isPublished ? "Disable Service" : "Enable Service"}
                            className={clsx(
                              "p-2 rounded transition-colors disabled:opacity-50",
                              isPublished ? "text-amber-500 hover:bg-amber-50 hover:text-amber-600" : "text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600"
                            )}
                          >
                            {isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          <Link 
                            href={`/admin/services/${service.slug}`}
                            title="Edit Service"
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(service.id, service.title)}
                            disabled={isDeleting === service.id}
                            title="Delete Service"
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
