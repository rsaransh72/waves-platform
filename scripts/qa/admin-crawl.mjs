// QA crawler for the admin console. Signs in as the platform superadmin with a
// one-time server-generated login (no email is sent), opens each admin page in a
// headless browser against the running dev server, and saves a full-page screenshot,
// console errors, failed requests and the visible text for review.
//
// Usage: node scripts/qa/admin-crawl.mjs [baseUrl] [outDir] [path ...]
import fs from "node:fs";
import path from "node:path";
import { config } from "dotenv";
import puppeteer from "puppeteer";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

config({ path: ".env.local" });

const baseUrl = process.argv[2] ?? "http://localhost:3000";
const outDir = process.argv[3] ?? "qa-output";
const requestedPaths = process.argv.slice(4);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const DEFAULT_PATHS = [
  "/admin", "/admin/leads", "/admin/onboarding", "/admin/organizations", "/admin/subscriptions", "/admin/billing",
  "/admin/client-users", "/admin/products", "/admin/services", "/admin/pages", "/admin/navigation", "/admin/users",
  "/admin/audit", "/admin/settings",
  // Not in the menu:
  "/admin/analytics", "/admin/automations", "/admin/feature-flags", "/admin/marketplaceitems", "/admin/media",
  "/admin/security", "/admin/suites", "/admin/support", "/admin/system", "/admin/usage",
];

async function adminCookies() {
  const service = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: admin } = await service.from("team_members").select("email").eq("role", "superadmin").eq("status", "active").limit(1).single();
  const { data: link, error: linkError } = await service.auth.admin.generateLink({ type: "magiclink", email: admin.email });
  if (linkError) throw linkError;

  const anon = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: verified, error: verifyError } = await anon.auth.verifyOtp({ token_hash: link.properties.hashed_token, type: "magiclink" });
  if (verifyError) throw verifyError;

  // Let @supabase/ssr produce the exact cookies the app expects.
  const jar = [];
  const ssr = createServerClient(url, anonKey, { cookies: { getAll: () => [], setAll: (cookies) => jar.push(...cookies) } });
  await ssr.auth.setSession({ access_token: verified.session.access_token, refresh_token: verified.session.refresh_token });
  return { email: admin.email, cookies: jar };
}

fs.mkdirSync(outDir, { recursive: true });
const { email, cookies } = await adminCookies();
console.log(`Signed in as ${email}`);

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const host = new URL(baseUrl).hostname;
await browser.setCookie(...cookies.map((cookie) => ({ name: cookie.name, value: cookie.value, domain: host, path: "/", httpOnly: false, secure: false, sameSite: "Lax" })));

const report = [];
for (const route of requestedPaths.length ? requestedPaths : DEFAULT_PATHS) {
  const consoleErrors = [];
  const failed = [];
  const onConsole = (message) => { if (message.type() === "error") consoleErrors.push(message.text().slice(0, 300)); };
  const onResponse = (response) => { if (response.status() >= 400 && !response.url().includes("/_next/")) failed.push(`${response.status()} ${response.url().replace(baseUrl, "")}`.slice(0, 200)); };
  const onPageError = (error) => consoleErrors.push(`pageerror: ${String(error.message).slice(0, 300)}`);
  page.on("console", onConsole);
  page.on("response", onResponse);
  page.on("pageerror", onPageError);

  let status = 0;
  try {
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle2", timeout: 120000 });
    status = response?.status() ?? 0;
    await new Promise((resolve) => setTimeout(resolve, 1200));
  } catch (error) {
    consoleErrors.push(`navigation: ${error.message}`);
  }
  const finalUrl = page.url().replace(baseUrl, "");
  const name = route.replace(/^\//, "").replace(/[/[\]]/g, "_") || "root";
  // The admin layout scrolls inside <main>, not the page, so grow the viewport to fit it.
  const contentHeight = await page.evaluate(() => {
    const main = document.querySelector("main");
    return main ? main.scrollHeight + 64 : document.body.scrollHeight;
  }).catch(() => 900);
  await page.setViewport({ width: 1440, height: Math.min(Math.max(900, contentHeight), 6000) });
  await new Promise((resolve) => setTimeout(resolve, 300));
  await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true }).catch(() => {});
  await page.setViewport({ width: 1440, height: 900 });
  const text = await page.evaluate(() => document.querySelector("main")?.innerText ?? document.body.innerText).catch(() => "");
  fs.writeFileSync(path.join(outDir, `${name}.txt`), text);

  page.off("console", onConsole);
  page.off("response", onResponse);
  page.off("pageerror", onPageError);
  report.push({ route, status, finalUrl, consoleErrors, failed });
  console.log(`${String(status).padEnd(4)} ${route}${finalUrl !== route ? ` -> ${finalUrl}` : ""}  errors:${consoleErrors.length} failed:${failed.length}`);
}

fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
await browser.close();
