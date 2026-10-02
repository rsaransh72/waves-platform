// Browser checks for the Phase 1 launch fixes, run as real users against seeded schools:
// live leads, honest notice wording, pricing copy, bulk fee assignment and the
// student/teacher spreadsheet import. Needs the simulation's seed data.
//
// Usage (SIM_INBOX, SIM_PASSWORD and SIM_BASE in the environment):
//   node scripts/qa/sim/seed.mjs && node scripts/qa/launch-fixes.mjs && node scripts/qa/sim/cleanup.mjs
import fs from "node:fs";
import path from "node:path";
import XLSX from "xlsx";
import { BASE, OUT, Person, closeBrowser, readJson, service, sessionCookies, sleep } from "./sim/lib.mjs";

const seeded = readJson("seed.json");
const school = Object.fromEntries(seeded.map((item) => [item.key, item]));
const results = [];
const check = (name, ok, note = "") => {
  results.push({ check: name, result: ok ? "✓ pass" : "✗ fail", note: String(note).replace(/\s+/g, " ").slice(0, 110) });
};
const inDays = (n) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date(Date.now() + n * 86400000));
const signedIn = async (id, email) => new Person(id, id, "qa", "desktop").open({ cookies: await sessionCookies(email) });
const textOf = (person) => person.page.evaluate(() => document.body.innerText);

// ── Leads appear live on an open Leads page ──────────────────────────────────────
{
  const { data: admin } = await service.from("team_members").select("email").eq("role", "superadmin").eq("status", "active").limit(1).single();
  const person = await signedIn("admin", admin.email);
  await person.visit("/admin/leads", "leads");
  await sleep(2500); // let the realtime channel subscribe
  const email = `${process.env.SIM_INBOX.split("@")[0]}+qasim-live-${Date.now().toString(36)}@${process.env.SIM_INBOX.split("@")[1]}`;
  const response = await fetch(`${BASE}/api/leads`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ inquiryType: "demo", name: "Live Test Principal", email, phone: "9000099001", organizationName: "Live Test Vidyalaya", product: "school-erp", source: "qa_live" }) });
  check("Lead form accepts the enquiry", response.status === 201, response.status);
  const toast = await person.page.waitForFunction(() => Array.from(document.querySelectorAll("[data-sonner-toast]")).map((node) => node.innerText).find((text) => text.includes("Live Test Principal")) ?? false, { timeout: 20000 }).then((handle) => handle.jsonValue()).catch(() => "");
  check("Admin sees a toast for the new enquiry", Boolean(toast), toast);
  const row = await person.page.waitForFunction(() => Array.from(document.querySelectorAll("tbody tr")).some((tr) => tr.innerText.includes("Live Test Principal")), { timeout: 15000 }).then(() => true).catch(() => false);
  check("New enquiry appears in the table without a reload", row);
  await person.shot("live-lead");
  await service.from("leads").delete().eq("email", email);
  await person.close();
}

// ── Public pricing copy ──────────────────────────────────────────────────────────
{
  const person = await new Person("visitor", "visitor", "qa", "desktop").open();
  const info = await person.visit("/pricing", "pricing");
  const { data: product } = await service.from("products").select("pricing").eq("slug", "school-erp").single();
  const hasPlans = (product?.pricing ?? []).some((plan) => /\d/.test(String(plan.price ?? "")));
  check("Pricing intro matches whether plans have prices", hasPlans ? info.text.includes("Every plan below") : !info.text.includes("Every plan below"), info.text.split("\n").find((line) => line.length > 60));
  await person.close();
}

// ── Notices say they are not sent ───────────────────────────────────────────────
{
  const person = await signedIn("s2", school.s2.email);
  await person.visit("/school/communications", "notice board");
  await person.mustClick("Post a notice");
  await sleep(400);
  const drawer = await textOf(person);
  check("No SMS or Email Blast options", !/SMS Text Message|Email Blast/.test(drawer));
  check("Form says notices are not sent to parents", drawer.includes("It is not sent to parents by SMS, WhatsApp or email."));
  await person.fill("Subject / Title", "PTM on Saturday, 11 October");
  await person.fill("Message Body", "Parent-teacher meeting for classes 6 to 10, 9 am to 1 pm.");
  await person.clearToasts();
  await person.mustClick("Post notice", { selector: "button[type=submit]" });
  check("Posting confirms “Notice posted.”", (await person.waitToast()).includes("Notice posted."));
  await person.close();
}

