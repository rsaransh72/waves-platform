// Drives real admin workflows in a browser and checks each step's result, the way a
// tester would. Everything it creates is labelled "QA test" and removed at the end.
// Usage: node scripts/qa/admin-process-test.mjs [baseUrl]
import { openAdminBrowser } from "./admin-session.mjs";

const baseUrl = process.argv[2] ?? "http://localhost:3000";
const { browser, page, service } = await openAdminBrowser(baseUrl);
page.on("dialog", (dialog) => dialog.accept());
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));

const results = [];
const step = async (name, fn) => {
  try {
    await fn();
    results.push({ step: name, result: "✓ pass" });
  } catch (error) {
    results.push({ step: name, result: `✗ ${String(error.message).slice(0, 120)}` });
  }
};
const go = (path) => page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle2", timeout: 120000 });
const waitForText = (text, timeout = 20000) => page.waitForFunction((value) => document.body.innerText.includes(value), { timeout }, text);
const clickText = async (selector, text) => {
  const handles = await page.$$(selector);
  for (const handle of handles) {
    if ((await handle.evaluate((element) => element.textContent?.trim())) === text) return handle.click();
  }
  throw new Error(`No ${selector} with text "${text}"`);
};
const leadName = `QA test lead ${Date.now()}`;

await step("Leads: add a lead by hand", async () => {
  await go("/admin/leads?new=1");
  const form = await page.waitForSelector("form:has(button[type=submit])");
  const fields = await form.$$("input");
  await fields[0].type(leadName);
  await fields[1].type("+91 90000 00000");
  await fields[2].type("qa-test@example.com");
  await fields[3].type("QA Test School");
  await clickText("button[type=submit]", "Add lead");
  await waitForText("Lead added.");
  await waitForText(leadName);
});

await step("Leads: set stage and follow-up date", async () => {
  await clickText("td div.font-bold", leadName);
  await waitForText("Save stage");
  const select = await page.waitForSelector("form select");
  await select.select("contacted");
  // Set the date the way React expects (typing into a date picker depends on locale).
  await page.$eval("form input[type=date]", (input) => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setter.call(input, "2026-12-15");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await clickText("button[type=submit]", "Save stage");
  await waitForText("Lead updated.");
});

await step("Leads: add a note", async () => {
  const textarea = await page.waitForSelector("textarea[placeholder^='What was discussed']");
  await textarea.type("QA test note: called, demo next week.");
  await clickText("button[type=submit]", "Add note");
  await waitForText("Note added.");
  await waitForText("QA test note: called, demo next week.");
});

await step("Leads: stage saved in the database", async () => {
  const { data } = await service.from("leads").select("status, next_follow_up").eq("name", leadName).single();
  if (data?.status !== "contacted" || data?.next_follow_up !== "2026-12-15") throw new Error(`Saved as ${JSON.stringify(data)}`);
});

await step("Leads: delete the test lead", async () => {
  const buttons = await page.$$("button");
  for (const button of buttons) {
    if ((await button.evaluate((element) => element.textContent ?? "")).includes("Delete (spam or duplicate)")) { await button.click(); break; }
  }
  await waitForText("Lead deleted.");
  const { count } = await service.from("leads").select("id", { count: "exact", head: true }).eq("name", leadName);
  if (count) throw new Error("Lead still in the database");
});

await step("Website menu: save", async () => {
  await go("/admin/navigation");
  await clickText("button", "Save Navigation");
  await waitForText("Website menu saved");
});

await step("Products: open School ERP and save without changes", async () => {
  await go("/admin/products/school-erp");
  await waitForText("Product name");
  await clickText("button", "Save changes");
  await waitForText("Product saved.");
});

await step("Settings: save", async () => {
  await go("/admin/settings");
  await clickText("button[type=submit]", "Save changes");
  await waitForText("Settings saved.");
});

await step("Audit log: readable, no raw objects", async () => {
  await go("/admin/audit");
  const text = await page.evaluate(() => document.body.innerText);
  if (text.includes("[object Object]")) throw new Error("Shows [object Object]");
  if (!text.includes("Deleted lead")) throw new Error("Deletion of the test lead is not in the audit log");
});

// Clean up anything left behind if a step failed midway.
await service.from("leads").delete().like("name", "QA test lead %");

console.table(results);
if (errors.length) console.log("Page errors:", errors);
await browser.close();
process.exitCode = results.some((row) => row.result.startsWith("✗")) ? 1 : 0;
