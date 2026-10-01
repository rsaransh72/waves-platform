import { createDatabaseClient } from "./db-client.mjs";


const schemaSQL = `
-- ==========================================
-- EXAMINATIONS & GRADING SCHEMA
-- ==========================================

CREATE TABLE IF NOT EXISTS public.school_exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- e.g., 'Midterm 2026'
    class_id UUID NOT NULL REFERENCES public.school_classes(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'upcoming', -- upcoming, active, completed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.school_exam_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    exam_id UUID NOT NULL REFERENCES public.school_exams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.school_students(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    marks_obtained DECIMAL(5,2) NOT NULL,
    max_marks DECIMAL(5,2) NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(exam_id, student_id, subject)
);

-- ==========================================
-- FEE MANAGEMENT & PAYMENTS SCHEMA
-- ==========================================

CREATE TABLE IF NOT EXISTS public.school_fee_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- e.g., 'Grade 10 Tuition Fee'
    amount DECIMAL(10,2) NOT NULL,
    frequency VARCHAR(50) DEFAULT 'monthly', -- monthly, quarterly, yearly
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.school_student_fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.school_students(id) ON DELETE CASCADE,
    fee_structure_id UUID NOT NULL REFERENCES public.school_fee_structures(id) ON DELETE CASCADE,
    due_date DATE NOT NULL,
    amount_due DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'pending', -- pending, partial, paid
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.school_fee_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    student_fee_id UUID NOT NULL REFERENCES public.school_student_fees(id) ON DELETE CASCADE,
    amount_paid DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    payment_method VARCHAR(100), -- cash, card, bank_transfer
    transaction_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- APPLY SECURE DEFAULT FOR ORGANIZATION ID
-- ==========================================
ALTER TABLE public.school_exams ALTER COLUMN organization_id SET DEFAULT public.get_auth_organization_id();
ALTER TABLE public.school_exam_results ALTER COLUMN organization_id SET DEFAULT public.get_auth_organization_id();
ALTER TABLE public.school_fee_structures ALTER COLUMN organization_id SET DEFAULT public.get_auth_organization_id();
ALTER TABLE public.school_student_fees ALTER COLUMN organization_id SET DEFAULT public.get_auth_organization_id();
ALTER TABLE public.school_fee_payments ALTER COLUMN organization_id SET DEFAULT public.get_auth_organization_id();

-- ==========================================
-- STRICT ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
ALTER TABLE public.school_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_student_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_fee_payments ENABLE ROW LEVEL SECURITY;

-- 1. Exams
CREATE POLICY "Strict Exams Isolation" ON public.school_exams
    FOR ALL USING (organization_id IN (
        SELECT om.organization_id FROM public.organization_members om WHERE om.user_id = auth.uid()
    ));

-- 2. Exam Results
CREATE POLICY "Strict Exam Results Isolation" ON public.school_exam_results
    FOR ALL USING (organization_id IN (
        SELECT om.organization_id FROM public.organization_members om WHERE om.user_id = auth.uid()
    ));

-- 3. Fee Structures
CREATE POLICY "Strict Fee Structures Isolation" ON public.school_fee_structures
    FOR ALL USING (organization_id IN (
        SELECT om.organization_id FROM public.organization_members om WHERE om.user_id = auth.uid()
    ));

-- 4. Student Fees
CREATE POLICY "Strict Student Fees Isolation" ON public.school_student_fees
    FOR ALL USING (organization_id IN (
        SELECT om.organization_id FROM public.organization_members om WHERE om.user_id = auth.uid()
    ));

-- 5. Fee Payments
CREATE POLICY "Strict Fee Payments Isolation" ON public.school_fee_payments
    FOR ALL USING (organization_id IN (
        SELECT om.organization_id FROM public.organization_members om WHERE om.user_id = auth.uid()
    ));
`;

async function applyAdvancedSchema() {
    const pgClient = createDatabaseClient();
  try {
    await pgClient.connect();
    console.log('Applying Advanced Exams and Fees Schema...');
    
    // First, drop existing policies just in case to avoid 'policy already exists' errors
    const tables = ['school_exams', 'school_exam_results', 'school_fee_structures', 'school_student_fees', 'school_fee_payments'];
    for (const table of tables) {
      await pgClient.query(`
        DO $$ 
        BEGIN
            IF EXISTS (
                SELECT 1 FROM pg_policies WHERE tablename = '${table}'
            ) THEN
                EXECUTE (
                    SELECT string_agg('DROP POLICY IF EXISTS "' || policyname || '" ON public.${table};', ' ')
                    FROM pg_policies WHERE tablename = '${table}'
                );
            END IF;
        END $$;
      `);
    }

    await pgClient.query(schemaSQL);
    console.log('✅ Successfully applied schema, secure defaults, and strict RLS policies.');
  } catch (err) {
    console.error('❌ Database error:', err);
  } finally {
    await pgClient.end();
  }
}

applyAdvancedSchema();
