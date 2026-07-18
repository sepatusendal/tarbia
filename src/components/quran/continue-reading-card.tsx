import Link from "next/link"
import { BookOpenCheck, ChevronRight } from "lucide-react"

import { getLastRead } from "@/lib/quran/queries"
import { Card, CardContent } from "@/components/ui/card"

export async function ContinueReadingCard({ memberId }: { memberId: string }) {
  const lastRead = await getLastRead(memberId)
  if (!lastRead) return null

  return (
    <Link href={`/quran/${lastRead.surahId}/${lastRead.ayahNumber}`}>
      <Card className="rounded-2xl transition-colors active:bg-muted/50">
        <CardContent className="flex items-center gap-3 py-1">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <BookOpenCheck className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Lanjutkan Membaca</p>
            <p className="truncate text-xs text-muted-foreground">
              QS {lastRead.surahName} : {lastRead.ayahNumber}
            </p>
          </div>
          <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
        </CardContent>
      </Card>
    </Link>
  )
}
