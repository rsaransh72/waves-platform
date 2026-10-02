# School ERP Production Onboarding

## Required Configuration

- Set `SUPABASE_SERVICE_ROLE_KEY` in the server runtime only. Never prefix it with `NEXT_PUBLIC_`.
- Keep the Supabase Auth invitation redirect allowlist configured for the deployed `/school/accept-invite` URL.
- Optionally set `NEXT_PUBLIC_SITE_URL` (for example `https://waves.example.com`) so invitation and password-reset emails link to the public domain rather than the request host.
- Optionally set `NEXT_PUBLIC_BILLING_CURRENCY` (ISO code, default `INR`). All platform amounts are displayed in this currency.
- Rotate the PostgreSQL password that was previously embedded in repository scripts before using `DATABASE_URL` again.

## Website And Leads

The public website shows only what is published in the admin console, so nothing on it is invented:

- **Company details** (name, tagline, phone, WhatsApp, emails, address, hours) come from **Admin → Settings**. Empty fields are hidden.
- The website is the company site (home, products, services, pricing, about, contact). Each published product also gets its own mini-site at `/{slug}` with Overview, `/features`, `/pricing`, `/faq` and `/demo` pages and its own menu (e.g. `/school-erp`). Publishing a new product in **Admin → Products** creates its mini-site; no code change is needed.
- **Products** (menu, home page, product mini-sites, pricing, every product dropdown) come from **Admin → Products**, published only. Features, use cases, pricing plans and FAQs are edited there. A product with no pricing plans shows "Pricing on request" and a quote form.
- **Services** come from **Admin → Services**; **About, Terms, Privacy** and other pages from **Admin → Pages** (a published page with no sections is not linked).
- Suites and marketplace entries appear only when published; the placeholder ones were set to draft.

Every form on the website (demo, contact, services consultation, pricing quote, account request) creates a lead in **Admin → Leads**:

1. **New**: arrives from the website (or added by hand for phone or walk-in enquiries). If `RESEND_API_KEY` and `RESEND_FROM_EMAIL` are set, an alert goes to the lead-alert email in Settings and the visitor gets a confirmation.
2. **Contacted → Demo scheduled → Qualified**: set the stage and the next follow-up date; add notes after each conversation. The **Follow-up due** tab lists new leads and leads whose follow-up date has arrived.
3. **Converted**: choose **Onboard as client** on the lead. The onboarding form is pre-filled from the enquiry; creating the client marks the lead converted and links it to the client.
4. **Lost**: record the reason.

There is no self-service sign-up: `/signup` collects an account request, and accounts are opened through onboarding.

## Client Onboarding

1. Website demo and contact requests are captured as leads. Qualify the request, schedule and complete the demo, and agree the product and commercial terms before provisioning an account.
2. In the admin portal, choose **Onboard Client** from the sidebar or **Organizations → Onboard Client**. Select School ERP, Hospital ERP, Pharmacy POS, or Other; enter the organization and first administrator details; set the plan, annual amount, active/trial state, and term end date.
3. Provisioning creates the organization, its linked subscription, and the first administrator invitation. School ERP also receives its initial `school_settings` row. The subscription is linked by `subscriptions.organization_id`; the administrator is linked through `organization_members.organization_id`.
4. The invited administrator accepts the email and sets a password. School clients enter the School ERP. Other product types enter the generic client workspace, which currently shows their organization, membership list, and subscription; product-specific hospital and pharmacy operating dashboards are not implemented yet.
5. Platform administrators can review all client memberships in **Admin → Client Users**. School administrators manage school operational users in the School ERP.

Public applications remain leads until the sales/demo process is complete. The current conversion step is an administrator creating the client from **Organizations**; this does not yet attach the lead record to the resulting organization.

## Managing A Client

Open **Admin → Organizations** and select the client. From that page a platform administrator can:

- Edit the client's details, or suspend and reactivate it. Suspending blocks every user of that client immediately.
- Create or edit the subscription (plan, annual amount, status, term end) and renew the term by 1–3 years. Renewing reactivates a suspended client, resets the renewal reminder, and can create a pending renewal invoice.
- Create invoices and record payments with method, UTR/reference and payment date.
- Add users with an Administrator, Teacher or Staff role, resend pending invitations, send password resets, change roles, and remove access. A client always keeps at least one administrator.
- Review the client's activity: subscription, invoice and profile changes and every user-access action, with the administrator who made it.

