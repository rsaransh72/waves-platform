-- This script will safely remove ALL existing audit triggers (including legacy ones)
-- and then reinstall exactly one clean trigger per table.

BEGIN;

-- 1. Drop ALL triggers that call any audit function
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (
        SELECT trigger_name, event_object_table 
        FROM information_schema.triggers 
        WHERE trigger_name ILIKE '%audit%'
    ) LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(r.trigger_name) || ' ON ' || quote_ident(r.event_object_table);
    END LOOP;
END $$;

-- 2. Re-apply exactly ONE clean trigger per table
CREATE TRIGGER audit_trigger_products AFTER INSERT OR UPDATE OR DELETE ON public.products FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();
CREATE TRIGGER audit_trigger_suites AFTER INSERT OR UPDATE OR DELETE ON public.suites FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();
CREATE TRIGGER audit_trigger_organizations AFTER INSERT OR UPDATE OR DELETE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();
CREATE TRIGGER audit_trigger_leads AFTER INSERT OR UPDATE OR DELETE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();
CREATE TRIGGER audit_trigger_feature_flags AFTER INSERT OR UPDATE OR DELETE ON public.feature_flags FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();
CREATE TRIGGER audit_trigger_team_members AFTER INSERT OR UPDATE OR DELETE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();
CREATE TRIGGER audit_trigger_subscriptions AFTER INSERT OR UPDATE OR DELETE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();
CREATE TRIGGER audit_trigger_support_tickets AFTER INSERT OR UPDATE OR DELETE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();
CREATE TRIGGER audit_trigger_invoices AFTER INSERT OR UPDATE OR DELETE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

COMMIT;
