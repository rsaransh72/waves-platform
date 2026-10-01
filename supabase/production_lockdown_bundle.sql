-- One-shot production lockdown. Paste into Supabase → SQL Editor → Run.
-- Runs in a single transaction: if any statement fails, nothing is changed.
-- Generated from, in order: admin_role_check.sql, production_access_policies.sql,
-- subscription_lifecycle.sql, production_public_cms_policies.sql, client_management.sql.

BEGIN;

-- ==================== admin_role_check.sql ====================
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

REVOKE ALL ON FUNCTION public.is_platform_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_platform_admin() TO authenticated;



-- ==================== production_access_policies.sql ====================
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
  table_name TEXT;
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

  FOREACH table_name IN ARRAY ARRAY[
    'school_teachers', 'school_classes', 'school_students', 'school_attendance',
    'school_exams', 'school_exam_results', 'school_fee_structures',
    'school_student_fees', 'school_fee_payments', 'school_communications',
    'school_library_books', 'school_library_issues', 'school_timetables',
    'school_transport_routes', 'school_transport_stops', 'school_transport_students',
    'school_settings'
  ] LOOP
    IF to_regclass(format('public.%I', table_name)) IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM information_schema.columns AS column_info
        WHERE column_info.table_schema = 'public' AND column_info.table_name = table_name
          AND column_info.column_name = 'organization_id'
      ) THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
      EXECUTE format(
        'ALTER TABLE public.%I ALTER COLUMN organization_id SET DEFAULT public.get_auth_organization_id()',
        table_name
      );
      FOR policy_row IN
        SELECT policyname FROM pg_policies AS existing_policy
        WHERE existing_policy.schemaname = 'public' AND existing_policy.tablename = table_name
      LOOP
        EXECUTE format('DROP POLICY %I ON public.%I', policy_row.policyname, table_name);
      END LOOP;
      EXECUTE format(
        'CREATE POLICY school_tenant_access ON public.%I FOR ALL TO authenticated USING (organization_id = public.get_auth_organization_id()) WITH CHECK (organization_id = public.get_auth_organization_id())',
        table_name
      );
    END IF;
  END LOOP;

  FOREACH table_name IN ARRAY ARRAY[
    'subscriptions', 'invoices', 'support_tickets', 'feature_flags', 'audit_logs'
  ] LOOP
    IF to_regclass(format('public.%I', table_name)) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
      FOR policy_row IN
        SELECT policyname FROM pg_policies AS existing_policy
        WHERE existing_policy.schemaname = 'public' AND existing_policy.tablename = table_name
      LOOP
        EXECUTE format('DROP POLICY %I ON public.%I', policy_row.policyname, table_name);
      END LOOP;
      EXECUTE format(
        'CREATE POLICY platform_admin_access ON public.%I FOR ALL TO authenticated USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin())',
        table_name
      );
    END IF;
  END LOOP;
END;
$$;



-- ==================== subscription_lifecycle.sql ====================
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS subscriptions_lifecycle_due_idx
  ON public.subscriptions (status, next_billing_date);

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
    AND organization.status IN ('active', 'trial');

  IF membership_count <> 1 THEN
    RETURN NULL;
  END IF;

  RETURN organization_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_auth_client_organization_id()
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
    AND organization.status IN ('active', 'trial');

  IF membership_count <> 1 THEN
    RETURN NULL;
  END IF;

  RETURN organization_id;
END;
$$;

REVOKE ALL ON FUNCTION public.get_auth_client_organization_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_auth_client_organization_id() TO authenticated;

DROP POLICY IF EXISTS client_members_read_own_organization ON public.organizations;
CREATE POLICY client_members_read_own_organization ON public.organizations
  FOR SELECT TO authenticated
  USING (id = public.get_auth_client_organization_id());

DROP POLICY IF EXISTS client_members_read_members ON public.organization_members;
CREATE POLICY client_members_read_members ON public.organization_members
  FOR SELECT TO authenticated
  USING (organization_id = public.get_auth_client_organization_id());

DROP POLICY IF EXISTS client_members_read_subscription ON public.subscriptions;
CREATE POLICY client_members_read_subscription ON public.subscriptions
  FOR SELECT TO authenticated
  USING (organization_id = public.get_auth_client_organization_id());



