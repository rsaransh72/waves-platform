// The proxy's role gate, as a teacher: pages a teacher may open load, admin-only pages
// send them back to the dashboard. Creates one teacher login on a seeded school.
// Usage: node scripts/qa/role-redirects.mjs (after seed.mjs; cleanup.mjs removes it)
import { BASE, PASSWORD, alias, readJson, service, sessionCookies } from "./sim/lib.mjs";

const s1 = readJson("seed.json").find((item) => item.key === "s1");
const email = alias("teacher-role-check");
const { data: created, error } = await service.auth.admin.createUser({ email, password: PASSWORD, email_confirm: true, user_metadata: { full_name: "Role Check Teacher" } });
if (error) throw error;
await service.from("organization_members").insert({ organization_id: s1.organizationId, user_id: created.user.id, role: "teacher" });
const cookie = (await sessionCookies(email)).map((item) => `${item.name}=${item.value}`).join("; ");
const expectations = [["/school", 200], ["/school/attendance", 200], ["/school/students", 200], ["/school/settings", "/school?denied=1"], ["/school/users", "/school?denied=1"], ["/school/fees/collection", "/school?denied=1"]];
const rows = [];
for (const [route, expected] of expectations) {
  const response = await fetch(`${BASE}${route}`, { headers: { cookie }, redirect: "manual" });
  const location = response.headers.get("location")?.replace(BASE, "") ?? "";
  const outcome = response.status === 200 ? 200 : location;
  rows.push({ route, outcome, expected, result: outcome === expected ? "✓ pass" : "✗ fail" });
}
const anonymous = await fetch(`${BASE}/school/students`, { redirect: "manual" });
rows.push({ route: "/school/students signed out", outcome: anonymous.headers.get("location")?.replace(BASE, ""), expected: "/school/login?next=…", result: anonymous.headers.get("location")?.includes("/school/login") ? "✓ pass" : "✗ fail" });
const forged = await fetch(`${BASE}/school/students`, { headers: { cookie: cookie.replace(/.{12}(;|$)/, "xxxxxxxxxxxx$1") }, redirect: "manual" });
rows.push({ route: "tampered session cookie", outcome: forged.status === 200 ? 200 : forged.headers.get("location")?.replace(BASE, ""), expected: "redirect to login", result: forged.status !== 200 ? "✓ pass" : "✗ fail" });
console.table(rows);
process.exitCode = rows.some((row) => row.result.startsWith("✗")) ? 1 : 0;
