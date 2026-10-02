// Shared helpers for the multi-user simulation: one browser, a separate context per
// person, a step log with timings, and form helpers that work the way a person does
// (find the field by its visible label, click the button by its visible text).
import fs from "node:fs";
import path from "node:path";
import puppeteer, { KnownDevices } from "puppeteer";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

config({ path: ".env.local", quiet: true });

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const service = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

export const BASE = process.env.SIM_BASE ?? "http://localhost:3000";
export const OUT = process.env.SIM_OUT ?? "qa-sim-output";
// Invitation and lead emails go to "+" aliases of an inbox you own; the principals'
// password is chosen per environment. Neither is kept in the repository.
export const INBOX = process.env.SIM_INBOX ?? "";
if (!INBOX.includes("@")) throw new Error("Set SIM_INBOX to an inbox you own, e.g. you@gmail.com");
export const TAG = "qasim";
export const alias = (tag) => `${INBOX.split("@")[0]}+${TAG}-${tag}@${INBOX.split("@")[1]}`;
export const PASSWORD = process.env.SIM_PASSWORD ?? "";
if (PASSWORD.length < 12) throw new Error("Set SIM_PASSWORD (12+ characters) for the seeded principals");

fs.mkdirSync(path.join(OUT, "shots"), { recursive: true });

