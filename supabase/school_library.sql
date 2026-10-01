-- Library circulation: issue and return books atomically so available copies stay
-- correct. Apply after school_roles.sql.

CREATE OR REPLACE FUNCTION public.issue_library_book(p_book_id UUID, p_student_id UUID, p_due_date DATE)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
#variable_conflict use_column
DECLARE
  caller_org UUID := public.get_auth_organization_id();
  book public.school_library_books%ROWTYPE;
  new_issue UUID;
BEGIN
  IF caller_org IS NULL OR public.get_auth_school_role() NOT IN ('admin', 'staff') THEN
    RAISE EXCEPTION 'Your role does not allow issuing books.' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO book FROM public.school_library_books
  WHERE id = p_book_id AND organization_id = caller_org
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Book not found.';
  END IF;
  IF COALESCE(book.available, 0) <= 0 THEN
    RAISE EXCEPTION 'No copies of "%" are available.', book.title;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.school_students WHERE id = p_student_id AND organization_id = caller_org) THEN
    RAISE EXCEPTION 'Student not found.';
  END IF;
  IF p_due_date IS NULL OR p_due_date < CURRENT_DATE THEN
    RAISE EXCEPTION 'Choose a return due date that is today or later.';
  END IF;

  INSERT INTO public.school_library_issues (organization_id, book_id, student_id, due_date, status)
  VALUES (caller_org, book.id, p_student_id, p_due_date, 'issued')
  RETURNING id INTO new_issue;

  UPDATE public.school_library_books SET available = available - 1 WHERE id = book.id;
  RETURN new_issue;
END;
$$;

CREATE OR REPLACE FUNCTION public.return_library_book(p_issue_id UUID, p_fine NUMERIC DEFAULT 0)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
#variable_conflict use_column
DECLARE
  caller_org UUID := public.get_auth_organization_id();
  issue public.school_library_issues%ROWTYPE;
BEGIN
  IF caller_org IS NULL OR public.get_auth_school_role() NOT IN ('admin', 'staff') THEN
    RAISE EXCEPTION 'Your role does not allow returning books.' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO issue FROM public.school_library_issues
  WHERE id = p_issue_id AND organization_id = caller_org
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Issue record not found.';
  END IF;
  IF issue.status = 'returned' THEN
    RAISE EXCEPTION 'This book has already been returned.';
  END IF;
  IF p_fine IS NULL OR p_fine < 0 THEN
    RAISE EXCEPTION 'The fine cannot be negative.';
  END IF;

  UPDATE public.school_library_issues
  SET status = 'returned', return_date = CURRENT_DATE, fine_amount = p_fine
  WHERE id = issue.id;

  UPDATE public.school_library_books
  SET available = LEAST(available + 1, quantity)
  WHERE id = issue.book_id;
END;
$$;

REVOKE ALL ON FUNCTION public.issue_library_book(UUID, UUID, DATE) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.return_library_book(UUID, NUMERIC) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.issue_library_book(UUID, UUID, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION public.return_library_book(UUID, NUMERIC) TO authenticated;

NOTIFY pgrst, 'reload schema';
