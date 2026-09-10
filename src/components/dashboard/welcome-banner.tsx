"use client"

import { useEffect, useState } from "react"
import { Compass, X } from "lucide-react"

const DISMISSED_KEY = "tarbia:welcome-dismissed"

// A one-time orientation hint, not a tour — most of what's here (Absensi,
// Materi, Al-Qur'an, Anggota) lives one tap away via the grid below or the
// "+" menu, but a brand-new member has no way to know that on first login.
// localStorage-only: skipping this once more on a new device is a
// non-issue, so it's not worth a DB column just to track "seen it".
export function WelcomeBanner({ name }: { name: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const checkDismissed = () => {
      try {
        if (!localStorage.getItem(DISMISSED_KEY)) setVisible(true)
      } catch {
        // localStorage unavailable (private mode etc.) — just skip the hint
      }
    }
    checkDismissed()
  }, [])

  function dismiss() {
    setVisible(false)
    try {
      localStorage.setItem(DISMISSED_KEY, "1")
    } catch {
      // ignore — worst case the hint reappears next visit
    }
  }

  if (!visible) return null

  return (
    <div className="animate-fade-up flex items-start gap-3 rounded-2xl border border-primary/15 bg-primary/[0.06] px-4 py-3.5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Compass className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">Halo, {name} 👋</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Absensi, Materi, Al-Qur&apos;an, dan Anggota ada di grid bawah ini,
          atau tombol <span className="font-medium text-foreground">+</span> di
          navigasi bawah kapan pun kamu butuh.
        </p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Tutup"
        className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
