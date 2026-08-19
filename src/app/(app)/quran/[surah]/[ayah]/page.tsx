import { notFound } from "next/navigation"

import { requireUser } from "@/lib/auth-helpers"
import { getVerseByKey } from "@/lib/quran/client"
import { isBookmarked } from "@/lib/quran/queries"
import { recordLastRead } from "@/lib/quran/mutations"
import { Card, CardContent } from "@/components/ui/card"
import { BookmarkButton } from "@/components/quran/bookmark-button"
import { ShareButton } from "@/components/quran/share-button"

export default async function VerseDetailPage({
  params,
}: {
  params: Promise<{ surah: string; ayah: string }>
}) {
  const user = await requireUser()
  const { surah, ayah } = await params

  const surahId = Number(surah)
  const ayahNumber = Number(ayah)
  if (!Number.isInteger(surahId) || !Number.isInteger(ayahNumber)) notFound()

  const verse = await getVerseByKey(`${surahId}:${ayahNumber}`).catch(() => null)
  if (!verse) notFound()

  const [bookmarked] = await Promise.all([
    isBookmarked(user.id, surahId, ayahNumber),
    recordLastRead(user.id, verse),
  ])

  return (
    <div className="grid gap-6 pb-4">
      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {verse.ayahNumber}
        </span>
        <div>
          <h1 className="text-lg font-semibold">{verse.surahName}</h1>
          <p dir="rtl" lang="ar" className="font-arabic text-sm text-muted-foreground">
            {verse.surahNameArabic}
          </p>
        </div>
      </div>

      <Card className="overflow-hidden rounded-3xl">
        <CardContent className="grid gap-6 py-2">
          <p
            dir="rtl"
            lang="ar"
            className="font-arabic text-right text-4xl leading-[2.4] text-balance"
          >
            {verse.arabicText}
          </p>

          {verse.transliteration && (
            <div className="grid gap-1.5 border-t border-dashed pt-5">
              <p className="text-[11px] font-bold tracking-[0.1em] text-primary uppercase">
                Latin
              </p>
              <p className="text-base leading-relaxed text-foreground/90">
                {verse.transliteration}
              </p>
            </div>
          )}

          <div className="grid gap-1.5 border-t pt-5">
            <p className="text-[11px] font-bold tracking-[0.1em] text-primary uppercase">
              Terjemahan
            </p>
            <p className="text-base leading-relaxed">{verse.translation}</p>
          </div>

          {verse.audioUrl && (
            <audio
              controls
              preload="none"
              className="w-full"
              src={verse.audioUrl}
            >
              <track kind="captions" />
            </audio>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <BookmarkButton verse={verse} initialBookmarked={bookmarked} />
        <ShareButton verse={verse} />
      </div>
    </div>
  )
}
