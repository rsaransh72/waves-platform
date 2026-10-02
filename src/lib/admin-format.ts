import { formatDate, formatDateTime } from "@/lib/india";

// Admin dates follow the Indian format and time zone: "02 Oct 2026, 4:30 pm".
export function formatAdminDate(value: string | Date | null | undefined) {
  return formatDate(value, "Not set");
}

export function formatAdminDateTime(value: string | Date | null | undefined) {
  return formatDateTime(value, "Not set");
}

// "just now", "12 min ago", "3 days ago"; older than a month falls back to the date.
export function formatRelative(value: string | Date | null | undefined, now = Date.now()) {
  if (!value) return "Never";
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return "Never";
  const seconds = Math.round((time - now) / 1000);
  const abs = Math.abs(seconds);
  if (abs < 60) return "just now";
  const format = new Intl.RelativeTimeFormat("en-IN", { numeric: "auto" });
  if (abs < 3600) return format.format(Math.round(seconds / 60), "minute");
  if (abs < 86400) return format.format(Math.round(seconds / 3600), "hour");
  if (abs < 30 * 86400) return format.format(Math.round(seconds / 86400), "day");
  return formatDate(value, "Never");
}
