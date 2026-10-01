"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { 
  Search, 
  Filter,
  ShieldAlert,
  Server,
  User,
  CreditCard,
  Building,
  Key,
  ChevronRight,
  Download
} from "lucide-react";
import { formatAdminDateTime } from "@/lib/admin-format";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

export function AuditLogsList({ initialLogs }: { initialLogs: any[] }) {
  const [logs, setLogs] = useState<any[]>(initialLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLog, setSelectedLog] = useState<any>(null);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const channel = supabase.channel('audit_logs_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'audit_logs' }, (payload) => {
        setLogs(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredLogs = logs.filter(log => 
    (log.actor_email && log.actor_email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.resource_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getActionIcon = (action: string) => {
    if (action.includes('login') || action.includes('auth')) return <Key className="w-4 h-4 text-purple-500" />;
    if (action.includes('payment') || action.includes('invoice')) return <CreditCard className="w-4 h-4 text-emerald-500" />;
    if (action.includes('user') || action.includes('student')) return <User className="w-4 h-4 text-blue-500" />;
    if (action.includes('organization')) return <Building className="w-4 h-4 text-amber-500" />;
    if (action.includes('system') || action.includes('backup')) return <Server className="w-4 h-4 text-gray-500" />;
    return <ShieldAlert className="w-4 h-4 text-gray-400" />;
  };

  const getActionColor = (action: string) => {
    if (action.includes('created') || action.includes('success')) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (action.includes('deleted') || action.includes('failed')) return "bg-red-50 text-red-700 border-red-200";
    if (action.includes('updated') || action.includes('modified')) return "bg-blue-50 text-blue-700 border-blue-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Logs Table Area */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-w-0">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events, actors, or resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="h-9 px-3 flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="h-9 px-3 flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto relative">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-gray-50 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <tr>
                <th className="py-2.5 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">Event</th>
                <th className="py-2.5 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">Actor</th>
                <th className="py-2.5 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">Resource</th>
                <th className="py-2.5 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 w-1/3">Context & Details</th>
                <th className="py-2.5 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">IP Address</th>
                <th className="py-2.5 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500 text-sm">
                    No logs found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr 
                    key={log.id} 
                    onClick={() => setSelectedLog(log)}
                    className={`hover:bg-blue-50/50 transition-colors cursor-pointer group ${selectedLog?.id === log.id ? 'bg-blue-50/50' : ''}`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 shrink-0">
                          {getActionIcon(log.action)}
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                      {log.actor_email || 'System'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 capitalize">
                      {log.resource_type}
                    </td>
                    <td className="py-3 px-4">
                      {log.details && typeof log.details === 'object' ? (
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(log.details).map(([key, value]) => {
                            if (value === null || value === undefined || value === '') return null;
                            const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
                            return (
                              <span key={key} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                <span className="text-gray-500 mr-1">{formattedKey}:</span> {String(value)}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500 font-mono text-[13px]">
                      {log.ip_address || '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500 whitespace-nowrap">
                      {formatAdminDateTime(log.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {filteredLogs.length > 0 && (
            <div className="p-4 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              Loading more logs...
            </div>
          )}
        </div>
      </div>

      {/* Inspector Panel */}
      {selectedLog && (
        <div className="w-full lg:w-96 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col shrink-0 animate-in slide-in-from-right duration-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50 rounded-t-xl">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-gray-400" />
              Event Details
            </h3>
            <button onClick={() => setSelectedLog(null)} className="text-gray-400 hover:text-gray-900 p-1 rounded-md hover:bg-gray-200 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Metadata</div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Event ID</span>
                  <span className="font-mono text-gray-900 text-xs">{selectedLog.id.split('-')[0]}...</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Timestamp</span>
                  <span className="text-gray-900">{formatAdminDateTime(selectedLog.created_at)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Actor</span>
                  <span className="font-medium text-gray-900">{selectedLog.actor_email || 'System'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">IP Address</span>
                  <span className="font-mono text-gray-900 text-xs">{selectedLog.ip_address || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Resource Affected</div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Type</span>
                  <span className="capitalize font-medium text-gray-900">{selectedLog.resource_type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Resource ID</span>
                  <span className="font-mono text-gray-900 text-xs">{selectedLog.resource_id?.split('-')[0] || 'N/A'}...</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Payload Details</div>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs text-green-400 font-mono">
                  {JSON.stringify(selectedLog.details || {}, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
