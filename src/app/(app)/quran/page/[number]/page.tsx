import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { requireUser } from "@/lib/auth-helpers"
import { getVersesByPage, QURAN_PAGE_COUNT } from "@/lib/quran/client"
import { Card, CardContent } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"

export default async function QuranPageReader({
  params,
}: {
  params: Promise<{ number: string }>
}) {
  await requireUser()
  const { number } = await params

  const pageNumber = Number(number)
  if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > QURAN_PAGE_COUNT) {
    notFound()
  }

  const page = await getVersesByPage(pageNumber).catch(() => null)
  if (!page) notFound()

  const hasPrev = pageNumber > 1
  const hasNext = pageNumber < QURAN_PAGE_COUNT

  return (
    <div className="grid gap-5 pb-4">
      <div>
        <p className="text-sm text-muted-foreground">
          Juz {page.juzNumber} &middot; {page.surahNames.join(", ")}
        </p>
        <h1 className="text-2xl font-semibold">
          Halaman {page.pageNumber}
        </h1>
      </div>

      <Card className="rounded-3xl">
        <CardContent className="py-2">
          <p dir="rtl" lang="ar" className="text-right text-3xl leading-loose">
            {page.verses.map((v) => (
              <span key={v.verseKey}>
                <Link
                  href={`/quran/${v.surahId}/${v.ayahNumber}`}
                  className="rounded transition-colors hover:bg-primary/5 active:bg-primary/10"
                >
                  {v.arabicText}
                </Link>{" "}
                <span
                  className="mx-0.5 inline-flex size-6 items-center justify-center rounded-full bg-primary/10 align-middle text-[11px] font-semibold text-primary"
                  style={{ direction: "ltr" }}
                >
                  {v.ayahNumber}
                </span>{" "}
              </span>
            ))}
          </p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        {hasPrev ? (
          <Link
            href={`/quran/page/${pageNumber - 1}`}
            className={buttonVariants({ variant: "outline", className: "h-11 flex-1 rounded-2xl" })}
          >
            <ChevronLeft className="size-4" />
            Sebelumnya
          </Link>
        ) : (
          <span
            className={buttonVariants({
              variant: "outline",
              className: "h-11 flex-1 rounded-2xl pointer-events-none opacity-50",
            })}
          >
            <ChevronLeft className="size-4" />
            Sebelumnya
          </span>
        )}
        {hasNext ? (
          <Link
            href={`/quran/page/${pageNumber + 1}`}
            className={buttonVariants({ className: "h-11 flex-1 rounded-2xl" })}
          >
            Selanjutnya
            <ChevronRight className="size-4" />
          </Link>
        ) : (
          <span
            className={buttonVariants({
              className: "h-11 flex-1 rounded-2xl pointer-events-none opacity-50",
            })}
          >
            Selanjutnya
            <ChevronRight className="size-4" />
          </span>
        )}
      </div>
    </div>
  )
}
