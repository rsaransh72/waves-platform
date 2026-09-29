-- ==============================================================================
-- Waves Technologies: Core Database Schema & Lead Intake Migration
-- Target Database: Supabase PostgreSQL (Project: gdbvabhstpohylajbucj)
-- ==============================================================================

-- 1. Organizations Table
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('school', 'hospital', 'pharmacy', 'other')),
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'trial')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Organization Members Table
CREATE TABLE IF NOT EXISTS public.organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'doctor', 'teacher', 'pharmacist', 'staff', 'member')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Leads & Demo Requests Table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    organization_name TEXT,
    product TEXT NOT NULL,
    city TEXT,
    team_size TEXT,
    message TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'demo_scheduled', 'converted', 'closed')),
    source TEXT DEFAULT 'website_demo_form',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Leads RLS Policies: Allow public anonymous and authenticated users to submit leads/demo requests
DROP POLICY IF EXISTS "Public can submit leads" ON public.leads;
CREATE POLICY "Public can submit leads" ON public.leads
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Ensure anon and authenticated have usage on schema and table permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.leads TO anon, authenticated;
GRANT ALL ON TABLE public.organizations TO anon, authenticated;
GRANT ALL ON TABLE public.organization_members TO anon, authenticated;

-- Force PostgREST to immediately reload schema cache
NOTIFY pgrst, 'reload schema';
