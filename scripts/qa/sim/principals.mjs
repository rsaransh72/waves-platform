// The five principals whose schools already use the ERP, each doing a normal working
// day in the real app: they sign in with their password and click through the screens.
import { BASE, PASSWORD, Person, alias, attempt, service, sleep } from "./lib.mjs";

const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
const inDays = (n) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date(Date.now() + n * 86400000));

async function signIn(person, email, password = PASSWORD) {
  await person.visit("/login", "sign-in page");
  const labelled = await person.page.evaluate(() => Array.from(document.querySelectorAll("input[type=email], input[type=password]")).every((input) => input.labels?.length || input.getAttribute("aria-label")));
  if (!labelled) person.issue("low", "accessibility", "Sign-in fields have no labels", "Email and password boxes only have placeholder text; screen readers and autofill rely on labels.");
  await person.page.type("input[type=email]", email, { delay: 10 });
  await person.page.type("input[type=password]", password, { delay: 10 });
  const started = Date.now();
  await person.mustClick("Sign in", { selector: "button[type=submit]" });
  const result = await person.page.waitForFunction(() => (location.pathname !== "/login" ? `→ ${location.pathname}` : (document.querySelector("[role=alert], .text-red-600, .bg-red-50")?.innerText.trim() || false)), { timeout: 30000 }).then((handle) => handle.jsonValue()).catch(() => "no response");
  await person.page.waitForNetworkIdle({ idleTime: 500, timeout: 20000 }).catch(() => {});
  return { result, ms: Date.now() - started };
}

async function openDrawerAndFill(person, buttonText, fields) {
  await person.mustClick(buttonText);
  await sleep(400);
  for (const [label, value] of fields) await person.fill(label, value);
}

async function submitAndToast(person, buttonText) {
  await person.clearToasts();
  await person.mustClick(buttonText, { selector: "button[type=submit]" });
  const toast = await person.waitToast();
  const invalid = toast ? "" : await person.validationMessages();
  return toast || (invalid ? `blocked: ${invalid}` : "no feedback");
}

async function findMenu(person) {
  const sidebarVisible = await person.page.evaluate(() => {
    const aside = document.querySelector("aside");
    return Boolean(aside && aside.getBoundingClientRect().width > 0 && aside.getBoundingClientRect().right > 0);
  });
  if (sidebarVisible) return "sidebar visible";
  const button = await person.page.$("header button");
  if (!button) return "no menu";
  const name = await button.evaluate((element) => element.getAttribute("aria-label") || element.innerText.trim());
  if (!name) person.issue("low", "accessibility", "Phone menu button has no name", "The ☰ button in the school header has no aria-label; screen readers announce just “button”.");
  await button.click();
  await sleep(500);
  const links = await person.page.evaluate(() => Array.from(document.querySelectorAll("a[href^='/school/']")).filter((link) => link.getBoundingClientRect().width > 0 && link.getBoundingClientRect().left >= 0).length);
  return `opened ☰ menu, ${links} links visible`;
}

async function exportCheck(person) {
  const text = await person.text();
  return /export|download|excel|csv/i.test(text);
}

