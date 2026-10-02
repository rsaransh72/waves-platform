-- Client management: invoice payment tracking and sequential invoice numbers.
-- Apply after extended_platform.sql and production_access_policies.sql.

ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS payment_reference TEXT;

ALTER TABLE public.invoices DROP CONSTRAINT IF EXISTS invoices_status_check;
ALTER TABLE public.invoices
  ADD CONSTRAINT invoices_status_check CHECK (status IN ('paid', 'pending', 'failed', 'refunded', 'void')) NOT VALID;

CREATE INDEX IF NOT EXISTS invoices_organization_idx ON public.invoices (organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_organization_idx ON public.audit_logs (organization_id, created_at DESC);

-- Invoice numbers are issued by the database so concurrent inserts never collide.
CREATE SEQUENCE IF NOT EXISTS public.invoice_number_seq;
GRANT USAGE ON SEQUENCE public.invoice_number_seq TO authenticated;
ALTER TABLE public.invoices
  ALTER COLUMN invoice_number SET DEFAULT
    'WAV-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.invoice_number_seq')::text, 5, '0');

NOTIFY pgrst, 'reload schema';
