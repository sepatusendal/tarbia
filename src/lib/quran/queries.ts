import "server-only"

import { prisma } from "@/lib/prisma"
import { searchQuran } from "@/lib/quran/client"

export async function getBookmarks(memberId: string) {
  return prisma.quranBookmark.findMany({
    where: { memberId },
    orderBy: { createdAt: "desc" },
  })
}

export async function isBookmarked(memberId: string, surahId: number, ayahNumber: number) {
  const bookmark = await prisma.quranBookmark.findUnique({
    where: { memberId_surahId_ayahNumber: { memberId, surahId, ayahNumber } },
  })
  return !!bookmark
}

export async function getLastRead(memberId: string) {
  return prisma.quranLastRead.findUnique({ where: { memberId } })
}

// Best-effort thematic matching against this week's meeting title — a
// lexical search, not true semantic search. Good enough to surface
// plausibly-related verses without hardcoding a lookup table.
export async function getRelatedVersesForTheme(theme: string) {
  const results = await searchQuran(theme, 3)
  return results
}