-- ==================== production_public_cms_policies.sql ====================
-- Locks down the tables that production_access_policies.sql does not cover.
-- Earlier setup scripts (realtime_migration.sql, cms_schema.sql) granted the public
-- anon key full read/write on these tables. Apply after production_access_policies.sql
-- and subscription_lifecycle.sql.

DO $$
DECLARE
  policy_row RECORD;
  table_name TEXT;
BEGIN
  -- Website visitors may submit leads; only platform admins may read or change them.
  IF to_regclass('public.leads') IS NOT NULL THEN
    ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
    FOR policy_row IN
      SELECT policyname FROM pg_policies
      WHERE schemaname = 'public' AND tablename = 'leads'
    LOOP
      EXECUTE format('DROP POLICY %I ON public.leads', policy_row.policyname);
    END LOOP;
    CREATE POLICY public_submit_leads ON public.leads
      FOR INSERT TO anon, authenticated
      WITH CHECK (true);
    CREATE POLICY platform_admin_access ON public.leads
      FOR ALL TO authenticated
      USING (public.is_platform_admin())
      WITH CHECK (public.is_platform_admin());
  END IF;

  -- CMS content: everyone reads published rows, only platform admins write.
  FOREACH table_name IN ARRAY ARRAY[
    'products', 'services', 'pages', 'suites', 'marketplaceitems', 'menus'
  ] LOOP
    IF to_regclass(format('public.%I', table_name)) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
      FOR policy_row IN
        SELECT policyname FROM pg_policies AS existing_policy
        WHERE existing_policy.schemaname = 'public' AND existing_policy.tablename = table_name
      LOOP
        EXECUTE format('DROP POLICY %I ON public.%I', policy_row.policyname, table_name);
      END LOOP;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns AS column_info
        WHERE column_info.table_schema = 'public' AND column_info.table_name = table_name
          AND column_info.column_name = 'status'
      ) THEN
        EXECUTE format(
          'CREATE POLICY public_read_published ON public.%I FOR SELECT TO anon, authenticated USING (status = ''published'')',
          table_name
        );
      ELSE
        EXECUTE format(
          'CREATE POLICY public_read ON public.%I FOR SELECT TO anon, authenticated USING (true)',
          table_name
        );
      END IF;

      EXECUTE format(
        'CREATE POLICY platform_admin_access ON public.%I FOR ALL TO authenticated USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin())',
        table_name
      );
    END IF;
  END LOOP;

  -- Back-office only.
  FOREACH table_name IN ARRAY ARRAY[
    'media', 'settings', 'automation_rules'
  ] LOOP
    IF to_regclass(format('public.%I', table_name)) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
      FOR policy_row IN
        SELECT policyname FROM pg_policies AS existing_policy
        WHERE existing_policy.schemaname = 'public' AND existing_policy.tablename = table_name
      LOOP
        EXECUTE format('DROP POLICY %I ON public.%I', policy_row.policyname, table_name);
      END LOOP;
      EXECUTE format(
        'CREATE POLICY platform_admin_access ON public.%I FOR ALL TO authenticated USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin())',
        table_name
      );
    END IF;
  END LOOP;
END;
$$;



-- ==================== client_management.sql ====================
-- Client management: invoice payment tracking and sequential invoice numbers.
-- Apply after extended_platform.sql and production_access_policies.sql.

ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS payment_reference TEXT;

ALTER TABLE public.invoices DROP CONSTRAINT IF EXISTS invoices_status_check;
ALTER TABLE public.invoices
  ADD CONSTRAINT invoices_status_check CHECK (status IN ('paid', 'pending', 'failed', 'refunded', 'void')) NOT VALID;

CREATE INDEX IF NOT EXISTS invoices_organization_idx ON public.invoices (organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_organization_idx ON public.audit_logs (organization_id, created_at DESC);

-- Invoice numbers are issued by the database so concurrent inserts never collide.
CREATE SEQUENCE IF NOT EXISTS public.invoice_number_seq;
GRANT USAGE ON SEQUENCE public.invoice_number_seq TO authenticated;
ALTER TABLE public.invoices
  ALTER COLUMN invoice_number SET DEFAULT
    'WAV-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.invoice_number_seq')::text, 5, '0');


COMMIT;

NOTIFY pgrst, 'reload schema';

-- Verification: should list only leads (INSERT) and published-content SELECT policies.
SELECT tablename, policyname, cmd FROM pg_policies WHERE schemaname = 'public' AND ('anon' = ANY(roles) OR 'public' = ANY(roles)) ORDER BY 1;