// ───────────────────────── S1: fees and attendance, office PC ─────────────────────────
async function anjali(person, school, shared) {
  await attempt(person, "sign in with password", async () => {
    const { result, ms } = await signIn(person, school.email);
    if (!result.startsWith("→ /school")) throw new Error(result);
    return `${result} in ${ms} ms`;
  });
  await attempt(person, "read dashboard", async () => {
    const info = await person.visit("/school", "dashboard");
    await person.shot("dashboard");
    return info.text.split("\n").filter(Boolean).slice(0, 25).join(" · ").slice(0, 380);
  });

  await attempt(person, "mark today's attendance for Class 1-A (32 students)", async () => {
    await person.visit("/school/attendance", "attendance");
    await person.fill("Class", "Class 1 - A");
    await sleep(800);
    const startClicks = person.clicks ?? 0;
    const started = Date.now();
    const rows = await person.page.$$("tbody tr");
    for (const [index, row] of rows.entries()) {
      const status = index === 4 || index === 11 || index === 20 ? "Absent" : index === 7 ? "Late" : "Present";
      const button = await row.evaluateHandle((tr, status) => Array.from(tr.querySelectorAll("button")).find((button) => button.innerText.trim() === status), status);
      await button.asElement().click();
      person.clicks = (person.clicks ?? 0) + 1;
    }
    const markClicks = (person.clicks ?? 0) - startClicks;
    const toast = await submitAndToast(person, "Save Register").catch(async () => { await person.mustClick("Save Register"); return person.waitToast(); });
    await person.shot("attendance-saved");
    if (!/saved/i.test(toast)) throw new Error(toast);
    if (!(await person.page.evaluate(() => /mark all|all present/i.test(document.body.innerText)))) person.issue("high", "usability", "No “Mark all present” in attendance", `Marking ${rows.length} students took ${markClicks} separate clicks (${Math.round((Date.now() - started) / 1000)} s for a bot; a teacher with 45 students would need 45+ taps every morning). Most students are present; the register should start as all-present.`);
    return `${rows.length} rows, ${markClicks} clicks to mark, toast: ${toast}`;
  });

  await attempt(person, "reload and confirm the register kept the marks", async () => {
    await person.page.reload({ waitUntil: "networkidle2" });
    const pressed = await person.page.$$eval("button[aria-pressed=true]", (buttons) => buttons.length);
    const shownClass = await person.page.$eval("select", (select) => select.options[select.selectedIndex]?.text);
    if (pressed < 32) person.issue("medium", "usability", "Attendance register looks empty after reload", `After saving, a reload shows ${pressed} marked buttons for ${shownClass} (expected 32). The principal may think the save failed.`);
    return `${pressed} marked after reload (${shownClass})`;
  });

  await attempt(person, "dashboard reflects today's attendance", async () => {
    const info = await person.visit("/school", "dashboard again");
    const line = info.text.split("\n").find((row) => /attendance/i.test(row)) ?? "";
    return info.text.match(/Today.s attendance[\s\S]{0,120}/)?.[0]?.replace(/\s+/g, " ") ?? line;
  });

  let receiptPath = null;
  await attempt(person, "collect ₹6,000 cash (part of term fee)", async () => {
    await person.visit("/school/fees/collection", "fee collection");
    await person.shot("fee-collection");
    const searchable = await person.page.$("input[type=search], input[placeholder*='earch']");
    if (!searchable) person.issue("medium", "usability", "Cannot search fee list by student", "With 100+ pending invoices, the accountant has to scroll to find the parent standing at the counter.");
    await person.mustClick("Pay Now");
    await sleep(500);
    await person.fill("Payment Method", "cash");
    await person.fill("Amount received", "6000");
    const toast = await submitAndToast(person, "Confirm payment");
    if (!/receipt/i.test(toast)) throw new Error(toast);
    await person.shot("payment-recorded");
    return toast;
  });

  await attempt(person, "open and read the printed receipt", async () => {
    await person.page.waitForNetworkIdle({ idleTime: 500 }).catch(() => {});
    const button = await person.page.$$eval("button", (buttons) => buttons.filter((button) => /^R-\d+/.test(button.innerText.trim())).map((button) => button.innerText.trim()));
    if (!button.length) throw new Error("No receipt number in the list");
    const [newPage] = await Promise.all([
      new Promise((resolve) => person.context.once("targetcreated", async (target) => resolve(await target.page()))).then((page) => page).catch(() => null),
      person.click(button[0], { selector: "button", exact: true }),
    ]);
    await sleep(2500);
    const page = newPage ?? person.page;
    await page.waitForNetworkIdle({ idleTime: 500 }).catch(() => {});
    receiptPath = page.url().replace(BASE, "");
    const text = await page.evaluate(() => document.body.innerText);
    await page.screenshot({ path: `${process.env.SIM_OUT}/shots/s1-receipt.png` }).catch(() => {});
    const has = { words: /Rupees .* Only/i.test(text), gstin: /GSTIN/i.test(text), balance: /balance|due/i.test(text), school: text.includes(school.name), signature: /signature|authori[sz]ed/i.test(text) };
    if (!has.balance) person.issue("medium", "fees", "Receipt does not show balance due", "A parent paying ₹6,000 of ₹18,000 gets no 'balance ₹12,000' on the receipt.");
    if (newPage && newPage !== person.page) await newPage.close();
    shared.s1ReceiptPath = receiptPath;
    return `${receiptPath} | ${JSON.stringify(has)}`;
  });

  await attempt(person, "try to record ₹20,000 against an ₹18,000 fee", async () => {
    await person.visit("/school/fees/collection", "fee collection");
    await person.mustClick("Pay Now", { nth: 1 });
    await sleep(500);
    await person.fill("Payment Method", "upi");
    await person.fill("Amount received", "20000");
    try { await person.fill("UTR", "412345678901"); } catch { /* label varies */ }
    const toast = await submitAndToast(person, "Confirm payment");
    if (/recorded/i.test(toast)) person.issue("high", "fees", "Over-payment accepted", "₹20,000 was recorded against an ₹18,000 fee with no warning.");
    await person.page.keyboard.press("Escape");
    return toast;
  });

  await attempt(person, "raise a single invoice (Annual Charges) for one student", async () => {
    await person.visit("/school/fees/collection", "fee collection");
    await person.mustClick("Generate Invoice");
    await sleep(500);
    await person.fill("Student", "");
    await person.fill("Fee Structure", "Annual Charges");
    await person.fill("Due Date", inDays(30));
    const toast = await submitAndToast(person, "Generate");
    const bulk = await person.page.evaluate(() => /whole class|all students|bulk/i.test(document.body.innerText));
    if (!bulk) person.issue("critical", "fees", "Fees can only be raised one student at a time", `To bill Annual Charges to ${school.studentCount} students the accountant must open the Generate Invoice form ${school.studentCount} times. There is no “assign fee to class / whole school”.`);
    return toast;
  });

  await attempt(person, "find a student by name", async () => {
    await person.visit("/school/students", "students");
    const search = await person.page.$("input[placeholder*='earch']");
    if (!search) throw new Error("No search box");
    await search.type("Sharma");
    await sleep(600);
    const rows = await person.page.$$eval("tbody tr", (trs) => trs.length);
    const hasExport = await exportCheck(person);
    if (!hasExport) person.issue("high", "data", "No export of student list", "Principals need the student list in Excel for boards, UDISE+ and transport; there is no Export/Download anywhere.");
    const hasImport = /import|upload/i.test(await person.text());
    if (!hasImport) person.issue("critical", "onboarding", "No bulk import of students", `A new school must type every student one by one (Greenfield: ${school.studentCount}; a typical school: 800+). There is no Excel/CSV import.`);
    return `${rows} rows for "Sharma"`;
  });
}

