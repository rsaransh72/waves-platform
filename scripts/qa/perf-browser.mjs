// What a browser downloads and waits for on a page: every request with its size and
// timing, plus the page's own timing milestones. Usage: node scripts/qa/perf-browser.mjs /school/students [device]
import { Person, closeBrowser, readJson, sessionCookies } from "./sim/lib.mjs";

const route = process.argv[2] ?? "/school/students";
const device = process.argv[3] ?? "desktop";
const s1 = readJson("seed.json").find((item) => item.key === "s1");
const signedIn = route.startsWith("/school") || route.startsWith("/admin");
const person = await new Person("perf", "perf", "qa", device).open(signedIn ? { cookies: await sessionCookies(s1.email) } : {});
const cdp = await person.page.createCDPSession();
await cdp.send("Network.enable");
const requests = new Map();
cdp.on("Network.requestWillBeSent", ({ requestId, request, timestamp, type }) => requests.set(requestId, { url: request.url, type, start: timestamp }));
cdp.on("Network.responseReceived", ({ requestId, response }) => Object.assign(requests.get(requestId) ?? {}, { status: response.status, cache: response.fromDiskCache || response.fromServiceWorker ? "cache" : "" }));
cdp.on("Network.loadingFinished", ({ requestId, timestamp, encodedDataLength }) => Object.assign(requests.get(requestId) ?? {}, { end: timestamp, bytes: encodedDataLength }));

for (const pass of ["first visit", "second visit"]) {
  requests.clear();
  const started = Date.now();
  await person.page.goto(`${process.env.SIM_BASE}${route}`, { waitUntil: "networkidle0", timeout: 90000 });
  const total = Date.now() - started;
  const timing = await person.page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const paint = Object.fromEntries(performance.getEntriesByType("paint").map((entry) => [entry.name, Math.round(entry.startTime)]));
    return { ttfb: Math.round(nav.responseStart), htmlDone: Math.round(nav.responseEnd), domContentLoaded: Math.round(nav.domContentLoadedEventEnd), load: Math.round(nav.loadEventEnd), fcp: paint["first-contentful-paint"] };
  });
  const list = [...requests.values()].filter((item) => item.start);
  const t0 = Math.min(...list.map((item) => item.start));
  const byType = {};
  for (const item of list) {
    const key = item.url.includes("supabase.co") ? `supabase ${new URL(item.url).pathname.split("/").slice(1, 4).join("/")}` : item.type;
    byType[key] ??= { count: 0, kb: 0 };
    byType[key].count += 1;
    byType[key].kb += Math.round((item.bytes ?? 0) / 1024);
  }
  console.log(`\n=== ${route} on ${device}, ${pass}: networkidle after ${total} ms ===`);
  console.log(timing);
  console.table(byType);
  console.table(list.sort((a, b) => a.start - b.start).map((item) => ({
    at: Math.round((item.start - t0) * 1000), ms: item.end ? Math.round((item.end - item.start) * 1000) : "open", kb: Math.round((item.bytes ?? 0) / 1024), status: item.status, url: item.url.replace(process.env.SIM_BASE, "").replace(/https:\/\/[a-z]+\.supabase\.co/, "SB").slice(0, 90),
  })));
}
await person.close();
await closeBrowser();
