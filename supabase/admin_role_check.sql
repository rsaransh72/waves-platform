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

NOTIFY pgrst, 'reload schema';