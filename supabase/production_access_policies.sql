CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.team_members AS member
    WHERE lower(member.email) = lower(auth.jwt() ->> 'email')
      AND member.status = 'active'
      AND member.role IN ('superadmin', 'admin')
  );
$$;

CREATE OR REPLACE FUNCTION public.get_auth_organization_id()
RETURNS UUID
LANGUAGE PLPGSQL
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  membership_count INTEGER;
  organization_id UUID;
BEGIN
  SELECT count(*), (array_agg(member.organization_id ORDER BY member.created_at))[1]
  INTO membership_count, organization_id
  FROM public.organization_members AS member
  JOIN public.organizations AS organization ON organization.id = member.organization_id
  WHERE member.user_id = auth.uid()
    AND member.role IN ('owner', 'admin', 'teacher', 'staff', 'member')
    AND organization.type = 'school'
    AND organization.status = 'active';

  IF membership_count <> 1 THEN
    RETURN NULL;
  END IF;

  RETURN organization_id;
END;
$$;

REVOKE ALL ON FUNCTION public.is_platform_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_auth_organization_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_platform_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_auth_organization_id() TO authenticated;

DO $$
DECLARE
  policy_row RECORD;
  target_table TEXT;
BEGIN
  IF to_regclass('public.team_members') IS NOT NULL THEN
    ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
    FOR policy_row IN
      SELECT policyname FROM pg_policies
      WHERE schemaname = 'public' AND tablename = 'team_members'
    LOOP
      EXECUTE format('DROP POLICY %I ON public.team_members', policy_row.policyname);
    END LOOP;
    CREATE POLICY platform_admins_manage_team ON public.team_members
      FOR ALL TO authenticated
      USING (public.is_platform_admin())
      WITH CHECK (public.is_platform_admin());
    CREATE POLICY team_members_read_self ON public.team_members
      FOR SELECT TO authenticated
      USING (lower(email) = lower(auth.jwt() ->> 'email'));
  END IF;

  IF to_regclass('public.organizations') IS NOT NULL THEN
    ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
    FOR policy_row IN
      SELECT policyname FROM pg_policies
      WHERE schemaname = 'public' AND tablename = 'organizations'
    LOOP
      EXECUTE format('DROP POLICY %I ON public.organizations', policy_row.policyname);
    END LOOP;
    CREATE POLICY platform_admins_manage_organizations ON public.organizations
      FOR ALL TO authenticated
      USING (public.is_platform_admin())
      WITH CHECK (public.is_platform_admin());
    CREATE POLICY school_members_read_own_organization ON public.organizations
      FOR SELECT TO authenticated
      USING (id = public.get_auth_organization_id());
  END IF;

  IF to_regclass('public.organization_members') IS NOT NULL THEN
    ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
    FOR policy_row IN
      SELECT policyname FROM pg_policies
      WHERE schemaname = 'public' AND tablename = 'organization_members'
    LOOP
      EXECUTE format('DROP POLICY %I ON public.organization_members', policy_row.policyname);
    END LOOP;
    CREATE POLICY platform_admins_manage_memberships ON public.organization_members
      FOR ALL TO authenticated
      USING (public.is_platform_admin())
      WITH CHECK (public.is_platform_admin());
    CREATE POLICY users_read_own_memberships ON public.organization_members
      FOR SELECT TO authenticated
      USING (user_id = auth.uid());
  END IF;

  FOREACH target_table IN ARRAY ARRAY[
    'school_teachers', 'school_classes', 'school_students', 'school_attendance',
    'school_exams', 'school_exam_results', 'school_fee_structures',
    'school_student_fees', 'school_fee_payments', 'school_communications',
    'school_library_books', 'school_library_issues', 'school_timetables',
    'school_transport_routes', 'school_transport_stops', 'school_transport_students',
    'school_settings'
  ] LOOP
    IF to_regclass(format('public.%I', target_table)) IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM information_schema.columns AS column_info
        WHERE column_info.table_schema = 'public' AND column_info.table_name = target_table
          AND column_info.column_name = 'organization_id'
      ) THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', target_table);
      EXECUTE format(
        'ALTER TABLE public.%I ALTER COLUMN organization_id SET DEFAULT public.get_auth_organization_id()',
        target_table
      );
      FOR policy_row IN
        SELECT policyname FROM pg_policies AS existing_policy
        WHERE existing_policy.schemaname = 'public' AND existing_policy.tablename = target_table
      LOOP
        EXECUTE format('DROP POLICY %I ON public.%I', policy_row.policyname, target_table);
      END LOOP;
      EXECUTE format(
        'CREATE POLICY school_tenant_access ON public.%I FOR ALL TO authenticated USING (organization_id = public.get_auth_organization_id()) WITH CHECK (organization_id = public.get_auth_organization_id())',
        target_table
      );
    END IF;
  END LOOP;

  FOREACH target_table IN ARRAY ARRAY[
    'subscriptions', 'invoices', 'support_tickets', 'feature_flags', 'audit_logs'
  ] LOOP
    IF to_regclass(format('public.%I', target_table)) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', target_table);
      FOR policy_row IN
        SELECT policyname FROM pg_policies AS existing_policy
        WHERE existing_policy.schemaname = 'public' AND existing_policy.tablename = target_table
      LOOP
        EXECUTE format('DROP POLICY %I ON public.%I', policy_row.policyname, target_table);
      END LOOP;
      EXECUTE format(
        'CREATE POLICY platform_admin_access ON public.%I FOR ALL TO authenticated USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin())',
        target_table
      );
    END IF;
  END LOOP;
END;
$$;

NOTIFY pgrst, 'reload schema';