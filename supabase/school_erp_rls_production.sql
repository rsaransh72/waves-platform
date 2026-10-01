-- ==============================================================================
-- Waves Technologies: School ERP Production RLS Implementation
-- Target Database: Supabase PostgreSQL
-- ==============================================================================

-- 1. Ensure organization_members exists (fixes the missing table from earlier)
CREATE TABLE IF NOT EXISTS public.organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- Ties to auth.users(id)
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'teacher', 'staff', 'member')),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(organization_id, user_id)
);

-- 2. Create the RLS Security Definer Function
-- This securely fetches the current user's organization_id based on their Supabase Auth session
CREATE OR REPLACE FUNCTION public.get_auth_organization_id()
RETURNS UUID AS $$
DECLARE
  org_id UUID;
BEGIN
  SELECT organization_id INTO org_id 
  FROM public.organization_members 
  WHERE user_id = auth.uid() 
  LIMIT 1;
  
  RETURN org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Update the RLS policies for School Teachers
DROP POLICY IF EXISTS "Public access to school teachers" ON public.school_teachers;
CREATE POLICY "Strict Org Access Teachers" ON public.school_teachers 
FOR ALL TO authenticated 
USING (organization_id = public.get_auth_organization_id())
WITH CHECK (organization_id = public.get_auth_organization_id());

-- 4. Update the RLS policies for School Classes
DROP POLICY IF EXISTS "Public access to school classes" ON public.school_classes;
CREATE POLICY "Strict Org Access Classes" ON public.school_classes 
FOR ALL TO authenticated 
USING (organization_id = public.get_auth_organization_id())
WITH CHECK (organization_id = public.get_auth_organization_id());

-- 5. Update the RLS policies for School Students
DROP POLICY IF EXISTS "Public access to school students" ON public.school_students;
CREATE POLICY "Strict Org Access Students" ON public.school_students 
FOR ALL TO authenticated 
USING (organization_id = public.get_auth_organization_id())
WITH CHECK (organization_id = public.get_auth_organization_id());

-- 6. Update the RLS policies for School Attendance
DROP POLICY IF EXISTS "Public access to school attendance" ON public.school_attendance;
CREATE POLICY "Strict Org Access Attendance" ON public.school_attendance 
FOR ALL TO authenticated 
USING (organization_id = public.get_auth_organization_id())
WITH CHECK (organization_id = public.get_auth_organization_id());

-- 7. Securely set default organization_id for inserts
ALTER TABLE public.school_teachers ALTER COLUMN organization_id SET DEFAULT public.get_auth_organization_id();
ALTER TABLE public.school_classes ALTER COLUMN organization_id SET DEFAULT public.get_auth_organization_id();
ALTER TABLE public.school_students ALTER COLUMN organization_id SET DEFAULT public.get_auth_organization_id();
ALTER TABLE public.school_attendance ALTER COLUMN organization_id SET DEFAULT public.get_auth_organization_id();

-- Force PostgREST schema reload
NOTIFY pgrst, 'reload schema';
