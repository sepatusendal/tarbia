"use client"

import { useState, useTransition } from "react"
import { Bookmark } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { toggleBookmark } from "@/app/(app)/quran/actions"
import type { Verse } from "@/types/quran"

export function BookmarkButton({
  verse,
  initialBookmarked,
}: {
  verse: Verse
  initialBookmarked: boolean
}) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    startTransition(async () => {
      const result = await toggleBookmark(verse)
      setBookmarked(result.bookmarked)
      toast.success(result.bookmarked ? "Ayat disimpan ✨" : "Bookmark dihapus")
    })
  }

  return (
    <Button
      variant={bookmarked ? "default" : "outline"}
      disabled={isPending}
      onClick={handleClick}
      className="h-11 flex-1 rounded-2xl"
    >
      <Bookmark className={bookmarked ? "size-4 fill-current" : "size-4"} />
      {bookmarked ? "Tersimpan" : "Simpan"}
    </Button>
  )
}
