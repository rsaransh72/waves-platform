// Server response time (time to first byte) of signed-in pages, repeated to separate
// cold starts from warm requests. Usage: node scripts/qa/perf-ttfb.mjs (after seed.mjs)
import { BASE, readJson, sessionCookies } from "./sim/lib.mjs";

const s1 = readJson("seed.json").find((item) => item.key === "s1");
const cookie = (await sessionCookies(s1.email)).map((item) => `${item.name}=${item.value}`).join("; ");
const routes = ["/school", "/school/students", "/school/attendance", "/school/fees", "/school/fees/collection", "/school/timetable", "/school/classes", "/school/settings"];
const rows = [];
for (const route of routes) {
  const times = [];
  for (let i = 0; i < 4; i += 1) {
    const started = performance.now();
    const response = await fetch(`${BASE}${route}`, { headers: { cookie }, redirect: "manual" });
    const reader = response.body.getReader();
    await reader.read();
    times.push(Math.round(performance.now() - started));
    while (!(await reader.read()).done);
    if (i === 0) rows.push({ route, status: response.status, region: response.headers.get("x-vercel-id")?.split("::").slice(0, 2).join("::") });
  }
  Object.assign(rows.at(-1), { first: times[0], warm: times.slice(1).join(" / ") });
}
console.table(rows);
