// Rules for onboarding a client. The onboarding form and /api/admin/school-clients
// both use them, so the form shows exactly the errors the server would return.
import { amountError, cityError, collectErrors, emailError, phoneError, pincodeError, stateError, textError } from "@/lib/india";
import { schoolToday } from "@/lib/school-date";

export const SLUG_MAX = 60;
export const PLAN_NAME_MAX = 100;
export const ADDRESS_MAX = 250;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_TERM_YEARS = 5;

export type SubscriptionStart = "active" | "trialing";

export type OnboardingInput = {
  name: string;
  slug: string;
  productSlug: string;
  planName: string;
  planAmount: string;
  subscriptionStatus: string;
  termEnd: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

export type OnboardingField = keyof OnboardingInput;
export type OnboardingErrors = Partial<Record<OnboardingField, string>>;

export function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, SLUG_MAX).replace(/-+$/, "");
}

export function slugError(value: string | null | undefined): string | null {
  const slug = String(value ?? "").trim();
  if (!slug) return "Enter a web address for the client.";
  if (slug.length < 3) return "Use at least 3 characters.";
  if (slug.length > SLUG_MAX) return `Keep it under ${SLUG_MAX} characters.`;
  if (!SLUG_PATTERN.test(slug)) return "Use lowercase letters, numbers and single hyphens, e.g. green-valley-school.";
  return null;
}

// "2026-10-02" plus whole days or months, as a calendar date.
export function shiftDate(date: string, { days = 0, months = 0 }: { days?: number; months?: number }) {
  const start = new Date(`${date}T00:00:00Z`);
  // 31 Jan + 1 month is 28/29 Feb, not 3 Mar.
  const lastDay = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + months + 1, 0)).getUTCDate();
  const shifted = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + months, Math.min(start.getUTCDate(), lastDay) + days));
  return shifted.toISOString().slice(0, 10);
}

export function termEndError(value: string | null | undefined, today = schoolToday()): string | null {
  const date = String(value ?? "").trim();
  if (!date) return "Choose the date the term ends.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(new Date(`${date}T00:00:00Z`).getTime())) return "Enter a valid date.";
  if (date <= today) return "The term must end after today.";
  if (date > shiftDate(today, { months: MAX_TERM_YEARS * 12 })) return `The term can be at most ${MAX_TERM_YEARS} years. Check the year.`;
  return null;
}

export function validateOnboarding(input: OnboardingInput, today = schoolToday()): OnboardingErrors {
  const trial = input.subscriptionStatus === "trialing";
  return collectErrors<OnboardingField>({
    name: textError(input.name, { label: "Organization name", required: true, max: 200 }),
    slug: slugError(input.slug),
    productSlug: input.productSlug ? null : "Choose the product the client is buying.",
    planName: textError(input.planName, { label: "Plan name", required: true, max: PLAN_NAME_MAX }),
    planAmount: amountError(input.planAmount, { allowZero: true })
      ?? (!trial && Number(input.planAmount) === 0 ? "A paying client needs an amount above ₹0. Choose Trial / pilot for a free pilot." : null),
    subscriptionStatus: input.subscriptionStatus === "active" || trial ? null : "Choose how the client starts.",
    termEnd: termEndError(input.termEnd, today),
    email: emailError(input.email, true),
    phone: phoneError(input.phone, { kind: "landline" }),
    address: textError(input.address, { label: "Address", max: ADDRESS_MAX }),
    city: cityError(input.city),
    state: stateError(input.state),
    pincode: pincodeError(input.pincode),
  });
}