let browserPromise;
export function browser() {
  browserPromise ??= puppeteer.launch({ headless: true, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--no-sandbox", "--disable-dev-shm-usage"], protocolTimeout: 180000 });
  return browserPromise;
}
export async function closeBrowser() {
  if (browserPromise) await (await browserPromise).close();
}

export const DEVICES = {
  office: { viewport: { width: 1366, height: 768 } },
  laptop: { viewport: { width: 1280, height: 720 } },
  desktop: { viewport: { width: 1440, height: 900 } },
  wide: { viewport: { width: 1920, height: 1080 } },
  iphone: KnownDevices["iPhone 13"],
  android: { userAgent: "Mozilla/5.0 (Linux; Android 13; Redmi Note 12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36", viewport: { width: 360, height: 780, deviceScaleFactor: 3, isMobile: true, hasTouch: true } },
  small: KnownDevices["Galaxy S9+"],
  tablet: KnownDevices["iPad Mini"],
  tiny: { userAgent: "Mozilla/5.0 (Linux; Android 11; Galaxy A02) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36", viewport: { width: 320, height: 640, deviceScaleFactor: 2, isMobile: true, hasTouch: true } },
  phone390: { userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36", viewport: { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true } },
};

const events = [];
export const allEvents = () => events;

// One simulated person: their own context (cookies), device and log.
export class Person {
  constructor(id, name, role, device = "desktop") {
    Object.assign(this, { id, name, role, device, step: 0, issues: [] });
    this.consoleErrors = [];
    this.failedRequests = [];
  }

  async open({ cookies } = {}) {
    this.context = await (await browser()).createBrowserContext();
    if (cookies?.length) {
      const host = new URL(BASE).hostname;
      await this.context.setCookie(...cookies.map((cookie) => ({ name: cookie.name, value: cookie.value, domain: host, path: "/", sameSite: "Lax" })));
    }
    this.page = await this.context.newPage();
    const device = DEVICES[this.device];
    if (device.userAgent) await this.page.emulate(device);
    else await this.page.setViewport(device.viewport);
    this.page.setDefaultTimeout(30000);
    this.dialogs = [];
    this.autoAcceptDialogs = true;
    this.page.on("dialog", async (dialog) => {
      this.dialogs.push(dialog.message());
      this.log("browser dialog", dialog.type(), dialog.message());
      if (this.autoAcceptDialogs) await dialog.accept(); else await dialog.dismiss();
    });
    this.page.on("console", (message) => {
      if (message.type() === "error") this.consoleErrors.push({ url: this.page.url(), text: message.text().slice(0, 300) });
    });
    this.page.on("pageerror", (error) => this.consoleErrors.push({ url: this.page.url(), text: `PAGE ERROR ${String(error.message).slice(0, 300)}` }));
    this.page.on("response", (response) => {
      const status = response.status();
      const url = response.url();
      if (status >= 400 && !url.includes("favicon") && !url.includes("_rsc=")) this.failedRequests.push({ page: this.page.url(), url: url.slice(0, 200), status, method: response.request().method() });
    });
    return this;
  }

  async close() {
    await this.context?.close().catch(() => {});
  }

  log(action, result = "", note = "", extra = {}) {
    const entry = { at: new Date().toISOString(), person: this.id, name: this.name, role: this.role, device: this.device, action, result, note: String(note ?? "").slice(0, 400), url: this.page?.url().replace(BASE, "") ?? "", ...extra };
    events.push(entry);
    const mark = result === "fail" ? "✗" : result === "issue" ? "!" : "·";
    console.log(`${mark} [${this.id}] ${action}${result ? ` → ${result}` : ""}${note ? ` (${String(note).slice(0, 140)})` : ""}`);
    return entry;
  }

  issue(severity, area, title, detail) {
    const entry = { severity, area, title, detail, person: this.id, name: this.name, url: this.page?.url().replace(BASE, "") ?? "" };
    this.issues.push(entry);
    this.log(`ISSUE ${severity}: ${title}`, "issue", detail);
  }

  async shot(label) {
    this.step += 1;
    const file = `${this.id}-${String(this.step).padStart(2, "0")}-${label.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.png`;
    try {
      await this.page.screenshot({ path: path.join(OUT, "shots", file), fullPage: false });
    } catch { /* closed page */ }
    return file;
  }

  // Navigate and record load time, final URL, title and layout problems.
  async visit(route, label = route) {
    const started = Date.now();
    let status = null;
    try {
      const response = await this.page.goto(`${BASE}${route}`, { waitUntil: "networkidle2", timeout: 60000 });
      status = response?.status() ?? null;
    } catch (error) {
      this.log(`open ${label}`, "fail", error.message);
      return { ok: false };
    }
    const ms = Date.now() - started;
    const screenWidth = (DEVICES[this.device].viewport ?? {}).width;
    const info = await this.page.evaluate((screenWidth) => ({
      title: document.title,
      h1: document.querySelector("h1")?.innerText?.trim() ?? "",
      overflowX: Math.max(document.documentElement.scrollWidth, window.innerWidth) - screenWidth,
      widestElement: (() => { let widest = null; for (const element of document.querySelectorAll("body *")) { const right = element.getBoundingClientRect().right; if (right > screenWidth + 2 && (!widest || right > widest.right)) widest = { right: Math.round(right), tag: `${element.tagName.toLowerCase()}.${String(element.className).split(" ").slice(0, 3).join(".")}`, text: (element.innerText || "").slice(0, 40) }; } return widest; })(),
      text: document.body.innerText.slice(0, 4000),
      imagesWithoutAlt: Array.from(document.images).filter((image) => !image.hasAttribute("alt")).length,
      brokenImages: Array.from(document.images).filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src).slice(0, 5),
      unlabeledControls: Array.from(document.querySelectorAll("input:not([type=hidden]):not([tabindex='-1']), select, textarea")).filter((element) => {
        if (element.closest("[aria-hidden=true]") || element.offsetParent === null) return false;
        if (element.getAttribute("aria-label") || element.getAttribute("aria-labelledby") || element.closest("label")) return false;
        return !(element.id && document.querySelector(`label[for="${CSS.escape(element.id)}"]`));
      }).length,
      iconButtonsWithoutName: Array.from(document.querySelectorAll("button")).filter((button) => button.offsetParent !== null && !button.innerText.trim() && !button.getAttribute("aria-label") && !button.getAttribute("title")).length,
    }), screenWidth);
    const finalPath = this.page.url().replace(BASE, "");
    this.log(`open ${label}`, status && status >= 400 ? "fail" : "ok", `${status} in ${ms}ms → ${finalPath} | h1: ${info.h1.slice(0, 60)}`, { ms, status, finalPath });
    if (ms > 4000) this.issue("medium", "performance", `Slow page: ${label}`, `${ms} ms to load on ${this.device}`);
    if (info.overflowX > 4) this.issue("medium", "mobile", `Page scrolls sideways: ${label}`, `${info.overflowX}px wider than the ${this.device} screen; widest: ${JSON.stringify(info.widestElement)}`);
    if (info.brokenImages.length) this.issue("medium", "content", `Broken images on ${label}`, info.brokenImages.join(", "));
    if (status === 404) this.issue("high", "navigation", `404 on ${label}`, `${route} returned 404`);
    if (status >= 500) this.issue("critical", "stability", `Server error on ${label}`, `${route} returned ${status}`);
    return { ok: true, ms, status, finalPath, ...info };
  }

  text() {
    return this.page.evaluate(() => document.body.innerText);
  }

  // Toasts that appeared since the last clearToasts().
  toasts() {
    return this.page.evaluate(() => Array.from(document.querySelectorAll("[data-sonner-toast]:not([data-sim-seen])")).map((toast) => toast.innerText.replace(/\s+/g, " ").trim()).join(" | "));
  }

  // Wait for a toast to appear and return its text ("" if none within the timeout).
  async waitToast(timeout = 15000) {
    try {
      await this.page.waitForFunction(() => document.querySelectorAll("[data-sonner-toast]:not([data-sim-seen])").length > 0, { timeout });
      await sleep(300);
      return this.toasts();
    } catch {
      return "";
    }
  }

  async clearToasts() {
    // Mark, never remove: deleting nodes React owns makes it crash on the next toast.
    await this.page.evaluate(() => document.querySelectorAll("[data-sonner-toast]").forEach((toast) => toast.setAttribute("data-sim-seen", "")));
  }

  // Click the visible button or link whose text contains `text`. Returns false if none.
  async click(text, { selector = "button, a, [role=button]", exact = false, within = null, nth = 0 } = {}) {
    const handle = await this.page.evaluateHandle((text, selector, exact, within, nth) => {
      const root = within ? Array.from(document.querySelectorAll(within)).filter((element) => element.offsetParent !== null || getComputedStyle(element).position === "fixed").pop() ?? document : document;
      const matches = Array.from(root.querySelectorAll(selector)).filter((element) => {
        const label = (element.innerText || element.getAttribute("aria-label") || element.getAttribute("title") || "").replace(/\s+/g, " ").trim();
        const visible = element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden";
        return visible && (exact ? label === text : label.toLowerCase().includes(text.toLowerCase()));
      });
      return matches[nth] ?? null;
    }, text, selector, exact, within, nth);
    const element = handle.asElement();
    if (!element) return false;
    await element.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }));
    await element.click();
    this.clicks = (this.clicks ?? 0) + 1;
    return true;
  }

  async mustClick(text, options) {
    if (!(await this.click(text, options))) throw new Error(`No visible control "${text}" on ${this.page.url().replace(BASE, "")}`);
  }

  // Find a form control by its visible label text (within the open form/drawer).
  async control(labelText) {
    const handle = await this.page.evaluateHandle((labelText) => {
      const wanted = labelText.toLowerCase();
      const labels = Array.from(document.querySelectorAll("label")).filter((label) => label.getClientRects().length > 0);
      for (const label of labels.reverse()) {
        const text = label.innerText.replace(/\s+/g, " ").replace(/\*/g, "").trim().toLowerCase();
        if (!text.startsWith(wanted)) continue;
        if (label.htmlFor) {
          const target = document.getElementById(label.htmlFor);
          if (target) return target;
        }
        const nested = label.querySelector("input, select, textarea");
        if (nested) return nested;
        let sibling = label.nextElementSibling;
        while (sibling) {
          if (sibling.matches("input, select, textarea")) return sibling;
          const inner = sibling.querySelector("input, select, textarea");
          if (inner) return inner;
          sibling = sibling.nextElementSibling;
        }
        const parentControl = label.parentElement?.querySelector("input, select, textarea");
        if (parentControl) return parentControl;
      }
      return null;
    }, labelText);
    const element = handle.asElement();
    if (!element) throw new Error(`No field labelled "${labelText}" on ${this.page.url().replace(BASE, "")}`);
    return element;
  }

  async fill(labelText, value) {
    const element = await this.control(labelText);
    const kind = await element.evaluate((node) => `${node.tagName}:${node.type ?? ""}`);
    if (kind.startsWith("SELECT")) {
      const chosen = await element.evaluate((select, value) => {
        const options = Array.from(select.options);
        const option = value === "" ? options.find((item) => item.value && !item.disabled) : options.find((item) => item.value === value) ?? options.find((item) => item.text.toLowerCase().includes(String(value).toLowerCase()));
        if (!option) return null;
        const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").set;
        setter.call(select, option.value);
        select.dispatchEvent(new Event("change", { bubbles: true }));
        return option.text;
      }, String(value));
      if (chosen === null) throw new Error(`No option "${value}" for "${labelText}"`);
      return;
    }
    if (/:(date|time|datetime-local|month)$/.test(kind)) {
      await setNative(element, value);
      return;
    }
    await element.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }));
    await element.click();
    await this.page.keyboard.down("Control");
    await this.page.keyboard.press("a");
    await this.page.keyboard.up("Control");
    await this.page.keyboard.press("Backspace");
    await element.type(String(value), { delay: 5 });
  }

  async fieldValue(labelText) {
    return (await this.control(labelText)).evaluate((node) => node.value);
  }

  // Validation message the browser or app shows for the focused/invalid field.
  async validationMessages() {
    return this.page.evaluate(() => {
      const browserMessages = Array.from(document.querySelectorAll("input, select, textarea")).filter((element) => element.offsetParent !== null && !element.checkValidity()).map((element) => element.validationMessage);
      const appMessages = Array.from(document.querySelectorAll("[role=alert], .text-red-600, .text-red-700, [id$=-error]")).filter((element) => element.offsetParent !== null).map((element) => element.innerText.trim()).filter(Boolean);
      return [...new Set([...appMessages, ...browserMessages])].join(" | ");
    });
  }

  async submitForm(buttonText) {
    const before = this.page.url();
    await this.mustClick(buttonText, { selector: "button[type=submit], button" });
    return before;
  }

  summary() {
    return { id: this.id, name: this.name, role: this.role, device: this.device, clicks: this.clicks ?? 0, consoleErrors: this.consoleErrors, failedRequests: this.failedRequests, issues: this.issues };
  }
}

