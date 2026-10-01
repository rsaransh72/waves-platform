import { createDatabaseClient } from "./db-client.mjs";


const schemaSQL = `
-- ==========================================
-- SCHOOL SETTINGS SCHEMA
-- ==========================================
CREATE TABLE IF NOT EXISTS public.school_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    school_name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    address TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    currency VARCHAR(10) DEFAULT 'USD',
    stripe_account_id VARCHAR(255), -- For Stripe Connect or storing keys securely (in real app, keys go in secure vault)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(organization_id)
);

ALTER TABLE public.school_settings ALTER COLUMN organization_id SET DEFAULT public.get_auth_organization_id();
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'school_settings') THEN
        EXECUTE (
            SELECT string_agg('DROP POLICY IF EXISTS "' || policyname || '" ON public.school_settings;', ' ')
            FROM pg_policies WHERE tablename = 'school_settings'
        );
    END IF;
END $$;

CREATE POLICY "Strict School Settings Isolation" ON public.school_settings FOR ALL USING (organization_id IN (SELECT om.organization_id FROM public.organization_members om WHERE om.user_id = auth.uid()));

-- We also need to add policies so unauthenticated users (like Parents accessing portal) can read the settings for a given org.
-- Wait, the parent portal relies on a student_id, which links to an organization. 
-- We can create a secure read policy for the portal. For now, we will just allow authenticated users.
`;

async function applySettingsSchema() {
  const pgClient = createDatabaseClient();
  try {
    await pgClient.connect();
    console.log('Applying School Settings Schema...');
    await pgClient.query(schemaSQL);
    console.log('✅ Successfully applied school_settings schema and RLS.');
  } catch (err) {
    console.error('❌ Database error:', err);
  } finally {
    await pgClient.end();
  }
}

applySettingsSchema();
