-- Small fixes from the October 2026 simulation.
--
-- 1. A school cannot have two bus routes with the same name ("Route 1" twice). The same
--    bus may still run more than one route, so the vehicle number is not unique.
-- 2. Fee structures can be archived. Archived fees stop appearing when fees are assigned;
--    dues already raised from them are kept.
-- 3. School logos are uploaded to Storage instead of pasted as a link. Each school writes
--    only inside its own folder (<organization id>/...), and only its administrator can.
--
-- Apply: node scripts/db/run-sql.mjs supabase/school_polish.sql

begin;

create unique index if not exists school_transport_routes_name_key
  on public.school_transport_routes (organization_id, lower(btrim(route_name)));

alter table public.school_fee_structures
  add column if not exists archived_at timestamptz;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('school-logos', 'school-logos', true, 1048576, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Listing and replacing need read access to the school's own folder.
drop policy if exists school_logos_member_read on storage.objects;
create policy school_logos_member_read on storage.objects
  for select to authenticated
  using (
    bucket_id = 'school-logos'
    and (storage.foldername(name))[1] = public.get_auth_organization_id()::text
  );

drop policy if exists school_logos_admin_insert on storage.objects;
create policy school_logos_admin_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'school-logos'
    and (storage.foldername(name))[1] = public.get_auth_organization_id()::text
    and public.get_auth_school_role() = 'admin'
  );

drop policy if exists school_logos_admin_update on storage.objects;
create policy school_logos_admin_update on storage.objects
  for update to authenticated
  using (
    bucket_id = 'school-logos'
    and (storage.foldername(name))[1] = public.get_auth_organization_id()::text
    and public.get_auth_school_role() = 'admin'
  );

drop policy if exists school_logos_admin_delete on storage.objects;
create policy school_logos_admin_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'school-logos'
    and (storage.foldername(name))[1] = public.get_auth_organization_id()::text
    and public.get_auth_school_role() = 'admin'
  );

commit;

notify pgrst, 'reload schema';