export async function setNative(element, value) {
  await element.evaluate((node, value) => {
    const proto = node.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, "value").set.call(node, value);
    node.dispatchEvent(new Event("input", { bubbles: true }));
    node.dispatchEvent(new Event("change", { bubbles: true }));
  }, String(value));
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Session cookies for a user, exactly as @supabase/ssr sets them (no email is sent).
export async function sessionCookies(email) {
  const { data: link, error } = await service.auth.admin.generateLink({ type: "magiclink", email });
  if (error) throw error;
  const anon = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: verified, error: verifyError } = await anon.auth.verifyOtp({ token_hash: link.properties.hashed_token, type: "magiclink" });
  if (verifyError) throw verifyError;
  const jar = [];
  const ssr = createServerClient(SUPABASE_URL, ANON_KEY, { cookies: { getAll: () => [], setAll: (cookies) => jar.push(...cookies) } });
  await ssr.auth.setSession({ access_token: verified.session.access_token, refresh_token: verified.session.refresh_token });
  return jar;
}

// A Supabase client signed in as a user with their password: what any logged-in
// user could do from the browser console with the public anon key.
export async function userClient(email, password = PASSWORD) {
  const client = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return client;
}

// Run `fn` and record a failure instead of throwing, so one broken step does not end
// the person's whole day.
export async function attempt(person, action, fn) {
  const started = Date.now();
  try {
    const note = await fn();
    person.log(action, "ok", note ?? "", { ms: Date.now() - started });
    return true;
  } catch (error) {
    const file = await person.shot(`fail-${action}`);
    person.log(action, "fail", `${String(error?.message ?? error).split("\n")[0]} [${file}]`, { ms: Date.now() - started });
    return false;
  }
}

export function writeJson(name, data) {
  fs.writeFileSync(path.join(OUT, name), JSON.stringify(data, null, 2));
}

export function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(OUT, name), "utf8"));
}
