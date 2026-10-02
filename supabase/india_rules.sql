-- India-only data rules, enforced by the database so that no screen, script or API
-- can store a value the forms would reject:
--   * phone numbers are stored as +91 followed by 10 digits (+919876543210);
--     personal numbers are mobiles (start 6-9), office numbers may be landlines
--     written with the STD code (start 1-9);
--   * PIN codes are 6 digits, not starting with 0;
--   * every amount is in rupees and never negative; fees and payments are above zero;
--   * the only currency is INR.
-- Existing values are converted first. A value that cannot be read as an Indian
-- number is not lost: on a lead it is moved into the lead's message.

-- The 10 national digits from "+91 98765-43210", "098765 43210", "919876543210"...
create or replace function public.india_phone_digits(value text)
returns text
language sql
immutable
as $$
  select case
    when d ~ '^[0-9]{10}$' then d
    when d ~ '^91[0-9]{10}$' then substr(d, 3)
    when d ~ '^0[0-9]{10}$' then substr(d, 2)
    else null
  end
  from (select regexp_replace(coalesce(value, ''), '[^0-9]', '', 'g') as d) digits
$$;

-- Leads: keep unreadable numbers in the message, then convert the rest.
update public.leads
set message = concat_ws(E'\n', nullif(message, ''), '[Phone as entered: ' || phone || ']'),
    phone = null
where phone is not null
  and coalesce(public.india_phone_digits(phone), '') !~ '^[6-9]';

update public.leads
set phone = '+91' || public.india_phone_digits(phone)
where phone is not null and phone <> '+91' || public.india_phone_digits(phone);

-- Every other phone column: convert, or clear when unreadable (none exist today).
update public.organizations set phone = case when public.india_phone_digits(phone) ~ '^[1-9]' then '+91' || public.india_phone_digits(phone) end where phone is not null;
update public.school_settings set contact_phone = case when public.india_phone_digits(contact_phone) ~ '^[1-9]' then '+91' || public.india_phone_digits(contact_phone) end where contact_phone is not null;
update public.school_students set parent_phone = case when public.india_phone_digits(parent_phone) ~ '^[6-9]' then '+91' || public.india_phone_digits(parent_phone) end where parent_phone is not null;
update public.school_teachers set phone = case when public.india_phone_digits(phone) ~ '^[6-9]' then '+91' || public.india_phone_digits(phone) end where phone is not null;
update public.school_transport_routes set driver_phone = case when public.india_phone_digits(driver_phone) ~ '^[6-9]' then '+91' || public.india_phone_digits(driver_phone) end where driver_phone is not null;
update public.organizations set pincode = null where pincode is not null and pincode !~ '^[1-9][0-9]{5}$';

-- Company phone and WhatsApp shown on the website.
update public.settings
set value = value
  || case when public.india_phone_digits(value->>'phone') ~ '^[1-9]' then jsonb_build_object('phone', '+91' || public.india_phone_digits(value->>'phone')) else '{}'::jsonb end
  || case when public.india_phone_digits(value->>'whatsapp') ~ '^[6-9]' then jsonb_build_object('whatsapp', '+91' || public.india_phone_digits(value->>'whatsapp')) else '{}'::jsonb end
where key = 'site_general';

-- Rupees only.
alter table public.school_settings alter column currency set default 'INR';
update public.school_settings set currency = 'INR' where currency is distinct from 'INR';

-- Constraints (dropped first so this file can be re-applied).
alter table public.leads drop constraint if exists leads_phone_india_check;
alter table public.leads add constraint leads_phone_india_check check (phone is null or phone ~ '^\+91[6-9][0-9]{9}$');

alter table public.organizations drop constraint if exists organizations_phone_india_check;
alter table public.organizations add constraint organizations_phone_india_check check (phone is null or phone ~ '^\+91[1-9][0-9]{9}$');
alter table public.organizations drop constraint if exists organizations_pincode_india_check;
alter table public.organizations add constraint organizations_pincode_india_check check (pincode is null or pincode ~ '^[1-9][0-9]{5}$');

alter table public.school_settings drop constraint if exists school_settings_contact_phone_india_check;
alter table public.school_settings add constraint school_settings_contact_phone_india_check check (contact_phone is null or contact_phone ~ '^\+91[1-9][0-9]{9}$');
alter table public.school_settings drop constraint if exists school_settings_currency_inr_check;
alter table public.school_settings add constraint school_settings_currency_inr_check check (currency is null or currency = 'INR');

alter table public.school_students drop constraint if exists school_students_parent_phone_india_check;
alter table public.school_students add constraint school_students_parent_phone_india_check check (parent_phone is null or parent_phone ~ '^\+91[6-9][0-9]{9}$');

alter table public.school_teachers drop constraint if exists school_teachers_phone_india_check;
alter table public.school_teachers add constraint school_teachers_phone_india_check check (phone is null or phone ~ '^\+91[6-9][0-9]{9}$');

alter table public.school_transport_routes drop constraint if exists school_transport_routes_driver_phone_india_check;
alter table public.school_transport_routes add constraint school_transport_routes_driver_phone_india_check check (driver_phone is null or driver_phone ~ '^\+91[6-9][0-9]{9}$');

alter table public.subscriptions drop constraint if exists subscriptions_amount_check;
alter table public.subscriptions add constraint subscriptions_amount_check check (amount >= 0 and amount <= 100000000);

alter table public.invoices drop constraint if exists invoices_amount_check;
alter table public.invoices add constraint invoices_amount_check check (amount > 0 and amount <= 100000000);

alter table public.school_fee_structures drop constraint if exists school_fee_structures_amount_check;
alter table public.school_fee_structures add constraint school_fee_structures_amount_check check (amount > 0 and amount <= 100000000);

alter table public.school_student_fees drop constraint if exists school_student_fees_amounts_check;
alter table public.school_student_fees add constraint school_student_fees_amounts_check check (amount_due >= 0 and amount_paid >= 0 and amount_paid <= amount_due);

alter table public.school_fee_payments drop constraint if exists school_fee_payments_amount_check;
alter table public.school_fee_payments add constraint school_fee_payments_amount_check check (amount_paid > 0);

alter table public.school_library_issues drop constraint if exists school_library_issues_fine_check;
alter table public.school_library_issues add constraint school_library_issues_fine_check check (fine_amount is null or fine_amount >= 0);

select
  (select string_agg(coalesce(phone, 'null'), ', ') from public.leads) as lead_phones,
  (select value->>'phone' || ' / ' || (value->>'whatsapp') from public.settings where key = 'site_general') as company_phone_whatsapp,
  (select column_default from information_schema.columns where table_schema = 'public' and table_name = 'school_settings' and column_name = 'currency') as currency_default,
  (select count(*) from pg_constraint where connamespace = 'public'::regnamespace and (conname like '%\_india\_check' or conname like '%\_amount\_check' or conname like '%\_amounts\_check' or conname like '%\_fine\_check' or conname like '%\_inr\_check')) as rules_in_place;
