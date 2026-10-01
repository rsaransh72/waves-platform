// All amounts on the platform are stored as plain numbers in this single currency.
export const BILLING_CURRENCY = process.env.NEXT_PUBLIC_BILLING_CURRENCY || "INR";

const moneyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: BILLING_CURRENCY,
  maximumFractionDigits: 2,
});

const moneyCodeFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: BILLING_CURRENCY,
  currencyDisplay: "code",
  maximumFractionDigits: 2,
});

function toAmount(value: number | string | null | undefined) {
  const amount = typeof value === "string" ? Number(value) : value ?? 0;
  return Number.isFinite(amount) ? amount : 0;
}

export function formatMoney(value: number | string | null | undefined) {
  return moneyFormatter.format(toAmount(value));
}

// For PDFs: the built-in jsPDF fonts cannot draw symbols such as the rupee sign.
export function formatMoneyCode(value: number | string | null | undefined) {
  return moneyCodeFormatter.format(toAmount(value));
}