// ───────────────────────── S2: exams, notices, admissions ─────────────────────────
async function thomas(person, school) {
  await attempt(person, "sign in with password", async () => {
    const { result, ms } = await signIn(person, school.email);
    if (!result.startsWith("→ /school")) throw new Error(result);
    return `${result} in ${ms} ms`;
  });

  const examName = "Half-Yearly Examination 2026-27";
  await attempt(person, "schedule Half-Yearly exam for Class 10-A", async () => {
    await person.visit("/school/exams", "exams");
    await openDrawerAndFill(person, "Schedule Exam", [["Exam Name", examName], ["Target Class", "Class 10 (A)"], ["Start Date", inDays(20)], ["End Date", inDays(30)]]);
    const toast = await submitAndToast(person, "Schedule Exam");
    await person.shot("exam-scheduled");
    return toast;
  });

  await attempt(person, "enter marks for 3 students (5 subjects each)", async () => {
    await person.visit("/school/exams", "exams");
    const clickedAt = Date.now();
    await person.mustClick("Grade Exam");
    await person.page.waitForFunction(() => /^\/school\/exams\/[0-9a-f-]{36}$/.test(location.pathname) && document.body.innerText.includes("Grades"), { timeout: 45000 });
    await person.page.waitForNetworkIdle({ idleTime: 500 }).catch(() => {});
    const openMs = Date.now() - clickedAt;
    if (openMs > 4000) person.issue("medium", "performance", "“Grade Exam” is slow to open", `${openMs} ms from click to the grading sheet, with no loading indicator after the click.`);
    await person.shot("grading");
    const subjects = [["Mathematics", 78], ["Science", 85], ["English", 66], ["Hindi", 72], ["Social Science", 105]];
    const started = Date.now();
    const startClicks = person.clicks ?? 0;
    const outcomes = [];
    for (let student = 0; student < 3; student += 1) {
      await person.mustClick("Enter Grades", { nth: 0 });
      await sleep(400);
      for (const [index, [subject, marks]] of subjects.entries()) {
        // The panel opens with one row (pre-filled "Mathematics"); later subjects need "+ Add Subject".
        const rowsBefore = await person.page.$$eval("input[placeholder='e.g. Mathematics']", (inputs) => inputs.length);
        if (index >= rowsBefore) {
          await person.mustClick("Add Subject");
          await person.page.waitForFunction((count) => document.querySelectorAll("input[placeholder='e.g. Mathematics']").length > count, { timeout: 5000 }, rowsBefore);
        }
        const inputs = await person.page.$$("input[placeholder='e.g. Mathematics']");
        const row = await inputs[index].evaluateHandle((input) => input.parentElement.parentElement);
        const fields = await row.asElement().$$("input");
        const set = async (field, value) => {
          await field.click();
          await person.page.keyboard.down("Control"); await person.page.keyboard.press("a"); await person.page.keyboard.up("Control");
          await person.page.keyboard.press("Backspace");
          await field.type(String(value));
          if (await person.page.evaluate(() => /couldn.t load/i.test(document.body.innerText))) throw new Error(`Page crashed (“This page couldn't load”) while typing “${value}” for student ${student + 1}, subject ${index + 1}: ${person.consoleErrors.at(-1)?.text.slice(0, 160)}`);
        };
        await set(inputs[index], subject);
        const numbers = (await Promise.all(fields.map(async (field) => ((await field.evaluate((node) => node.type)) === "number" ? field : null)))).filter(Boolean);
        if (numbers[0]) await set(numbers[0], student === 2 ? marks : Math.min(marks, 100));
      }
      const toast = await submitAndToast(person, "Save Report Card");
      outcomes.push(toast);
      if (student === 2 && /saved|success/i.test(toast)) person.issue("high", "exams", "Marks above maximum accepted", "105 out of 100 in Social Science was saved without an error.");
      await person.page.keyboard.press("Escape");
      await sleep(600);
    }
    const perStudent = Math.round(((person.clicks ?? 0) - startClicks) / 3);
    person.issue("high", "usability", "Marks entry is one student at a time", `Each student needs ~${perStudent} clicks plus typing every subject name again (${Math.round((Date.now() - started) / 3000)} s per student for a bot). For 25 students × 5 subjects that is 125 separate rows; teachers expect a class grid (students × subjects) with subjects set once per exam.`);
    return outcomes.join(" / ");
  });

  await attempt(person, "send a PTM notice to parents by SMS", async () => {
    await person.visit("/school/communications", "communications");
    await openDrawerAndFill(person, "New Announcement", [["Message Type", "sms"], ["Target Audience", "parents"], ["Subject / Title", "Parent-Teacher Meeting on Saturday, 11 October"], ["Message Body", "Dear Parents, the PTM for classes 6 to 10 will be held on Saturday, 11 October from 9 am to 1 pm. Please bring the report diary."]]);
    const toast = await submitAndToast(person, "Send Now");
    await sleep(800);
    const listed = await person.page.evaluate(() => document.body.innerText.includes("Parent-Teacher Meeting on Saturday"));
    await person.shot("notice-sent");
    person.issue("critical", "trust", "“Send Now” sends nothing", `The principal chose “SMS Text Message 📱” and pressed “Send Now”. Feedback: ${toast === "no feedback" ? "none – the drawer just closes" : `“${toast}”`}. The notice is ${listed ? "only added to the list on screen" : "not even visible in the list"}; no SMS, email or WhatsApp is sent and nothing says so. Parents never receive it.`);
    return `${toast}; in list: ${listed}`;
  });

  await attempt(person, "admit a new Class 9 student with roll number 101", async () => {
    await person.visit("/school/students", "students");
    await openDrawerAndFill(person, "Admit Student", [["First Name", "Ishita"], ["Last Name", "Verma"], ["Roll Number", "101"], ["Class & Section", "Class 9 - A"], ["Parent/Guardian Mobile", "9000040001"]]);
    const toast = await submitAndToast(person, "Admit Student");
    if (/already used/i.test(toast)) person.issue("high", "students", "Roll number must be unique across the whole school", "Roll 101 exists in Class 6-A, so it cannot be used in Class 9-A. Indian schools number rolls 1, 2, 3… inside each section; the uniqueness should be per class-section (and an admission number should be the school-wide ID).");
    const fields = await person.page.evaluate(() => Array.from(document.querySelectorAll("form label")).map((label) => label.innerText.trim()));
    const missing = ["Date of birth", "Gender", "Admission", "Father", "Mother", "Address", "Aadhaar", "Blood"].filter((word) => !fields.some((field) => field.toLowerCase().includes(word.toLowerCase())));
    if (missing.length > 4) person.issue("high", "students", "Admission form is too thin", `Only ${fields.join(", ")}. Missing what every Indian school records: ${missing.join(", ")}.`);
    await person.page.keyboard.press("Escape");
    return toast;
  });
}

