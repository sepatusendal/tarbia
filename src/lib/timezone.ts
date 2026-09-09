// Server-side date handling for a WIB-only org (Cibitung, Kab. Bekasi).
// The app's date-only inputs (`<input type="date">`) and "is this meeting
// upcoming" comparisons all need to reason in WIB, but this runs on
// Vercel's serverless functions, which default to UTC — `new Date("2026-09-10")`
// parses as UTC midnight, `date.setHours(0,0,0,0)` zeroes out in the
// server's local (UTC) zone, and `now.getFullYear()/getMonth()/getDate()`
// read UTC-based components. Every one of those silently shifts "today"
// by 7 hours, which is exactly why a meeting scheduled for later today
// could vanish from "akan datang" the moment the server's UTC clock
// crossed midnight (07:00 WIB).
export const WIB_TIME_ZONE = "Asia/Jakarta"

// Parses a date-only string (from a date input, "YYYY-MM-DD") as midnight
// in WIB rather than UTC.
export function parseWIBDate(dateOnly: string): Date {
  return new Date(`${dateOnly}T00:00:00+07:00`)
}

// Start of "today" in WIB, as the correct UTC instant — for `gte`/`lt`
// boundaries so a meeting or transaction dated today stays classified as
// today for the whole WIB day, regardless of the server's own timezone.
export function startOfWIBToday(): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: WIB_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date())

  const get = (type: string) => parts.find((p) => p.type === type)!.value
  return parseWIBDate(`${get("year")}-${get("month")}-${get("day")}`)
}
