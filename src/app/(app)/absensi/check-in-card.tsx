"use client"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, MapPin, Clock, Sparkles } from "lucide-react"
import { toast } from "sonner"

import { formatTanggal } from "@/lib/format"
import { checkInAttendance } from "./actions"
import type { AttendanceStatus } from "@/generated/prisma/enums"

// Same dark-olive brand panel as the dashboard hero card, so self
// check-in reads as a natural extension of "today's liqo" rather than
// a bolted-on form.
export function CheckInCard({
  meeting,
  initialStatus,
}: {
  meeting: { id: string; tanggal: Date; jam: string; lokasi: string; tema: string }
  initialStatus: AttendanceStatus | null
}) {
  const [status, setStatus] = useState(initialStatus)
  const [isPending, startTransition] = useTransition()
  const checkedIn = status === "HADIR"

  function handleCheckIn() {
    startTransition(async () => {
      try {
        await checkInAttendance(meeting.id)
        setStatus("HADIR")
        toast.success("Hadir tercatat, semoga berkah ilmunya 🌿")
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Gagal mencatat kehadiran."
        )
      }
    })
  }

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[linear-gradient(150deg,#3f572f,#182410_100%)] px-5 py-6 text-[#f9f8f1] shadow-lg shadow-black/25 sm:px-7 sm:py-7">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.09]"
        aria-hidden="true"
      >
        <pattern id="checkin-star-pattern" width="46" height="46" patternUnits="userSpaceOnUse">
          <path
            d="M23 4 L27.5 17 L41 17 L30 25.5 L34 39 L23 30.5 L12 39 L16 25.5 L5 17 L18.5 17 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#checkin-star-pattern)" />
      </svg>

      <div className="relative grid gap-5">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-accent-gold" />
          <p className="text-sm font-medium text-[#f9f8f1]/85">
            Liqo Berikutnya
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {meeting.tema}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-[#f9f8f1]/70 sm:text-sm">
            <span>{formatTanggal(meeting.tanggal)}</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {meeting.jam} WIB
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" />
              {meeting.lokasi}
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {checkedIn ? (
            <motion.div
              key="checked-in"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="flex items-center gap-3 rounded-2xl bg-[#f9f8f1]/15 px-4 py-3.5"
            >
              <CheckCircle2 className="size-6 shrink-0 text-accent-gold" />
              <p className="text-sm font-medium">
                Kamu sudah tercatat <span className="text-accent-gold">Hadir</span> di
                pertemuan ini.
              </p>
            </motion.div>
          ) : (
            <motion.button
              key="check-in-button"
              type="button"
              onClick={handleCheckIn}
              disabled={isPending}
              whileTap={{ scale: 0.97 }}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-accent-gold text-[15px] font-semibold text-[#1c2919] shadow-lg shadow-black/20 transition-opacity disabled:opacity-60"
            >
              <CheckCircle2 className="size-5" />
              {isPending ? "Mencatat..." : "Hadir Sekarang"}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
