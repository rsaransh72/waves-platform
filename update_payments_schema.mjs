import { createDatabaseClient } from "./db-client.mjs";


async function updatePaymentsSchema() {
  const pgClient = createDatabaseClient();
  try {
    await pgClient.connect();
    console.log('Updating Fee Payments Schema for Uploads and Approvals...');
    
    // Add columns for receipt uploads and payment status (pending_approval vs completed)
    await pgClient.query(`
      ALTER TABLE public.school_fee_payments 
      ADD COLUMN IF NOT EXISTS receipt_url TEXT,
      ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'completed',
      ADD COLUMN IF NOT EXISTS uploaded_by VARCHAR(100) DEFAULT 'admin';
    `);
    
    console.log('✅ Successfully added receipt_url, status, and uploaded_by to school_fee_payments.');
  } catch (err) {
    console.error('❌ Database error:', err);
  } finally {
    await pgClient.end();
  }
}

updatePaymentsSchema();
