import { Coordinates, CalculationMethod, PrayerTimes } from "adhan"

// UPA Ash-Habul Kahfi is based in Cibitung, Kab. Bekasi (per the app
// footer) — fixed coordinates instead of browser geolocation, since this
// is a single-location community org, not a general-purpose prayer app.
const CIBITUNG_COORDINATES = new Coordinates(-6.2383, 107.1215)
const WIB_TIME_ZONE = "Asia/Jakarta"

export type PrayerName = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha"

export const PRAYER_LABELS: Record<PrayerName, string> = {
  fajr: "Subuh",
  sunrise: "Terbit",
  dhuhr: "Dzuhur",
  asr: "Ashar",
  maghrib: "Maghrib",
  isha: "Isya",
}

export type PrayerSchedule = {
  times: Record<PrayerName, Date>
  next: { name: PrayerName; time: Date } | null
}

function computeForDate(date: Date) {
  const params = CalculationMethod.Singapore()
  return new PrayerTimes(CIBITUNG_COORDINATES, date, params)
}

export function getTodayPrayerSchedule(now: Date): PrayerSchedule {
  const today = computeForDate(now)
  const times: Record<PrayerName, Date> = {
    fajr: today.fajr,
    sunrise: today.sunrise,
    dhuhr: today.dhuhr,
    asr: today.asr,
    maghrib: today.maghrib,
    isha: today.isha,
  }

  const order: PrayerName[] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"]
  const upcoming = order.find((name) => times[name].getTime() > now.getTime())

  if (upcoming) {
    return { times, next: { name: upcoming, time: times[upcoming] } }
  }

  // Past Isha — next prayer is tomorrow's Fajr.
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const fajrTomorrow = computeForDate(tomorrow).fajr
  return { times, next: { name: "fajr", time: fajrTomorrow } }
}

export function formatWIBTime(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: WIB_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function formatCountdown(ms: number) {
  const totalMinutes = Math.max(0, Math.floor(ms / 60000))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours > 0) return `${hours} jam ${minutes} menit`
  return `${minutes} menit`
}
