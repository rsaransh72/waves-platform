// Turns audit_logs rows into sentences people can read. Rows come from the database
// trigger (INSERT/UPDATE/DELETE with previous_value/new_value) and from app events
// such as "member.invited".

export type AuditLogRow = {
  id: string;
  action: string;
  resource_type: string | null;
  resource_id?: string | null;
  organization_id?: string | null;
  actor_email: string | null;
  details: unknown;
  created_at: string;
};

const AREAS: Record<string, string> = {
  organizations: "Client",
  organization_members: "Client user",
  subscriptions: "Subscription",
  invoices: "Invoice",
  leads: "Lead",
  lead_notes: "Lead note",
  products: "Product",
  services: "Service",
  pages: "Page",
  menus: "Navigation",
  suites: "Suite",
  marketplaceitems: "Marketplace item",
  team_members: "Platform team member",
  settings: "Settings",
  feature_flags: "Feature flag",
  support_tickets: "Support ticket",
  automation_rules: "Automation",
  users: "User",
};

const FIELD_LABELS: Record<string, string> = {
  next_billing_date: "term end",
  plan_name: "plan",
  amount: "amount",
  status: "status",
  organization_name: "name",
  next_follow_up: "follow-up date",
  lost_reason: "lost reason",
  paid_at: "paid date",
  payment_method: "payment method",
  payment_reference: "payment reference",
  reminder_sent_at: "renewal reminder",
  published_at: "publish date",
  seo_title: "SEO title",
  seo_description: "SEO description",
};

const IGNORED_FIELDS = new Set(["updated_at", "created_at", "id"]);

function parse(details: unknown): Record<string, unknown> {
  if (typeof details === "string") {
    try { return JSON.parse(details); } catch { return {}; }
  }
  return details && typeof details === "object" ? details as Record<string, unknown> : {};
}

function recordName(record: Record<string, unknown> | undefined) {
  if (!record) return "";
  for (const key of ["name", "title", "organization_name", "invoice_number", "plan_name", "email", "key"]) {
    if (typeof record[key] === "string" && record[key]) return String(record[key]);
  }
  return "";
}

function short(value: unknown) {
  if (value === null || value === undefined || value === "") return "empty";
  if (typeof value === "string") return value.length > 40 ? `${value.slice(0, 40)}…` : value.replaceAll("_", " ");
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "updated";
}

export function auditArea(resourceType: string | null | undefined) {
  if (!resourceType) return "System";
  return AREAS[resourceType] ?? resourceType.replaceAll("_", " ");
}

export function describeAuditLog(log: AuditLogRow): string {
  const details = parse(log.details);
  const area = auditArea(log.resource_type).toLowerCase();

  if (log.action === "INSERT" || log.action === "UPDATE" || log.action === "DELETE") {
    const after = (details.new_value ?? undefined) as Record<string, unknown> | undefined;
    const before = (details.previous_value ?? undefined) as Record<string, unknown> | undefined;
    const name = recordName(after) || recordName(before);
    const subject = `${area}${name ? ` “${name}”` : ""}`;
    if (log.action === "INSERT") return `Created ${subject}`;
    if (log.action === "DELETE") return `Deleted ${subject}`;

    const changes = Object.keys(after ?? {})
      .filter((key) => !IGNORED_FIELDS.has(key) && JSON.stringify(before?.[key]) !== JSON.stringify(after?.[key]))
      .map((key) => {
        const label = FIELD_LABELS[key] ?? key.replaceAll("_", " ");
        const simple = ["status", "plan_name", "amount", "payment_method", "role"].includes(key);
        return simple ? `${label} ${short(before?.[key])} → ${short(after?.[key])}` : label;
      });
    return changes.length ? `Updated ${subject}: ${changes.slice(0, 4).join(", ")}${changes.length > 4 ? ` and ${changes.length - 4} more` : ""}` : `Updated ${subject}`;
  }

  const email = typeof details.email === "string" ? details.email : "";
  const events: Record<string, string> = {
    "member.invited": `Invited ${email}${details.role ? ` as ${details.role}` : ""}`,
    "member.invite_resent": `Re-sent invitation to ${email}`,
    "member.password_reset_sent": `Sent password reset to ${email}`,
    "member.role_changed": `Changed ${email} from ${details.from} to ${details.to}`,
    "member.removed": `Removed ${email}`,
    "team.invited": `Invited ${email} to the platform team${details.role ? ` as ${details.role}` : ""}`,
    "team.removed": `Removed ${email} from the platform team`,
    "user.impersonated": `Viewed as ${typeof details.impersonated_email === "string" ? details.impersonated_email : "a user"}`,
    "system.lead_captured": "Website enquiry received",
  };
  return events[log.action] ?? log.action.replaceAll(/[._]/g, " ");
}

export function auditActor(log: AuditLogRow) {
  return log.actor_email ?? "System";
}
