// Read-only: what the public website's content tables hold (titles, slugs, status),
// and lead counts by status. No personal data is printed.
import { createDatabaseClient } from "../../db-client.mjs";

const client = createDatabaseClient();
await client.connect();
try {
  for (const table of ["products", "suites", "marketplaceitems", "services", "pages"]) {
    const exists = (await client.query("select to_regclass($1) as t", [`public.${table}`])).rows[0].t;
    if (!exists) { console.log(`\n${table}: (missing)`); continue; }
    const { rows } = await client.query(`select slug, title, status from public.${table} order by slug`);
    console.log(`\n${table} (${rows.length})`);
    for (const row of rows) console.log(`  ${row.status.padEnd(10)} ${row.slug}  —  ${row.title}`);
  }
  const { rows: menus } = await client.query("select name, jsonb_array_length(coalesce(items::jsonb, '[]'::jsonb)) as items from public.menus");
  console.log("\nmenus");
  for (const menu of menus) console.log(`  ${menu.name}: ${menu.items} top-level items`);
  const { rows: menuItems } = await client.query("select items from public.menus where name = 'Main Navbar'");
  if (menuItems[0]) console.log(JSON.stringify(menuItems[0].items, null, 1).slice(0, 3000));
  const { rows: leadColumns } = await client.query("select column_name, data_type from information_schema.columns where table_name = 'leads' order by ordinal_position");
  console.log("\nleads columns:", leadColumns.map((c) => c.column_name).join(", "));
  const { rows: leads } = await client.query("select status, count(*)::int as n from public.leads group by 1");
  console.log("leads by status:", leads);
} finally {
  await client.end();
}
