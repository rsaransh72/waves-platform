// Runs SQL on the Supabase project through the Management API, for networks where the
// database host (IPv6 only) is unreachable and scripts/db/run-sql.mjs cannot connect.
// Usage: node scripts/supabase/sql.mjs supabase/<file>.sql
//        node scripts/supabase/sql.mjs "select ..."
// Needs SUPABASE_ACCESS_TOKEN and NEXT_PUBLIC_SUPABASE_URL in .env.local or the environment.
import fs from "node:fs";
import { config } from "dotenv";

config({ path: ".env.local", quiet: true });

const input = process.argv[2];
const token = process.env.SUPABASE_ACCESS_TOKEN;
const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/^https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1];
if (!input || !token || !projectRef) {
  console.error("Usage: node scripts/supabase/sql.mjs <file.sql | \"sql\"> (needs SUPABASE_ACCESS_TOKEN and NEXT_PUBLIC_SUPABASE_URL)");
  process.exitCode = 1;
} else {
  const isFile = input.endsWith(".sql") && fs.existsSync(input);
  const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: isFile ? fs.readFileSync(input, "utf8") : input }),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) {
    console.error(`SQL failed (${response.status}): ${result?.message ?? JSON.stringify(result)}`);
    process.exitCode = 1;
  } else if (Array.isArray(result) && result.length) {
    console.table(result);
  } else {
    console.log(isFile ? `Applied ${input}.` : "Done.");
  }
}
