"use client"

import { useEffect, useState } from "react"
import { Sunrise, Sun, Sunset, Moon, CalendarDays } from "lucide-react"

import {
  getTodayPrayerSchedule,
  formatWIBTime,
  formatCountdown,
  PRAYER_LABELS,
  type PrayerName,
} from "@/lib/prayer-times"
import { cn } from "@/lib/utils"

const WIB_TIME_ZONE = "Asia/Jakarta"

function wibHour(date: Date) {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: WIB_TIME_ZONE,
      hour: "numeric",
      hourCycle: "h23",
    }).format(date)
  )
}

function formatTanggalWIB(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: WIB_TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

function timeOfDay(hour: number) {
  if (hour < 11) return { label: "Selamat Pagi", Icon: Sunrise }
  if (hour < 15) return { label: "Selamat Siang", Icon: Sun }
  if (hour < 18) return { label: "Selamat Sore", Icon: Sunset }
  return { label: "Selamat Malam", Icon: Moon }
}

const PRAYER_ORDER: PrayerName[] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"]

// One dark hero panel instead of two stacked ones — greeting and prayer
// times used to be separate cards with the same background/pattern,
// which read as accidental repetition rather than one deliberate block.
export function HeroCard({ name }: { name: string }) {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  const Shell = ({ children }: { children: React.ReactNode }) => (
    // Fixed dark-olive brand panel — deliberately NOT the semantic
    // --primary/--primary-foreground pair, since those invert in dark
    // mode (primary becomes the light accent) and would wash this out.
    <section className="animate-fade-up relative overflow-hidden rounded-3xl bg-[linear-gradient(150deg,#3f572f,#182410_100%)] px-5 py-6 text-[#f9f8f1] shadow-lg shadow-black/25 sm:px-7 sm:py-7">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.09]"
        aria-hidden="true"
      >
        <pattern id="hero-star-pattern" width="46" height="46" patternUnits="userSpaceOnUse">
          <path
            d="M23 4 L27.5 17 L41 17 L30 25.5 L34 39 L23 30.5 L12 39 L16 25.5 L5 17 L18.5 17 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#hero-star-pattern)" />
      </svg>
      <svg
        viewBox="0 0 160 160"
        className="pointer-events-none absolute -right-6 -bottom-8 size-40 text-[#f9f8f1] opacity-[0.14] sm:size-48"
        aria-hidden="true"
      >
        <path d="M108 20a52 52 0 1 0 32 92 42 42 0 1 1-32-92Z" fill="currentColor" />
        <path
          d="M40 34l3.2 8.8L52 46l-8.8 3.2L40 58l-3.2-8.8L28 46l8.8-3.2Z"
          className="fill-accent-gold"
          opacity="0.9"
        />
        <path
          d="M132 96l2.4 6.6 6.6 2.4-6.6 2.4-2.4 6.6-2.4-6.6-6.6-2.4 6.6-2.4Z"
          className="fill-accent-gold"
          opacity="0.9"
        />
      </svg>
      <div className="relative grid gap-5">{children}</div>
    </section>
  )

  // Skeleton height-matched placeholder until mounted — avoids an
  // SSR/client mismatch on the live clock and countdown.
  if (!now) {
    return (
      <div className="animate-fade-up h-[268px] rounded-3xl bg-[linear-gradient(150deg,#3f572f,#182410_100%)] sm:h-[292px]" />
    )
  }

  const { label, Icon } = timeOfDay(wibHour(now))
  const { times, next } = getTodayPrayerSchedule(now)
  const countdownMs = next ? next.time.getTime() - now.getTime() : 0

  return (
    <Shell>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-full bg-[#f9f8f1]/15">
            <Icon className="size-4.5" />
          </span>
          <p className="text-sm font-medium text-[#f9f8f1]/85">{label}</p>
        </div>
        <p className="pt-1.5 text-xs font-medium text-[#f9f8f1]/70">
          {formatWIBTime(now)} WIB
        </p>
      </div>

      <div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {name}
        </h1>
        <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-[#f9f8f1]/70">
          <CalendarDays className="size-3.5" />
          {formatTanggalWIB(now)}
        </p>
      </div>

      <div className="border-t border-[#f9f8f1]/15 pt-4">
        {next && (
          <p className="mb-3 text-sm font-medium text-[#f9f8f1]/85">
            {PRAYER_LABELS[next.name]} {formatWIBTime(next.time)} &middot;{" "}
            {formatCountdown(countdownMs)} lagi
          </p>
        )}
        <div className="grid grid-cols-6 gap-1">
          {PRAYER_ORDER.map((name) => {
            const isNext = next?.name === name
            return (
              <div
                key={name}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-xl py-1.5",
                  isNext && "bg-[#f9f8f1]/12"
                )}
              >
                <p
                  className={cn(
                    "text-[10px] font-medium",
                    isNext ? "text-accent-gold" : "text-[#f9f8f1]/70"
                  )}
                >
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
    </Shell>
  )
}