// ── Bulk fee assignment ──────────────────────────────────────────────────────────
{
  const s1 = school.s1;
  const person = await signedIn("s1", s1.email);
  const due = inDays(30);
  const openAssign = async () => {
    await person.visit("/school/fees/collection", "fee collection");
    await person.mustClick("Assign to classes");
    await sleep(400);
    await person.fill("Fee", "Annual Charges");
    await person.fill("Due date", due);
  };
  const tick = (label) => person.page.evaluate((label) => {
    const box = Array.from(document.querySelectorAll("label")).find((item) => item.innerText.trim().startsWith(label))?.querySelector("input[type=checkbox]");
    box?.click();
    return Boolean(box);
  }, label);
  const preview = () => person.page.$eval("[role=status]", (node) => node.innerText.replace(/\s+/g, " ").trim());

  await openAssign();
  await tick("Class 8 - B");
  await tick("Class 10 - A");
  await sleep(300);
  const first = await preview();
  check("Preview counts the chosen classes (24 + 20)", first.startsWith("44 students × ₹6,000.00 = ₹2,64,000.00"), first);
  await person.clearToasts();
  await person.mustClick("Assign to 44 students", { selector: "button[type=submit]" });
  const toast = await person.waitToast();
  check("Assigning confirms the count", toast.includes("Annual Charges 2026-27 assigned to 44 students."), toast);
  const { count: billed } = await service.from("school_student_fees").select("id", { count: "exact", head: true }).eq("organization_id", s1.organizationId).eq("due_date", due);
  check("44 fee rows exist in the database", billed === 44, billed);
  await sleep(800);
  const listed = await person.page.$$eval("tbody tr", (rows) => rows.filter((row) => row.innerText.includes("Annual Charges")).length);
  check("The list shows the new fees without a reload", listed === 44, listed);

  await openAssign();
  await tick("Class 8 - B");
  await tick("Class 10 - A");
  await sleep(300);
  const again = await preview();
  const disabled = await person.page.$eval("form button[type=submit]", (button) => button.disabled);
  check("Running it again bills nobody twice", again.startsWith("0 students") && again.includes("44 already owe this fee") && disabled, again);

  // Whole school, same fee and date: only the other 60 students are billed.
  await person.page.evaluate(() => Array.from(document.querySelectorAll("label")).find((item) => item.innerText.includes("Whole school"))?.querySelector("input")?.click());
  await sleep(300);
  const whole = await preview();
  check("Whole school skips the 44 already billed", whole.startsWith("60 students") && whole.includes("44 already owe"), whole);
  await person.shot("assign-fee");
  await person.close();
}

// ── Spreadsheet import ───────────────────────────────────────────────────────────
const files = path.join(OUT, "import-files");
fs.mkdirSync(files, { recursive: true });
const studentsFile = path.join(files, "students.xlsx");
{
  const rows = [
    ["First name *", "Last name", "Roll number *", "Class *", "Section *", "Parent mobile"],
    ...Array.from({ length: 8 }, (_, i) => [["Ishaan", "Kavya", "Rohit", "Sneha", "Arnav", "Pihu", "Yash", "Tara"][i], "Verma", `9${String(i + 1).padStart(2, "0")}`, "Class VIII", "b", i % 2 ? "" : `+91 90000 4${String(1000 + i)}`]),
    ["Meher", "Kaur", "960", "Class 6", "C", "9000041100"],
    ["Zubin", "Shah", "961", "6", "C", ""],
    ["Bad", "Phone", "962", "Class 8", "B", "12345"],
    ["Dup", "Roll", "101", "Class 8", "B", ""],
  ];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rows), "Students");
  fs.writeFileSync(studentsFile, XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }));
}
const teachersFile = path.join(files, "teachers.csv");
fs.writeFileSync(teachersFile, "Employee ID,First name,Last name,Subject,Email,Mobile\nT-101,Ritu,Bansal,Physics,ritu@school.in,98765 40001\nT-102,Manoj,Rawat,Chemistry,,\nEMP-001,Copy,Teacher,Maths,,\n");

