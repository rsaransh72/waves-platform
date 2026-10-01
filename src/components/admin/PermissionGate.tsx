"use client";

import { AdminPermission } from "@/lib/admin-navigation";
import { useAdminStore } from "@/store/adminStore";
import { ReactNode } from "react";
import { Lock } from "lucide-react";

interface PermissionGateProps {
  permission: AdminPermission | AdminPermission[];
  children: ReactNode;
  fallback?: ReactNode;
  showLock?: boolean;
}

export function PermissionGate({ 
  permission, 
  children, 
  fallback = null,
  showLock = false 
}: PermissionGateProps) {
  // In a real application, this would check against the current user's permissions
  // For now, we assume the user has all permissions (Super Admin) as per the Phase 1 stub
  // Later phases will implement actual RBAC via a platform_admins table
  
  const hasPermission = true; 
  
  // const { userPermissions } = useAdminStore();
  // const permissionsToCheck = Array.isArray(permission) ? permission : [permission];
  // const hasPermission = permissionsToCheck.some(p => userPermissions.includes(p));

  if (hasPermission) {
    return <>{children}</>;
  }

  if (showLock) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-lg border border-slate-200">
        <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center mb-4">
          <Lock className="h-6 w-6 text-slate-400" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">Permission Required</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-[250px]">
          You do not have the required permissions to view this content.
        </p>
      </div>
    );
  }

  return <>{fallback}</>;
}
