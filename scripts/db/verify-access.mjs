// Exercises row level security as real roles inside a transaction that is always
// rolled back, so nothing is written. Usage: node scripts/db/verify-access.mjs
import { createDatabaseClient } from "../../db-client.mjs";

const client = createDatabaseClient();
await client.connect();
const results = [];
let step = 0;

async function check(label, role, claims, sql, expect) {
  const savepoint = `s${step++}`;
  await client.query(`SAVEPOINT ${savepoint}`);
  let outcome;
  try {
    await client.query(`SET LOCAL ROLE ${role}`);
    await client.query(`SELECT set_config('request.jwt.claims', $1, true)`, [JSON.stringify(claims)]);
    const { rows, rowCount } = await client.query(sql);
    outcome = rows?.[0]?.n !== undefined ? `rows=${rows[0].n}` : rows?.[0]?.ok !== undefined ? `value=${rows[0].ok}` : `ok (${rowCount})`;
  } catch (error) {
    outcome = `denied: ${error.message.slice(0, 60)}`;
  }
  await client.query(`ROLLBACK TO SAVEPOINT ${savepoint}`);
  results.push({ check: label, role, outcome, expected: expect });
}

await client.query("BEGIN");
try {
  const { rows: [admin] } = await client.query(
    `select m.email, u.id from team_members m left join auth.users u on lower(u.email) = lower(m.email)
     where m.status = 'active' and m.role = 'superadmin' limit 1`
  );
  const anon = { role: "anon" };
  const adminClaims = { role: "authenticated", sub: admin?.id, email: admin?.email };

  for (const table of ["team_members", "organizations", "organization_members", "subscriptions", "invoices", "leads", "audit_logs", "school_students", "settings", "automation_rules"]) {
    await check(`read ${table}`, "anon", anon, `select count(*)::int as n from public.${table}`, "rows=0 or denied");
  }
  await check("read published products", "anon", anon, `select count(*)::int as n from public.products`, "rows>0 if any published");
  await check("read menus", "anon", anon, `select count(*)::int as n from public.menus`, "rows>0");
  await check("submit lead", "anon", anon, `insert into public.leads (name, email, phone, product, source, status) values ('RLS test', 'rls@test.invalid', '0', 'test', 'rls_check', 'new')`, "ok");
  await check("self-promote to superadmin", "anon", anon, `insert into public.team_members (name, email, role, status) values ('x', 'x@test.invalid', 'superadmin', 'active')`, "denied");
  await check("is_platform_admin()", "authenticated", adminClaims, `select public.is_platform_admin() as ok`, "value=true");
  await check("admin reads team_members", "authenticated", adminClaims, `select count(*)::int as n from public.team_members`, "rows>=1");
  await check("admin reads leads", "authenticated", adminClaims, `select count(*)::int as n from public.leads`, "rows>=0, not denied");
  await check("admin reads invoices", "authenticated", adminClaims, `select count(*)::int as n from public.invoices`, "not denied");
  await check("random user is admin?", "authenticated", { role: "authenticated", sub: "00000000-0000-0000-0000-000000000001", email: "nobody@test.invalid" }, `select public.is_platform_admin() as ok`, "value=false");
  await check("random user reads team_members", "authenticated", { role: "authenticated", sub: "00000000-0000-0000-0000-000000000001", email: "nobody@test.invalid" }, `select count(*)::int as n from public.team_members`, "rows=0");
  console.log(admin?.id ? "Superadmin has a Supabase Auth account." : "WARNING: the superadmin email has no Supabase Auth account.");
} finally {
  await client.query("ROLLBACK");
  await client.end();
}
console.table(results);
