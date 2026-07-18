"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth-helpers"
import type { Verse } from "@/types/quran"

export async function toggleBookmark(verse: Verse) {
  const user = await requireUser()

  const existing = await prisma.quranBookmark.findUnique({
    where: {
      memberId_surahId_ayahNumber: {
        memberId: user.id,
        surahId: verse.surahId,
        ayahNumber: verse.ayahNumber,
      },
    },
  })

  if (existing) {
    await prisma.quranBookmark.delete({ where: { id: existing.id } })
  } else {
    await prisma.quranBookmark.create({
      data: {
        memberId: user.id,
        surahId: verse.surahId,
        surahName: verse.surahName,
        ayahNumber: verse.ayahNumber,
        arabicText: verse.arabicText,
        translation: verse.translation,
      },
    })
  }

  revalidatePath("/profile")
  revalidatePath(`/quran/${verse.surahId}/${verse.ayahNumber}`)
  return { bookmarked: !existing }
}

export async function removeBookmark(bookmarkId: string) {
  const user = await requireUser()
  await prisma.quranBookmark.deleteMany({
    where: { id: bookmarkId, memberId: user.id },
  })
  revalidatePath("/profile")
}