// ───────────────────────── S3: budget Android phone, low tech comfort ─────────────────────────
async function omPrakash(person, school) {
  await attempt(person, "sign in with a wrong password first", async () => {
    const { result } = await signIn(person, school.email, "saraswati123");
    await person.shot("wrong-password");
    if (result.startsWith("→")) throw new Error("Signed in with a wrong password");
    return `message: ${result}`;
  });
  await attempt(person, "sign in with the right password", async () => {
    await person.page.$eval("input[type=password]", (input) => { input.value = ""; });
    await person.page.click("input[type=password]", { clickCount: 3 });
    await person.page.keyboard.press("Backspace");
    await person.page.type("input[type=password]", PASSWORD);
    await person.mustClick("Sign in", { selector: "button[type=submit]" });
    await person.page.waitForFunction(() => location.pathname.startsWith("/school"), { timeout: 30000 });
    await person.page.waitForNetworkIdle({ idleTime: 500 }).catch(() => {});
    await person.shot("phone-dashboard");
    return person.page.url().replace(BASE, "");
  });
  await attempt(person, "find the menu on a phone", async () => {
    const how = await findMenu(person);
    await person.shot("phone-menu");
    if (how === "no menu") person.issue("critical", "mobile", "School portal has no menu on phones", "On a 360px phone the sidebar is hidden and there is no menu button; the principal cannot reach Attendance or Fees.");
    await person.page.keyboard.press("Escape");
    return how;
  });
  for (const route of ["/school/attendance", "/school/students", "/school/fees/collection", "/school/exams", "/school/timetable"]) {
    await person.visit(route);
    await person.shot(route.split("/").pop());
  }
  await attempt(person, "mark Class 3-A all present on the phone", async () => {
    await person.visit("/school/attendance", "attendance");
    await person.fill("Class", "Class 3 - A");
    await sleep(800);
    const buttons = await person.page.$$("tbody tr");
    let tapped = 0;
    for (const row of buttons) {
      const present = await row.evaluateHandle((tr) => Array.from(tr.querySelectorAll("button")).find((button) => button.innerText.trim() === "Present"));
      const box = await present.asElement()?.boundingBox();
      if (box && box.width < 44) person.tapTooSmall = Math.round(box.width);
      await present.asElement().tap().catch(() => present.asElement().click());
      tapped += 1;
    }
    if (person.tapTooSmall) person.issue("low", "mobile", "Attendance buttons are small for thumbs", `“Present” is ${person.tapTooSmall}px wide (Google recommends 48px).`);
    const toast = await submitAndToast(person, "Save Register").catch(async () => { await person.mustClick("Save"); return person.waitToast(); });
    await person.shot("phone-attendance-saved");
    return `${tapped} taps, ${toast}`;
  });
  await attempt(person, "admit a student from the phone", async () => {
    await person.visit("/school/students", "students");
    await openDrawerAndFill(person, "Admit Student", [["First Name", "Govind"], ["Last Name", "Mishra"], ["Roll Number", "540"], ["Class & Section", "Class 5 - A"], ["Parent/Guardian Mobile", "9000040002"]]);
    await person.shot("phone-admit");
    return submitAndToast(person, "Admit Student");
  });
}

