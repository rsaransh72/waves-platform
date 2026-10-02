// Deletes everything the simulation created: clients (and their school data), leads,
// logins and team members whose email or slug carries the "qasim" tag.
//
// Usage: node scripts/qa/sim/cleanup.mjs
import { TAG, service } from "./lib.mjs";

const pattern = `%+${TAG}%`;
const { data: organizations } = await service.from("organizations").select("id, name").or(`slug.like.${TAG}-%,email.ilike.${pattern}`);
const organizationIds = (organizations ?? []).map((organization) => organization.id);

// Leads converted into clients point at the client; delete leads first.
const { data: leads } = await service.from("leads").delete().ilike("email", pattern).select("id");
console.log(`Leads deleted: ${leads?.length ?? 0}`);

if (organizationIds.length) {
  const { error } = await service.from("organizations").delete().in("id", organizationIds);
  if (error) throw error;
}
console.log(`Clients deleted: ${organizationIds.length} (${(organizations ?? []).map((organization) => organization.name).join(", ")})`);

// Confirm the school data went with them.
for (const table of ["school_students", "school_teachers", "school_classes", "school_attendance", "school_fee_payments", "subscriptions", "organization_members", "school_settings"]) {
  if (!organizationIds.length) break;
  const { count } = await service.from(table).select("*", { count: "exact", head: true }).in("organization_id", organizationIds);
  if (count) console.log(`  WARNING: ${count} rows left in ${table}`);
}

const { data: team } = await service.from("team_members").delete().ilike("email", pattern).select("id");
console.log(`Team members deleted: ${team?.length ?? 0}`);

let removed = 0;
for (let page = 1; ; page += 1) {
  const { data } = await service.auth.admin.listUsers({ page, perPage: 1000 });
  const users = data?.users ?? [];
  for (const user of users.filter((item) => item.email?.includes(`+${TAG}-`))) {
    const { error } = await service.auth.admin.deleteUser(user.id);
    if (error) console.log(`  Could not delete ${user.email}: ${error.message}`); else removed += 1;
  }
  if (users.length < 1000) break;
}
console.log(`Logins deleted: ${removed}`);
