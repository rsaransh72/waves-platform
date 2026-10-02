-- What a school user may know about their own Waves account: the school's name, whether
-- it is active or paused, and the current plan's status and end date.
--
-- get_auth_organization_id() returns null once a school is suspended, and principals
-- cannot read the subscriptions table, so the overdue banner and the "account paused"
-- page read this instead. It never returns amounts, invoices or other schools.
--
-- Apply: node scripts/db/run-sql.mjs supabase/school_account_status.sql

begin;

create or replace function public.get_my_school_account()
returns table (
  organization_name text,
  organization_status text,
  subscription_status text,
  next_billing_date timestamptz
)
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  membership_count integer;
  school_id uuid;
begin
  select count(*), (array_agg(member.organization_id order by member.created_at))[1]
  into membership_count, school_id
  from public.organization_members as member
  join public.organizations as organization on organization.id = member.organization_id
  where member.user_id = auth.uid()
    and member.role in ('owner', 'admin', 'teacher', 'staff', 'member')
    and organization.type = 'school';

  if membership_count <> 1 then
    return;
  end if;

  return query
  select
    organization.name::text,
    organization.status::text,
    subscription.status::text,
    subscription.next_billing_date
  from public.organizations as organization
  left join lateral (
    select candidate.status, candidate.next_billing_date
    from public.subscriptions as candidate
    where candidate.organization_id = organization.id
      and candidate.status <> 'canceled'
    order by candidate.next_billing_date desc nulls last
    limit 1
  ) as subscription on true
  where organization.id = school_id;
end;
$$;

revoke all on function public.get_my_school_account() from public;
grant execute on function public.get_my_school_account() to authenticated;

commit;

notify pgrst, 'reload schema';
