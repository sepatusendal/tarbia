import Link from "next/link"
import { BookMarked, ChevronRight } from "lucide-react"

import { getRelatedVersesForTheme } from "@/lib/quran/queries"
import { getChapters } from "@/lib/quran/client"
import { Card, CardContent } from "@/components/ui/card"

export async function RelatedVersesCard({ theme }: { theme: string }) {
  const [verses, chapters] = await Promise.all([
    getRelatedVersesForTheme(theme).catch(() => []),
    getChapters().catch(() => []),
  ])

  if (verses.length === 0) return null

  const chapterName = (surahId: number) =>
    chapters.find((c) => c.id === surahId)?.nameSimple ?? `Surah ${surahId}`

  return (
    <Card className="rounded-2xl">
      <CardContent className="grid gap-3 py-1">
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <BookMarked className="size-4 text-primary" />
          Minggu Ini
        </div>
        <div>
          <p className="font-medium">{theme}</p>
          <p className="text-xs text-muted-foreground">Ayat terkait tema ini</p>
        </div>
        <div className="grid gap-1">
          {verses.map((v) => (
            <Link
              key={v.verseKey}
              href={`/quran/${v.surahId}/${v.ayahNumber}`}
              className="flex items-center justify-between rounded-xl px-2 py-2 text-sm transition-colors active:bg-muted"
            >
              <span>
                QS {chapterName(v.surahId)} : {v.ayahNumber}
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
