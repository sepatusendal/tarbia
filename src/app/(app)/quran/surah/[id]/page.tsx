import Link from "next/link"
import { notFound } from "next/navigation"
import { Bookmark, ChevronRight } from "lucide-react"

import { requireUser } from "@/lib/auth-helpers"
import { getChapters, getVersesByChapter } from "@/lib/quran/client"
import { getBookmarkedAyahNumbers } from "@/lib/quran/queries"
import { recordLastRead } from "@/lib/quran/mutations"

const BISMILLAH = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
// At-Tawbah is the one surah traditionally recited without the opening
// Bismillah.
const NO_BISMILLAH_SURAH = 9

export default async function SurahReaderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireUser()
  const { id } = await params
  const surahId = Number(id)
  if (!Number.isInteger(surahId) || surahId < 1 || surahId > 114) notFound()

  const chapters = await getChapters()
  const chapter = chapters.find((c) => c.id === surahId)
  if (!chapter) notFound()

  const [verses, bookmarkedAyahs] = await Promise.all([
    getVersesByChapter(surahId),
    getBookmarkedAyahNumbers(user.id, surahId),
  ])

  if (verses[0]) {
    await recordLastRead(user.id, {
      surahId,
      surahName: chapter.nameSimple,
      surahNameArabic: chapter.nameArabic,
      ayahNumber: verses[0].ayahNumber,
      verseKey: verses[0].verseKey,
      arabicText: verses[0].arabicText,
      translation: verses[0].translation,
      transliteration: null,
      audioUrl: null,
    })
  }

  return (
    <div className="grid gap-6 pb-4">
      <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(150deg,#3f572f,#182410_100%)] px-5 py-6 text-[#f9f8f1]">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]"
          aria-hidden="true"
        >
          <pattern id="surah-star-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M20 3 L24 16 L37 16 L26 23 L30 36 L20 27 L10 36 L14 23 L3 16 L16 16 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#surah-star-pattern)" />
        </svg>
        <div className="relative grid gap-1">
          <p className="text-xs font-medium text-[#f9f8f1]/70">
            Surah {chapter.id} &middot; {chapter.versesCount} Ayat
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {chapter.nameSimple}
          </h1>
          <p className="text-sm text-[#f9f8f1]/80">{chapter.translatedName}</p>
          <p
            dir="rtl"
            lang="ar"
            className="font-arabic mt-2 text-right text-3xl"
          >
            {chapter.nameArabic}
          </p>
        </div>
      </div>

      {surahId !== NO_BISMILLAH_SURAH && (
        <p dir="rtl" lang="ar" className="font-arabic text-center text-3xl">
          {BISMILLAH}
        </p>
      )}

      <div className="grid">
        {verses.map((verse, i) => (
          <div
            key={verse.verseKey}
            className={
              i !== verses.length - 1
                ? "grid gap-3 border-b border-border/60 py-5"
                : "grid gap-3 py-5"
            }
          >
            <div className="flex items-center justify-between">
              <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {verse.ayahNumber}
              </span>
              <div className="flex items-center gap-3">
                {bookmarkedAyahs.has(verse.ayahNumber) && (
                  <Bookmark className="size-4 fill-primary text-primary" />
                )}
                <Link
                  href={`/quran/${surahId}/${verse.ayahNumber}`}
                  className="flex items-center gap-0.5 text-xs font-medium text-primary"
                >
                  Detail &amp; Audio
                  <ChevronRight className="size-3.5" />
                </Link>
              </div>
            </div>
            <p
              dir="rtl"
              lang="ar"
              className="font-arabic text-right text-3xl leading-[2.3] text-balance"
            >
              {verse.arabicText}
            </p>
            {verse.transliteration && (
              <p className="text-sm leading-relaxed text-foreground/90">
                {verse.transliteration}
              </p>
            )}
            <p className="text-sm leading-relaxed text-muted-foreground">
              {verse.translation}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
