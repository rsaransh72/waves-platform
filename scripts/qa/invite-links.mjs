// Invitation and password-reset links, opened the way the emails open them. Uses
// generateLink, so no email is sent (no mail rate limit) and the throwaway users are
// deleted at the end.
// Usage: node scripts/qa/invite-links.mjs   (with the app running on QA_BASE, default http://localhost:3000)
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local", quiet: true });
const BASE = process.env.QA_BASE ?? "http://localhost:3000";
const OUT = process.env.QA_OUT ?? "qa-sim-output/invite-links";
fs.mkdirSync(OUT, { recursive: true });
const service = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
const anon = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

const stamp = Date.now();
const PASSWORD = `Qa-invite-${stamp}!`;
const metadata = { organization_name: "QA Invite School", organization_type: "school", invited_role: "teacher" };
const userIds = [];
const rows = [];
const check = (name, ok, detail = "") => rows.push({ check: name, result: ok ? "✓ pass" : "✗ fail", detail });

async function invite(tag) {
  const { data, error } = await service.auth.admin.generateLink({ type: "invite", email: `qa-invite-${tag}-${stamp}@example.com`, options: { data: metadata } });
  if (error) throw error;
  userIds.push(data.user.id);
  return data;
}

const browser = await puppeteer.launch({ headless: true, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe" });
async function page(viewport = { width: 1280, height: 800 }) {
  const context = await browser.createBrowserContext();
  const tab = await context.newPage();
  await tab.setViewport(viewport);
  return tab;
}
const text = (tab) => tab.evaluate(() => document.body.innerText);
const waitForText = (tab, value) => tab.waitForFunction((needle) => document.body.innerText.includes(needle), { timeout: 20000 }, value);
const clickButton = (tab, label) => tab.evaluate((needle) => [...document.querySelectorAll("button")].find((button) => button.innerText.includes(needle))?.click(), label);

try {
  // 1. New-style link: welcome step, accept, set password, land in the app.
  const first = await invite("token");
  const tokenUrl = `${BASE}/school/accept-invite?token_hash=${first.properties.hashed_token}&type=invite`;
  let tab = await page();
  await tab.goto(tokenUrl, { waitUntil: "networkidle2" });
  check("token link shows the welcome step", (await text(tab)).includes("You're invited"));
  await tab.screenshot({ path: path.join(OUT, "1-welcome.png") });
  await clickButton(tab, "Accept invitation");
  await waitForText(tab, "Welcome to QA Invite School");
  const step2 = await text(tab);
  check("password step names the school and role", step2.includes("QA Invite School") && step2.includes("Teacher"));
  check("token removed from the address bar", !tab.url().includes("token_hash"), tab.url().replace(BASE, ""));
  await tab.screenshot({ path: path.join(OUT, "2-password.png") });
  const [newPassword, confirmPassword] = await tab.$$('input[autocomplete="new-password"]');
  await newPassword.type(PASSWORD);
  await confirmPassword.type(PASSWORD);
  await Promise.all([tab.waitForNavigation({ waitUntil: "networkidle2" }).catch(() => null), clickButton(tab, "Activate account")]);
  await tab.waitForFunction(() => !location.pathname.startsWith("/school/accept-invite"), { timeout: 20000 }).catch(() => null);
  check("activating leaves the invitation page", !tab.url().includes("/school/accept-invite"), tab.url().replace(BASE, ""));
  const { error: signInError } = await anon().auth.signInWithPassword({ email: first.user.email, password: PASSWORD });
  check("the chosen password signs in", !signInError, signInError?.message ?? "");

  // 2. The same link a second time is refused with a clear message.
  tab = await page();
  await tab.goto(tokenUrl, { waitUntil: "networkidle2" });
  await clickButton(tab, "Accept invitation");
  await waitForText(tab, "can't be used").catch(() => null);
  check("a used link explains itself", (await text(tab)).includes("expired or has already been used"));
  await tab.screenshot({ path: path.join(OUT, "3-used.png") });

  // 3. Emails already sent with Supabase's default template (#access_token=…) still work.
  const legacy = await invite("legacy");
  const verify = await fetch(legacy.properties.action_link, { redirect: "manual" });
  const hash = new URL(verify.headers.get("location") ?? "http://x/").hash;
  tab = await page({ width: 390, height: 844 });
  await tab.goto(`${BASE}/school/accept-invite${hash}`, { waitUntil: "networkidle2" });
  await waitForText(tab, "Welcome to QA Invite School").catch(() => null);
  check("legacy #access_token link reaches the password step", (await text(tab)).toLowerCase().includes("step 2 of 2"), hash ? "" : "no hash in verify redirect");
  await tab.screenshot({ path: path.join(OUT, "4-legacy-phone.png") });

  // 4. An expired link from Supabase's redirect.
  tab = await page();
  await tab.goto(`${BASE}/school/accept-invite#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired`, { waitUntil: "networkidle2" });
  await waitForText(tab, "can't be used").catch(() => null);
  check("expired link shows the expired message", (await text(tab)).includes("expired or has already been used"));

  // 5. Opened the invitation but stopped before choosing a password: still counts as invited,
  // and the re-sent link (a recovery link to the invitation page) finishes the job.
  const half = await invite("half");
  await anon().auth.verifyOtp({ token_hash: half.properties.hashed_token, type: "invite" });
  // Same rule as hasActivatedAccount() in src/lib/client-members.ts.
  const activated = async (id) => {
    const { user } = (await service.auth.admin.getUserById(id)).data;
    if (!user.email_confirmed_at) return false;
    if (user.user_metadata?.password_set_at) return true;
    return Boolean(user.last_sign_in_at) && Date.parse(user.last_sign_in_at) - Date.parse(user.email_confirmed_at) > 60_000;
  };
  check("opened-but-no-password counts as invited", !(await activated(half.user.id)) && await activated(first.user.id));
  const { data: resend } = await service.auth.admin.generateLink({ type: "recovery", email: half.user.email });
  tab = await page();
  await tab.goto(`${BASE}/school/accept-invite?token_hash=${resend.properties.hashed_token}&type=recovery`, { waitUntil: "networkidle2" });
  await clickButton(tab, "Accept invitation");
  await waitForText(tab, "Welcome to QA Invite School").catch(() => null);
  const [halfPassword, halfConfirm] = await tab.$$('input[autocomplete="new-password"]');
  await halfPassword.type(PASSWORD);
  await halfConfirm.type(PASSWORD);
  await clickButton(tab, "Activate account");
  await tab.waitForFunction(() => !location.pathname.startsWith("/school/accept-invite"), { timeout: 20000 }).catch(() => null);
  check("re-sent link sets the password", await activated(half.user.id), tab.url().replace(BASE, ""));

  // 6. Password reset with the new template's link.
  const { data: recovery, error: recoveryError } = await service.auth.admin.generateLink({ type: "recovery", email: first.user.email });
  if (recoveryError) throw recoveryError;
  tab = await page();
  await tab.goto(`${BASE}/account/reset-password?token_hash=${recovery.properties.hashed_token}&type=recovery`, { waitUntil: "networkidle2" });
  const [resetPassword, resetConfirm] = await tab.$$('input[autocomplete="new-password"]');
  await resetPassword.type(`${PASSWORD}-2`);
  await resetConfirm.type(`${PASSWORD}-2`);
  await clickButton(tab, "Update password");
  await tab.waitForFunction(() => location.pathname === "/login", { timeout: 20000 }).catch(() => null);
  check("reset link updates the password", tab.url().includes("/login?password-updated=1"), tab.url().replace(BASE, ""));
  const { error: resetSignIn } = await anon().auth.signInWithPassword({ email: first.user.email, password: `${PASSWORD}-2` });
  check("the new password signs in", !resetSignIn, resetSignIn?.message ?? "");
} finally {
  await browser.close();
  for (const id of userIds) await service.auth.admin.deleteUser(id);
}

console.table(rows);
console.log(`Screenshots: ${OUT}`);
process.exitCode = rows.some((row) => row.result.startsWith("✗")) ? 1 : 0;
