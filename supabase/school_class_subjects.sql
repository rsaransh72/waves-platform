-- The subjects taught in each class (and section). Set when classes are added and
-- offered as choices in the timetable and exam marks. Same row-level policies as the
-- rest of school_classes: everyone in the school reads, administrators change.

ALTER TABLE public.school_classes
  ADD COLUMN IF NOT EXISTS subjects TEXT[] NOT NULL DEFAULT '{}';

ALTER TABLE public.school_classes
  DROP CONSTRAINT IF EXISTS school_classes_subjects_limit;
ALTER TABLE public.school_classes
  ADD CONSTRAINT school_classes_subjects_limit CHECK (cardinality(subjects) <= 30);
