import { createDatabaseClient } from "./db-client.mjs";
import fs from 'fs';


async function applyProductionRLS() {
  const client = createDatabaseClient();
  
  try {
    await client.connect();
    console.log('Connected to database.');
    
    const schema = fs.readFileSync('supabase/school_erp_rls_production.sql', 'utf8');
    
    console.log('Executing production RLS script...');
    await client.query(schema);
    
    console.log('Successfully applied Strict Production RLS!');
  } catch (err) {
    console.error('Error executing schema:', err);
  } finally {
    await client.end();
  }
}

applyProductionRLS();
