// Read-only summary of security state: RLS per table, policies open to anon/public,
// applied migration markers, and row counts (no row contents).
import { createDatabaseClient } from "../../db-client.mjs";

const client = createDatabaseClient();
await client.connect();
const query = async (sql) => (await client.query(sql)).rows;
try {
  console.log("Tables without row level security:");
  console.table(await query(`select c.relname as table from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity order by 1`));
  console.log("Policies open to anon or public:");
  console.table(await query(`select tablename, policyname, cmd, left(coalesce(qual, with_check, ''), 40) as condition
    from pg_policies where schemaname = 'public' and ('anon' = any(roles) or 'public' = any(roles)) order by 1, 2`));
  console.log("Migration markers:");
  console.table(await query(`select
    exists(select 1 from pg_policies where policyname = 'school_tenant_access') as production_access_policies,
    exists(select 1 from information_schema.columns where table_name = 'subscriptions' and column_name = 'reminder_sent_at') as subscription_lifecycle,
    exists(select 1 from pg_policies where tablename = 'leads' and policyname = 'public_submit_leads') as public_cms_policies,
    exists(select 1 from information_schema.columns where table_name = 'invoices' and column_name = 'paid_at') as client_management`));
  console.log("Accounts:");
  console.table(await query(`select
    (select count(*) from organizations)::int as organizations,
    (select count(*) from organization_members)::int as members,
    (select count(*) from team_members where status = 'active' and role in ('superadmin', 'admin'))::int as platform_admins`));
} finally {
  await client.end();
}
