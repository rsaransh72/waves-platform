import { createDatabaseClient } from "./db-client.mjs";


const schemaSQL = `
DROP TABLE IF EXISTS public.audit_logs CASCADE;
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID, -- usually references auth.users(id), but can be null if system
    actor_email VARCHAR(255),
    action VARCHAR(100) NOT NULL, -- e.g., 'user.created', 'organization.updated'
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    organization_id UUID,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: In a production environment, audit logs are typically append-only and have strict RLS.
-- For the platform super-admin, we will enable RLS and add a policy to let platform admins read it.
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'audit_logs') THEN
        EXECUTE (
            SELECT string_agg('DROP POLICY IF EXISTS "' || policyname || '" ON public.audit_logs;', ' ')
            FROM pg_policies WHERE tablename = 'audit_logs'
        );
    END IF;
END $$;

-- Policy: Allow authenticated users to read audit logs
CREATE POLICY "Platform admins can read audit logs" 
ON public.audit_logs FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- We can also add an insert policy for all authenticated users, or just handle inserts via a secure backend API/Trigger.
-- For ease of development, we allow authenticated inserts.
CREATE POLICY "Authenticated users can insert audit logs" 
ON public.audit_logs FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Let's seed some mock data so the page looks good immediately.
INSERT INTO public.audit_logs (actor_email, action, resource_type, resource_id, details, ip_address, created_at)
VALUES 
('admin@platform.com', 'user.login', 'session', uuid_generate_v4(), '{"browser": "Chrome", "os": "Windows"}'::jsonb, '192.168.1.1', NOW() - INTERVAL '5 minutes'),
('john.doe@school.com', 'payment.collected', 'invoice', uuid_generate_v4(), '{"amount": 500, "method": "stripe", "status": "success"}'::jsonb, '10.0.0.5', NOW() - INTERVAL '1 hour'),
('system@platform.com', 'backup.completed', 'database', uuid_generate_v4(), '{"size": "2.4GB", "status": "success"}'::jsonb, '127.0.0.1', NOW() - INTERVAL '3 hours'),
('admin@platform.com', 'feature_flag.updated', 'feature_flag', uuid_generate_v4(), '{"flag": "school_erp", "enabled": true}'::jsonb, '192.168.1.1', NOW() - INTERVAL '1 day'),
('jane.smith@school.com', 'student.enrolled', 'student', uuid_generate_v4(), '{"student_name": "Alice Wonderland", "class": "Grade 10"}'::jsonb, '10.0.0.8', NOW() - INTERVAL '2 days');
`;

async function applyAuditLogsSchema() {
  const pgClient = createDatabaseClient();
  try {
    await pgClient.connect();
    console.log('Applying Audit Logs Schema...');
    await pgClient.query(schemaSQL);
    console.log('✅ Successfully applied audit_logs schema and RLS.');
  } catch (err) {
    console.error('❌ Database error:', err);
  } finally {
    await pgClient.end();
  }
}

applyAuditLogsSchema();
