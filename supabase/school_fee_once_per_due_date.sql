-- A fee head can be due from a student only once per due date. Assigning a fee to a
-- whole class (Fee Collection → Assign fee) inserts with ON CONFLICT DO NOTHING, so
-- running it twice, or two people running it at once, never bills a student twice.
-- A monthly fee billed again for the next month has a different due date and is kept.
--
-- Apply: node scripts/db/run-sql.mjs supabase/school_fee_once_per_due_date.sql
-- Fails (and changes nothing) if duplicates already exist; list them with:
--   select student_id, fee_structure_id, due_date, count(*) from public.school_student_fees
--   group by 1, 2, 3 having count(*) > 1;

create unique index if not exists school_student_fees_once_per_due_date
  on public.school_student_fees (student_id, fee_structure_id, due_date);
