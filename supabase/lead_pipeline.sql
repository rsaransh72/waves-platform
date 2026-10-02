-- Sales pipeline for website enquiries, and public company details for the website.
-- Apply after production_public_cms_policies.sql.

-- What the visitor asked for, and where the lead is in the sales process.
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS inquiry_type TEXT NOT NULL DEFAULT 'demo',
  ADD COLUMN IF NOT EXISTS next_follow_up DATE,
  ADD COLUMN IF NOT EXISTS lost_reason TEXT,
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;

UPDATE public.leads SET status = 'lost' WHERE status = 'closed';
UPDATE public.leads SET status = 'new' WHERE status IS NULL;

ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_status_check
  CHECK (status IN ('new', 'contacted', 'demo_scheduled', 'qualified', 'converted', 'lost')) NOT VALID;
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_inquiry_type_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_inquiry_type_check
  CHECK (inquiry_type IN ('demo', 'contact', 'consultation', 'pricing', 'access')) NOT VALID;

CREATE INDEX IF NOT EXISTS leads_status_created_idx ON public.leads (status, created_at DESC);

-- Visitors may only create a fresh lead; they cannot set its pipeline state.
DROP POLICY IF EXISTS public_submit_leads ON public.leads;
CREATE POLICY public_submit_leads ON public.leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'new' AND organization_id IS NULL AND next_follow_up IS NULL AND lost_reason IS NULL);

-- Follow-up notes on a lead, newest first in the admin console.
CREATE TABLE IF NOT EXISTS public.lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (length(trim(body)) > 0),
  author_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS lead_notes_lead_idx ON public.lead_notes (lead_id, created_at DESC);
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS platform_admin_access ON public.lead_notes;
CREATE POLICY platform_admin_access ON public.lead_notes
  FOR ALL TO authenticated
  USING (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

-- The website shows the company's public contact details from settings.site_general.
-- Every other setting stays back-office only.
CREATE UNIQUE INDEX IF NOT EXISTS settings_key_idx ON public.settings (key);
DROP POLICY IF EXISTS public_read_site_general ON public.settings;
CREATE POLICY public_read_site_general ON public.settings
  FOR SELECT TO anon, authenticated
  USING (key = 'site_general');

NOTIFY pgrst, 'reload schema';
