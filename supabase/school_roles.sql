-- School roles: what administrators, teachers and office staff may read and change.
-- Replaces the single school_tenant_access policy on each school table with a read
-- policy and a write policy. Apply after production_access_policies.sql.
--
--   admin (and owner)  everything
--   teacher            attendance, exams and results, communications; reads the rest except fees
--   staff (office)     students, fees, library, transport, communications; reads the rest
--   member             read-only, no fees

CREATE OR REPLACE FUNCTION public.get_auth_school_role()
RETURNS TEXT
LANGUAGE PLPGSQL
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  member_role TEXT;
BEGIN
  SELECT member.role INTO member_role
  FROM public.organization_members AS member
  WHERE member.user_id = auth.uid()
    AND member.organization_id = public.get_auth_organization_id();

  IF member_role = 'owner' THEN
    RETURN 'admin';
  END IF;
  RETURN member_role;
END;
$$;

REVOKE ALL ON FUNCTION public.get_auth_school_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_auth_school_role() TO authenticated;

DO $$
DECLARE
  policy_row RECORD;
  rule RECORD;
BEGIN
  FOR rule IN
    SELECT * FROM (VALUES
      -- table,                      read roles (NULL = every member),   write roles
      ('school_settings',            NULL::TEXT[],                        ARRAY['admin']),
      ('school_teachers',            NULL,                                ARRAY['admin']),
      ('school_classes',             NULL,                                ARRAY['admin']),
      ('school_timetables',          NULL,                                ARRAY['admin']),
      ('school_students',            NULL,                                ARRAY['admin', 'staff']),
      ('school_attendance',          NULL,                                ARRAY['admin', 'teacher']),
      ('school_exams',               NULL,                                ARRAY['admin', 'teacher']),
      ('school_exam_results',        NULL,                                ARRAY['admin', 'teacher']),
      ('school_communications',      NULL,                                ARRAY['admin', 'teacher', 'staff']),
      ('school_library_books',       NULL,                                ARRAY['admin', 'staff']),
      ('school_library_issues',      NULL,                                ARRAY['admin', 'staff']),
      ('school_transport_routes',    NULL,                                ARRAY['admin', 'staff']),
      ('school_transport_stops',     NULL,                                ARRAY['admin', 'staff']),
      ('school_transport_students',  NULL,                                ARRAY['admin', 'staff']),
      ('school_fee_structures',      ARRAY['admin', 'staff'],             ARRAY['admin']),
      ('school_student_fees',        ARRAY['admin', 'staff'],             ARRAY['admin', 'staff']),
      ('school_fee_payments',        ARRAY['admin', 'staff'],             ARRAY['admin', 'staff'])
    ) AS rules(target_table, read_roles, write_roles)
  LOOP
    IF to_regclass(format('public.%I', rule.target_table)) IS NULL THEN
      CONTINUE;
    END IF;

    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', rule.target_table);
    FOR policy_row IN
      SELECT policyname FROM pg_policies AS existing_policy
      WHERE existing_policy.schemaname = 'public' AND existing_policy.tablename = rule.target_table
    LOOP
      EXECUTE format('DROP POLICY %I ON public.%I', policy_row.policyname, rule.target_table);
    END LOOP;

    EXECUTE format(
      'CREATE POLICY school_read ON public.%I FOR SELECT TO authenticated USING (organization_id = public.get_auth_organization_id()%s)',
      rule.target_table,
      CASE WHEN rule.read_roles IS NULL THEN ''
           ELSE format(' AND public.get_auth_school_role() = ANY (%L::TEXT[])', rule.read_roles) END
    );
    EXECUTE format(
      'CREATE POLICY school_write ON public.%1$I FOR ALL TO authenticated USING (organization_id = public.get_auth_organization_id() AND public.get_auth_school_role() = ANY (%2$L::TEXT[])) WITH CHECK (organization_id = public.get_auth_organization_id() AND public.get_auth_school_role() = ANY (%2$L::TEXT[]))',
      rule.target_table,
      rule.write_roles
    );
  END LOOP;
END;
$$;

NOTIFY pgrst, 'reload schema';
