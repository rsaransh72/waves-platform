// Checks the India-only form rules in a browser: +91 phone field, digit limits,
// inline errors, blocked submission, and that the server rejects what the form
// would. Nothing is saved: every request it sends is invalid on purpose.
// Usage: node scripts/qa/india-inputs.mjs [baseUrl]
import puppeteer from "puppeteer";

const baseUrl = process.argv[2] ?? "http://localhost:3000";
const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
const results = [];
const check = (name, ok, note = "") => results.push({ check: name, result: ok ? "✓ pass" : "✗ fail", note: String(note).slice(0, 90) });

await page.goto(`${baseUrl}/contact`, { waitUntil: "networkidle2" });
const phone = "#contact-phone";
await page.waitForSelector(phone);

const prefix = await page.$eval(phone, (input) => input.parentElement.textContent);
check("+91 shown in front of the phone field", prefix.includes("+91"), prefix);

await page.type(phone, "abc98765x43210999");
let value = await page.$eval(phone, (input) => input.value);
check("Only digits kept, at most 10", value === "9876543210", value);
let counter = await page.$eval(phone, (input) => input.parentElement.textContent);
check("Counter shows 10/10", counter.includes("10/10"), counter);

await page.$eval(phone, (input) => {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, "");
  input.dispatchEvent(new Event("input", { bubbles: true }));
});
await page.evaluate(() => {
  const input = document.querySelector("#contact-phone");
  input.focus();
  const data = new DataTransfer();
  data.setData("text/plain", "+91 98765 43210");
  input.dispatchEvent(new ClipboardEvent("paste", { clipboardData: data, bubbles: true }));
});
await page.$eval(phone, (input) => {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, "+91 98765 43210");
  input.dispatchEvent(new Event("input", { bubbles: true }));
});
value = await page.$eval(phone, (input) => input.value);
check("Pasting +91 98765 43210 keeps the 10 digits", value === "9876543210", value);

await page.$eval(phone, (input) => {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, "98765");
  input.dispatchEvent(new Event("input", { bubbles: true }));
});
await page.click("#contact-email");
await page.waitForFunction(() => document.body.innerText.includes("Enter all 10 digits"), { timeout: 5000 }).catch(() => {});
let text = await page.evaluate(() => document.body.innerText);
check("Short number shows an error under the field", text.includes("Enter all 10 digits (5 entered)."));

await page.$eval(phone, (input) => {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, "5876543210");
  input.dispatchEvent(new Event("input", { bubbles: true }));
});
text = await page.evaluate(() => document.body.innerText);
check("Number starting with 5 is rejected", text.includes("A mobile number starts with 6, 7, 8 or 9."));

await page.type("#contact-name", "Rahul123");
await page.type("#contact-email", "rahul@x");
await page.click("#contact-phone");
text = await page.evaluate(() => document.body.innerText);
check("Name with digits is rejected", text.includes("Use letters only"));
check("Incomplete email is rejected", text.includes("Enter a valid email address"));

let posted = false;
page.on("request", (request) => { if (request.url().includes("/api/leads")) posted = true; });
await page.evaluate(() => document.querySelector("form button[type=submit]")?.click());
await new Promise((resolve) => setTimeout(resolve, 800));
const invalidCount = await page.evaluate(() => document.querySelectorAll("form :invalid").length);
check("Invalid form is not submitted", !posted && invalidCount > 0, `${invalidCount} invalid fields`);

// The server applies the same rules even if the browser is bypassed. The message is
// deliberately too short (checked last), so even a wrongly accepted phone saves nothing.
const api = async (body) => {
  const response = await fetch(`${baseUrl}/api/leads`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return { status: response.status, body: await response.json() };
};
const base = { name: "Asha Verma", email: "asha@school.in", organizationName: "QA School", inquiryType: "contact", message: "x" };
for (const [label, phoneValue, expected] of [
  ["9 digits", "987654321", "Enter all 10 digits"],
  ["starts with 5", "5876543210", "starts with 6, 7, 8 or 9"],
  ["US number", "+1 555 000 0000", "Enter exactly 10 digits"],
  ["21-digit junk", "769848222222222222222", "Enter exactly 10 digits"],
]) {
  const { status, body } = await api({ ...base, phone: phoneValue });
  check(`API rejects phone: ${label}`, status === 400 && body.error?.includes(expected), `${status} ${body.error}`);
}
const nameCheck = await api({ ...base, name: "R2D2", phone: "9876543210" });
check("API rejects a name with digits", nameCheck.status === 400, nameCheck.body.error);

// Public pages show rupees, never dollars.
for (const path of ["/", "/pricing", "/services", "/school-erp", "/school-erp/pricing"]) {
  await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle2" });
  const body = await page.evaluate(() => document.body.innerText);
  const dollars = body.match(/\$\s?\d|USD/g);
  check(`No dollar amounts on ${path}`, !dollars, dollars?.join(" "));
}

await browser.close();
console.table(results);
process.exitCode = results.some((row) => row.result.startsWith("✗")) ? 1 : 0;
