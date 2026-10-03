// Adding many classes at once, through the Classes page as a school administrator.
// Creates a throwaway school (admin, one teacher, one existing class) and deletes it after.
// Usage: node scripts/qa/bulk-classes.mjs   (app running on QA_BASE, default http://localhost:3000)
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

config({ path: ".env.local", quiet: true });
const BASE = process.env.QA_BASE ?? "http://localhost:3000";
const OUT = process.env.QA_OUT ?? "qa-sim-output/bulk-classes";
fs.mkdirSync(OUT, { recursive: true });
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = createClient(URL_, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

const stamp = Date.now();
const rows = [];
const check = (name, ok, detail = "") => rows.push({ check: name, result: ok ? "✓ pass" : "✗ fail", detail: String(detail).slice(0, 70) });

let organizationId;
let userId;
const browser = await puppeteer.launch({ headless: true, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe" });
try {
  const { data: organization, error: organizationError } = await service.from("organizations")
    .insert({ name: "QA Bulk Classes School", slug: `qa-bulk-${stamp}`, type: "school", status: "active" }).select("id").single();
  if (organizationError) throw organizationError;
  organizationId = organization.id;
  await service.from("school_settings").insert({ organization_id: organizationId, school_name: "QA Bulk Classes School" });
  const email = `qa-bulk-admin-${stamp}@example.com`;
  const { data: created, error: userError } = await service.auth.admin.createUser({ email, password: `Qa-bulk-${stamp}!`, email_confirm: true });
  if (userError) throw userError;
  userId = created.user.id;
  await service.from("organization_members").insert({ organization_id: organizationId, user_id: userId, role: "admin" });
  const { data: teacher } = await service.from("school_teachers")
    .insert({ organization_id: organizationId, first_name: "Asha", last_name: "Verma", employee_id: "QA-T1", status: "active" }).select("id").single();
  await service.from("school_classes").insert({ organization_id: organizationId, name: "Class 1", section: "A" });

  // Sign the browser in as the school administrator.
  const { data: link } = await service.auth.admin.generateLink({ type: "magiclink", email });
  const anon = createClient(URL_, ANON, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: verified } = await anon.auth.verifyOtp({ token_hash: link.properties.hashed_token, type: "magiclink" });
  const jar = [];
  const ssr = createServerClient(URL_, ANON, { cookies: { getAll: () => [], setAll: (cookies) => jar.push(...cookies) } });
  await ssr.auth.setSession({ access_token: verified.session.access_token, refresh_token: verified.session.refresh_token });
  const host = new URL(BASE).hostname;
  const cookies = jar.map(({ name, value }) => ({ name, value, domain: host, path: "/" }));

  const page = await browser.newPage();
  await browser.setCookie(...cookies);
  await page.setViewport({ width: 1366, height: 900 });
  await page.goto(`${BASE}/school/classes`, { waitUntil: "networkidle2" });
  const clickText = (text, scope = "button") => page.evaluate((needle, selector) => {
    const target = [...document.querySelectorAll(selector)].find((element) => element.textContent.trim() === needle);
    target?.click();
    return Boolean(target);
  }, text, scope);
  const status = () => page.evaluate(() => document.querySelector('[role="status"]')?.textContent.replace(/\s+/g, " ").trim() ?? "");

  check("Add Classes opens the bulk form", await clickText("Add Classes") && await page.waitForFunction(() => document.body.textContent.includes("1. Choose classes"), { timeout: 15000 }).then(() => true, () => false));
  await clickText("Primary");
  await clickText("Nursery");
  await page.type('input[aria-label="Other class name"]', "Play Group");
  await page.keyboard.press("Enter");
  await clickText("B");
  check("counts new classes and skips existing ones", (await status()).includes("13 classes to add · 1 already added"), await status());

  // Not every class has every section: Class 4 has no B, Class 5 also has a C.
  await page.click('button[aria-label="Class 4 section B"]');
  check("switching off one class's section drops only that one", (await status()).includes("12 classes to add"), await status());
  await page.type('input[aria-label="Add a section to Class 5 only"]', "c");
  await page.keyboard.press("Enter");
  check("adding a section to one class adds only that one", (await status()).includes("13 classes to add"), await status());

  // Class 3: drop General Knowledge, add Sanskrit.
  await page.click('button[aria-label="Remove General Knowledge from Class 3 subjects"]').catch(() => null);
  const class3Input = await page.$('input[aria-label="Class 3 subjects"]');
  await class3Input.type("Sanskrit");
  await page.keyboard.press("Enter");
  await page.select('select[aria-label="Class 1 B class teacher"]', teacher.id);
  await page.type('input[aria-label="Class 1 B room"]', "101");
  await page.screenshot({ path: path.join(OUT, "1-bulk-form.png"), fullPage: false });

  await clickText("Add 13 classes");
  await page.waitForFunction(() => document.body.textContent.includes("13 classes added"), { timeout: 20000 }).catch(() => null);
  await page.waitForFunction(() => !document.body.textContent.includes("1. Choose classes"), { timeout: 10000 }).catch(() => null);

  const { data: saved } = await service.from("school_classes").select("name, section, subjects, class_teacher_id, room_number").eq("organization_id", organizationId);
  const find = (name, section) => saved.find((item) => item.name === name && item.section === section);
  check("all classes saved in one go", saved.length === 14, `${saved.length} rows`);
  check("edited subjects saved for every section", ["A", "B"].every((section) => find("Class 3", section)?.subjects.includes("Sanskrit") && !find("Class 3", section)?.subjects.includes("General Knowledge")), JSON.stringify(find("Class 3", "B")?.subjects));
  check("suggested subjects saved for untouched classes", find("Nursery", "A")?.subjects.includes("EVS"), JSON.stringify(find("Nursery", "A")?.subjects));
  check("teacher and room saved for Class 1 B", find("Class 1", "B")?.class_teacher_id === teacher.id && find("Class 1", "B")?.room_number === "101");
  check("existing Class 1 A left unchanged", find("Class 1", "A")?.subjects.length === 0);
  check("Class 4 saved without B; only Class 5 got C", !find("Class 4", "B") && find("Class 4", "A") && find("Class 5", "C") && saved.filter((item) => item.section === "C").length === 1);

  await page.reload({ waitUntil: "networkidle2" });
  const firstRows = await page.evaluate(() => [...document.querySelectorAll("tbody tr")].slice(0, 6).map((row) => [...row.querySelectorAll("td")].slice(0, 2).map((cell) => cell.textContent.trim()).join(" ")));
  check("list sorted Play Group, Nursery, Class 1...", firstRows.join(",").startsWith("Play Group A,Play Group B,Nursery A,Nursery B,Class 1 A,Class 1 B"), firstRows.join(", "));
  await page.screenshot({ path: path.join(OUT, "2-list.png") });

  const phone = await browser.newPage();
  await phone.setViewport({ width: 390, height: 844 });
  await phone.goto(`${BASE}/school/classes`, { waitUntil: "networkidle2" });
  await phone.evaluate(() => [...document.querySelectorAll("button")].find((button) => button.textContent.trim() === "Add Classes")?.click());
  await phone.waitForFunction(() => document.body.textContent.includes("1. Choose classes"), { timeout: 15000 }).catch(() => null);
  await phone.evaluate(() => [...document.querySelectorAll("button")].find((button) => button.textContent.trim() === "Middle")?.click());
  await new Promise((resolve) => setTimeout(resolve, 400));
  const overflow = await phone.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check("bulk form fits a phone screen", overflow <= 0, `${overflow}px wider`);
  await phone.screenshot({ path: path.join(OUT, "3-phone.png") });
} finally {
  await browser.close();
  if (organizationId) await service.from("organizations").delete().eq("id", organizationId);
  if (userId) await service.auth.admin.deleteUser(userId);
}

console.table(rows);
console.log(`Screenshots: ${OUT}`);
process.exitCode = rows.some((row) => row.result.startsWith("✗")) ? 1 : 0;
