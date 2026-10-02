// The platform super admin's day: watching leads arrive while principals browse the
// site, working each lead, onboarding the two who say yes, chasing the overdue school
// and checking the books.
import { BASE, Person, attempt, sessionCookies, service, sleep } from "./lib.mjs";

const inDays = (n) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date(Date.now() + n * 86400000));

async function openLead(person, name) {
  await person.page.keyboard.press("Escape");
  await sleep(400);
  const search = await person.page.$("input[type=search]");
  await search.click({ clickCount: 3 });
  await search.type(name.split(" ").slice(-1)[0]);
  await sleep(400);
  const row = await person.page.evaluateHandle((name) => Array.from(document.querySelectorAll("tbody tr")).find((tr) => tr.innerText.includes(name)), name);
  if (!row.asElement()) throw new Error(`Lead ${name} not in the list`);
  await row.asElement().click();
  await sleep(700);
}

export async function startAdmin() {
  const { data: admin } = await service.from("team_members").select("email").eq("role", "superadmin").eq("status", "active").limit(1).single();
  const person = await new Person("admin", `Super admin (${admin.email})`, "super admin", "desktop").open({ cookies: await sessionCookies(admin.email) });
  return person;
}

// Phase 1: the leads page is open while the 15 prospects fill in forms.
export async function watchLeads(person) {
  await attempt(person, "open Leads before the morning rush", async () => {
    const info = await person.visit("/admin/leads", "leads");
    const rows = await person.page.$$eval("tbody tr", (trs) => trs.filter((tr) => !/no leads|nothing/i.test(tr.innerText)).length);
    person.leadsAtStart = rows;
    return `${rows} leads shown | ${info.h1}`;
  });
}

export async function afterProspects(person, expected) {
  await attempt(person, "do new leads appear without refreshing?", async () => {
    await sleep(4000);
    const live = await person.page.$$eval("tbody tr", (trs) => trs.filter((tr) => tr.querySelector("td + td")).length);
    const badge = await person.page.evaluate(() => document.querySelector("nav, aside")?.innerText.match(/Leads\s*(\d+)/)?.[1] ?? null);
    await person.page.reload({ waitUntil: "networkidle2" });
    const afterReload = await person.page.$$eval("tbody tr", (trs) => trs.filter((tr) => tr.querySelector("td + td")).length);
    await person.shot("leads-after-rush");
    if (live < afterReload) person.issue("high", "realtime", "New enquiries do not appear until the page is refreshed", `While Leads was open, ${expected} principals submitted forms. The table still showed ${live}; after a manual refresh it showed ${afterReload}. Sales can sit on a hot lead without knowing.`);
    return `before refresh: ${live}, sidebar badge: ${badge ?? "none"}, after refresh: ${afterReload}`;
  });
}

// Phase 2: work the pipeline.
export async function workLeads(person, prospects) {
  const plan = {
    p01: { stage: "qualified", note: "Spoke to Mrs Sharma. Wants fees + attendance live before November. Budget approved by trust." },
    p15: { stage: "qualified", note: "3 branches. Ms Menon wants one login across branches – check with product." },
    p02: { stage: "contacted", followUp: 2, note: "Father Joseph asked for a WhatsApp demo video first." },
    p03: { stage: "contacted", followUp: 3, note: "Wants price on call. Quoted ₹30/student/year verbally." },
    p04: { stage: "demo_scheduled", followUp: 1, note: "Demo booked Tue 4 pm on Google Meet." },
    p11: { stage: "demo_scheduled", followUp: 5 },
    p13: { stage: "contacted", followUp: 2, note: "Asked for data-security document and DPDP compliance letter." },
    p14: { stage: "lost", lost: "Budget below ₹15,000 a year" },
  };
  for (const prospect of prospects) {
    const step = plan[prospect.id];
    if (!step) continue;
    await attempt(person, `lead ${prospect.name}: ${step.stage}`, async () => {
      await openLead(person, prospect.name);
      await person.fill("Stage", step.stage);
      if (step.followUp) await person.fill("Next follow-up", inDays(step.followUp));
      if (step.lost) await person.fill("Reason lost", step.lost);
      const saved = await (async () => { await person.clearToasts(); await person.mustClick("Save stage"); return person.waitToast(); })();
      let noted = "";
      if (step.note) {
        await sleep(500);
        const area = await person.page.$("textarea");
        await area.type(step.note);
        await person.clearToasts();
        await person.mustClick("Add note");
        noted = await person.waitToast(5000);
        await sleep(800);
        const visible = await person.page.evaluate((note) => document.body.innerText.includes(note.slice(0, 30)), step.note);
        if (!visible) noted += " (note not shown in list)";
      }
      return `${saved}${noted ? ` | note: ${noted}` : ""}`;
    });
  }

  await attempt(person, "delete the duplicate enquiry from Mohammed Irfan", async () => {
    await person.page.keyboard.press("Escape");
    const { data } = await service.from("leads").select("id, created_at").ilike("email", "%qasim-lead-p10%").order("created_at");
    if ((data?.length ?? 0) > 1) person.issue("medium", "sales", "Same person can submit the same enquiry twice", `Mohammed Irfan's second submission created a second lead (${data.length} rows, same phone and email). Duplicates should be merged or flagged.`);
    await openLead(person, "Mohammed Irfan");
    await person.clearToasts();
    await person.mustClick("Delete (spam or duplicate)");
    return `${data?.length ?? 0} rows; ${await person.waitToast(8000)}`;
  });
}

