import "server-only"

import { prisma } from "@/lib/prisma"
import type { Verse } from "@/types/quran"

// Called directly from the verse detail page's render — visiting the page
// is what "reading" means here, no explicit user action needed.
export async function recordLastRead(memberId: string, verse: Verse) {
  await prisma.quranLastRead.upsert({
    where: { memberId },
    create: {
      memberId,
      surahId: verse.surahId,
      surahName: verse.surahName,
      ayahNumber: verse.ayahNumber,
    },
    update: {
      surahId: verse.surahId,
      surahName: verse.surahName,
      ayahNumber: verse.ayahNumber,
    },
  })
}