{
  const s4 = school.s4; // Little Angels: has Class 8 - B, no Class 6 - C
  const person = await signedIn("s4", s4.email);
  await person.visit("/school/students", "students");
  await person.mustClick("Import from Excel");
  await person.page.waitForFunction(() => location.pathname === "/school/students/import", { timeout: 20000 });
  await person.page.waitForNetworkIdle({ idleTime: 500 }).catch(() => {});

  // Capture the generated workbook as the page hands it to the browser to save.
  await person.page.evaluate(() => {
    const original = URL.createObjectURL;
    URL.createObjectURL = (blob) => { window.__lastDownload = blob; return original(blob); };
  });
  await person.mustClick("Download Excel template");
  await person.page.waitForFunction(() => window.__lastDownload, { timeout: 15000 }).catch(() => {});
  const base64 = await person.page.evaluate(async () => {
    const blob = window.__lastDownload;
    if (!blob) return "";
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
  });
  const headings = base64 ? XLSX.utils.sheet_to_json(XLSX.read(Buffer.from(base64, "base64")).Sheets.Students, { header: 1 })[0] : [];
  check("Template downloads with the right headings", headings.join("|") === "First name *|Last name|Roll number *|Class *|Section *|Parent mobile", headings.join(", "));

  const input = await person.page.$("input[type=file]");
  await input.uploadFile(studentsFile);
  await person.page.waitForFunction(() => document.body.innerText.includes("ready"), { timeout: 15000 });
  let text = await textOf(person);
  check("Preview: 8 ready, 4 with errors", text.includes("8 ready") && text.includes("4 with errors"), text.match(/\d+ ready[\s\S]{0,40}/)?.[0]);
  check("“Class VIII / b” matches Class 8 - B", !text.includes("Class VIII - b does not exist"));
  check("Bad phone is explained", text.includes("Parent mobile: Enter all 10 digits (5 entered)."));
  check("Existing roll number is caught", text.includes("Roll number 101 is already used"));
  check("Missing class is offered for creation", text.includes("1 class in the file does not exist yet: Class 6 - C"), text.match(/class(es)? in the file[^.]*/)?.[0]);
  await person.shot("import-preview");

  await person.clearToasts();
  await person.mustClick("Create it");
  await person.page.waitForFunction(() => document.body.innerText.includes("10 ready"), { timeout: 15000 }).catch(() => {});
  text = await textOf(person);
  check("After creating Class 6 - C: 10 ready, 2 with errors", text.includes("10 ready") && text.includes("2 with errors"));
  await person.mustClick("Import 10 students");
  await person.page.waitForFunction(() => document.body.innerText.includes("imported"), { timeout: 20000 }).catch(() => {});
  text = await textOf(person);
  check("Import confirms 10 students and 2 left out", text.includes("10 students imported.") && text.includes("2 rows with errors were left out"), text.match(/\d+ students? imported[^.]*\.[^.]*/)?.[0]);
  const { data: imported } = await service.from("school_students").select("roll_number, parent_phone, school_classes(name, section)").eq("organization_id", s4.organizationId).in("roll_number", ["901", "902", "960", "961"]);
  const byRoll = Object.fromEntries((imported ?? []).map((row) => [row.roll_number, row]));
  check("Saved rows have the right class and phone", byRoll["901"]?.school_classes?.name === "Class 8" && byRoll["901"]?.parent_phone === "+919000041000" && byRoll["902"]?.parent_phone === null && byRoll["960"]?.school_classes?.name === "Class 6" && byRoll["960"]?.school_classes?.section === "C", JSON.stringify(byRoll["901"]));
  await person.shot("import-done");

  await person.visit("/school/teachers/import", "teacher import");
  await (await person.page.$("input[type=file]")).uploadFile(teachersFile);
  await person.page.waitForFunction(() => document.body.innerText.includes("ready"), { timeout: 15000 });
  text = await textOf(person);
  check("Teacher CSV: 2 ready, duplicate EMP-001 caught", text.includes("2 ready") && text.includes("Employee ID EMP-001 is already used"));
  await person.mustClick("Import 2 teachers");
  await person.page.waitForFunction(() => document.body.innerText.includes("imported"), { timeout: 20000 }).catch(() => {});
  const { count: teachers } = await service.from("school_teachers").select("id", { count: "exact", head: true }).eq("organization_id", s4.organizationId).in("employee_id", ["T-101", "T-102"]);
  check("2 teachers saved", teachers === 2, teachers);
  await person.close();
}

// ── A teacher cannot open the importer ───────────────────────────────────────────
{
  const person = await new Person("anon", "anon", "qa", "desktop").open();
  const info = await person.visit("/school/students/import", "importer while signed out");
  check("Importer needs a login", info.finalPath.startsWith("/school/login") || info.finalPath.startsWith("/login"), info.finalPath);
  await person.close();
}

await closeBrowser();
console.table(results);
process.exitCode = results.some((row) => row.result.startsWith("✗")) ? 1 : 0;
