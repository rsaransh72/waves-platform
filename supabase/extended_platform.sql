-- ==============================================================================
-- Waves Technologies: Extended Platform Schema
-- Run this in your Supabase SQL Editor to support the new Admin modules.
-- ==============================================================================

-- 1. Team Members (Platform Admins)
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin', 'editor', 'support', 'viewer')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    organization_name TEXT NOT NULL,
    plan_name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'trialing')),
    next_billing_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Support Tickets
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'pending', 'resolved', 'closed')),
    assigned_to UUID REFERENCES public.team_members(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Invoices (Billing History)
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT UNIQUE NOT NULL,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    organization_name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'failed', 'refunded')),
    due_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Enable Row Level Security
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- 6. Grant Access to authenticated admin users (Platform Admins)
-- For development simplicity, we grant access to anon and authenticated
CREATE POLICY "Admin access team_members" ON public.team_members FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin access subscriptions" ON public.subscriptions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin access support_tickets" ON public.support_tickets FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin access invoices" ON public.invoices FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

GRANT ALL ON TABLE public.team_members TO anon, authenticated;
GRANT ALL ON TABLE public.subscriptions TO anon, authenticated;
GRANT ALL ON TABLE public.support_tickets TO anon, authenticated;
GRANT ALL ON TABLE public.invoices TO anon, authenticated;

-- 7. Setup Realtime Publications
BEGIN;
  -- If supabase_realtime doesn't exist, this will error. Assuming it exists.
  ALTER PUBLICATION supabase_realtime ADD TABLE team_members, subscriptions, support_tickets, invoices;
COMMIT;

ALTER TABLE public.team_members REPLICA IDENTITY FULL;
ALTER TABLE public.subscriptions REPLICA IDENTITY FULL;
ALTER TABLE public.support_tickets REPLICA IDENTITY FULL;
ALTER TABLE public.invoices REPLICA IDENTITY FULL;

-- 8. Add Audit Triggers
CREATE TRIGGER audit_trigger_team_members
    AFTER INSERT OR UPDATE OR DELETE ON public.team_members
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_trigger_subscriptions
    AFTER INSERT OR UPDATE OR DELETE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_trigger_support_tickets
    AFTER INSERT OR UPDATE OR DELETE ON public.support_tickets
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_trigger_invoices
    AFTER INSERT OR UPDATE OR DELETE ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

-- Force PostgREST schema reload
NOTIFY pgrst, 'reload schema';
