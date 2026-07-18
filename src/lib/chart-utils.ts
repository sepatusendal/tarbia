export type Period = "weekly" | "monthly" | "yearly"

const PERIOD_COUNT: Record<Period, number> = {
  weekly: 8,
  monthly: 6,
  yearly: 4,
}

function startOfWeek(d: Date) {
  const date = new Date(d)
  const day = date.getDay()
  const diff = (day === 0 ? -6 : 1) - day
  date.setDate(date.getDate() + diff)
  date.setHours(0, 0, 0, 0)
  return date
}

function bucketLabel(start: Date, period: Period) {
  if (period === "weekly") {
    return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" }).format(start)
  }
  if (period === "monthly") {
    return new Intl.DateTimeFormat("id-ID", { month: "short" }).format(start)
  }
  return String(start.getFullYear())
}

export type Bucket = { label: string; start: Date; end: Date }

export function buildBuckets(period: Period): Bucket[] {
  const count = PERIOD_COUNT[period]
  const now = new Date()
  const buckets: Bucket[] = []

  for (let i = count - 1; i >= 0; i--) {
    let start: Date
    let end: Date
    if (period === "weekly") {
      start = startOfWeek(new Date(now.getFullYear(), now.getMonth(), now.getDate() - i * 7))
      end = new Date(start)
      end.setDate(end.getDate() + 7)
    } else if (period === "monthly") {
      start = new Date(now.getFullYear(), now.getMonth() - i, 1)
      end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
    } else {
      start = new Date(now.getFullYear() - i, 0, 1)
      end = new Date(now.getFullYear() - i + 1, 0, 1)
    }
    buckets.push({ label: bucketLabel(start, period), start, end })
  }

  return buckets
}