// Phase 3: onboard the two schools that said yes.
export async function onboardFromLead(person, prospect, shared) {
  let organizationId = null;
  await attempt(person, `onboard ${prospect.org} from the lead`, async () => {
    await person.visit("/admin/leads", "leads");
    await openLead(person, prospect.name);
    await person.mustClick("Onboard as client");
    await person.page.waitForFunction(() => location.pathname === "/admin/onboarding", { timeout: 20000 });
    await person.page.waitForNetworkIdle({ idleTime: 500 }).catch(() => {});
    const prefill = await person.page.evaluate(() => ({ name: document.querySelector("#onboard-name")?.value, email: document.querySelector("#onboard-email")?.value, phone: document.querySelector("#onboard-phone")?.value, city: document.querySelector("#onboard-city")?.value }));
    await person.shot(`onboard-${prospect.id}-prefilled`);
    if (!prefill.name || !prefill.email) throw new Error(`Form not pre-filled: ${JSON.stringify(prefill)}`);
    const planOptions = await person.page.$$eval("select[aria-label=Plan] option", (options) => options.map((option) => `${option.value}:${option.text}`));
    await person.page.select("select[aria-label=Plan]", "custom");
    await sleep(300);
    const field = async (id, value) => { const handle = await person.page.$(id); if (!handle) return; await handle.click({ clickCount: 3 }); await person.page.keyboard.press("Backspace"); await handle.type(value); };
    await field("#onboard-planName", "School ERP – Standard (annual)");
    await field("#onboard-planAmount", prospect.id === "p15" ? "216000" : "84000");
    const state = await person.page.$("#onboard-state");
    if (state) await person.page.evaluate((value) => { const select = document.querySelector("#onboard-state"); if (select?.tagName === "SELECT") { const option = Array.from(select.options).find((item) => item.text === value); if (option) { Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").set.call(select, option.value); select.dispatchEvent(new Event("change", { bubbles: true })); } } }, prospect.id === "p15" ? "Maharashtra" : "Rajasthan");
    await person.clearToasts();
    const started = Date.now();
    await person.mustClick("Create client and send invitation", { selector: "button[type=submit]" });
    const outcome = await person.page.waitForFunction(() => (/^\/admin\/organizations\/[0-9a-f-]{36}$/.test(location.pathname) ? "created" : (document.querySelector("[role=alert]")?.innerText.trim() || false)), { timeout: 60000 }).then((handle) => handle.jsonValue()).catch(() => "no response");
    await person.shot(`onboard-${prospect.id}-result`);
    if (outcome !== "created") {
      if (/limit|rate|too many/i.test(outcome)) person.issue("critical", "email", "Cannot onboard a paying school: email limit", `Onboarding ${prospect.org} failed with “${outcome}”. Supabase's built-in mailer allows ~2 emails/hour; set up custom SMTP before launch.`);
      throw new Error(outcome);
    }
    organizationId = person.page.url().split("/").pop();
    shared.newClients.push({ organizationId, prospect });
    return `${Date.now() - started} ms | prefilled ${JSON.stringify(prefill)} | plans: ${planOptions.join(", ")}`;
  });
  return organizationId;
}

// Phase 4: overdue school, money, audit.
export async function chaseOverdue(person, school, shared) {
  await attempt(person, "spot the overdue subscription", async () => {
    const info = await person.visit("/admin/subscriptions", "subscriptions");
    await person.shot("subscriptions");
    const line = info.text.split("\n").find((row) => row.includes(school.name)) ?? "";
    const flagged = /past.?due|overdue/i.test(info.text);
    if (!flagged) person.issue("medium", "billing", "Overdue subscription not highlighted", "Delhi Heights is 6 days past due but the subscriptions list does not flag it.");
    return `${flagged ? "flagged" : "not flagged"} | ${line.slice(0, 120)}`;
  });
  await attempt(person, "suspend Delhi Heights while the principal is working", async () => {
    await shared.s5ReadyPromise;
    await person.visit(`/admin/organizations/${school.organizationId}`, "client page");
    await person.clearToasts();
    await person.mustClick("Suspend");
    const toast = await person.waitToast();
    shared.markSuspended();
    return toast;
  });
  await attempt(person, "reactivate after the school pays", async () => {
    const seen = await Promise.race([shared.s5SawPromise, sleep(90000).then(() => "timeout")]);
    await sleep(1500);
    await person.visit(`/admin/organizations/${school.organizationId}`, "client page");
    await person.clearToasts();
    await person.mustClick("Reactivate");
    const toast = await person.waitToast();
    shared.markReactivated();
    return `principal saw: ${String(seen).slice(0, 80).replace(/\s+/g, " ")} | ${toast}`;
  });
}

export async function endOfDay(person, seeded) {
  for (const route of ["/admin", "/admin/organizations", "/admin/billing", "/admin/client-users", "/admin/audit"]) {
    await attempt(person, `review ${route}`, async () => {
      const info = await person.visit(route);
      await person.shot(route.split("/").pop() || "dashboard");
      const mentions = seeded.filter((school) => info.text.includes(school.name)).length;
      return `${info.h1} | mentions ${mentions}/${seeded.length} seeded schools | ${info.text.split("\n").filter(Boolean).slice(1, 14).join(" · ").slice(0, 300)}`;
    });
  }
  await attempt(person, "audit log shows what principals did today", async () => {
    const info = await person.visit("/admin/audit", "audit");
    const principalActions = /attendance|payment|student|exam/i.test(info.text);
    if (!principalActions) person.issue("medium", "audit", "School activity is not in the audit log", "Fee payments, deactivated students and attendance changes made by principals today do not appear in Admin → Audit, so disputes (\"I paid ₹6,000\") cannot be traced.");
    return principalActions ? "school actions present" : "only admin actions";
  });
  await attempt(person, "dashboard numbers match reality", async () => {
    const info = await person.visit("/admin", "dashboard");
    return info.text.replace(/\s+/g, " ").slice(0, 400);
  });
}

export { BASE };
