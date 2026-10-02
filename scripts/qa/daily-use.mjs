// Browser checks for the Phase 2 daily-use fixes, run as real users against seeded
// schools: attendance, admissions, timetable clashes, billing notices, fee structures,
// logo upload, transport and library, and the public site on small phones.
//
// Usage (SIM_INBOX, SIM_PASSWORD and SIM_BASE in the environment):
//   node scripts/qa/sim/seed.mjs && node scripts/qa/daily-use.mjs && node scripts/qa/sim/cleanup.mjs
import fs from "node:fs";
import path from "node:path";
import { OUT, Person, closeBrowser, readJson, service, sessionCookies, sleep, userClient } from "./sim/lib.mjs";

const seeded = readJson("seed.json");
const school = Object.fromEntries(seeded.map((item) => [item.key, item]));
const results = [];
const check = (name, ok, note = "") => {
  results.push({ check: name, result: ok ? "✓ pass" : "✗ fail", note: String(note).replace(/\s+/g, " ").slice(0, 110) });
};
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
const signedIn = async (id, email, device = "desktop") => new Person(id, id, "qa", device).open({ cookies: await sessionCookies(email) });
const textOf = (person) => person.page.evaluate(() => document.body.innerText);
const classesOf = async (organizationId) => {
  const { data } = await service.from("school_classes").select("id, name, section").eq("organization_id", organizationId);
  return Object.fromEntries((data ?? []).map((row) => [`${row.name} - ${row.section}`, row.id]));
};
// Run a step and record a failure instead of stopping the whole run.
const step = async (name, fn) => {
  try {
    await fn();
  } catch (error) {
    check(`${name} (step crashed)`, false, error.message);
  }
};

// ── Attendance on a phone: everyone starts present ──────────────────────────────
await step("Attendance", async () => {
  const s2 = school.s2;
  const classes = await classesOf(s2.organizationId);
  const person = await signedIn("s2-attendance", s2.email, "android");
  const info = await person.visit("/school/attendance", "attendance");
  check("Attendance fits a 360px phone", info.overflowX <= 4, `${info.overflowX}px`);
  await person.fill("Class", classes["Class 9 - A"]);
  await person.page.waitForFunction(() => document.body.innerText.includes("18 present"), { timeout: 15000 }).catch(() => {});
  let text = await textOf(person);
  check("Unsaved register starts with all 18 present", text.includes("18 present · 0 late · 0 absent") && text.includes("Not saved yet"), text.match(/\d+ present[^\n]*/)?.[0]);
  const absentButtons = await person.page.$$("button[aria-pressed]");
  await absentButtons[2].click(); // first student: Absent
  await sleep(200);
  text = await textOf(person);
  check("Marking one absent updates the counts", text.includes("17 present · 0 late · 1 absent"), text.match(/\d+ present[^\n]*/)?.[0]);
  await person.clearToasts();
  await person.mustClick("Save Register");
  const toast = await person.waitToast();
  check("Save confirms the number of students", toast.includes("Attendance saved for 18 students."), toast);
  const { data: saved } = await service.from("school_attendance").select("status").eq("class_id", classes["Class 9 - A"]).eq("date", today);
  const absent = (saved ?? []).filter((row) => row.status === "absent").length;
  check("18 rows saved, 1 absent", saved?.length === 18 && absent === 1, `${saved?.length} rows, ${absent} absent`);
  await person.shot("attendance-phone");
  await person.close();
});

