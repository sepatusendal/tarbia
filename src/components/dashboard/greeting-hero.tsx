import { Sunrise, Sun, Sunset, Moon, CalendarDays } from "lucide-react"

import { formatTanggal } from "@/lib/format"

function timeOfDay(hour: number) {
  if (hour < 11) return { label: "Selamat Pagi", Icon: Sunrise }
  if (hour < 15) return { label: "Selamat Siang", Icon: Sun }
  if (hour < 18) return { label: "Selamat Sore", Icon: Sunset }
  return { label: "Selamat Malam", Icon: Moon }
}

export function GreetingHero({ name, now }: { name: string; now: Date }) {
  const { label, Icon } = timeOfDay(now.getHours())

  return (
    <section className="animate-fade-up relative overflow-hidden rounded-3xl bg-[linear-gradient(150deg,var(--primary),color-mix(in_srgb,var(--primary)_75%,#0d1a08)_100%)] px-5 py-6 text-primary-foreground shadow-lg shadow-primary/20 sm:px-7 sm:py-7">
      {/* Tiled geometric star pattern, brand texture rather than literal ornament */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.09]"
        aria-hidden="true"
      >
        <pattern
          id="hero-star-pattern"
          width="46"
          height="46"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M23 4 L27.5 17 L41 17 L30 25.5 L34 39 L23 30.5 L12 39 L16 25.5 L5 17 L18.5 17 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#hero-star-pattern)" />
      </svg>

      {/* Crescent + stars accent, bleeding off the bottom-right corner */}
      <svg
        viewBox="0 0 160 160"
        className="pointer-events-none absolute -right-6 -bottom-8 size-40 text-primary-foreground opacity-[0.14] sm:size-48"
        aria-hidden="true"
      >
        <path
          d="M108 20a52 52 0 1 0 32 92 42 42 0 1 1-32-92Z"
          fill="currentColor"
        />
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

      <div className="relative grid gap-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/15">
            <Icon className="size-4.5" />
          </span>
          <p className="text-sm font-medium text-primary-foreground/85">
            {label}
          </p>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {name}
        </h1>

        <p className="flex items-center gap-1.5 text-xs font-medium text-primary-foreground/70">
          <CalendarDays className="size-3.5" />
          {formatTanggal(now)}
        </p>
      </div>
    </section>
  )
}
