import { createDatabaseClient } from "./db-client.mjs";
import fs from 'fs';


async function applySchema() {
  const client = createDatabaseClient();
  
  try {
    await client.connect();
    console.log('Connected to database.');
    
    const schema = fs.readFileSync('supabase/school_erp_schema.sql', 'utf8');
    
    console.log('Executing schema script...');
    await client.query(schema);
    
    console.log('Successfully applied School ERP schema!');
  } catch (err) {
    console.error('Error executing schema:', err);
  } finally {
    await client.end();
  }
}

applySchema();
