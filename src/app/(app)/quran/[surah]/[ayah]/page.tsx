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
      <div>
        <p className="text-sm text-muted-foreground">
          QS {verse.surahName} ({verse.surahNameArabic})
        </p>
        <h1 className="text-2xl font-semibold">Ayat {verse.ayahNumber}</h1>
      </div>

      <Card className="rounded-3xl">
        <CardContent className="grid gap-5 py-2">
          <p dir="rtl" lang="ar" className="text-right text-3xl leading-loose">
            {verse.arabicText}
          </p>

          {verse.transliteration && (
            <p className="text-sm italic text-muted-foreground">
              {verse.transliteration}
            </p>
          )}

          <div className="border-t pt-4">
            <p className="text-base leading-relaxed">{verse.translation}</p>
          </div>

          {verse.audioUrl && (
            <audio controls preload="none" className="w-full" src={verse.audioUrl}>
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
