// Runs the whole day at once: 15 prospects on the website (in waves of five), the five
// existing principals working in their schools, and the super admin handling both.
// Then probes tenant isolation with each principal's own login.
//
// Usage (SIM_INBOX=you@gmail.com SIM_PASSWORD=<12+ chars> in the environment):
//   node scripts/qa/sim/seed.mjs && node scripts/qa/sim/run.mjs && node scripts/qa/sim/cleanup.mjs
import { ANON_KEY, BASE, Person, SUPABASE_URL, allEvents, closeBrowser, readJson, sessionCookies, sleep, userClient, writeJson } from "./lib.mjs";
import { createClient } from "@supabase/supabase-js";
import { PROSPECTS, runProspect } from "./prospects.mjs";
import { runPrincipal } from "./principals.mjs";
import { afterProspects, chaseOverdue, endOfDay, onboardFromLead, startAdmin, watchLeads, workLeads } from "./admin.mjs";

const seeded = readJson("seed.json");
const bySchool = Object.fromEntries(seeded.map((school) => [school.key, school]));
const started = Date.now();

const deferred = () => { let resolve; const promise = new Promise((done) => { resolve = done; }); return { promise, resolve }; };
const ready = deferred();
const suspended = deferred();
const saw = deferred();
const reactivated = deferred();
const shared = {
  newClients: [],
  s5Ready: ready.resolve, s5ReadyPromise: ready.promise,
  s5Suspended: suspended.promise, markSuspended: suspended.resolve,
  s5SawSuspension: saw.resolve, s5SawPromise: saw.promise,
  s5Reactivated: reactivated.promise, markReactivated: reactivated.resolve,
};

const admin = await startAdmin();
await watchLeads(admin);

// Everyone starts at once.
const principalRuns = seeded.map((school) => runPrincipal(school, shared));
const submitted = [];
const prospectRun = (async () => {
  const results = [];
  for (let wave = 0; wave < PROSPECTS.length; wave += 5) {
    results.push(...await Promise.all(PROSPECTS.slice(wave, wave + 5).map((prospect) => runProspect(prospect, { onSubmitted: (item) => submitted.push(item.id) }))));
  }
  return results;
})();

const adminRun = (async () => {
  const prospectResults = await prospectRun;
  await afterProspects(admin, submitted.length);
  await workLeads(admin, PROSPECTS);
  for (const id of ["p01", "p15"]) await onboardFromLead(admin, PROSPECTS.find((prospect) => prospect.id === id), shared);
  await chaseOverdue(admin, bySchool.s5, shared);
  return prospectResults;
})();

const [prospectResults, principalResults] = await Promise.all([adminRun, Promise.all(principalRuns)]);
await endOfDay(admin, seeded);

// ───────────── Tenant isolation, as each principal from their own login ─────────────
const security = new Person("sec", "Security probe (as principals)", "security", "desktop");
security.page = null;
const probe = async (title, fn, { expectBlocked = true, severity = "critical" } = {}) => {
  try {
    const { leaked, detail } = await fn();
    const failed = expectBlocked ? leaked : !leaked;
    security.log(title, failed ? "fail" : "ok", detail);
    if (failed) security.issue(severity, "security", title, detail);
  } catch (error) {
    security.log(title, "ok", `blocked: ${error.message}`);
  }
};
const s1 = await userClient(bySchool.s1.email);
const s5 = await userClient(bySchool.s5.email);
const anon = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } });
const otherOrg = bySchool.s2.organizationId;

