import { formatDate, formatDateTime } from "@/lib/india";

// Admin dates follow the Indian format and time zone: "02 Oct 2026, 4:30 pm".
export function formatAdminDate(value: string | Date | null | undefined) {
  return formatDate(value, "Not set");
}

export function formatAdminDateTime(value: string | Date | null | undefined) {
  return formatDateTime(value, "Not set");
}
