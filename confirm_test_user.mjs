import { createDatabaseClient } from "./db-client.mjs";


async function confirmUser() {
  const pgClient = createDatabaseClient();
  try {
    await pgClient.connect();
    
    // Auto-confirm the user in Supabase auth
    await pgClient.query(`
      UPDATE auth.users 
      SET email_confirmed_at = now() 
      WHERE email = 'admin@school.com';
    `);
    
    // Fetch user ID
    const res = await pgClient.query(`SELECT id FROM auth.users WHERE email = 'admin@school.com'`);
    if (res.rows.length === 0) throw new Error('User not found');
    const userId = res.rows[0].id;
    
    // Link to dev organization
    const orgId = '9767ea6f-50d7-4f89-a37b-6fb7cea0b8a9';
    await pgClient.query(`
      INSERT INTO public.organizations (id, name, slug, type) 
      VALUES ($1, 'Dev School', 'dev-school', 'school')
      ON CONFLICT (id) DO NOTHING;
    `, [orgId]);

    await pgClient.query(`
      INSERT INTO public.organization_members (organization_id, user_id, role)
      VALUES ($1, $2, 'admin')
      ON CONFLICT (organization_id, user_id) DO NOTHING;
    `, [orgId, userId]);
    
    console.log('User confirmed and linked!');
  } catch (err) {
    console.error('Database error:', err);
  } finally {
    await pgClient.end();
  }
}

confirmUser();
