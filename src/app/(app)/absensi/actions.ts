"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth-helpers"
import type { AttendanceStatus } from "@/generated/prisma/enums"

export async function saveAttendance(
  meetingId: string,
  entries: { memberId: string; status: AttendanceStatus }[]
) {
  await requireRole(["ADMIN", "PENGURUS"])

  await prisma.$transaction(
    entries.map((entry) =>
      prisma.attendance.upsert({
        where: {
          meetingId_memberId: { meetingId, memberId: entry.memberId },
        },
        update: { status: entry.status },
        create: { meetingId, memberId: entry.memberId, status: entry.status },
      })
    )
  )

  revalidatePath("/absensi")
  revalidatePath("/dashboard")
  revalidatePath(`/jadwal/${meetingId}`)

  return { success: true }
}
