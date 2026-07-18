import Link from "next/link"
import { redirect } from "next/navigation"
import { Search, ChevronRight } from "lucide-react"

import { requireUser } from "@/lib/auth-helpers"
import { getChapters, getJuzList, searchQuran } from "@/lib/quran/client"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ContinueReadingCard } from "@/components/quran/continue-reading-card"

const VERSE_KEY_PATTERN = /^(\d{1,3})\s*[:.]\s*(\d{1,3})$/
type View = "surah" | "juz"

export default async function QuranSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; view?: string }>
}) {
  const user = await requireUser()
  const { q, view } = await searchParams
  const query = q?.trim() ?? ""
  const activeView: View = view === "juz" ? "juz" : "surah"

  const directMatch = query.match(VERSE_KEY_PATTERN)
  if (directMatch) {
    redirect(`/quran/${directMatch[1]}/${directMatch[2]}`)
  }

  const chapters = await getChapters()

  const matchingChapters = query
    ? chapters.filter(
        (c) =>
          c.nameSimple.toLowerCase().includes(query.toLowerCase()) ||
          c.translatedName.toLowerCase().includes(query.toLowerCase())
      )
    : []
  const verseResults = query ? await searchQuran(query, 10).catch(() => []) : []
  const juzList = !query && activeView === "juz" ? await getJuzList() : []

  return (
    <div className="grid gap-6 pb-4">
      <div>
        <h1 className="text-2xl font-semibold">Al-Qur&apos;an</h1>
        <p className="text-muted-foreground">
          Cari surah, ayat, atau kata kunci.
        </p>
      </div>

      <ContinueReadingCard memberId={user.id} />

      <form method="GET" className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Cari 'ilmu', 'Al-Baqarah', atau '2:255'"
            className="h-11 rounded-2xl pl-10"
          />
        </div>
        <Button type="submit" className="h-11 rounded-2xl">
          Cari
        </Button>
      </form>

      {query && matchingChapters.length === 0 && verseResults.length === 0 && (
        <p className="text-muted-foreground py-6 text-center text-sm">
          Gak ketemu hasil buat &ldquo;{query}&rdquo;.
        </p>
      )}

      {matchingChapters.length > 0 && (
        <div className="grid gap-2">
          <p className="text-sm font-medium text-muted-foreground">Surah</p>
          {matchingChapters.map((c) => (
            <ChapterRow key={c.id} chapterId={c.id} name={c.nameSimple} translatedName={c.translatedName} versesCount={c.versesCount} />
          ))}
        </div>
      )}

      {verseResults.length > 0 && (
        <div className="grid gap-2">
          <p className="text-sm font-medium text-muted-foreground">Ayat</p>
          {verseResults.map((v) => (
            <Link key={v.verseKey} href={`/quran/${v.surahId}/${v.ayahNumber}`}>
              <Card className="rounded-2xl transition-colors active:bg-muted/50">
                <CardContent className="grid gap-1 py-3">
                  <p
                    dir="rtl"
                    lang="ar"
                    className="text-right text-lg leading-relaxed"
                  >
                    {v.arabicText}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {v.translationSnippet}
                  </p>
                  <p className="text-xs font-medium text-primary">
                    QS {chapters.find((c) => c.id === v.surahId)?.nameSimple ?? v.surahId} :{" "}
                    {v.ayahNumber}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {!query && (
        <div className="grid gap-3">
          <div className="flex gap-2">
            <Link
              href="/quran?view=surah"
              className={`flex-1 rounded-2xl py-2 text-center text-sm font-medium transition-colors ${
                activeView === "surah"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              Surah
            </Link>
            <Link
              href="/quran?view=juz"
              className={`flex-1 rounded-2xl py-2 text-center text-sm font-medium transition-colors ${
                activeView === "juz"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              Juz
            </Link>
          </div>

          {activeView === "surah" ? (
            <div className="grid gap-2">
              {chapters.map((c) => (
                <ChapterRow
                  key={c.id}
                  chapterId={c.id}
                  name={c.nameSimple}
                  translatedName={c.translatedName}
                  versesCount={c.versesCount}
                  number={c.id}
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-2">
              {juzList.map((j) => {
                const startChapter = chapters.find((c) => c.id === j.startSurahId)
                return (
                  <Link key={j.juzNumber} href={`/quran/${j.startSurahId}/${j.startAyahNumber}`}>
                    <Card className="rounded-2xl transition-colors active:bg-muted/50">
                      <CardContent className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {j.juzNumber}
                          </span>
                          <div>
                            <p className="font-medium">Juz {j.juzNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              Mulai dari {startChapter?.nameSimple} : {j.startAyahNumber}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="size-4 text-muted-foreground" />
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ChapterRow({
  chapterId,
  name,
  translatedName,
  versesCount,
  number,
}: {
  chapterId: number
  name: string
  translatedName: string
  versesCount: number
  number?: number
}) {
  return (
    <Link href={`/quran/${chapterId}/1`}>
      <Card className="rounded-2xl transition-colors active:bg-muted/50">
        <CardContent className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            {number && (
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {number}
              </span>
            )}
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-sm text-muted-foreground">
                {translatedName} &middot; {versesCount} ayat
              </p>
            </div>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </CardContent>
      </Card>
    </Link>
  )
}
