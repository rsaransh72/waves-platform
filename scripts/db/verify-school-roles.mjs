// Checks the school role matrix as real users inside a transaction that is always
// rolled back. Pass migrations to apply them inside the same transaction first, so a
// policy change can be tested before it reaches the database:
//   node scripts/db/verify-school-roles.mjs [supabase/a.sql supabase/b.sql ...]
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { createDatabaseClient } from "../../db-client.mjs";

const migrations = process.argv.slice(2);
const client = createDatabaseClient();
await client.connect();
const results = [];
let step = 0;

async function as(userId, sql) {
  const savepoint = `s${step++}`;
  await client.query(`SAVEPOINT ${savepoint}`);
  try {
    await client.query("SET LOCAL ROLE authenticated");
    await client.query(`SELECT set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ role: "authenticated", sub: userId })]);
    const { rows, rowCount } = await client.query(sql);
    return rows?.[0] && "v" in rows[0] ? String(rows[0].v) : `ok:${rowCount}`;
  } catch (error) {
    return error.code === "42501" || /row-level security/.test(error.message) ? "denied" : `error: ${error.message.slice(0, 50)}`;
  } finally {
    await client.query(`ROLLBACK TO SAVEPOINT ${savepoint}`);
  }
}

async function expect(role, userId, label, sql, expected) {
  const outcome = await as(userId, sql);
  const pass = expected === "allowed" ? outcome.startsWith("ok:") && outcome !== "ok:0" : outcome === expected;
  results.push({ role, check: label, outcome, expected, pass: pass ? "✓" : "✗ FAIL" });
}

await client.query("BEGIN");
try {
  for (const migration of migrations) await client.query(fs.readFileSync(migration, "utf8").replace(/^NOTIFY .*$/gm, ""));

  const { rows: [org] } = await client.query(
    `insert into organizations (name, slug, type, status) values ('Role Test School', $1, 'school', 'active') returning id`,
    [`role-test-${randomUUID().slice(0, 8)}`]
  );
  const users = {};
  for (const role of ["admin", "teacher", "staff"]) {
    const id = randomUUID();
    await client.query(
      `insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
       values ($1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', $2, '', now(), now(), now(), '{}', '{}')`,
      [id, `${id}@test.invalid`]
    );
    await client.query(`insert into organization_members (organization_id, user_id, role) values ($1, $2, $3)`, [org.id, id, role]);
    users[role] = id;
  }
  const { rows: [schoolClass] } = await client.query(`insert into school_classes (organization_id, name, section) values ($1, 'Grade 1', 'A') returning id`, [org.id]);
  const { rows: [student] } = await client.query(`insert into school_students (organization_id, first_name, last_name, roll_number, class_id) values ($1, 'Test', 'Student', 'R-1', $2) returning id`, [org.id, schoolClass.id]);
  const { rows: [structure] } = await client.query(`insert into school_fee_structures (organization_id, name, amount) values ($1, 'Tuition', 1000) returning id`, [org.id]);
  const { rows: [studentFee] } = await client.query(`insert into school_student_fees (organization_id, student_id, fee_structure_id, due_date, amount_due) values ($1, $2, $3, current_date, 1000) returning id`, [org.id, student.id, structure.id]);
  await client.query(`insert into school_settings (organization_id, school_name) values ($1, 'Role Test School')`, [org.id]);

  const insertStudent = (roll) => `insert into school_students (first_name, last_name, roll_number, class_id) values ('New', 'Student', '${roll}', '${schoolClass.id}')`;
  const insertAttendance = `insert into school_attendance (student_id, class_id, status) values ('${student.id}', '${schoolClass.id}', 'present')`;
  const insertPayment = `insert into school_fee_payments (student_fee_id, amount_paid, payment_method) values ('${studentFee.id}', 100, 'cash')`;
  const insertNotice = `insert into school_communications (type, title, message, audience) values ('notice', 'Hello', 'Test', 'all')`;
  const updateSettings = `update school_settings set school_name = 'Changed'`;
  const readFees = `select count(*)::int as v from school_student_fees`;
  const insertClass = `insert into school_classes (name, section) values ('Grade 2', 'B')`;

  for (const [role, id] of Object.entries(users)) {
    await expect(role, id, "role function", `select get_auth_school_role() as v`, role);
    await expect(role, id, "read students", `select count(*)::int as v from school_students`, "1");
  }

  await expect("admin", users.admin, "add student", insertStudent("R-2"), "allowed");
  await expect("admin", users.admin, "add class", insertClass, "allowed");
  await expect("admin", users.admin, "mark attendance", insertAttendance, "allowed");
  await expect("admin", users.admin, "read fees", readFees, "1");
  await expect("admin", users.admin, "record payment", insertPayment, "allowed");
  await expect("admin", users.admin, "change settings", updateSettings, "ok:1");

  await expect("teacher", users.teacher, "add student", insertStudent("R-3"), "denied");
  await expect("teacher", users.teacher, "add class", insertClass, "denied");
  await expect("teacher", users.teacher, "mark attendance", insertAttendance, "allowed");
  await expect("teacher", users.teacher, "post notice", insertNotice, "allowed");
  await expect("teacher", users.teacher, "read fees", readFees, "0");
  await expect("teacher", users.teacher, "record payment", insertPayment, "denied");
  await expect("teacher", users.teacher, "change settings", updateSettings, "ok:0");

  await expect("staff", users.staff, "add student", insertStudent("R-4"), "allowed");
  await expect("staff", users.staff, "add class", insertClass, "denied");
  await expect("staff", users.staff, "mark attendance", insertAttendance, "denied");
  await expect("staff", users.staff, "read fees", readFees, "1");
  await expect("staff", users.staff, "record payment", insertPayment, "allowed");
  await expect("staff", users.staff, "add fee structure", `insert into school_fee_structures (name, amount) values ('Bus', 500)`, "denied");
  await expect("staff", users.staff, "change settings", updateSettings, "ok:0");

  const hasPaymentFunction = (await client.query("select 1 from pg_proc where proname = 'record_fee_payment'")).rowCount > 0;
  if (hasPaymentFunction) {
    // Payments persist between checks so receipt numbering and balances can be followed.
    // A refused payment aborts its statement, so each attempt gets its own savepoint:
    // kept when the payment succeeds, rolled back when it is refused.
    const pay = async (userId, amount, method = "cash") => {
      await client.query("SAVEPOINT attempt");
      await client.query("SET LOCAL ROLE authenticated");
      await client.query("SELECT set_config('request.jwt.claims', $1, true)", [JSON.stringify({ role: "authenticated", sub: userId })]);
      try {
        const { rows } = await client.query("select receipt_number from record_fee_payment($1, $2, $3, null, null)", [studentFee.id, amount, method]);
        await client.query("RELEASE SAVEPOINT attempt");
        await client.query("RESET ROLE");
        return rows[0].receipt_number;
      } catch (error) {
        await client.query("ROLLBACK TO SAVEPOINT attempt");
        return error.code === "42501" ? "denied" : `error: ${error.message.slice(0, 45)}`;
      }
    };
    const record = async (role, label, outcome, expected) => results.push({ role, check: label, outcome, expected, pass: outcome === expected ? "✓" : "✗ FAIL" });
    await client.query("SAVEPOINT payments");
    await record("admin", "pay 400 (receipt no.)", await pay(users.admin, 400), "R-000001");
    await record("staff", "pay 500 by UPI", await pay(users.staff, 500, "upi"), "R-000002");
    await record("staff", "overpay 200 (balance 100)", (await pay(users.staff, 200)).startsWith("error: The amount is more than the balance") ? "refused" : "accepted", "refused");
    await record("teacher", "record payment", await pay(users.teacher, 50), "denied");
    await record("admin", "bad method", (await pay(users.admin, 10, "bitcoin")).startsWith("error: Choose a payment method") ? "refused" : "accepted", "refused");
    await record("admin", "pay final 100", await pay(users.admin, 100), "R-000003");
    const { rows: [fee] } = await client.query("select amount_paid::int as paid, status from school_student_fees where id = $1", [studentFee.id]);
    await record("-", "invoice after payments", `${fee.paid} ${fee.status}`, "1000 paid");
    await client.query("ROLLBACK TO SAVEPOINT payments");
  }

  const hasLibraryFunctions = (await client.query("select 1 from pg_proc where proname = 'issue_library_book'")).rowCount > 0;
  if (hasLibraryFunctions) {
    const { rows: [book] } = await client.query(`insert into school_library_books (organization_id, title, quantity, available) values ($1, 'Test Book', 1, 1) returning id`, [org.id]);
    const call = async (userId, sql, params) => {
      await client.query("SAVEPOINT attempt");
      await client.query("SET LOCAL ROLE authenticated");
      await client.query("SELECT set_config('request.jwt.claims', $1, true)", [JSON.stringify({ role: "authenticated", sub: userId })]);
      try {
        const { rows } = await client.query(sql, params);
        await client.query("RELEASE SAVEPOINT attempt");
        await client.query("RESET ROLE");
        return { ok: true, value: rows[0] ? Object.values(rows[0])[0] : null };
      } catch (error) {
        await client.query("ROLLBACK TO SAVEPOINT attempt");
        return { ok: false, value: error.code === "42501" ? "denied" : error.message.slice(0, 40) };
      }
    };
    const available = async () => (await client.query("select available from school_library_books where id = $1", [book.id])).rows[0].available;
    const record = (role, label, outcome, expected) => results.push({ role, check: label, outcome: String(outcome), expected: String(expected), pass: String(outcome) === String(expected) ? "✓" : "✗ FAIL" });
    const issueSql = "select issue_library_book($1, $2, current_date + 7)";

    const issued = await call(users.staff, issueSql, [book.id, student.id]);
    record("staff", "issue last copy", issued.ok ? "issued" : issued.value, "issued");
    record("-", "available after issue", await available(), 0);
    const second = await call(users.admin, issueSql, [book.id, student.id]);
    record("admin", "issue with 0 copies", second.ok ? "issued" : second.value.startsWith("No copies") ? "refused" : second.value, "refused");
    const teacherIssue = await call(users.teacher, issueSql, [book.id, student.id]);
    record("teacher", "issue book", teacherIssue.value, "denied");
    const returned = await call(users.staff, "select return_library_book($1, 0)", [issued.value]);
    record("staff", "return book", returned.ok ? "returned" : returned.value, "returned");
    record("-", "available after return", await available(), 1);
    const again = await call(users.staff, "select return_library_book($1, 0)", [issued.value]);
    record("staff", "return twice", again.ok ? "returned" : again.value.startsWith("This book has already") ? "refused" : again.value, "refused");
  }
} finally {
  await client.query("ROLLBACK");
  await client.end();
}
console.table(results);
const failures = results.filter((result) => result.pass !== "✓").length;
console.log(failures ? `${failures} check(s) failed.` : `All ${results.length} role checks passed. Rolled back; nothing was saved.`);
process.exitCode = failures ? 1 : 0;
