// The platform serves India only. Every form and every server check uses these
// rules, so a value accepted in the browser is the same value the server accepts.
//
// Phone numbers are stored as +91 followed by 10 digits ("+919876543210") and
// shown as "+91 98765 43210".

export const COUNTRY_CODE = "+91";
export const PHONE_DIGITS = 10;
export const PINCODE_DIGITS = 6;
export const INDIA_TIME_ZONE = "Asia/Kolkata";
export const INDIA_LOCALE = "en-IN";

// A personal mobile starts with 6-9. An office number may be a landline written
// with its STD code (e.g. 0120 4567890 becomes 1204567890), so it may start with 1-9.
export type PhoneKind = "mobile" | "landline";
const PHONE_PATTERNS: Record<PhoneKind, RegExp> = {
  mobile: /^[6-9]\d{9}$/,
  landline: /^[1-9]\d{9}$/,
};

// The national digits from anything typed or pasted: "+91 98765-43210",
// "098765 43210" and "919876543210" all give "9876543210". Extra digits are kept,
// so an over-long number is rejected rather than silently cut short.
function nationalDigits(value: string | null | undefined): string {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

// What the phone box shows while typing: the national digits, at most 10.
export function phoneDigits(value: string | null | undefined): string {
  return nationalDigits(value).slice(0, PHONE_DIGITS);
}

export function isValidPhone(value: string | null | undefined, kind: PhoneKind = "mobile") {
  return phoneError(value, { kind, required: true }) === null;
}

export function phoneError(value: string | null | undefined, { kind = "mobile", required = false }: { kind?: PhoneKind; required?: boolean } = {}): string | null {
  const digits = nationalDigits(value);
  if (!digits) return required ? "Enter a 10-digit mobile number." : null;
  if (digits.length < PHONE_DIGITS) return `Enter all 10 digits (${digits.length} entered).`;
  if (digits.length > PHONE_DIGITS) return `Enter exactly 10 digits (${digits.length} entered).`;
  if (!PHONE_PATTERNS[kind].test(digits)) return kind === "mobile" ? "A mobile number starts with 6, 7, 8 or 9." : "Enter a valid 10-digit number with its STD code.";
  return null;
}

// "+919876543210" for storage, or null when empty. Throws on an invalid number so
// server code can never save one.
export function toStoredPhone(value: string | null | undefined, options: { kind?: PhoneKind; required?: boolean; label?: string } = {}): string | null {
  const error = phoneError(value, options);
  if (error) throw new Error(options.label ? `${options.label}: ${error}` : error);
  const digits = nationalDigits(value);
  return digits ? `${COUNTRY_CODE}${digits}` : null;
}

// "+91 98765 43210". Values saved before these rules that cannot be read are shown as they are.
export function formatPhone(value: string | null | undefined): string {
  const digits = nationalDigits(value);
  if (digits.length !== PHONE_DIGITS) return String(value ?? "");
  return `${COUNTRY_CODE} ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export function phoneHref(value: string | null | undefined) {
  return `tel:${COUNTRY_CODE}${phoneDigits(value)}`;
}

export function whatsAppHref(value: string | null | undefined) {
  return `https://wa.me/91${phoneDigits(value)}`;
}

export function pincodeError(value: string | null | undefined, required = false): string | null {
  const pincode = String(value ?? "").trim();
  if (!pincode) return required ? "Enter the 6-digit PIN code." : null;
  if (!/^\d+$/.test(pincode)) return "A PIN code has digits only.";
  if (pincode.length !== PINCODE_DIGITS) return `Enter all 6 digits (${pincode.length} entered).`;
  if (pincode.startsWith("0")) return "A PIN code cannot start with 0.";
  return null;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export function emailError(value: string | null | undefined, required = false): string | null {
  const email = String(value ?? "").trim();
  if (!email) return required ? "Enter an email address." : null;
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) return "Enter a valid email address, e.g. name@school.in.";
  return null;
}

// Names of people: letters (any Indian script), spaces, dots, apostrophes and hyphens.
export function personNameError(value: string | null | undefined, required = true): string | null {
  const name = String(value ?? "").trim();
  if (!name) return required ? "Enter the name." : null;
  if (name.length < 2) return "The name is too short.";
  if (name.length > 80) return "Keep the name under 80 characters.";
  if (!/^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u.test(name)) return "Use letters only (spaces, dots and hyphens are fine).";
  return null;
}

// Rupee amounts: up to 2 decimal places (paise), never negative, at most ₹10 crore.
export const MAX_AMOUNT = 10_00_00_000;

export function amountError(value: string | number | null | undefined, { required = true, allowZero = false, max = MAX_AMOUNT }: { required?: boolean; allowZero?: boolean; max?: number } = {}): string | null {
  const text = String(value ?? "").trim();
  if (!text) return required ? "Enter the amount in rupees." : null;
  if (!/^\d+(\.\d{1,2})?$/.test(text)) return "Enter rupees in digits, with at most 2 decimal places (paise).";
  const amount = Number(text);
  if (!allowZero && amount <= 0) return "The amount must be more than ₹0.";
  if (amount > max) return `The amount cannot be more than ${new Intl.NumberFormat(INDIA_LOCALE, { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(max)}.`;
  return null;
}

export function formatIndianNumber(value: number | null | undefined) {
  return new Intl.NumberFormat(INDIA_LOCALE).format(value ?? 0);
}

// Dates are shown the Indian way, "02 Oct 2026", in Indian time.
export function formatDate(value: string | number | Date | null | undefined, fallback = "—") {
  if (value === null || value === undefined || value === "") return fallback;
  // A plain "2026-10-02" is a calendar date, not midnight UTC.
  const date = typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00+05:30`) : new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return new Intl.DateTimeFormat(INDIA_LOCALE, { day: "2-digit", month: "short", year: "numeric", timeZone: INDIA_TIME_ZONE }).format(date);
}

export function formatDateTime(value: string | number | Date | null | undefined, fallback = "—") {
  if (value === null || value === undefined || value === "") return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return new Intl.DateTimeFormat(INDIA_LOCALE, { day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true, timeZone: INDIA_TIME_ZONE }).format(date);
}

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
] as const;

export function stateError(value: string | null | undefined, required = false): string | null {
  const state = String(value ?? "").trim();
  if (!state) return required ? "Choose the state." : null;
  return (INDIAN_STATES as readonly string[]).includes(state) ? null : "Choose a state or union territory from the list.";
}

// Free text such as a city or school name: trimmed, length-checked, no control characters.
export function textError(value: string | null | undefined, { label = "This field", required = false, min = 2, max = 120 }: { label?: string; required?: boolean; min?: number; max?: number } = {}): string | null {
  const text = String(value ?? "").trim();
  if (!text) return required ? `${label} is required.` : null;
  if (text.length < min) return `${label} is too short.`;
  if (text.length > max) return `${label} must be under ${max} characters.`;
  if (/[\u0000-\u001f<>]/.test(text)) return `${label} contains characters that are not allowed.`;
  return null;
}

export function cityError(value: string | null | undefined, required = false): string | null {
  const city = String(value ?? "").trim();
  if (!city) return required ? "Enter the city." : null;
  if (!/^[\p{L}\p{M}][\p{L}\p{M} .'-]{1,59}$/u.test(city)) return "Enter a city name using letters only.";
  return null;
}

// Vehicle registration as issued by RTOs: "MH 12 AB 1234", "DL 1C 1234", or Bharat
// series "22 BH 1234 AA". Stored in capitals with single spaces.
export function normalizeVehicleNumber(value: string | null | undefined) {
  return String(value ?? "").toUpperCase().replace(/[^A-Z0-9]+/g, " ").trim();
}

export function vehicleNumberError(value: string | null | undefined, required = false): string | null {
  const compact = normalizeVehicleNumber(value).replace(/ /g, "");
  if (!compact) return required ? "Enter the vehicle registration number." : null;
  if (/^[A-Z]{2}\d{1,2}[A-Z]{0,3}\d{4}$/.test(compact) || /^\d{2}BH\d{4}[A-Z]{1,2}$/.test(compact)) return null;
  return "Enter the registration number as on the RC, e.g. MH 12 AB 1234.";
}

// Collects the first error per field; an empty object means the form is valid.
export function collectErrors<T extends string>(checks: Record<T, string | null>): Partial<Record<T, string>> {
  return Object.fromEntries(Object.entries(checks).filter(([, error]) => error)) as Partial<Record<T, string>>;
}

// "07:30:00" or "07:30" -> "7:30 am", as Indian schools write timings.
export function formatTime(value: string | null | undefined, fallback = "—") {
  const match = /^(\d{1,2}):(\d{2})/.exec(String(value ?? ""));
  if (!match) return fallback;
  const hours = Number(match[1]);
  return `${hours % 12 || 12}:${match[2]} ${hours < 12 ? "am" : "pm"}`;
}
