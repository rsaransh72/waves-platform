"use client";

import { useAdminStore } from "@/store/adminStore";
import { Activity, AlertCircle, RefreshCw, WifiOff } from "lucide-react";
import { clsx } from "clsx";

export function RealtimeStatusIndicator() {
  const { realtimeStatus } = useAdminStore();

  const getStatusConfig = () => {
    switch (realtimeStatus) {
      case "CONNECTED":
        return {
          icon: <Activity className="h-3.5 w-3.5" />,
          label: "Connected",
          color: "text-emerald-700 bg-emerald-50 border-emerald-200"
        };
      case "CONNECTING":
      case "RECONNECTING":
        return {
          icon: <RefreshCw className="h-3.5 w-3.5 animate-spin" />,
          label: "Connecting...",
          color: "text-blue-700 bg-blue-50 border-blue-200"
        };
      case "OFFLINE":
        return {
          icon: <WifiOff className="h-3.5 w-3.5" />,
          label: "Offline",
          color: "text-amber-700 bg-amber-50 border-amber-200"
        };
      case "ERROR":
      default:
        return {
          icon: <AlertCircle className="h-3.5 w-3.5" />,
          label: "Error",
          color: "text-red-700 bg-red-50 border-red-200"
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div 
      className={clsx(
        "hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold shadow-sm transition-colors",
        config.color
      )}
      title="Realtime database connection status"
    >
      {config.icon}
      {config.label}
    </div>
  );
}