await probe("Principal A reads school B's students", async () => {
  const { data } = await s1.from("school_students").select("first_name, parent_phone").eq("organization_id", otherOrg);
  return { leaked: (data?.length ?? 0) > 0, detail: `${data?.length ?? 0} of school B's students returned` };
});
await probe("Principal A edits school B's student", async () => {
  const { data } = await s1.from("school_students").update({ status: "inactive" }).eq("organization_id", otherOrg).select("id");
  return { leaked: (data?.length ?? 0) > 0, detail: `${data?.length ?? 0} rows changed` };
});
await probe("Principal A adds a student into school B", async () => {
  const { data, error } = await s1.from("school_students").insert({ organization_id: otherOrg, first_name: "Intruder", last_name: "Test", roll_number: "X1", class_id: bySchool.s2.classes[0].id }).select("id, organization_id");
  if (error) throw error;
  return { leaked: data?.[0]?.organization_id === otherOrg, detail: `inserted with organization ${data?.[0]?.organization_id}` };
});
await probe("Principal reads website leads (names, phones of other schools)", async () => {
  const { data } = await s1.from("leads").select("name, phone");
  return { leaked: (data?.length ?? 0) > 0, detail: `${data?.length ?? 0} leads visible` };
});
await probe("Principal lists other clients' subscriptions", async () => {
  const { data } = await s1.from("subscriptions").select("organization_name, amount");
  const others = (data ?? []).filter((row) => row.organization_name !== bySchool.s1.name);
  return { leaked: others.length > 0, detail: `${others.length} other clients' subscriptions visible` };
});
await probe("Overdue principal marks own subscription as active", async () => {
  const { data } = await s5.from("subscriptions").update({ status: "active" }).eq("organization_id", bySchool.s5.organizationId).select("status");
  return { leaked: data?.[0]?.status === "active", detail: `${data?.length ?? 0} rows changed` };
});
await probe("Principal changes own school status / plan amount", async () => {
  const { data } = await s5.from("subscriptions").update({ amount: 1 }).eq("organization_id", bySchool.s5.organizationId).select("amount");
  return { leaked: Number(data?.[0]?.amount) === 1, detail: `${data?.length ?? 0} rows changed` };
});
await probe("Principal grants self platform admin", async () => {
  const { data, error } = await s1.from("team_members").insert({ email: bySchool.s1.email, role: "superadmin", status: "active", name: "x" }).select("id");
  if (error) throw error;
  return { leaked: (data?.length ?? 0) > 0, detail: "team_members row created" };
});
await probe("Anonymous visitor reads students or leads with the public key", async () => {
  const [{ data: students }, { data: leads }] = await Promise.all([anon.from("school_students").select("id").limit(5), anon.from("leads").select("id").limit(5)]);
  return { leaked: (students?.length ?? 0) + (leads?.length ?? 0) > 0, detail: `${students?.length ?? 0} students, ${leads?.length ?? 0} leads` };
});
await probe("Principal A deletes school B's attendance", async () => {
  const { data } = await s1.from("school_attendance").delete().eq("organization_id", bySchool.s1.organizationId === otherOrg ? "" : otherOrg).select("id");
  return { leaked: (data?.length ?? 0) > 0, detail: `${data?.length ?? 0} rows deleted` };
});

// Browser checks: other school's receipt, and the admin console.
const s3browser = await new Person("sec-b", "Security probe (browser, as principal of school C)", "security", "desktop").open({ cookies: await sessionCookies(bySchool.s3.email) });
if (shared.s1ReceiptPath) {
  const info = await s3browser.visit(shared.s1ReceiptPath, "school A's receipt, opened by school C");
  const leaked = info.text.includes(bySchool.s1.name);
  s3browser.log("other school's receipt", leaked ? "fail" : "ok", `${info.finalPath} | ${info.h1}`);
  if (leaked) s3browser.issue("critical", "security", "A principal can open another school's fee receipt", shared.s1ReceiptPath);
}
const adminTry = await s3browser.visit("/admin", "admin console as a principal");
if (adminTry.finalPath.startsWith("/admin") && !/denied|not allowed|sign in/i.test(adminTry.text)) s3browser.issue("critical", "security", "Principal can open the admin console", adminTry.finalPath);
await s3browser.close();
const outsider = await new Person("sec-c", "Security probe (logged out)", "security", "desktop").open();
const school = await outsider.visit("/school/students", "school portal while logged out");
if (school.finalPath.startsWith("/school/students")) outsider.issue("critical", "security", "School data open without login", school.finalPath);
await outsider.close();

await admin.close();
await closeBrowser();

const people = [admin.summary(), ...prospectResults, ...principalResults, security.summary(), s3browser.summary(), outsider.summary()];
writeJson("results.json", { startedAt: new Date(started).toISOString(), minutes: Math.round((Date.now() - started) / 6000) / 10, base: BASE, people, events: allEvents(), newClients: shared.newClients });
const issues = people.flatMap((person) => person.issues);
console.log(`\nDone in ${Math.round((Date.now() - started) / 1000)} s. ${allEvents().length} steps, ${allEvents().filter((event) => event.result === "fail").length} failed, ${issues.length} issues.`);
await sleep(100);
