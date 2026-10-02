// A school's own plan status, from get_my_school_account() (supabase/school_account_status.sql).
import { formatDate } from "@/lib/india";

export type SchoolAccount = {
  organization_name: string;
  organization_status: string;
  subscription_status: string | null;
  next_billing_date: string | null;
};

export type BillingNotice = { tone: "overdue" | "ending"; message: string; phone?: string };

const DAY = 86_400_000;

export const isPaused = (account: SchoolAccount | null | undefined) =>
  account?.organization_status === "suspended" || account?.organization_status === "inactive";

// The principal sees this above every page: an unpaid plan, or one ending within a week.
export function billingNotice(account: SchoolAccount | null | undefined, now: number): BillingNotice | null {
  if (!account?.next_billing_date || isPaused(account)) return null;
  const ends = new Date(account.next_billing_date).getTime();
  const days = Math.ceil((ends - now) / DAY);
  const endDate = formatDate(account.next_billing_date);
  if (account.subscription_status === "past_due" || days < 0) {
    const late = Math.max(1, -days);
    return { tone: "overdue", message: `Your Waves plan ended on ${endDate} and the renewal is overdue by ${late} ${late === 1 ? "day" : "days"}. Renew to keep using the ERP without a break.` };
  }
  if (days <= 7) {
    return { tone: "ending", message: `Your Waves plan ends on ${endDate}${days <= 1 ? "" : `, in ${days} days`}. Renew before then to avoid a pause.` };
  }
  return null;
}