// ── Admission form: roll numbers per class, admission number per school ─────────
await step("Admissions", async () => {
  const s1 = school.s1;
  const person = await signedIn("s1-admit", s1.email);
  const admit = async (first, roll, admission) => {
    await person.clearToasts();
    await person.mustClick("Admit Student");
    await sleep(400);
    await person.fill("First name", first);
    await person.fill("Last name", "Joshi");
    await person.fill("Date of birth", "2016-04-12");
    await person.fill("Gender", "female");
    await person.fill("Admission number", admission);
    await person.fill("Class and section", "Class 5");
    await person.fill("Roll number", roll);
    await person.fill("Father's name", "Mahesh Joshi");
    await person.fill("Category", "obc");
    await person.fill("Blood group", "B+");
    await person.page.evaluate(() => Array.from(document.querySelectorAll("form button[type=submit]")).find((button) => button.innerText.includes("Admit Student"))?.click());
    return person.waitToast();
  };
  await person.visit("/school/students", "students");
  let toast = await admit("Riya", "101", "QA/2026/001");
  check("Roll 101 is free in Class 5 - A (Class 1 - A has its own 101)", toast.includes("Student enrolled."), toast);
  await person.page.keyboard.press("Escape");
  await person.visit("/school/students", "students");
  toast = await admit("Diya", "101", "QA/2026/002");
  check("Same roll in the same class is refused", toast.includes("That roll number is already used in this class."), toast);
  await person.visit("/school/students", "students");
  toast = await admit("Tara", "150", "QA/2026/001");
  check("Same admission number is refused", toast.includes("That admission number is already used by another student."), toast);
  const { data: riya } = await service.from("school_students").select("admission_number, date_of_birth, gender, father_name, category, blood_group").eq("organization_id", s1.organizationId).eq("first_name", "Riya").eq("last_name", "Joshi").maybeSingle();
  check("Admission details are saved", riya?.admission_number === "QA/2026/001" && riya?.date_of_birth === "2016-04-12" && riya?.gender === "female" && riya?.category === "obc" && riya?.blood_group === "B+" && riya?.father_name === "Mahesh Joshi", JSON.stringify(riya));
  await person.visit("/school/students", "students");
  check("Students list shows the admission number", (await textOf(person)).includes("QA/2026/001"));
  await person.close();
});

// ── Timetable clashes ────────────────────────────────────────────────────────────
await step("Timetable", async () => {
  const s1 = school.s1;
  const person = await signedIn("s1-timetable", s1.email);
  await person.visit("/school/timetable", "timetable");
  const options = await person.page.$$eval("select option", (items) => items.map((item) => item.textContent));
  check("Classes read “Class 10 - A”", options.includes("Class 10 - A") && !options.some((text) => /\(.+\)/.test(text)), options.slice(0, 4).join(", "));
  const addPeriod = async (className, start, end, room) => {
    await person.clearToasts();
    await person.mustClick("Add Period");
    await sleep(300);
    await person.fill("Class", className);
    await person.fill("Day of Week", "Monday");
    await person.fill("Start Time", start);
    await person.fill("End Time", end);
    await person.fill("Subject", "Mathematics");
    await person.fill("Assigned Teacher", "");
    await person.fill("Room Number", room);
    await sleep(300);
  };
  await addPeriod("Class 10", "09:00", "10:00", "12");
  await person.page.evaluate(() => document.querySelector("form button[type=submit]")?.click());
  const toast = await person.waitToast();
  check("First period is added", toast.includes("Mathematics added for Class 10 - A on Monday."), toast);
  await addPeriod("Class 8", "09:30", "10:30", "Room 12");
  const alert = await person.page.$eval("[role=alert]", (node) => node.innerText).catch(() => "");
  const disabled = await person.page.$eval("form button[type=submit]", (button) => button.disabled);
  check("Same teacher at an overlapping time is flagged", /is already teaching Class 10 - A at 9:00 am – 10:00 am/.test(alert), alert);
  check("“Room 12” and “12” are the same room", alert.includes("Room 12 is already used by Class 10 - A"), alert);
  check("A clashing period cannot be saved", disabled);
  await person.fill("Start Time", "10:00");
  await person.fill("End Time", "11:00");
  await sleep(300);
  const after = await person.page.$("[role=alert]");
  check("Back-to-back periods do not clash", !after);
  await person.shot("timetable-clash");
  await person.close();
});

