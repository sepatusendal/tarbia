import Link from "next/link"
import { BookOpen, ArrowRight } from "lucide-react"

import { getDailyVerse } from "@/lib/quran/client"
import { Card, CardContent } from "@/components/ui/card"

export async function TodaysReflectionCard() {
  const verse = await getDailyVerse().catch(() => null)
  if (!verse) return null

  return (
    <Link href={`/quran/${verse.surahId}/${verse.ayahNumber}`}>
      <Card className="relative overflow-hidden rounded-2xl border-primary/10 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--primary)_8%,var(--card)),var(--card)_65%)] ring-primary/15 transition-colors active:bg-primary/10">
        <span
          className="pointer-events-none absolute -top-3 right-3 font-serif text-7xl leading-none text-primary/[0.08] select-none"
          aria-hidden="true"
        >
          &rdquo;
        </span>
        <CardContent className="relative grid gap-2 py-1">
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
