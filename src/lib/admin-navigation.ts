import { 
  LayoutDashboard, 
  Package, 
  Briefcase, 
  FileText, 
  Navigation, 
  Image as ImageIcon, 
  Settings, 
  Users, 
  UserRoundCog,
  ShieldAlert,
  Search,
  Building,
  CreditCard,
  Activity,
  PhoneCall,
  LifeBuoy,
  Shield,
  Zap,
  Globe,
  Database,
  CheckSquare
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export type AdminPermission = 
  | 'platform.users.read'
  | 'platform.users.manage'
  | 'platform.organizations.read'
  | 'platform.organizations.manage'
  | 'platform.billing.read'
  | 'platform.billing.manage'
  | 'platform.cms.manage'
  | 'platform.features.manage'
  | 'platform.security.read'
  | 'platform.audit.read'
  | 'platform.system.manage';

export interface AdminNavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: AdminPermission;
  children?: AdminNavigationItem[];
  badge?: number | string;
  featureFlag?: string;
  isBottom?: boolean;
}

export const adminNavigation: AdminNavigationItem[] = [
  // Overview
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  
  // Organizations & Users
  { label: "Organizations", href: "/admin/organizations", icon: Building },
  { label: "Onboard Client", href: "/admin/onboarding", icon: Building },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Client Users", href: "/admin/client-users", icon: UserRoundCog },
  
  // Commercial
  // { label: "Leads", href: "/admin/leads", icon: PhoneCall },
  { label: "Products", href: "/admin/products", icon: Package },
  // { label: "Billing", href: "/admin/billing", icon: CreditCard },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: CheckSquare },
  // { label: "Usage", href: "/admin/usage", icon: Activity },

  // Operations
  // { label: "Support", href: "/admin/support", icon: LifeBuoy },

  // Content & Features
  // { label: "CMS", href: "/admin/pages", icon: FileText },
  // { label: "Feature Flags", href: "/admin/feature-flags", icon: Navigation },

  // System & Security
  // { label: "Automations", href: "/admin/automations", icon: Zap, isBottom: true },
  // { label: "Security", href: "/admin/security", icon: Shield, isBottom: true },
  { label: "Audit Logs", href: "/admin/audit", icon: ShieldAlert, isBottom: true },
  // { label: "System", href: "/admin/system", icon: Database, isBottom: true },
  // { label: "Analytics", href: "/admin/analytics", icon: Activity, isBottom: true },
  { label: "Settings", href: "/admin/settings", icon: Settings, isBottom: true },
];
