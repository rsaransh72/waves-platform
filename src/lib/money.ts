// The platform serves India only: every amount is stored as a plain number of rupees
// and shown with the ₹ sign and Indian digit grouping (₹1,25,000).
export const BILLING_CURRENCY = "INR";

const moneyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: BILLING_CURRENCY,
  maximumFractionDigits: 2,
});

const plainNumberFormatter = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function toAmount(value: number | string | null | undefined) {
  const amount = typeof value === "string" ? Number(value) : value ?? 0;
  return Number.isFinite(amount) ? amount : 0;
}

export function formatMoney(value: number | string | null | undefined) {
  return moneyFormatter.format(toAmount(value));
}

// A plan price as rupees: 25000, "25,000", "₹25000", "Rs. 25000" and "25000/-" all give
// 25000. Anything else ("$49/mo", "On request") gives null, i.e. pricing on request.
export function rupeePrice(value: number | string | null | undefined): number | null {
  if (value === undefined || value === null || value === "") return null;
  const amount = typeof value === "number" ? value : Number(String(value).replace(/[₹,\s]|\/-$/g, "").replace(/^rs\.?/i, ""));
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function belowHundred(n: number) {
  return n < 20 ? ONES[n] : `${TENS[Math.floor(n / 10)]}${n % 10 ? ` ${ONES[n % 10]}` : ""}`;
}

function belowThousand(n: number) {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  return [hundreds ? `${ONES[hundreds]} Hundred` : "", rest ? belowHundred(rest) : ""].filter(Boolean).join(" ");
}

// Indian numbering (lakh, crore) as printed on school fee receipts:
// 125050.5 -> "Rupees One Lakh Twenty Five Thousand Fifty and Fifty Paise Only".
export function amountInWords(value: number | string) {
  const amount = Math.round(toAmount(value) * 100) / 100;
  let rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  const parts: string[] = [];
  for (const [size, label] of [[10_000_000, "Crore"], [100_000, "Lakh"], [1_000, "Thousand"]] as const) {
    const count = Math.floor(rupees / size);
    if (count) parts.push(`${count >= 1000 ? amountInWords(count).replace(/^Rupees |\s*Only$/g, "") : belowThousand(count)} ${label}`);
    rupees %= size;
  }
  if (rupees) parts.push(belowThousand(rupees));
  const words = parts.join(" ") || "Zero";
  return `Rupees ${words}${paise ? ` and ${belowHundred(paise)} Paise` : ""} Only`;
}

// For PDFs: the built-in jsPDF fonts cannot draw the rupee sign, so "Rs. 1,25,000.00".
export function formatMoneyCode(value: number | string | null | undefined) {
  return `Rs. ${plainNumberFormatter.format(toAmount(value))}`;
}
