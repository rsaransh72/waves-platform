import {
  LayoutDashboard,
  Package,
  Briefcase,
  FileText,
  Navigation,
  Settings,
  Users,
  UserRoundCog,
  ShieldAlert,
  Building,
  CreditCard,
  PhoneCall,
  CheckSquare,
  Rocket,
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
  section?: string;
  description?: string;
  permission?: AdminPermission;
  children?: AdminNavigationItem[];
  badge?: number | string;
  featureFlag?: string;
  isBottom?: boolean;
}

// Only screens that work end to end are listed. Pages still in the codebase but not
// listed here (support, usage, automations, feature flags, ...) are not in use yet.
export const adminNavigation: AdminNavigationItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },

  { section: "Sales", label: "Leads", href: "/admin/leads", icon: PhoneCall, description: "Website enquiries and follow-ups" },
  { section: "Sales", label: "Onboard Client", href: "/admin/onboarding", icon: Rocket, description: "Create a client account and invite its administrator" },

  { section: "Clients", label: "Clients", href: "/admin/organizations", icon: Building, description: "Client organizations and their access" },
  { section: "Clients", label: "Subscriptions", href: "/admin/subscriptions", icon: CheckSquare, description: "Plans and renewal dates" },
  { section: "Clients", label: "Billing", href: "/admin/billing", icon: CreditCard, description: "Invoices and payments" },
  { section: "Clients", label: "Client Users", href: "/admin/client-users", icon: UserRoundCog, description: "Everyone who signs in to a client workspace" },

  { section: "Website", label: "Products", href: "/admin/products", icon: Package, description: "Products, features and pricing shown on the website" },
  { section: "Website", label: "Services", href: "/admin/services", icon: Briefcase, description: "Services shown on the website" },
  { section: "Website", label: "Pages", href: "/admin/pages", icon: FileText, description: "About, Terms, Privacy and other pages" },
  { section: "Website", label: "Navigation", href: "/admin/navigation", icon: Navigation, description: "Main menu of the website" },

  { label: "Platform Team", href: "/admin/users", icon: Users, isBottom: true, description: "Your staff with admin console access" },
  { label: "Audit Logs", href: "/admin/audit", icon: ShieldAlert, isBottom: true },
  { label: "Settings", href: "/admin/settings", icon: Settings, isBottom: true, description: "Company details and contact information" },
];
