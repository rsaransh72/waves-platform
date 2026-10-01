// Applies a SQL file to the database in DATABASE_URL (from .env.local).
// Usage: node scripts/db/run-sql.mjs supabase/<file>.sql
import fs from "node:fs";
import { createDatabaseClient } from "../../db-client.mjs";

const file = process.argv[2];
if (!file || !fs.existsSync(file)) {
  console.error("Usage: node scripts/db/run-sql.mjs <path-to-sql-file>");
  process.exit(1);
}

const client = createDatabaseClient();
await client.connect();
try {
  const result = await client.query(fs.readFileSync(file, "utf8"));
  const results = Array.isArray(result) ? result : [result];
  const last = results.at(-1);
  console.log(`Applied ${file} (${results.length} statements).`);
  if (last?.rows?.length) console.table(last.rows);
} catch (error) {
  console.error(`Failed to apply ${file}: ${error.message}`);
  process.exitCode = 1;
} finally {
  await client.end();
}
