import { createDatabaseClient } from "./db-client.mjs";


const schemaSQL = `
-- ==========================================
-- 1. COMMUNICATIONS SCHEMA
-- ==========================================
CREATE TABLE IF NOT EXISTS public.school_communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'notice', 'sms', 'email'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    audience VARCHAR(100) NOT NULL, -- 'all', 'teachers', 'parents', 'class:uuid'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. LIBRARY MANAGEMENT SCHEMA
-- ==========================================
CREATE TABLE IF NOT EXISTS public.school_library_books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    isbn VARCHAR(100),
    quantity INTEGER DEFAULT 1,
    available INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.school_library_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES public.school_library_books(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.school_students(id) ON DELETE CASCADE,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    return_date DATE,
    status VARCHAR(50) DEFAULT 'issued', -- 'issued', 'returned', 'overdue'
    fine_amount DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 3. TIMETABLE & SCHEDULING SCHEMA
-- ==========================================
CREATE TABLE IF NOT EXISTS public.school_timetables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.school_classes(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.school_teachers(id) ON DELETE CASCADE,
    day_of_week VARCHAR(20) NOT NULL, -- 'Monday', 'Tuesday', etc.
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    subject VARCHAR(100) NOT NULL,
    room_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 4. TRANSPORTATION SCHEMA
-- ==========================================
CREATE TABLE IF NOT EXISTS public.school_transport_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    route_name VARCHAR(255) NOT NULL,
    vehicle_number VARCHAR(100) NOT NULL,
    driver_name VARCHAR(255),
    driver_phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.school_transport_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    route_id UUID NOT NULL REFERENCES public.school_transport_routes(id) ON DELETE CASCADE,
    stop_name VARCHAR(255) NOT NULL,
    pickup_time TIME NOT NULL,
    drop_time TIME NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.school_transport_students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.school_students(id) ON DELETE CASCADE,
    stop_id UUID NOT NULL REFERENCES public.school_transport_stops(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id) -- one student can only have one primary transport stop
);


-- ==========================================
-- APPLY SECURE DEFAULT FOR ORGANIZATION ID
-- ==========================================
ALTER TABLE public.school_communications ALTER COLUMN organization_id SET DEFAULT public.get_auth_organization_id();
ALTER TABLE public.school_library_books ALTER COLUMN organization_id SET DEFAULT public.get_auth_organization_id();
ALTER TABLE public.school_library_issues ALTER COLUMN organization_id SET DEFAULT public.get_auth_organization_id();
ALTER TABLE public.school_timetables ALTER COLUMN organization_id SET DEFAULT public.get_auth_organization_id();
ALTER TABLE public.school_transport_routes ALTER COLUMN organization_id SET DEFAULT public.get_auth_organization_id();
ALTER TABLE public.school_transport_stops ALTER COLUMN organization_id SET DEFAULT public.get_auth_organization_id();
ALTER TABLE public.school_transport_students ALTER COLUMN organization_id SET DEFAULT public.get_auth_organization_id();


-- ==========================================
-- STRICT ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
ALTER TABLE public.school_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_library_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_transport_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_transport_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_transport_students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Strict Communications Isolation" ON public.school_communications FOR ALL USING (organization_id IN (SELECT om.organization_id FROM public.organization_members om WHERE om.user_id = auth.uid()));
CREATE POLICY "Strict Library Books Isolation" ON public.school_library_books FOR ALL USING (organization_id IN (SELECT om.organization_id FROM public.organization_members om WHERE om.user_id = auth.uid()));
CREATE POLICY "Strict Library Issues Isolation" ON public.school_library_issues FOR ALL USING (organization_id IN (SELECT om.organization_id FROM public.organization_members om WHERE om.user_id = auth.uid()));
CREATE POLICY "Strict Timetables Isolation" ON public.school_timetables FOR ALL USING (organization_id IN (SELECT om.organization_id FROM public.organization_members om WHERE om.user_id = auth.uid()));
CREATE POLICY "Strict Transport Routes Isolation" ON public.school_transport_routes FOR ALL USING (organization_id IN (SELECT om.organization_id FROM public.organization_members om WHERE om.user_id = auth.uid()));
CREATE POLICY "Strict Transport Stops Isolation" ON public.school_transport_stops FOR ALL USING (organization_id IN (SELECT om.organization_id FROM public.organization_members om WHERE om.user_id = auth.uid()));
CREATE POLICY "Strict Transport Students Isolation" ON public.school_transport_students FOR ALL USING (organization_id IN (SELECT om.organization_id FROM public.organization_members om WHERE om.user_id = auth.uid()));

`;

async function applyAdvancedSchema() {
  const pgClient = createDatabaseClient();
  try {
    await pgClient.connect();
    console.log('Applying Full ERP Schema extensions...');
    
    // First, drop existing policies just in case
    const tables = ['school_communications', 'school_library_books', 'school_library_issues', 'school_timetables', 'school_transport_routes', 'school_transport_stops', 'school_transport_students'];
    for (const table of tables) {
      await pgClient.query(`
        DO $$ 
        BEGIN
            IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = '${table}') THEN
                EXECUTE (
                    SELECT string_agg('DROP POLICY IF EXISTS "' || policyname || '" ON public.${table};', ' ')
                    FROM pg_policies WHERE tablename = '${table}'
                );
            END IF;
        END $$;
      `);
    }

    await pgClient.query(schemaSQL);
    console.log('✅ Successfully applied full ERP schema, secure defaults, and strict RLS policies.');
  } catch (err) {
    console.error('❌ Database error:', err);
  } finally {
    await pgClient.end();
  }
}

applyAdvancedSchema();
