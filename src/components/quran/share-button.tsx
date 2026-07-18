"use client"

import { Share2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import type { Verse } from "@/types/quran"

export function ShareButton({ verse }: { verse: Verse }) {
  async function handleClick() {
    const text = `"${verse.translation}"\n\nQS ${verse.surahName} : ${verse.ayahNumber}`
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/quran/${verse.surahId}/${verse.ayahNumber}`
        : ""

    if (navigator.share) {
      try {
        await navigator.share({ text, url })
      } catch {
        // user cancelled — no-op
      }
      return
    }

    await navigator.clipboard.writeText(`${text}\n${url}`)
    toast.success("Disalin ke clipboard 📋")
  }

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className="h-11 flex-1 rounded-2xl"
    >
      <Share2 className="size-4" />
      Bagikan
    </Button>
  )
}
