// Opens a headless browser signed in as the platform superadmin, using a one-time
// server-generated login (no email is sent). Shared by the QA scripts.
import { config } from "dotenv";
import puppeteer from "puppeteer";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

config({ path: ".env.local" });

export async function openAdminBrowser(baseUrl) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: admin } = await service.from("team_members").select("email").eq("role", "superadmin").eq("status", "active").limit(1).single();
  const { data: link, error: linkError } = await service.auth.admin.generateLink({ type: "magiclink", email: admin.email });
  if (linkError) throw linkError;

  const anon = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: verified, error: verifyError } = await anon.auth.verifyOtp({ token_hash: link.properties.hashed_token, type: "magiclink" });
  if (verifyError) throw verifyError;

  const jar = [];
  const ssr = createServerClient(url, anonKey, { cookies: { getAll: () => [], setAll: (cookies) => jar.push(...cookies) } });
  await ssr.auth.setSession({ access_token: verified.session.access_token, refresh_token: verified.session.refresh_token });

  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  const host = new URL(baseUrl).hostname;
  await browser.setCookie(...jar.map((cookie) => ({ name: cookie.name, value: cookie.value, domain: host, path: "/", sameSite: "Lax" })));
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  return { browser, page, email: admin.email, service };
}
