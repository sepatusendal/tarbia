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

// The given instant's calendar date in WIB, as plain numbers — safe to
// feed into calendar arithmetic without the server's own timezone
// creeping back in.
export function wibDateParts(date: Date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: WIB_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date)

  const get = (type: string) => Number(parts.find((p) => p.type === type)!.value)
  return { year: get("year"), month: get("month"), day: get("day") }
}

// Start of "today" in WIB, as the correct UTC instant — for `gte`/`lt`
// boundaries so a meeting or transaction dated today stays classified as
// today for the whole WIB day, regardless of the server's own timezone.
export function startOfWIBToday(): Date {
  const { year, month, day } = wibDateParts()
  return parseWIBDate(
    `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  )
}
