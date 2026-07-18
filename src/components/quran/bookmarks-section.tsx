import Link from "next/link"
import { BookMarked } from "lucide-react"

import { getBookmarks } from "@/lib/quran/queries"
import { Card, CardContent } from "@/components/ui/card"
import { RemoveBookmarkButton } from "@/components/quran/remove-bookmark-button"

export async function BookmarksSection({ memberId }: { memberId: string }) {
  const bookmarks = await getBookmarks(memberId)

  return (
    <div className="grid gap-2">
      <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
        <BookMarked className="size-4" />
        Ayat Tersimpan
      </p>
      {bookmarks.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="py-4 text-center text-sm text-muted-foreground">
            Belum ada ayat yang disimpan.
          </CardContent>
        </Card>
      ) : (
        bookmarks.map((b) => (
          <Card key={b.id} className="rounded-2xl">
            <CardContent className="flex items-center gap-3 py-2">
              <Link
                href={`/quran/${b.surahId}/${b.ayahNumber}`}
                className="min-w-0 flex-1"
              >
                <p className="truncate text-sm italic">&ldquo;{b.translation}&rdquo;</p>
                <p className="text-xs font-medium text-primary">
                  QS {b.surahName} : {b.ayahNumber}
                </p>
              </Link>
              <RemoveBookmarkButton bookmarkId={b.id} />
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
