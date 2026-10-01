-- A trigger created outside this repository added every new Supabase Auth user to
-- team_members as an active 'admin', which made each invited school user a platform
-- administrator with access to every client. Platform administrators are added
-- explicitly instead (see PRODUCTION_SCHOOL_ONBOARDING.md).

BEGIN;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

COMMIT;

-- Verification: remaining non-internal triggers on auth.users (expected: none).
SELECT t.tgname AS trigger
FROM pg_trigger t
JOIN pg_class c ON c.oid = t.tgrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'auth' AND c.relname = 'users' AND NOT t.tgisinternal;
