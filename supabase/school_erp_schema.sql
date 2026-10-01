-- ==============================================================================
-- Waves Technologies: School ERP Module Schema
-- Target Database: Supabase PostgreSQL
-- ==============================================================================

-- 1. School Teachers Table
CREATE TABLE IF NOT EXISTS public.school_teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    employee_id TEXT NOT NULL,
    primary_subject TEXT,
    email TEXT,
    phone TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. School Classes Table
CREATE TABLE IF NOT EXISTS public.school_classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., 'Grade 10'
    section TEXT NOT NULL, -- e.g., 'A'
    class_teacher_id UUID REFERENCES public.school_teachers(id) ON DELETE SET NULL,
    room_number TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(organization_id, name, section)
);

-- 3. School Students Table
CREATE TABLE IF NOT EXISTS public.school_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    roll_number TEXT NOT NULL,
    class_id UUID NOT NULL REFERENCES public.school_classes(id) ON DELETE CASCADE,
    parent_phone TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(organization_id, roll_number)
);

-- 4. School Attendance Table
CREATE TABLE IF NOT EXISTS public.school_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.school_students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.school_classes(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
    marked_by UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(student_id, date)
);

-- Enable RLS
ALTER TABLE public.school_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_attendance ENABLE ROW LEVEL SECURITY;

-- Grant Permissions
GRANT ALL ON TABLE public.school_teachers TO anon, authenticated;
GRANT ALL ON TABLE public.school_classes TO anon, authenticated;
GRANT ALL ON TABLE public.school_students TO anon, authenticated;
GRANT ALL ON TABLE public.school_attendance TO anon, authenticated;

-- Force PostgREST to immediately reload schema cache
NOTIFY pgrst, 'reload schema';
