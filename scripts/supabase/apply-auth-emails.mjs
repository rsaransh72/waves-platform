// Applies the branded invitation and password-reset emails (supabase/email-templates),
// the Site URL and the redirect allowlist to the Supabase project, through the
// Management API. Without these, invitation links fall back to the Site URL
// (http://localhost:3000) and arrive with Supabase's plain default email.
//
// Usage:
//   node scripts/supabase/apply-auth-emails.mjs https://your-domain [--dry-run]
// Needs SUPABASE_ACCESS_TOKEN (create it at https://supabase.com/dashboard/account/tokens)
// in .env.local or the environment. The project is read from NEXT_PUBLIC_SUPABASE_URL.
import fs from "node:fs";
import { config } from "dotenv";

config({ path: ".env.local" });

const siteUrl = process.argv[2]?.replace(/\/$/, "");
const dryRun = process.argv.includes("--dry-run");
const token = process.env.SUPABASE_ACCESS_TOKEN;
const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/^https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1];

if (!siteUrl || !/^https?:\/\//.test(siteUrl)) {
  console.error("Usage: node scripts/supabase/apply-auth-emails.mjs https://your-domain [--dry-run]");
  process.exit(1);
}
if (!projectRef) {
  console.error("NEXT_PUBLIC_SUPABASE_URL in .env.local must be a https://<ref>.supabase.co URL.");
  process.exit(1);
}
if (!token && !dryRun) {
  console.error("Set SUPABASE_ACCESS_TOKEN (create one at https://supabase.com/dashboard/account/tokens).");
  process.exit(1);
}

const endpoint = `https://api.supabase.com/v1/projects/${projectRef}/config/auth`;
const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

// Keep redirect URLs that are already allowed; add the site and local development.
let existing = [];
if (token) {
  const response = await fetch(endpoint, { headers });
  if (!response.ok) {
    console.error(`Could not read the auth settings (${response.status}): ${await response.text()}`);
    process.exit(1);
  }
  existing = String((await response.json()).uri_allow_list ?? "").split(",").map((url) => url.trim()).filter(Boolean);
}
const allowList = [...new Set([...existing, `${siteUrl}/**`, "http://localhost:3000/**"])];

const template = (name) => fs.readFileSync(new URL(`../../supabase/email-templates/${name}.html`, import.meta.url), "utf8");
const settings = {
  site_url: siteUrl,
  uri_allow_list: allowList.join(","),
  mailer_subjects_invite: "{{ if .Data.organization_name }}You're invited to {{ .Data.organization_name }} on Waves{{ else }}You're invited to Waves{{ end }}",
  mailer_templates_invite_content: template("invite"),
  mailer_subjects_recovery: "Reset your Waves password",
  mailer_templates_recovery_content: template("recovery"),
};

console.log(`Project ${projectRef}`);
console.log(`  Site URL:       ${settings.site_url}`);
console.log(`  Redirect URLs:  ${allowList.join(", ")}`);
console.log(`  Invite subject: ${settings.mailer_subjects_invite}`);
console.log(`  Reset subject:  ${settings.mailer_subjects_recovery}`);

// URLs and templates go separately: Supabase refuses template changes on free projects
// that still use its built-in mailer, and the URLs must be fixed regardless.
// process.exitCode rather than process.exit(): exiting right after fetch() crashes Node on Windows.
const patch = (body) => fetch(endpoint, { method: "PATCH", headers, body: JSON.stringify(body) });
if (dryRun) {
  console.log("Dry run: nothing was changed.");
} else {
  const { site_url, uri_allow_list, ...templates } = settings;
  const urls = await patch({ site_url, uri_allow_list });
  if (urls.ok) {
    console.log("✓ Site URL and redirect URLs applied: email links now open the site.");
  } else {
    console.error(`✗ Could not update the URLs (${urls.status}): ${await urls.text()}`);
    process.exitCode = 1;
  }
  const mail = await patch(templates);
  if (mail.ok) {
    console.log("✓ Branded invitation and password-reset emails applied.");
  } else {
    const reason = await mail.text();
    console.error(/custom SMTP/i.test(reason)
      ? "✗ Branded emails not applied: Supabase allows custom templates only with your own email provider (SMTP) on the free plan. Connect SMTP in Supabase → Authentication → Emails, then run this again."
      : `✗ Could not update the email templates (${mail.status}): ${reason}`);
    process.exitCode = 1;
  }
}
