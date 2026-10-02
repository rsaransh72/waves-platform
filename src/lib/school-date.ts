// "Today" for the school, not for the server. A UTC date is still yesterday in
// India until 05:30, which would open the wrong attendance register.
export const SCHOOL_TIME_ZONE = process.env.NEXT_PUBLIC_SCHOOL_TIME_ZONE || "Asia/Kolkata";

export function schoolToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: SCHOOL_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}
