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

NOTIFY pgrst, 'reload schema';