import { createDatabaseClient } from "./db-client.mjs";

const c = createDatabaseClient();

c.connect()
  .then(() => c.query(`SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name IN ('organizations', 'team_members', 'organization_members')`))
  .then(res => console.log(res.rows))
  .finally(() => c.end());
