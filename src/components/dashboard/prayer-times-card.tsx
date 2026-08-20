"use client"

import { useEffect, useState } from "react"
import { Sunrise, Sun, Cloud, Sunset, Moon, MoonStar } from "lucide-react"

import {
  getTodayPrayerSchedule,
  formatWIBTime,
  formatCountdown,
  PRAYER_LABELS,
  type PrayerName,
} from "@/lib/prayer-times"
import { cn } from "@/lib/utils"

const PRAYER_ICONS: Record<PrayerName, React.ComponentType<{ className?: string }>> = {
  fajr: Sunrise,
  sunrise: Sun,
  dhuhr: Cloud,
  asr: Sunset,
  maghrib: Sunset,
  isha: MoonStar,
}

const ORDER: PrayerName[] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"]

export function PrayerTimesCard() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  // Avoid an SSR/client mismatch on the live clock — render nothing
  // meaningful until mounted, then the interval keeps it fresh.
  if (!now) {
    return (
      <div className="animate-fade-up h-[172px] rounded-3xl bg-[linear-gradient(150deg,#3f572f,#182410_100%)]" />
    )
  }

  const { times, next } = getTodayPrayerSchedule(now)
  const countdownMs = next ? next.time.getTime() - now.getTime() : 0

  return (
    <div className="animate-fade-up relative overflow-hidden rounded-3xl bg-[linear-gradient(150deg,#3f572f,#182410_100%)] px-5 py-5 text-[#f9f8f1] shadow-lg shadow-black/25">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]"
        aria-hidden="true"
      >
        <pattern id="prayer-star-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M20 3 L24 16 L37 16 L26 23 L30 36 L20 27 L10 36 L14 23 L3 16 L16 16 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#prayer-star-pattern)" />
      </svg>

      <div className="relative grid gap-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-[#f9f8f1]/70">
            Cibitung, Kab. Bekasi
          </p>
          <p className="text-xs font-medium text-[#f9f8f1]/70">
            {formatWIBTime(now)} WIB
          </p>
        </div>

        {next && (
          <div>
            <p className="text-2xl font-semibold tracking-tight">
              {PRAYER_LABELS[next.name]} {formatWIBTime(next.time)}
            </p>
            <p className="text-sm text-[#f9f8f1]/70">
              {formatCountdown(countdownMs)} lagi
            </p>
          </div>
        )}

        <div className="grid grid-cols-6 gap-1">
          {ORDER.map((name) => {
            const Icon = PRAYER_ICONS[name]
            const isNext = next?.name === name
            return (
              <div
                key={name}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl py-2",
                  isNext && "bg-[#f9f8f1]/12"
                )}
              >
                <Icon
                  className={cn(
                    "size-4",
                    isNext ? "text-accent-gold" : "text-[#f9f8f1]/60"
                  )}
                />
                <p className="text-[10px] font-medium text-[#f9f8f1]/80">
                  {PRAYER_LABELS[name]}
                </p>
                <p className="text-[10px] text-[#f9f8f1]/60">
                  {formatWIBTime(times[name])}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
