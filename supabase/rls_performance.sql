-- Make row-level security cheap.
--
-- 1. Policies called helpers such as get_auth_organization_id() directly, so Postgres
--    could run them once for every row it looked at, across every school. Reading one
--    class's attendance took ~60 ms for 1,500 rows and grows with the whole platform.
--    Wrapping each call as (select fn()) makes it an InitPlan: run once per query.
--    Same rule, same result, only evaluated once. (Supabase "RLS performance" guidance.)
-- 2. Tables filtered by organization_id get an index on it, and the register's
--    class + date lookup gets its own.
--
-- Safe to run again: calls that are already wrapped are left alone.
-- Apply: node scripts/db/run-sql.mjs supabase/rls_performance.sql

begin;

do $$
declare
  policy record;
  helper constant text := '(public\.|auth\.)?(get_auth_organization_id|get_auth_school_role|is_platform_admin|get_auth_client_organization_id|uid|jwt)\(\)';
  new_using text;
  new_check text;
  statement text;
begin
  for policy in
    select schemaname, tablename, policyname, qual, with_check
    from pg_policies
    where schemaname in ('public', 'storage')
  loop
    -- Wrap only calls that are not already the whole body of a "SELECT ...".
    new_using := regexp_replace(policy.qual, '(?<!SELECT )(?<!SELECT public\.)(?<!SELECT auth\.)\m' || helper, '( SELECT \1\2() )', 'g');
    new_check := regexp_replace(policy.with_check, '(?<!SELECT )(?<!SELECT public\.)(?<!SELECT auth\.)\m' || helper, '( SELECT \1\2() )', 'g');
    -- auth.uid() / auth.jwt() deparse without a schema in some policies; never wrap a bare uid()/jwt().
    new_using := replace(replace(new_using, '( SELECT uid() )', 'uid()'), '( SELECT jwt() )', 'jwt()');
    new_check := replace(replace(new_check, '( SELECT uid() )', 'uid()'), '( SELECT jwt() )', 'jwt()');

    if new_using is distinct from policy.qual or new_check is distinct from policy.with_check then
      statement := format('alter policy %I on %I.%I', policy.policyname, policy.schemaname, policy.tablename);
      if new_using is not null then statement := statement || format(' using (%s)', new_using); end if;
      if new_check is not null then statement := statement || format(' with check (%s)', new_check); end if;
      execute statement;
    end if;
  end loop;
end;
$$;

create index if not exists school_attendance_organization_id_idx on public.school_attendance (organization_id);
create index if not exists school_attendance_class_date_idx on public.school_attendance (class_id, date);
create index if not exists school_communications_organization_id_idx on public.school_communications (organization_id);
create index if not exists school_exam_results_organization_id_idx on public.school_exam_results (organization_id);
create index if not exists school_exams_organization_id_idx on public.school_exams (organization_id);
create index if not exists school_fee_structures_organization_id_idx on public.school_fee_structures (organization_id);
create index if not exists school_library_books_organization_id_idx on public.school_library_books (organization_id);
create index if not exists school_library_issues_organization_id_idx on public.school_library_issues (organization_id);
create index if not exists school_student_fees_organization_id_idx on public.school_student_fees (organization_id);
create index if not exists school_timetables_organization_id_idx on public.school_timetables (organization_id);
create index if not exists school_transport_stops_organization_id_idx on public.school_transport_stops (organization_id);
create index if not exists school_transport_students_organization_id_idx on public.school_transport_students (organization_id);
create index if not exists subscriptions_organization_id_idx on public.subscriptions (organization_id);
create index if not exists leads_organization_id_idx on public.leads (organization_id);

commit;

notify pgrst, 'reload schema';
