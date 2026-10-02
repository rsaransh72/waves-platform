-- Admission details every Indian school records, and roll numbers per class.
--
-- Roll numbers restart in every section (1, 2, 3 … in Class 5-A and again in 5-B), so
-- they are unique within a class, not across the school. The admission number is the
-- school-wide ID and is unique per school when given.
-- Aadhaar is deliberately not stored (UIDAI storage rules); schools enter it on UDISE+.
--
-- Apply: node scripts/db/run-sql.mjs supabase/school_students_admission.sql

begin;

alter table public.school_students
  add column if not exists admission_number text,
  add column if not exists admission_date date default current_date,
  add column if not exists date_of_birth date,
  add column if not exists gender text,
  add column if not exists father_name text,
  add column if not exists mother_name text,
  add column if not exists address text,
  add column if not exists category text,
  add column if not exists blood_group text;

alter table public.school_students
  drop constraint if exists school_students_admission_number_check,
  add constraint school_students_admission_number_check
    check (admission_number is null or admission_number ~ '^[A-Z0-9/-]{1,20}$'),
  drop constraint if exists school_students_gender_check,
  add constraint school_students_gender_check
    check (gender is null or gender in ('male', 'female', 'other')),
  drop constraint if exists school_students_category_check,
  add constraint school_students_category_check
    check (category is null or category in ('general', 'ews', 'obc', 'sc', 'st')),
  drop constraint if exists school_students_blood_group_check,
  add constraint school_students_blood_group_check
    check (blood_group is null or blood_group in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  drop constraint if exists school_students_date_of_birth_check,
  add constraint school_students_date_of_birth_check
    check (date_of_birth is null or (date_of_birth >= date '1990-01-01' and date_of_birth <= current_date)),
  drop constraint if exists school_students_names_length_check,
  add constraint school_students_names_length_check
    check (coalesce(length(father_name), 0) <= 80 and coalesce(length(mother_name), 0) <= 80 and coalesce(length(address), 0) <= 250);

create unique index if not exists school_students_admission_number_key
  on public.school_students (organization_id, admission_number)
  where admission_number is not null;

-- Roll numbers: unique inside a class instead of across the whole school.
alter table public.school_students drop constraint if exists school_students_organization_id_roll_number_key;
create unique index if not exists school_students_roll_number_per_class_key
  on public.school_students (class_id, roll_number);

commit;