## School Roles

Every school user has one role. The database enforces it (`supabase/school_roles.sql`); the School ERP hides pages and buttons to match (`src/lib/school-permissions.ts`). Keep the two in step.

| Area | Administrator | Teacher | Office staff |
|---|---|---|---|
| Students | manage | view | manage |
| Teachers (staff profiles), classes, timetable | manage | view classes and timetable | view |
| Attendance | manage | manage | view |
| Exams and grades | manage | manage | — |
| Fee structures | manage | — | view |
| Fee collection and receipts | manage | — | manage |
| Library, transport | manage | view library | manage |
| Notices | manage | manage | manage |
| Settings, Users & Access | manage | — | — |

School administrators invite their own teachers and office staff from **Users & Access**. Platform administrators can do the same from the client page in the admin console.

Fee payments are recorded by `record_fee_payment()`, which checks the balance, issues the school's next receipt number (`R-000001`, `R-000002`, ...) and updates the invoice in one transaction. Each receipt has a printable page with the amount in words. Library books are issued and returned with `issue_library_book()` and `return_library_book()`, which keep available copies correct.

### Verifying the database

These scripts run against `DATABASE_URL` from `.env.local`. The verify scripts create test data inside a transaction that is always rolled back.

- `node scripts/db/inspect.mjs`: tables without row level security, policies open to the public, applied migrations.
- `node scripts/db/verify-access.mjs`: anonymous visitors, platform admin and an unrelated signed-in user.
- `node scripts/db/verify-tenancy.mjs`: two schools cannot see each other's data; suspension blocks access.
- `node scripts/db/verify-school-roles.mjs [migration.sql ...]`: the role matrix, fee receipts and library circulation. Pass a migration to rehearse it before applying it with `node scripts/db/run-sql.mjs`.

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
4. Apply `supabase/subscription_lifecycle.sql`, then `supabase/production_public_cms_policies.sql`. The latter replaces the development policies that gave the public anon key full read/write on `leads` and the website CMS tables (`products`, `services`, `pages`, `suites`, `marketplaceitems`, `menus`, `media`, `settings`, `automation_rules`). Visitors keep insert-only access to `leads` and read access to published CMS rows.
5. Apply `supabase/client_management.sql`. It adds invoice payment fields (method, UTR/reference, paid date), links invoices to subscriptions, allows voiding invoices, and issues sequential invoice numbers (`WAV-2026-00001`). Creating invoices from the client page fails until it is applied.
6. Apply `supabase/lead_pipeline.sql`, `supabase/remove_placeholder_content.sql` and `supabase/school_erp_content.sql` (website content and lead pipeline).
7. Apply `supabase/school_roles.sql`, `supabase/school_fee_receipts.sql` and `supabase/school_library.sql` (see **School Roles** below).
8. Apply `supabase/remove_auto_admin_trigger.sql`. It was created outside this repository and adds every new user to `team_members` as an active admin, which makes each invited school user a platform administrator.
9. Do not use development policies that grant `anon` access to platform or school tables. Do not run the audit setup script as a routine migration; it drops `audit_logs` with `CASCADE`.

The parent portal (`/portal/student/[id]`) and the parent payment endpoints (`/api/portal/payment`, `/api/portal/payment/stripe`) are disabled until parents have their own sign-in. Schools record fee payments from **Fees → Collection**.

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
6. As the school administrator, open **Users & Access** and invite one teacher and one office staff member. Sign in as each: the teacher should not see Fees, Settings or Users & Access; office staff should not be able to mark attendance or create fee structures.
7. As office staff, create a fee invoice, record a part payment by UPI with a UTR, then the balance by cash. Open both receipts, check the receipt numbers are consecutive and the amounts in words are right, and print one.
8. Issue a library book with one copy, confirm it shows as unavailable, mark it returned and confirm it is available again.
9. As a teacher, schedule an exam, enter grades for a student, edit one subject and confirm the other subjects were kept.

The access migration must be applied before deploying the fail-closed `/admin` and `/school` route checks.