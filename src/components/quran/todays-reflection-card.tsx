import Link from "next/link"
import { BookOpen, ArrowRight } from "lucide-react"

import { getDailyVerse } from "@/lib/quran/client"
import { Card, CardContent } from "@/components/ui/card"

export async function TodaysReflectionCard() {
  const verse = await getDailyVerse().catch(() => null)
  if (!verse) return null

  return (
    <Link href={`/quran/${verse.surahId}/${verse.ayahNumber}`}>
      <Card className="rounded-2xl bg-primary/5 ring-primary/15 transition-colors active:bg-primary/10">
        <CardContent className="grid gap-2 py-1">
          <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
            <BookOpen className="size-4" />
            Renungan Hari Ini
          </div>
          <p className="text-sm leading-relaxed italic text-foreground/90">
            &ldquo;{verse.translation}&rdquo;
          </p>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              QS {verse.surahName} : {verse.ayahNumber}
            </p>
            <span className="flex items-center gap-0.5 text-xs font-medium text-primary">
              Baca ayat hari ini
              <ArrowRight className="size-3" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
