// Creates two throwaway schools inside a transaction that is always rolled back,
// then checks each school's users see only their own rows. Nothing is written.
// Usage: node scripts/db/verify-tenancy.mjs
import { randomUUID } from "node:crypto";
import { createDatabaseClient } from "../../db-client.mjs";

const client = createDatabaseClient();
await client.connect();
const results = [];
let step = 0;

async function as(userId, label, sql, expected) {
  const savepoint = `s${step++}`;
  await client.query(`SAVEPOINT ${savepoint}`);
  let outcome;
  try {
    await client.query("SET LOCAL ROLE authenticated");
    await client.query(`SELECT set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ role: "authenticated", sub: userId, email: `${userId}@test.invalid` })]);
    const { rows, rowCount } = await client.query(sql);
    outcome = rows?.[0] && "v" in rows[0] ? String(rows[0].v) : `ok (${rowCount})`;
  } catch (error) {
    outcome = `denied: ${error.message.slice(0, 55)}`;
  }
  await client.query(`ROLLBACK TO SAVEPOINT ${savepoint}`);
  results.push({ check: label, outcome, expected });
}

await client.query("BEGIN");
try {
  const schools = [];
  for (const name of ["RLS Test School A", "RLS Test School B"]) {
    const userId = randomUUID();
    await client.query(
      `insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
       values ($1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', $2, '', now(), now(), now(), '{}', '{}')`,
      [userId, `${userId}@test.invalid`]
    );
    const { rows: [org] } = await client.query(
      `insert into organizations (name, slug, type, status) values ($1, $2, 'school', 'active') returning id`,
      [name, `rls-test-${userId.slice(0, 8)}`]
    );
    await client.query(`insert into organization_members (organization_id, user_id, role) values ($1, $2, 'admin')`, [org.id, userId]);
    const { rows: [schoolClass] } = await client.query(
      `insert into school_classes (organization_id, name, section) values ($1, 'Grade 1', 'A') returning id`,
      [org.id]
    );
    await client.query(
      `insert into school_students (organization_id, first_name, last_name, roll_number, class_id) values ($1, $2, 'Student', 'T-1', $3)`,
      [org.id, name, schoolClass.id]
    );
    schools.push({ orgId: org.id, userId, name, classId: schoolClass.id });
  }
  const [a, b] = schools;

  await as(a.userId, "A: own organization id", `select get_auth_organization_id() = '${a.orgId}' as v`, "true");
  await as(a.userId, "A: students visible", `select count(*)::int as v from school_students`, "1");
  await as(a.userId, "A: B's students visible", `select count(*)::int as v from school_students where organization_id = '${b.orgId}'`, "0");
  await as(a.userId, "A: insert student into B", `insert into school_students (organization_id, first_name, last_name, roll_number, class_id) values ('${b.orgId}', 'x', 'y', 'T-2', '${b.classId}')`, "denied");
  await as(a.userId, "A: update B's students", `update school_students set first_name = 'hacked' where organization_id = '${b.orgId}'`, "ok (0)");
  await as(a.userId, "A: insert without org id (default)", `insert into school_students (first_name, last_name, roll_number, class_id) values ('Default', 'Org', 'T-3', '${a.classId}') returning (organization_id = '${a.orgId}') as v`, "true");
  await as(a.userId, "A: sees B's organization", `select count(*)::int as v from organizations where id = '${b.orgId}'`, "0");
  await as(a.userId, "A: is platform admin", `select is_platform_admin() as v`, "false");
  await as(b.userId, "B: students visible", `select count(*)::int as v from school_students`, "1");
  await as(b.userId, "B: A's students visible", `select count(*)::int as v from school_students where organization_id = '${a.orgId}'`, "0");

  await client.query(`update organizations set status = 'suspended' where id = $1`, [a.orgId]);
  await as(a.userId, "A suspended: students visible", `select count(*)::int as v from school_students`, "0");
  await client.query(`update organizations set status = 'trial' where id = $1`, [a.orgId]);
  await as(a.userId, "A on trial: students visible", `select count(*)::int as v from school_students`, "1");
} finally {
  await client.query("ROLLBACK");
  await client.end();
}
const failures = results.filter((r) => !(r.outcome === r.expected || (r.expected === "denied" && r.outcome.startsWith("denied"))));
console.table(results);
console.log(failures.length ? `${failures.length} check(s) did not match.` : "All tenancy checks passed. Transaction rolled back; nothing was saved.");
