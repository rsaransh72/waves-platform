# School ERP Production Onboarding

## Required Configuration

- Set `SUPABASE_SERVICE_ROLE_KEY` in the server runtime only. Never prefix it with `NEXT_PUBLIC_`.
- Keep the Supabase Auth invitation redirect allowlist configured for the deployed `/school/accept-invite` URL.
- Rotate the PostgreSQL password that was previously embedded in repository scripts before using `DATABASE_URL` again.

## Client Onboarding

1. Website demo and contact requests are captured as leads. Qualify the request, schedule and complete the demo, and agree the product and commercial terms before provisioning an account.
2. In the admin portal, choose **Onboard Client** from the sidebar or **Organizations → Onboard Client**. Select School ERP, Hospital ERP, Pharmacy POS, or Other; enter the organization and first administrator details; set the plan, annual amount, active/trial state, and term end date.
3. Provisioning creates the organization, its linked subscription, and the first administrator invitation. School ERP also receives its initial `school_settings` row. The subscription is linked by `subscriptions.organization_id`; the administrator is linked through `organization_members.organization_id`.
4. The invited administrator accepts the email and sets a password. School clients enter the School ERP. Other product types enter the generic client workspace, which currently shows their organization, membership list, and subscription; product-specific hospital and pharmacy operating dashboards are not implemented yet.
5. Platform administrators can review all client memberships in **Admin → Client Users**. School administrators manage school operational users in the School ERP.

Public applications remain leads until the sales/demo process is complete. The current conversion step is an administrator creating the client from **Organizations**; this does not yet attach the lead record to the resulting organization.

## Subscription Lifecycle Automation

Apply `supabase/subscription_lifecycle.sql` after the base organizations and subscriptions schemas. Configure these server-only environment variables:

- `CRON_SECRET`: a long random secret used to authorize the scheduled job.
- `RESEND_API_KEY`: the Resend API key used for renewal reminders.
- `RESEND_FROM_EMAIL`: a verified Resend sender address.

Schedule a daily `GET /api/cron/subscriptions` request and send `Authorization: Bearer <CRON_SECRET>`. The job sends one renewal reminder when an active term is within seven days of its end date. At or after the term end, it marks the subscription `past_due` and suspends the organization if no other active, unexpired subscription exists; workspace access is denied until an administrator extends the subscription. The extension action reactivates a suspended organization and resets the reminder flag.

The job returns a count of reminders and suspensions plus per-subscription failures. Monitor non-200 responses and configure the scheduler to retry failed runs. Applying the migration and setting the three environment variables are required before enabling this cron job.

## Database Order

1. Apply the reviewed core, platform, and school schema files so `organizations`, `organization_members`, `team_members`, school tables, and `school_settings` exist.
2. Apply `supabase/admin_role_check.sql` after `team_members` exists. It enables the shared `/login` page to verify active platform admins.
3. Apply `supabase/production_access_policies.sql` after all school tables are present. It replaces existing policies on platform-admin and school data tables; review against the deployed schema before applying.
4. Do not use development policies that grant `anon` access to platform or school tables. Do not run the audit setup script as a routine migration; it drops `audit_logs` with `CASCADE`.

## Bootstrap The First Platform Administrator

Create the administrator's Supabase Auth account first, then run this once with that account's real email:

```sql
INSERT INTO public.team_members (name, email, role, status)
VALUES ('Platform Administrator', 'admin@example.com', 'superadmin', 'active')
ON CONFLICT (email) DO UPDATE
SET role = 'superadmin', status = 'active';
```

The platform-admin policies use the authenticated email to match this row. Do not add school customer emails to `team_members`.

## Pilot Acceptance Checks

1. Sign in as the bootstrapped platform administrator and onboard each school from **Admin → Onboard Client**.
2. Accept each email invitation, set a password, and verify the school dashboard loads.
3. For both schools, create a class, enroll a student, save attendance, and verify the records persist after sign-out and sign-in.
4. With two separate school accounts, verify neither can read or mutate the other school's rows.
5. Verify ordinary authenticated users and anonymous requests cannot access admin data or school records.

The access migration must be applied before deploying the fail-closed `/admin` and `/school` route checks.