// ───────────────────────── S4: timetable, transport, library ─────────────────────────
async function fatima(person, school) {
  await attempt(person, "sign in with password", async () => {
    const { result, ms } = await signIn(person, school.email);
    if (!result.startsWith("→ /school")) throw new Error(result);
    return `${result} in ${ms} ms`;
  });

  await attempt(person, "build Monday timetable for Class 8-B", async () => {
    await person.visit("/school/timetable", "timetable");
    const outcomes = [];
    for (const [start, end, subject] of [["09:00", "09:40", "Mathematics"], ["09:40", "10:20", "Science"]]) {
      await openDrawerAndFill(person, "Add Period", [["Class", "Class 8 (B)"], ["Day of Week", "Monday"], ["Start Time", start], ["End Time", end], ["Subject", subject], ["Assigned Teacher", ""]]);
      outcomes.push(await submitAndToast(person, "Add Period"));
      await sleep(500);
    }
    await person.shot("timetable");
    return outcomes.join(" / ");
  });

  await attempt(person, "double-book the same teacher at 09:00 Monday in Class 2-A", async () => {
    await person.visit("/school/timetable", "timetable");
    await openDrawerAndFill(person, "Add Period", [["Class", "Class 2 (A)"], ["Day of Week", "Monday"], ["Start Time", "09:00"], ["End Time", "09:40"], ["Subject", "Mathematics"], ["Assigned Teacher", ""]]);
    const toast = await submitAndToast(person, "Add Period");
    await sleep(1000);
    const { data } = await service.from("school_timetables").select("class_id, teacher_id").eq("organization_id", school.organizationId).eq("day_of_week", "Monday").eq("start_time", "09:00:00");
    const teachers = new Map();
    for (const row of data ?? []) teachers.set(row.teacher_id, (teachers.get(row.teacher_id) ?? 0) + 1);
    if ([...teachers.values()].some((count) => count > 1)) person.issue("high", "timetable", "Teacher clash not detected", `The same teacher was saved in two classes at 09:00 on Monday (feedback: ${toast}).`);
    return `${toast}; saved periods at Mon 09:00: ${data?.length ?? 0}`;
  });

  await attempt(person, "period that ends before it starts", async () => {
    await person.visit("/school/timetable", "timetable");
    await openDrawerAndFill(person, "Add Period", [["Class", "Class 4 (B)"], ["Day of Week", "Tuesday"], ["Start Time", "11:00"], ["End Time", "10:20"], ["Subject", "English"], ["Assigned Teacher", ""]]);
    const toast = await submitAndToast(person, "Add Period");
    if (/added|saved|success|created/i.test(toast)) person.issue("medium", "timetable", "Period ending before it starts was saved", "11:00–10:20 accepted.");
    return toast;
  });

  await attempt(person, "add bus route with two stops", async () => {
    await person.visit("/school/transport", "transport");
    await openDrawerAndFill(person, "Add Route", [["Route Name", "Route 3 – Vijay Nagar"], ["Vehicle Number", "mp09ab1234"], ["Driver Name", "Ramesh Kumar"], ["Driver Mobile", "9000040003"]]);
    const route = await submitAndToast(person, "Add Route");
    if (route === "no feedback") person.issue("low", "usability", "Some saves give no confirmation", "Adding a bus route, a stop or a library book closes the panel silently, while students, fees and attendance show a green “saved” message.");
    await sleep(800);
    const stops = [];
    for (const [stop, pickup, drop] of [["Vijay Nagar Square", "07:10", "14:20"], ["C21 Mall", "07:20", "14:10"]]) {
      await person.mustClick("Add Stop");
      await sleep(400);
      await person.fill("Stop Name", stop);
      await person.fill("Pickup Time", pickup);
      await person.fill("Drop Time", drop);
      stops.push(await submitAndToast(person, "Save Stop"));
      await sleep(500);
    }
    await person.shot("transport");
    const text = await person.text();
    if (!/assign|students? on (this )?route/i.test(text)) person.issue("high", "transport", "Students cannot be put on a bus route", "Routes and stops can be created, but there is no way to assign students to a stop, so the transport fee and the bus list cannot be produced.");
    return `${route} | ${stops.join(" / ")}`;
  });

  await attempt(person, "add a book and issue it to a student", async () => {
    await person.visit("/school/library", "library");
    await openDrawerAndFill(person, "Add Book", [["Book Title", "Godaan"], ["Author", "Munshi Premchand"], ["ISBN", "978-81-7028-123-4"], ["Total Quantity", "3"]]);
    const added = await submitAndToast(person, "Add Book");
    await sleep(800);
    await person.mustClick("Issue Book");
    await sleep(400);
    await person.fill("Select Student", "");
    await person.fill("Return Due Date", inDays(14));
    const issued = await submitAndToast(person, "Confirm Issue");
    await sleep(800);
    const returned = (await person.click("Mark returned")) ? await person.waitToast() : "no Mark returned button";
    await person.shot("library");
    return `${added} | ${issued} | ${returned}`;
  });

  await attempt(person, "add Class 3-B and try deleting a class that has students", async () => {
    await person.visit("/school/classes", "classes");
    await openDrawerAndFill(person, "Add Class", [["Class/Grade Name", "Class 3"], ["Section", "B"], ["Room Number", "Room 204"]]);
    const created = await submitAndToast(person, "Create Class");
    await sleep(800);
    await person.clearToasts();
    await person.page.keyboard.press("Escape");
    await sleep(500);
    const crashesBefore = person.consoleErrors.filter((error) => error.text.startsWith("PAGE ERROR")).length;
    await person.mustClick("Delete Class 2 A");
    const blocked = await person.waitToast();
    await sleep(1000);
    const crashes = person.consoleErrors.filter((error) => error.text.startsWith("PAGE ERROR")).slice(crashesBefore);
    if (crashes.length) person.issue("high", "stability", "Classes page crashes when deleting a class", `${crashes[0].text.slice(0, 160)} — shown message: “${blocked || "none"}”`);
    await person.shot("class-delete");
    return `${created} | delete Class 2-A: ${blocked}`;
  });
}

