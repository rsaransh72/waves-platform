// Read-only: lists triggers on auth.users and the functions they call, plus the
// current definition of is_platform_admin(). Usage: node scripts/db/inspect-auth-triggers.mjs
import { createDatabaseClient } from "../../db-client.mjs";

const client = createDatabaseClient();
await client.connect();
try {
  const { rows: triggers } = await client.query(`
    select t.tgname as trigger, p.proname as function, pg_get_functiondef(p.oid) as definition
    from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
    join pg_proc p on p.oid = t.tgfoid
    where n.nspname = 'auth' and c.relname = 'users' and not t.tgisinternal`);
  for (const trigger of triggers) {
    console.log(`\n=== trigger ${trigger.trigger} -> ${trigger.function}\n${trigger.definition}`);
  }
  if (!triggers.length) console.log("No triggers on auth.users.");

  const { rows: [admin] } = await client.query(`select pg_get_functiondef('public.is_platform_admin'::regproc) as definition`);
  console.log(`\n=== is_platform_admin()\n${admin.definition}`);

  const { rows: policies } = await client.query(`
    select tablename, policyname, roles::text, cmd, qual, with_check from pg_policies
    where schemaname = 'public' and tablename in ('team_members', 'organizations') order by 1, 2`);
  console.table(policies);
} finally {
  await client.end();
}
