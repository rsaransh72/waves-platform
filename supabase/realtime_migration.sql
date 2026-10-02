-- 1. Feature Flags Table
CREATE TABLE IF NOT EXISTS public.feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    key TEXT UNIQUE NOT NULL,
    description TEXT,
    is_enabled BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- Allow Admin access to feature flags
DROP POLICY IF EXISTS "Admin full access feature flags" ON public.feature_flags;
CREATE POLICY "Admin full access feature flags" ON public.feature_flags
    FOR ALL TO anon, authenticated
    USING (true) WITH CHECK (true);
    
GRANT ALL ON TABLE public.feature_flags TO anon, authenticated;

-- Organizations Table
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin full access organizations" ON public.organizations;
CREATE POLICY "Admin full access organizations" ON public.organizations
    FOR ALL TO anon, authenticated
    USING (true) WITH CHECK (true);
GRANT ALL ON TABLE public.organizations TO anon, authenticated;

-- Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    organization_name TEXT,
    product TEXT,
    city TEXT,
    team_size TEXT,
    message TEXT,
    status TEXT DEFAULT 'new',
    source TEXT DEFAULT 'website_demo_form',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin full access leads" ON public.leads;
CREATE POLICY "Admin full access leads" ON public.leads
    FOR ALL TO anon, authenticated
    USING (true) WITH CHECK (true);
GRANT ALL ON TABLE public.leads TO anon, authenticated;

-- Enable Realtime
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE 
    products, 
    suites, 
    audit_logs,
    organizations,
    leads,
    feature_flags;
COMMIT;

-- Use REPLICA IDENTITY FULL for complete OLD row info
ALTER TABLE public.products REPLICA IDENTITY FULL;
ALTER TABLE public.suites REPLICA IDENTITY FULL;
ALTER TABLE public.audit_logs REPLICA IDENTITY FULL;
ALTER TABLE public.organizations REPLICA IDENTITY FULL;
ALTER TABLE public.leads REPLICA IDENTITY FULL;
ALTER TABLE public.feature_flags REPLICA IDENTITY FULL;

-- Create Audit Trigger Function
CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS TRIGGER AS $$
DECLARE
    v_previous_value JSONB;
    v_new_value JSONB;
    v_record JSONB;
BEGIN
    IF TG_OP = 'INSERT' THEN
        v_previous_value := NULL;
        v_new_value := to_jsonb(NEW);
        v_record := v_new_value;
    ELSIF TG_OP = 'UPDATE' THEN
        v_previous_value := to_jsonb(OLD);
        v_new_value := to_jsonb(NEW);
        v_record := v_new_value;
    ELSIF TG_OP = 'DELETE' THEN
        v_previous_value := to_jsonb(OLD);
        v_new_value := NULL;
        v_record := v_previous_value;
    END IF;

    IF TG_OP = 'UPDATE' AND v_previous_value = v_new_value THEN
        RETURN NEW;
    END IF;

    INSERT INTO public.audit_logs (
        actor_id,
        actor_email,
        action,
        resource_type,
        resource_id,
        organization_id,
        details
    ) VALUES (
        auth.uid(),
        NULLIF(auth.jwt()->>'email', ''),
        TG_OP,
        TG_TABLE_NAME,
        NULLIF(v_record->>'id', '')::UUID,
        NULLIF(v_record->>'organization_id', '')::UUID,
        jsonb_build_object('previous_value', v_previous_value, 'new_value', v_new_value)
    );

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public;

-- Apply Audit Triggers to important tables
DROP TRIGGER IF EXISTS audit_trigger_products ON public.products;
CREATE TRIGGER audit_trigger_products
    AFTER INSERT OR UPDATE OR DELETE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

DROP TRIGGER IF EXISTS audit_trigger_suites ON public.suites;
CREATE TRIGGER audit_trigger_suites
    AFTER INSERT OR UPDATE OR DELETE ON public.suites
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

DROP TRIGGER IF EXISTS audit_trigger_organizations ON public.organizations;
CREATE TRIGGER audit_trigger_organizations
    AFTER INSERT OR UPDATE OR DELETE ON public.organizations
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

DROP TRIGGER IF EXISTS audit_trigger_leads ON public.leads;
CREATE TRIGGER audit_trigger_leads
    AFTER INSERT OR UPDATE OR DELETE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

DROP TRIGGER IF EXISTS audit_trigger_feature_flags ON public.feature_flags;
CREATE TRIGGER audit_trigger_feature_flags
    AFTER INSERT OR UPDATE OR DELETE ON public.feature_flags
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();
