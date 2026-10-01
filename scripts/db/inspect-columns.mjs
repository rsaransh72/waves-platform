// Read-only: prints the columns (type, nullability, default) of public tables.
// Usage: node scripts/db/inspect-columns.mjs [table-prefix]   e.g. school_
import { createDatabaseClient } from "../../db-client.mjs";

const prefix = process.argv[2] ?? "";
const client = createDatabaseClient();
await client.connect();
try {
  const { rows } = await client.query(
    `select table_name, column_name, data_type, is_nullable, column_default
     from information_schema.columns
     where table_schema = 'public' and table_name like $1
     order by table_name, ordinal_position`,
    [`${prefix}%`]
  );
  let current = "";
  for (const row of rows) {
    if (row.table_name !== current) {
      current = row.table_name;
      console.log(`\n${current}`);
    }
    const nullable = row.is_nullable === "NO" ? " NOT NULL" : "";
    const fallback = row.column_default ? ` = ${row.column_default.slice(0, 40)}` : "";
    console.log(`  ${row.column_name} ${row.data_type}${nullable}${fallback}`);
  }
  const { rows: checks } = await client.query(
    `select conrelid::regclass::text as table_name, pg_get_constraintdef(oid) as definition
     from pg_constraint where contype = 'c' and connamespace = 'public'::regnamespace
       and conrelid::regclass::text like $1 order by 1`,
    [`${prefix}%`]
  );
  console.log("\nCHECK constraints:");
  for (const check of checks) console.log(`  ${check.table_name}: ${check.definition}`);

  const { rows: uniques } = await client.query(
    `select tablename as table_name, indexdef as definition from pg_indexes
     where schemaname = 'public' and tablename like $1 and indexdef ilike 'create unique%' and indexname not like '%_pkey'
     order by 1`,
    [`${prefix}%`]
  );
  console.log("\nUnique indexes:");
  for (const unique of uniques) console.log(`  ${unique.table_name}: ${unique.definition.replace(/^.* USING btree /, "")}`);
} finally {
  await client.end();
}