// ── Billing: overdue banner, admin label, paused page ───────────────────────────
await step("Billing", async () => {
  const s5 = school.s5; // past_due, term ended 6 days ago, school still active
  let person = await signedIn("s5-billing", s5.email);
  await person.visit("/school", "dashboard");
  let text = await textOf(person);
  check("Principal sees the overdue banner", text.includes("Payment overdue.") && text.includes("overdue by 6 days"), text.match(/Payment overdue[^\n]*/)?.[0]);
  check("Banner gives the Waves phone number", /Call Waves on \+91 \d{5} \d{5}/.test(text), text.match(/Call Waves[^\n]*/)?.[0]);
  await person.close();

  const s1 = school.s1;
  person = await signedIn("s1-billing", s1.email);
  await person.visit("/school", "dashboard");
  check("A paid-up school sees no banner", !(await textOf(person)).includes("Payment overdue"));
  await person.close();

  const { data: admin } = await service.from("team_members").select("email").eq("role", "superadmin").eq("status", "active").limit(1).single();
  person = await signedIn("admin-billing", admin.email);
  await person.visit("/admin/subscriptions", "subscriptions");
  text = await textOf(person);
  check("Admin list says “Payment overdue · 6 days”", text.includes("Payment overdue · 6 days"), text.match(/Payment overdue[^\n]*/)?.[0]);
  await person.close();

  await service.from("organizations").update({ status: "suspended" }).eq("id", s5.organizationId);
  try {
    person = await signedIn("s5-paused", s5.email);
    const info = await person.visit("/school/students", "students while paused");
    text = await textOf(person);
    check("Paused school lands on the paused page", info.finalPath.startsWith("/access-denied?area=school&reason=paused"), info.finalPath);
    check("Paused page names the school and says data is safe", text.includes("Delhi Heights Academy is paused") && text.includes("Nothing has been deleted"), info.h1);
    check("Paused page says how to renew", text.includes("To renew, contact Waves"));
    await person.shot("account-paused");
    await person.close();
  } finally {
    await service.from("organizations").update({ status: "active" }).eq("id", s5.organizationId);
  }
});

// ── Fee structures: edit and archive ────────────────────────────────────────────
await step("Fee structures", async () => {
  const s3 = school.s3;
  const person = await signedIn("s3-fees", s3.email);
  const info = await person.visit("/school/fees", "fee structures");
  check("Fee page title is the h1", info.h1 === "Fee Structures", info.h1);
  await person.clearToasts();
  await person.page.click("button[aria-label='Edit Transport Fee – October']");
  await sleep(300);
  await person.fill("Amount", "2600");
  await person.mustClick("Save Changes");
  let toast = await person.waitToast();
  check("Editing a fee confirms", toast.includes("“Transport Fee – October” updated.") || toast.includes('"Transport Fee – October" updated.'), toast);
  await person.clearToasts();
  await person.page.click("button[aria-label='Archive Annual Charges 2026-27']");
  toast = await person.waitToast();
  check("Archiving asks first and confirms", person.dialogs.some((message) => message.includes("Fees already assigned")) && toast.includes("archived"), toast);
  const { data: rows } = await service.from("school_fee_structures").select("name, amount, archived_at").eq("organization_id", s3.organizationId);
  const byName = Object.fromEntries((rows ?? []).map((row) => [row.name, row]));
  check("Saved: new amount and archived date", Number(byName["Transport Fee – October"]?.amount) === 2600 && Boolean(byName["Annual Charges 2026-27"]?.archived_at), JSON.stringify(byName["Transport Fee – October"]));
  const listed = await person.page.$eval("table", (table) => table.innerText);
  check("Archived fee leaves the list", !listed.includes("Annual Charges 2026-27") && (await textOf(person)).includes("Show archived (1)"));
  await person.visit("/school/fees/collection", "fee collection");
  await person.mustClick("Assign to classes");
  await sleep(500);
  check("Archived fee is not offered when assigning", !(await textOf(person)).includes("Annual Charges 2026-27"));
  await person.close();
});

