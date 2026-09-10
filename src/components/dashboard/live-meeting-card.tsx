import Link from "next/link"
import { MapPin, ArrowRight, FileText, PlayCircle } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Shown instead of the plain "next meeting" countdown card when that
// meeting is happening today — the actual moment people are sitting in
// liqo reaching for their phone to pull up the PDF/video, so materi goes
// straight into this card instead of requiring a trip to /materi first.
export function LiveMeetingCard({
  meeting,
}: {
  meeting: {
    id: string
    tema: string
    jam: string
    lokasi: string
    materi: { fileUrl: string | null; videoUrl: string | null } | null
  }
}) {
  const hasMateri = meeting.materi && (meeting.materi.fileUrl || meeting.materi.videoUrl)

  return (
    <Card className="overflow-hidden rounded-3xl border-accent-gold/30 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent-gold)_14%,var(--card)),var(--card)_55%)] ring-accent-gold/20">
      <CardContent className="grid gap-5 py-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-accent-gold">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-gold opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-accent-gold" />
              </span>
              SEDANG BERLANGSUNG
            </span>
            <p className="mt-1 text-lg font-semibold tracking-tight">
              {meeting.tema}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3.5" />
              {meeting.lokasi} &middot; {meeting.jam} WIB
            </p>
          </div>
        </div>

        {hasMateri ? (
          <div className="grid gap-2">
            {meeting.materi?.fileUrl && (
              <a
                href={meeting.materi.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-12 items-center gap-3 rounded-2xl bg-primary px-4 text-primary-foreground shadow-sm transition-opacity active:opacity-90"
              >
                <FileText className="size-4.5 shrink-0" />
                <span className="flex-1 text-sm font-semibold">Buka PDF Materi</span>
              </a>
            )}
            {meeting.materi?.videoUrl && (
              <a
                href={meeting.materi.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-12 items-center gap-3 rounded-2xl border border-border bg-card px-4 transition-colors active:bg-muted/50"
              >
                <PlayCircle className="size-4.5 shrink-0 text-primary" />
                <span className="flex-1 text-sm font-medium">Tonton Video</span>
              </a>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Materi belum diunggah pengurus.
          </p>
        )}

        <Button
          variant="outline"
          nativeButton={false}
          className="h-11 w-full rounded-xl bg-card/70"
          render={
            <Link href={`/materi?meetingId=${meeting.id}`}>
              Lihat Semua Materi
              <ArrowRight className="size-4" />
            </Link>
          }
        />
      </CardContent>
    </Card>
  )
}
