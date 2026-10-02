// Opens headless browsers signed in as a given user, using a one-time server-generated
// login (no email is sent). Shared by the QA scripts.
import { config } from "dotenv";
import puppeteer from "puppeteer";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const service = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

let sharedBrowser;
async function browser() {
  sharedBrowser ??= await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  return sharedBrowser;
}

export async function closeBrowsers() {
  await sharedBrowser?.close();
}

// Session cookies for `email`, exactly as the app's @supabase/ssr client would set them.
async function sessionCookies(email, linkType = "magiclink") {
  let { data: link, error: linkError } = await service.auth.admin.generateLink({ type: linkType, email });
  if (linkError && linkType === "invite") {
    // Already invited: a magic link signs the same user in.
    ({ data: link, error: linkError } = await service.auth.admin.generateLink({ type: "magiclink", email }));
    linkType = "magiclink";
  }
  if (linkError) throw linkError;
  const anon = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: verified, error: verifyError } = await anon.auth.verifyOtp({ token_hash: link.properties.hashed_token, type: linkType === "invite" ? "invite" : "magiclink" });
  if (verifyError) throw verifyError;
  const jar = [];
  const ssr = createServerClient(url, anonKey, { cookies: { getAll: () => [], setAll: (cookies) => jar.push(...cookies) } });
  await ssr.auth.setSession({ access_token: verified.session.access_token, refresh_token: verified.session.refresh_token });
  return jar;
}

// A separate browser context per user, so sessions do not mix.
export async function openBrowserAs(baseUrl, email, linkType) {
  const context = await (await browser()).createBrowserContext();
  const cookies = await sessionCookies(email, linkType);
  const host = new URL(baseUrl).hostname;
  await context.setCookie(...cookies.map((cookie) => ({ name: cookie.name, value: cookie.value, domain: host, path: "/", sameSite: "Lax" })));
  const page = await context.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  return { context, page };
}

export async function openAdminBrowser(baseUrl) {
  const { data: admin } = await service.from("team_members").select("email").eq("role", "superadmin").eq("status", "active").limit(1).single();
  const { page, context } = await openBrowserAs(baseUrl, admin.email);
  return { browser: { close: closeBrowsers }, context, page, email: admin.email, service };
}
