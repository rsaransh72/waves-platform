// End-to-end test of client onboarding and the platform team invitation, driven in a
// browser as each person involved. Invitation emails go to Gmail "+" aliases of the
// given inbox; the invitation links themselves are generated on the server, so the
// inbox does not need to be read. Everything created is deleted at the end.
//
// Usage: node scripts/qa/e2e-onboarding.mjs <your@gmail.com> [baseUrl]
import { closeBrowsers, openAdminBrowser, openBrowserAs, service } from "./admin-session.mjs";

const inbox = process.argv[2];
const baseUrl = process.argv[3] ?? "http://localhost:3000";
if (!inbox?.includes("@")) throw new Error("Pass an inbox you own, e.g. you@gmail.com");
const [local, domain] = inbox.split("@");
const alias = (tag) => `${local}+${tag}-${Date.now().toString(36)}@${domain}`;
const schoolAdminEmail = alias("qa-school");
const teacherEmail = alias("qa-teacher");
const teamEmail = alias("qa-admin");
const password = `Qa-${Math.random().toString(36).slice(2)}-Pass!`;
const schoolName = `QA Test School ${Date.now().toString(36)}`;

const results = [];
const step = async (name, fn) => {
  try {
    const note = await fn();
    results.push({ step: name, result: "✓ pass", note: note ?? "" });
    return true;
  } catch (error) {
    results.push({ step: name, result: "✗ fail", note: String(error?.message ?? error).slice(0, 160) });
    return false;
  }
};
const waitForText = (page, text, timeout = 30000) => page.waitForFunction((value) => document.body.innerText.includes(value), { timeout }, text);
const clickText = async (page, selector, text) => {
  for (const handle of await page.$$(selector)) {
    if ((await handle.evaluate((element) => element.textContent?.trim() ?? "")).startsWith(text)) return handle.click();
  }
  throw new Error(`No ${selector} "${text}"`);
};
const typeInto = async (page, selector, value) => {
  const field = await page.waitForSelector(selector);
  await field.click({ clickCount: 3 });
  await field.type(String(value));
};
const toastText = (page) => page.evaluate(() => Array.from(document.querySelectorAll("[data-sonner-toast]")).map((toast) => toast.textContent).join(" | "));

let organizationId = null;
const admin = await openAdminBrowser(baseUrl);
admin.page.on("dialog", (dialog) => dialog.accept());

