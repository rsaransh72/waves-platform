import { createClient } from '@supabase/supabase-js';
import { createDatabaseClient } from "./db-client.mjs";

const supabaseUrl = 'https://gdbvabhstpohylajbucj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkYnZhYmhzdHBvaHlsYWpidWNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1Nzc4MDYsImV4cCI6MjEwNjE1MzgwNn0.wVbjvKHZhwt_sZpEzmPxTgyMvqM4KmFOkKBpzeONekM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);


async function createTestUser() {
  const email = 'admin@school.com';
  const password = 'password123';
  
  console.log('Signing up user via Supabase Auth...');
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    if (error.message.includes('User already registered')) {
      console.log('User already exists. Skipping signup.');
    } else {
      console.error('Signup error:', error.message);
      return;
    }
  } else {
    console.log('User created:', data.user?.id);
  }

  console.log('Signing in to get the UUID...');
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (signInError) {
    console.error('Signin error:', signInError.message);
    return;
  }

  const userId = signInData.user.id;
  console.log('Got user ID:', userId);

  console.log('Linking user to organization via pg...');
  const pgClient = createDatabaseClient();
  try {
    await pgClient.connect();
    
    // Hardcoded Dev Organization ID
    const orgId = '9767ea6f-50d7-4f89-a37b-6fb7cea0b8a9';
    
    // Make sure organization exists
    await pgClient.query(`
      INSERT INTO public.organizations (id, name, slug, type) 
      VALUES ($1, 'Dev School', 'dev-school', 'school')
      ON CONFLICT (id) DO NOTHING;
    `, [orgId]);

    // Insert organization member mapping
    await pgClient.query(`
      INSERT INTO public.organization_members (organization_id, user_id, role)
      VALUES ($1, $2, 'admin')
      ON CONFLICT (organization_id, user_id) DO NOTHING;
    `, [orgId, userId]);
    
    console.log('Successfully linked user to Dev School organization.');
    console.log(`\nTest Credentials:`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } catch (err) {
    console.error('Database error:', err);
  } finally {
    await pgClient.end();
  }
}

createTestUser();