// ───────────────────────── S5: admin tasks; school gets suspended for non-payment ─────────────────────────
async function karan(person, school, shared) {
  await attempt(person, "sign in with password", async () => {
    const { result, ms } = await signIn(person, school.email);
    if (!result.startsWith("→ /school")) throw new Error(result);
    return `${result} in ${ms} ms`;
  });
  await attempt(person, "notice the overdue subscription", async () => {
    const info = await person.visit("/school", "dashboard");
    await person.shot("dashboard-past-due");
    const warned = /overdue|past due|renew|payment due|subscription/i.test(info.text);
    if (!warned) person.issue("high", "billing", "Principal is not told the subscription is overdue", "Delhi Heights is 6 days past due, but the school dashboard shows no banner or reminder before the account is suspended.");
    return warned ? "warning shown" : "no warning";
  });

  // Tested in the trial run ("Invitation sent to …"); skipped here so the hourly email
  // allowance is left for the two onboardings. Set SIM_INVITE=1 to include it.
  if (process.env.SIM_INVITE) await attempt(person, "invite a teacher to sign in", async () => {
    await person.visit("/school/users", "users & access");
    await person.page.type("#invite-email", alias("s5-newteacher"));
    await person.page.select("#invite-role", "teacher");
    const toast = await submitAndToast(person, "Send invitation");
    await person.shot("invite");
    if (/limit|too many|rate/i.test(toast)) person.issue("critical", "email", "Invitations blocked by email limit", toast);
    return toast;
  });

  await attempt(person, "update school contact phone (typo first)", async () => {
    await person.visit("/school/settings", "settings");
    await person.fill("Contact Phone", "12345");
    const bad = await submitAndToast(person, "Save Settings");
    await person.fill("Contact Phone", "9000040004");
    const good = await submitAndToast(person, "Save Settings");
    await person.shot("settings");
    const logo = await person.page.evaluate(() => /logo url/i.test(document.body.innerText));
    if (logo) person.issue("medium", "usability", "Logo must be pasted as a URL", "Principals have the logo as a file on their phone or PC; there is no upload button.");
    return `typo: ${bad} | fixed: ${good}`;
  });

  await attempt(person, "add a teacher (duplicate employee ID first)", async () => {
    await person.visit("/school/teachers", "teachers");
    await openDrawerAndFill(person, "Add Teacher", [["First Name", "Neeraj"], ["Last Name", "Chopra"], ["Employee ID", "EMP-001"], ["Primary Subject", "Physical Education"], ["Email Address", alias("s5-neeraj")], ["Mobile", "9000040005"]]);
    const duplicate = await submitAndToast(person, "Add Teacher");
    await person.fill("Employee ID", "EMP-007");
    const added = await submitAndToast(person, "Add Teacher");
    return `EMP-001: ${duplicate} | EMP-007: ${added}`;
  });

  // The super admin suspends the school for non-payment while Karan is working.
  shared.s5Ready?.();
  await attempt(person, "keep working after the school is suspended", async () => {
    await shared.s5Suspended;
    await person.visit("/school/students", "students (after suspension)");
    await person.shot("suspended");
    const text = await person.text();
    const clear = /suspend|payment|unpaid|renew|overdue|paused/i.test(text);
    if (!clear) person.issue("high", "billing", "Suspended school sees an unclear page", `After suspension the principal sees: “${text.slice(0, 160).replace(/\s+/g, " ")}”. It should say the account is paused for an unpaid invoice and how to pay or whom to call.`);
    shared.s5SawSuspension?.(text.slice(0, 200));
    return `${person.page.url().replace(BASE, "")} | ${text.slice(0, 140).replace(/\s+/g, " ")}`;
  });
  await attempt(person, "back in after reactivation", async () => {
    await shared.s5Reactivated;
    const info = await person.visit("/school", "dashboard after reactivation");
    return info.finalPath;
  });
}

export const PRINCIPAL_DAYS = { s1: anjali, s2: thomas, s3: omPrakash, s4: fatima, s5: karan };
export const PRINCIPAL_DEVICES = { s1: "office", s2: "desktop", s3: "android", s4: "laptop", s5: "wide" };

export async function runPrincipal(school, shared) {
  const person = await new Person(`${school.key}`, `${school.principal} (${school.name})`, "school principal", PRINCIPAL_DEVICES[school.key]).open();
  try {
    await PRINCIPAL_DAYS[school.key](person, school, shared);
  } catch (error) {
    person.log("day stopped", "fail", error.message);
  }
  await person.close();
  return person.summary();
}

export { today };