try {
  // 1. Super admin onboards the client.
  const onboarded = await step("Admin: onboard a client from the form", async () => {
    const page = admin.page;
    await page.goto(`${baseUrl}/admin/onboarding`, { waitUntil: "networkidle2" });
    await typeInto(page, "#onboard-name", schoolName);
    await typeInto(page, "#onboard-email", schoolAdminEmail);
    await typeInto(page, "#onboard-phone", "9000000001");
    await page.select("select[aria-label=Plan]", "custom");
    await typeInto(page, "#onboard-planName", "QA plan");
    await typeInto(page, "#onboard-planAmount", "1000");
    await clickText(page, "button[type=submit]", "Create client and send invitation");
    await page.waitForFunction(() => /^\/admin\/organizations\/[0-9a-f-]{36}$/.test(location.pathname) || document.querySelector("[role=alert]"), { timeout: 60000 });
    if (!/\/admin\/organizations\/[0-9a-f-]{36}$/.test(new URL(page.url()).pathname)) {
      throw new Error(`Stayed on the form: ${await page.$$eval("[role=alert]", (alerts) => alerts.map((alert) => alert.textContent).join(" | "))}`);
    }
    const { data: organization } = await service.from("organizations").select("id, status, type, phone").eq("name", schoolName).single();
    organizationId = organization.id;
    if (organization.phone !== "+919000000001") throw new Error(`Phone saved as ${organization.phone}`);
    return `type ${organization.type}, status ${organization.status}, phone ${organization.phone}`;
  });

  if (onboarded) {
    await step("Database: subscription, settings and admin membership created", async () => {
      const [{ data: subscription }, { data: settings }, { data: members }] = await Promise.all([
        service.from("subscriptions").select("plan_name, amount, status").eq("organization_id", organizationId).single(),
        service.from("school_settings").select("school_name").eq("organization_id", organizationId).single(),
        service.from("organization_members").select("role").eq("organization_id", organizationId),
      ]);
      if (!subscription || !settings || members?.length !== 1 || members[0].role !== "admin") throw new Error(JSON.stringify({ subscription, settings, members }));
      return `${subscription.plan_name} ₹${subscription.amount} (${subscription.status})`;
    });

    // 2. The school administrator accepts the invitation and sets a password.
    let school;
    await step("School admin: accept invitation and set password", async () => {
      school = await openBrowserAs(baseUrl, schoolAdminEmail, "invite");
      await school.page.goto(`${baseUrl}/school/accept-invite`, { waitUntil: "networkidle2" });
      const fields = await school.page.$$("input[type=password]");
      await fields[0].type(password);
      await fields[1].type(password);
      await clickText(school.page, "button[type=submit]", "");
      await school.page.waitForFunction(() => location.pathname === "/school", { timeout: 60000 });
      return "landed on /school";
    });

    if (school) {
      school.page.on("dialog", (dialog) => dialog.accept());
      await step("School admin: dashboard shows the school name and role", async () => {
        await school.page.goto(`${baseUrl}/school`, { waitUntil: "networkidle2" });
        const text = await school.page.evaluate(() => document.body.innerText);
        if (!text.includes(schoolName) || !text.includes("Administrator")) throw new Error("School name or role missing from the header");
      });

      await step("School admin: invite a teacher from Users & Access", async () => {
        await school.page.goto(`${baseUrl}/school/users`, { waitUntil: "networkidle2" });
        await typeInto(school.page, "#invite-email", teacherEmail);
        await school.page.select("#invite-role", "teacher");
        await clickText(school.page, "button[type=submit]", "Send invitation");
        await waitForText(school.page, teacherEmail);
        const toasts = await toastText(school.page);
        if (!toasts.includes("Invitation sent")) throw new Error(toasts || "No confirmation");
      });

      // 3. Fee collection and receipt.
      await step("School admin: record a fee payment and open the receipt", async () => {
        const { data: schoolClass } = await service.from("school_classes").insert({ organization_id: organizationId, name: "QA Grade 1", section: "A" }).select("id").single();
        const { data: student } = await service.from("school_students").insert({ organization_id: organizationId, first_name: "Asha", last_name: "Test", roll_number: "QA-1", class_id: schoolClass.id }).select("id").single();
        const { data: structure } = await service.from("school_fee_structures").insert({ organization_id: organizationId, name: "QA Tuition", amount: 12500 }).select("id").single();
        await service.from("school_student_fees").insert({ organization_id: organizationId, student_id: student.id, fee_structure_id: structure.id, due_date: "2026-12-31", amount_due: 12500 });

        await school.page.goto(`${baseUrl}/school/fees/collection`, { waitUntil: "networkidle2" });
        await clickText(school.page, "button", "Pay Now");
        await school.page.waitForSelector("#payment-amount");
        await school.page.$eval("#payment-amount", (input) => {
          Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, "5000");
          input.dispatchEvent(new Event("input", { bubbles: true }));
        });
        await clickText(school.page, "button[type=submit]", "Confirm payment");
        await waitForText(school.page, "Receipt R-000001");
        const { data: payment } = await service.from("school_fee_payments").select("id, receipt_number").eq("organization_id", organizationId).single();
        await school.page.goto(`${baseUrl}/school/fees/receipts/${payment.id}`, { waitUntil: "networkidle2" });
        const text = await school.page.evaluate(() => document.body.innerText);
        if (!text.includes("R-000001") || !text.includes("Rupees Five Thousand Only") || !text.includes("Asha Test")) throw new Error("Receipt content wrong");
        return "R-000001, Rupees Five Thousand Only";
      });

      // 4. The teacher's access is limited by role.
      await step("Teacher: accept invitation; fees and settings are blocked", async () => {
        const teacher = await openBrowserAs(baseUrl, teacherEmail, "invite");
        await teacher.page.goto(`${baseUrl}/school/fees/collection`, { waitUntil: "networkidle2" });
        if (!teacher.page.url().includes("/school?denied=1")) throw new Error(`Fees page opened for a teacher: ${teacher.page.url()}`);
        const sidebar = await teacher.page.evaluate(() => document.querySelector("aside")?.innerText ?? "");
        if (sidebar.includes("Fee Collection") || sidebar.includes("School Settings")) throw new Error("Teacher sees fee or settings links");
        await teacher.context.close();
        return "redirected with notice; links hidden";
      });

      // 5. Suspending the client cuts off access.
      await step("Admin: suspend client blocks the school; reactivate restores it", async () => {
        await admin.page.goto(`${baseUrl}/admin/organizations/${organizationId}`, { waitUntil: "networkidle2" });
        await clickText(admin.page, "button", "Suspend");
        await waitForText(admin.page, "Client suspended");
        await school.page.goto(`${baseUrl}/school`, { waitUntil: "networkidle2" });
        if (!school.page.url().includes("/access-denied")) throw new Error(`Suspended school still opens: ${school.page.url()}`);
        await admin.page.goto(`${baseUrl}/admin/organizations/${organizationId}`, { waitUntil: "networkidle2" });
        await clickText(admin.page, "button", "Reactivate");
        await waitForText(admin.page, "Client reactivated");
        await school.page.goto(`${baseUrl}/school`, { waitUntil: "networkidle2" });
        if (!school.page.url().endsWith("/school")) throw new Error("Reactivated school still blocked");
      });

      await step("Admin: client page lists both users", async () => {
        await admin.page.goto(`${baseUrl}/admin/organizations/${organizationId}`, { waitUntil: "networkidle2" });
        const text = await admin.page.evaluate(() => document.body.innerText);
        if (!text.includes(schoolAdminEmail) || !text.includes(teacherEmail)) throw new Error("Users missing");
      });
      await school.context.close();
    }
  }

  // 6. Platform team invitation.
  await step("Admin: invite a platform team member", async () => {
    await admin.page.goto(`${baseUrl}/admin/users`, { waitUntil: "networkidle2" });
    await typeInto(admin.page, "#team-name", "QA Team Member");
    await typeInto(admin.page, "#team-email", teamEmail);
    await clickText(admin.page, "button[type=submit]", "Send invitation");
    await waitForText(admin.page, teamEmail);
    const toasts = await toastText(admin.page);
    if (!toasts.includes("Invitation sent")) throw new Error(toasts || "No confirmation");
  });

  await step("Team member: set password, then sign in to /admin with it", async () => {
    const member = await openBrowserAs(baseUrl, teamEmail, "invite");
    await member.page.goto(`${baseUrl}/account/reset-password`, { waitUntil: "networkidle2" });
    const fields = await member.page.$$("input[type=password]");
    await fields[0].type(password);
    await fields[1].type(password);
    await clickText(member.page, "button[type=submit]", "");
    await member.page.waitForFunction(() => location.pathname === "/login", { timeout: 60000 });
    // Sign in through the real login form with the new password.
    await member.context.deleteCookie(...(await member.page.cookies()));
    await member.page.goto(`${baseUrl}/login`, { waitUntil: "networkidle2" });
    await typeInto(member.page, "input[type=email]", teamEmail);
    await typeInto(member.page, "input[type=password]", password);
    await clickText(member.page, "button[type=submit]", "SIGN IN");
    await member.page.waitForFunction(() => location.pathname.startsWith("/admin"), { timeout: 60000 });
    await member.context.close();
    return "password set; admin console opens";
  });
} finally {
  // Clean up everything the test created.
  if (organizationId) await service.from("organizations").delete().eq("id", organizationId);
  await service.from("team_members").delete().eq("email", teamEmail);
  const { data } = await service.auth.admin.listUsers({ page: 1, perPage: 1000 });
  for (const user of data?.users ?? []) {
    if ([schoolAdminEmail, teacherEmail, teamEmail].includes(user.email)) await service.auth.admin.deleteUser(user.id);
  }
  await closeBrowsers();
}

console.table(results);
process.exitCode = results.some((row) => row.result.startsWith("✗")) ? 1 : 0;
