import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getSiteSettings } from "@/lib/site-content";
import { formatDate, formatPhone, phoneHref } from "@/lib/india";
import { isPaused, type SchoolAccount } from "@/lib/school-account";

export const metadata = {
  title: "Access Denied | Waves Platform",
};

export default async function AccessDeniedPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; reason?: string }>;
}) {
  const { area, reason } = await searchParams;
  const isSchool = area === "school";
  const isClient = area === "client";

  if (isSchool && reason === "paused") {
    const supabase = await createServerSupabaseClient();
    const [{ data: account }, settings] = await Promise.all([
      supabase.rpc("get_my_school_account").maybeSingle<SchoolAccount>(),
      getSiteSettings(),
    ]);
    if (isPaused(account)) return <AccountPaused account={account!} phone={settings.phone} email={settings.support_email || settings.sales_email} />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <section className="w-full max-w-lg border-t-4 border-red-700 bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase text-red-700">Access restricted</p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">This account is not authorized</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {isSchool
            ? "This account does not have one active school workspace membership. Contact your school administrator."
            : isClient
              ? "This account does not have one active client workspace membership. Contact your organization administrator."
              : "This account is not an active platform administrator. Contact the Waves platform owner."}
        </p>
        <Link href={isSchool ? "/school/login" : isClient ? "/login" : "/admin/login"} className="mt-6 inline-flex font-semibold text-blue-700 hover:text-blue-900">
          Return to sign in
        </Link>
      </section>
    </main>
  );
}

function AccountPaused({ account, phone, email }: { account: SchoolAccount; phone: string; email: string }) {
  const ended = account.subscription_status === "past_due" && account.next_billing_date;
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10">
      <section className="w-full max-w-lg border-t-4 border-amber-500 bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase text-amber-700">Account paused</p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">{account.organization_name} is paused</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {ended
            ? `The Waves plan ended on ${formatDate(account.next_billing_date)} and has not been renewed, so sign-in to the School ERP is paused.`
            : "Sign-in to the School ERP is paused for this school."}
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Your students, fees, attendance and other records are safe. Nothing has been deleted. Access returns as soon as the plan is renewed.
        </p>
        <div className="mt-6 rounded border border-slate-200 bg-slate-50 p-4 text-sm">
          <p className="font-semibold text-slate-900">To renew, contact Waves</p>
          <ul className="mt-2 space-y-1 text-slate-700">
            {phone && <li>Phone: <a href={phoneHref(phone)} className="font-semibold text-blue-700 hover:text-blue-900">{formatPhone(phone)}</a></li>}
            {email && <li>Email: <a href={`mailto:${email}`} className="font-semibold text-blue-700 hover:text-blue-900">{email}</a></li>}
            {!phone && !email && <li><Link href="/contact" className="font-semibold text-blue-700 hover:text-blue-900">Contact us</Link></li>}
          </ul>
        </div>
        <Link href="/school/login" className="mt-6 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900">
          Back to sign in
        </Link>
      </section>
    </main>
  );
}
