import { parseWIBDate, wibDateParts } from "@/lib/timezone"

export type Period = "weekly" | "monthly" | "yearly"

const PERIOD_COUNT: Record<Period, number> = {
  weekly: 8,
  monthly: 6,
  yearly: 4,
}

// "Civil" dates below are UTC-anchored Date objects used purely as a
// calendar abstraction (year/month/day/day-of-week arithmetic) — never as
// real instants. Using UTC getters/setters on them keeps the arithmetic
// correct regardless of the server's own timezone; only `toWIBInstant`
// converts a civil date into an actual point in time (WIB midnight), the
// same way lib/timezone.ts anchors date-only form inputs.
function civilDate(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month - 1, day))
}

function toWIBInstant(civil: Date): Date {
  const y = civil.getUTCFullYear()
  const m = String(civil.getUTCMonth() + 1).padStart(2, "0")
  const d = String(civil.getUTCDate()).padStart(2, "0")
  return parseWIBDate(`${y}-${m}-${d}`)
}

function startOfWeek(civil: Date) {
  const date = new Date(civil)
  const day = date.getUTCDay()
  const diff = (day === 0 ? -6 : 1) - day
  date.setUTCDate(date.getUTCDate() + diff)
  return date
}

function bucketLabel(civil: Date, period: Period) {
  if (period === "weekly") {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    }).format(civil)
  }
  if (period === "monthly") {
    return new Intl.DateTimeFormat("id-ID", { month: "short", timeZone: "UTC" }).format(civil)
  }
  return String(civil.getUTCFullYear())
}

export type Bucket = { label: string; start: Date; end: Date }

export function buildBuckets(period: Period): Bucket[] {
  const count = PERIOD_COUNT[period]
  const today = wibDateParts()
  const todayCivil = civilDate(today.year, today.month, today.day)
  const buckets: Bucket[] = []

  for (let i = count - 1; i >= 0; i--) {
    let startCivil: Date
    let endCivil: Date
    if (period === "weekly") {
      const ref = new Date(todayCivil)
      ref.setUTCDate(ref.getUTCDate() - i * 7)
      startCivil = startOfWeek(ref)
      endCivil = new Date(startCivil)
      endCivil.setUTCDate(endCivil.getUTCDate() + 7)
    } else if (period === "monthly") {
      startCivil = civilDate(today.year, today.month - i, 1)
      endCivil = civilDate(today.year, today.month - i + 1, 1)
    } else {
      startCivil = civilDate(today.year - i, 1, 1)
      endCivil = civilDate(today.year - i + 1, 1, 1)
    }
    buckets.push({
      label: bucketLabel(startCivil, period),
      start: toWIBInstant(startCivil),
      end: toWIBInstant(endCivil),
    })
  }

  return buckets
}
