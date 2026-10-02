// What each school role may open and change. The database enforces the same rules
// (supabase/school_roles.sql); this copy drives navigation, route guards and which
// buttons are shown, so keep the two in step.

export type SchoolRole = "admin" | "teacher" | "staff" | "member";

export type SchoolArea =
  | "dashboard"
  | "students"
  | "teachers"
  | "classes"
  | "attendance"
  | "exams"
  | "feeStructures"
  | "fees"
  | "communications"
  | "library"
  | "timetable"
  | "transport"
  | "settings"
  | "users";

const ALL: SchoolRole[] = ["admin", "teacher", "staff", "member"];

const VIEW: Record<SchoolArea, SchoolRole[]> = {
  dashboard: ALL,
  students: ALL,
  teachers: ["admin", "staff"],
  classes: ALL,
  attendance: ["admin", "teacher", "staff"],
  exams: ["admin", "teacher"],
  feeStructures: ["admin", "staff"],
  fees: ["admin", "staff"],
  communications: ALL,
  library: ["admin", "teacher", "staff"],
  timetable: ALL,
  transport: ["admin", "staff"],
  settings: ["admin"],
  users: ["admin"],
};

const MANAGE: Record<SchoolArea, SchoolRole[]> = {
  dashboard: [],
  students: ["admin", "staff"],
  teachers: ["admin"],
  classes: ["admin"],
  attendance: ["admin", "teacher"],
  exams: ["admin", "teacher"],
  feeStructures: ["admin"],
  fees: ["admin", "staff"],
  communications: ["admin", "teacher", "staff"],
  library: ["admin", "staff"],
  timetable: ["admin"],
  transport: ["admin", "staff"],
  settings: ["admin"],
  users: ["admin"],
};

export const SCHOOL_ROLE_LABELS: Record<SchoolRole, string> = {
  admin: "Administrator",
  teacher: "Teacher",
  staff: "Office staff",
  member: "Read-only",
};

export function normalizeSchoolRole(role: string | null | undefined): SchoolRole {
  if (role === "owner" || role === "admin") return "admin";
  if (role === "teacher" || role === "staff") return role;
  return "member";
}

export function canViewSchoolArea(role: SchoolRole, area: SchoolArea) {
  return VIEW[area].includes(role);
}

export function canManageSchoolArea(role: SchoolRole, area: SchoolArea) {
  return MANAGE[area].includes(role);
}

const PATH_AREAS: Array<[prefix: string, area: SchoolArea]> = [
  ["/school/fees/collection", "fees"],
  ["/school/fees/receipts", "fees"],
  ["/school/fees", "feeStructures"],
  ["/school/students", "students"],
  ["/school/teachers", "teachers"],
  ["/school/classes", "classes"],
  ["/school/attendance", "attendance"],
  ["/school/exams", "exams"],
  ["/school/communications", "communications"],
  ["/school/library", "library"],
  ["/school/timetable", "timetable"],
  ["/school/transport", "transport"],
  ["/school/settings", "settings"],
  ["/school/users", "users"],
];

export function schoolAreaForPath(pathname: string): SchoolArea | null {
  if (pathname === "/school") return "dashboard";
  const match = PATH_AREAS.find(([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  return match ? match[1] : null;
}
