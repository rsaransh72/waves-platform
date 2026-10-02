-- Fee payments with per-school sequential receipt numbers, recorded atomically.
-- Apply after school_roles.sql.

ALTER TABLE public.school_fee_payments
  ADD COLUMN IF NOT EXISTS receipt_number TEXT,
  ADD COLUMN IF NOT EXISTS recorded_by UUID;

CREATE UNIQUE INDEX IF NOT EXISTS school_fee_payments_receipt_idx
  ON public.school_fee_payments (organization_id, receipt_number);

-- Employee IDs identify a teacher within a school.
CREATE UNIQUE INDEX IF NOT EXISTS school_teachers_employee_idx
  ON public.school_teachers (organization_id, employee_id);

-- Only record_fee_payment() touches this table; with RLS on and no policies, nobody
-- else can read or change it.
CREATE TABLE IF NOT EXISTS public.school_receipt_counters (
  organization_id UUID PRIMARY KEY REFERENCES public.organizations(id) ON DELETE CASCADE,
  last_number INTEGER NOT NULL DEFAULT 0
);
ALTER TABLE public.school_receipt_counters ENABLE ROW LEVEL SECURITY;

-- Records one payment against a student fee: checks the caller's role and the
-- balance, issues the next receipt number for the school, and updates the fee in the
-- same transaction so concurrent collections cannot double-count.
CREATE OR REPLACE FUNCTION public.record_fee_payment(
  p_student_fee_id UUID,
  p_amount NUMERIC,
  p_method TEXT,
  p_reference TEXT DEFAULT NULL,
  p_paid_on DATE DEFAULT NULL
)
RETURNS TABLE (payment_id UUID, receipt_number TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
#variable_conflict use_column
DECLARE
  caller_org UUID := public.get_auth_organization_id();
  fee public.school_student_fees%ROWTYPE;
  balance NUMERIC;
  next_number INTEGER;
  new_receipt TEXT;
  new_payment UUID;
BEGIN
  IF caller_org IS NULL OR public.get_auth_school_role() NOT IN ('admin', 'staff') THEN
    RAISE EXCEPTION 'Your role does not allow recording payments.' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO fee FROM public.school_student_fees
  WHERE id = p_student_fee_id AND organization_id = caller_org
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Fee invoice not found.';
  END IF;

  balance := fee.amount_due - COALESCE(fee.amount_paid, 0);
  IF p_amount IS NULL OR p_amount <= 0 THEN
    RAISE EXCEPTION 'Enter an amount greater than zero.';
  END IF;
  IF p_amount > balance THEN
    RAISE EXCEPTION 'The amount is more than the balance due of %.', balance;
  END IF;
  IF p_method NOT IN ('cash', 'upi', 'bank_transfer', 'cheque', 'card', 'other') THEN
    RAISE EXCEPTION 'Choose a payment method.';
  END IF;

  INSERT INTO public.school_receipt_counters AS counter (organization_id, last_number)
  VALUES (caller_org, 1)
  ON CONFLICT (organization_id) DO UPDATE SET last_number = counter.last_number + 1
  RETURNING counter.last_number INTO next_number;
  new_receipt := 'R-' || lpad(next_number::TEXT, 6, '0');

  INSERT INTO public.school_fee_payments
    (organization_id, student_fee_id, amount_paid, payment_date, payment_method, transaction_id, status, uploaded_by, receipt_number, recorded_by)
  VALUES
    (caller_org, fee.id, p_amount, COALESCE(p_paid_on + TIME '12:00', now()), p_method, NULLIF(trim(p_reference), ''), 'completed', 'school', new_receipt, auth.uid())
  RETURNING id INTO new_payment;

  UPDATE public.school_student_fees
  SET amount_paid = COALESCE(amount_paid, 0) + p_amount,
      status = CASE WHEN COALESCE(amount_paid, 0) + p_amount >= amount_due THEN 'paid' ELSE 'partial' END
  WHERE id = fee.id;

  RETURN QUERY SELECT new_payment, new_receipt;
END;
$$;

REVOKE ALL ON FUNCTION public.record_fee_payment(UUID, NUMERIC, TEXT, TEXT, DATE) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_fee_payment(UUID, NUMERIC, TEXT, TEXT, DATE) TO authenticated;

NOTIFY pgrst, 'reload schema';
