-- Locks down the tables that production_access_policies.sql does not cover.
-- Earlier setup scripts (realtime_migration.sql, cms_schema.sql) granted the public
-- anon key full read/write on these tables. Apply after production_access_policies.sql
-- and subscription_lifecycle.sql.

DO $$
DECLARE
  policy_row RECORD;
  target_table TEXT;
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
  FOREACH target_table IN ARRAY ARRAY[
    'products', 'services', 'pages', 'suites', 'marketplaceitems', 'menus'
  ] LOOP
    IF to_regclass(format('public.%I', target_table)) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', target_table);
      FOR policy_row IN
        SELECT policyname FROM pg_policies AS existing_policy
        WHERE existing_policy.schemaname = 'public' AND existing_policy.tablename = target_table
      LOOP
        EXECUTE format('DROP POLICY %I ON public.%I', policy_row.policyname, target_table);
      END LOOP;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns AS column_info
        WHERE column_info.table_schema = 'public' AND column_info.table_name = target_table
          AND column_info.column_name = 'status'
      ) THEN
        EXECUTE format(
          'CREATE POLICY public_read_published ON public.%I FOR SELECT TO anon, authenticated USING (status = ''published'')',
          target_table
        );
      ELSE
        EXECUTE format(
          'CREATE POLICY public_read ON public.%I FOR SELECT TO anon, authenticated USING (true)',
          target_table
        );
      END IF;

      EXECUTE format(
        'CREATE POLICY platform_admin_access ON public.%I FOR ALL TO authenticated USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin())',
        target_table
      );
    END IF;
  END LOOP;

  -- Back-office only.
  FOREACH target_table IN ARRAY ARRAY[
    'media', 'settings', 'automation_rules'
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
