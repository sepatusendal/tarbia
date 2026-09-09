"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { requireRole, requireUser } from "@/lib/auth-helpers"
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

// Self check-in — any member can mark their own attendance as HADIR, but
// only for a meeting that hasn't already passed. Prevents self-reporting
// presence at old meetings while staying open to whichever meeting is
// currently "next" without needing an admin to record it first.
export async function checkInAttendance(meetingId: string) {
  const user = await requireUser()

  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    select: { tanggal: true },
  })
  if (!meeting) throw new Error("Jadwal tidak ditemukan.")

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  if (meeting.tanggal < startOfToday) {
    throw new Error("Pertemuan ini sudah lewat.")
  }

  await prisma.attendance.upsert({
    where: { meetingId_memberId: { meetingId, memberId: user.id } },
    update: { status: "HADIR" },
    create: { meetingId, memberId: user.id, status: "HADIR" },
  })

  revalidatePath("/absensi")
  revalidatePath("/dashboard")

  return { success: true }
}