// ── Logo upload and settings toast ──────────────────────────────────────────────
await step("Logo", async () => {
  const s3 = school.s3;
  const logo = path.join(OUT, "qa-logo.png");
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(logo, Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64"));
  const person = await signedIn("s3-logo", s3.email);
  await person.visit("/school/settings", "settings");
  await person.clearToasts();
  await (await person.page.$("input[type=file]")).uploadFile(logo);
  let toast = await person.waitToast();
  check("Logo uploads", toast.includes("Logo uploaded."), toast);
  await person.clearToasts();
  await person.mustClick("Save Settings");
  toast = await person.waitToast();
  check("Settings save shows a toast", toast.includes("School settings saved."), toast);
  const { data: settings } = await service.from("school_settings").select("logo_url").eq("organization_id", s3.organizationId).single();
  check("Logo URL points at Storage", String(settings?.logo_url).includes(`/storage/v1/object/public/school-logos/${s3.organizationId}/`), settings?.logo_url);
  const image = await fetch(settings?.logo_url ?? "").then((response) => response.status).catch(() => 0);
  check("Uploaded logo is reachable", image === 200, image);
  await person.close();

  // Another school must not be able to write into this school's folder.
  const intruder = await userClient(school.s1.email);
  const { error } = await intruder.storage.from("school-logos").upload(`${s3.organizationId}/evil.png`, fs.readFileSync(logo), { contentType: "image/png" });
  check("Another school cannot upload into this folder", Boolean(error), error?.message);
});

// ── Transport and library confirm saves ──────────────────────────────────────────
await step("Transport", async () => {
  const s2 = school.s2;
  const person = await signedIn("s2-transport", s2.email);
  await person.visit("/school/transport", "transport");
  const addRoute = async (name) => {
    await person.clearToasts();
    await person.mustClick("Add Route");
    await sleep(300);
    await person.fill("Route Name", name);
    await person.fill("Vehicle Number", "MP04AB1234");
    await person.page.evaluate(() => Array.from(document.querySelectorAll("form button[type=submit]")).at(-1)?.click());
    return person.waitToast();
  };
  let toast = await addRoute("Route 1 – Kolar Road");
  check("Adding a route confirms", toast.includes("Route \"Route 1 – Kolar Road\" added."), toast);
  await person.page.keyboard.press("Escape");
  toast = await addRoute("route 1 – kolar road");
  check("A second route with the same name is refused", toast.includes("There is already a route called"), toast);
  await person.close();
});

await step("Library", async () => {
  const s2 = school.s2;
  const person = await signedIn("s2-library", s2.email);
  await person.visit("/school/library", "library");
  await person.clearToasts();
  await person.mustClick("Add Book");
  await sleep(300);
  await person.fill("Book Title", "Godaan");
  await person.fill("Author", "Munshi Premchand");
  await person.fill("Total Quantity", "3");
  await person.page.evaluate(() => Array.from(document.querySelectorAll("form button[type=submit]")).at(-1)?.click());
  const toast = await person.waitToast();
  check("Adding a book confirms", toast.includes("“Godaan” added") || toast.includes('"Godaan" added to the library.'), toast);
  await person.close();
});

// ── Public site on small phones, sign-in labels ──────────────────────────────────
await step("Website", async () => {
  for (const device of ["tiny", "phone390"]) {
    const person = await new Person(`visitor-${device}`, device, "qa", device).open();
    const info = await person.visit("/", `home on ${device}`);
    check(`Home page fits a ${device === "tiny" ? 320 : 390}px screen`, info.overflowX <= 4, `${info.overflowX}px; ${JSON.stringify(info.widestElement)}`);
    const overlap = await person.page.evaluate(() => {
      const header = document.querySelector("header");
      const logo = header.querySelector("a[href='/']").getBoundingClientRect();
      const demo = Array.from(header.querySelectorAll("a")).find((link) => link.offsetParent && /demo/i.test(link.innerText)).getBoundingClientRect();
      return logo.right > demo.left + 1;
    });
    check(`“Demo” button clears the logo at ${device === "tiny" ? 320 : 390}px`, !overlap);
    if (device === "phone390") {
      await person.page.click("button[aria-label='Toggle navigation menu']");
      await sleep(300);
      const opened = await person.page.$eval("button[aria-label='Toggle navigation menu']", (button) => button.getAttribute("aria-expanded"));
      await person.page.keyboard.press("Escape");
      await sleep(300);
      const closed = await person.page.$eval("button[aria-label='Toggle navigation menu']", (button) => button.getAttribute("aria-expanded"));
      check("Escape closes the website menu", opened === "true" && closed === "false", `${opened} → ${closed}`);
    }
    await person.shot(`home-${device}`);
    await person.close();
  }
  const person = await new Person("visitor-login", "login", "qa", "desktop").open();
  const info = await person.visit("/login", "sign in");
  check("Sign-in fields have labels", info.unlabeledControls === 0, info.unlabeledControls);
  await person.close();

  const principal = await signedIn("s1-phone", school.s1.email, "android");
  const dash = await principal.visit("/school", "dashboard on phone");
  check("School menu button has a name", dash.iconButtonsWithoutName === 0, dash.iconButtonsWithoutName);
  check("Sidebar says “Classes”", !(await textOf(principal)).includes("Classes & Subjects"));
  await principal.close();
});

await closeBrowser();
console.table(results);
fs.writeFileSync(path.join(OUT, "daily-use-results.json"), JSON.stringify(results, null, 2));
process.exitCode = results.some((row) => row.result.startsWith("✗")) ? 1 : 0;
