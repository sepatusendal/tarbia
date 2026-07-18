"use client"

import { useTransition } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { removeBookmark } from "@/app/(app)/quran/actions"

export function RemoveBookmarkButton({ bookmarkId }: { bookmarkId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      disabled={isPending}
      onClick={() => startTransition(() => removeBookmark(bookmarkId))}
      aria-label="Hapus bookmark"
    >
      <X className="size-3.5" />
    </Button>
  )
}
