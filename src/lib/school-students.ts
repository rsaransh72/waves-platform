// Admission details for a student, shared by the admission form and the spreadsheet
// importer. The database checks the same values (supabase/school_students_admission.sql).
import { schoolToday } from "@/lib/school-date";

export const GENDERS = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Other" },
] as const;

// Social category as UDISE+ records it.
export const CATEGORIES = [
  { value: "general", label: "General" },
  { value: "ews", label: "EWS" },
  { value: "obc", label: "OBC" },
  { value: "sc", label: "SC" },
  { value: "st", label: "ST" },
] as const;

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

const CODE = /^[A-Za-z0-9/-]+$/;

// Roll numbers, admission numbers and employee IDs: letters, digits, "/" and "-".
export function codeError(value: string, label: string, required = true): string | null {
  if (!value) return required ? `${label} is required.` : null;
  if (value.length > 20) return `${label} must be 20 characters or fewer.`;
  if (!CODE.test(value)) return `${label} may use only letters, digits, / and -.`;
  return null;
}

export function dateOfBirthError(value: string | null | undefined): string | null {
  if (!value) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Enter the date of birth as a date.";
  if (value < "1990-01-01") return "Check the year of birth.";
  if (value > schoolToday()) return "The date of birth cannot be in the future.";
  return null;
}

// Match what people type in a spreadsheet ("F", "Girl", "OBC-NCL", "b +ve") to the stored values.
export function parseGender(value: string): string | null | undefined {
  const text = value.trim().toLowerCase();
  if (!text) return null;
  if (["f", "female", "girl"].includes(text)) return "female";
  if (["m", "male", "boy"].includes(text)) return "male";
  if (["o", "other", "others", "transgender"].includes(text)) return "other";
  return undefined;
}

export function parseCategory(value: string): string | null | undefined {
  const text = value.trim().toLowerCase().replace(/[^a-z]/g, "");
  if (!text) return null;
  if (["general", "gen", "gn", "unreserved", "ur"].includes(text)) return "general";
  if (text === "ews") return "ews";
  if (text.startsWith("obc")) return "obc";
  if (text === "sc") return "sc";
  if (text === "st") return "st";
  return undefined;
}

export function parseBloodGroup(value: string): string | null | undefined {
  const text = value.trim().toUpperCase().replace(/\s+/g, "").replace(/VE$/, "").replace(/POSITIVE$/, "+").replace(/NEGATIVE$/, "-");
  if (!text) return null;
  return (BLOOD_GROUPS as readonly string[]).includes(text) ? text : undefined;
}

// A date from a spreadsheet cell: an Excel serial number, "12-05-2015", "12/05/2015",
// "12.05.2015" (day first, as written in India) or "2015-05-12". Returns YYYY-MM-DD.
export function parseSheetDate(value: unknown): string | null | undefined {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  if (typeof value === "number" && value > 0 && value < 80000) {
    const date = new Date(Date.UTC(1899, 11, 30) + Math.round(value) * 86400000);
    return date.toISOString().slice(0, 10);
  }
  const text = String(value).trim();
  let match = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) return isoDate(+match[1], +match[2], +match[3]);
  match = text.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (match) return isoDate(+match[3], +match[2], +match[1]);
  return undefined;
}

function isoDate(year: number, month: number, day: number) {
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return undefined;
  return date.toISOString().slice(0, 10);
}

export const genderLabel = (value: string | null | undefined) => GENDERS.find((item) => item.value === value)?.label ?? "—";
export const categoryLabel = (value: string | null | undefined) => CATEGORIES.find((item) => item.value === value)?.label ?? "—";
