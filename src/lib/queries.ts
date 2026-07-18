import "server-only"

import { prisma } from "@/lib/prisma"
import type { PetugasRole } from "@/generated/prisma/enums"
import { buildBuckets, type Period } from "@/lib/chart-utils"

export async function getNextMeeting() {
  return prisma.meeting.findFirst({
    where: { tanggal: { gte: new Date() } },
    orderBy: { tanggal: "asc" },
    include: { petugas: { include: { member: true } } },
  })
}

export async function getSaldoKas() {
  const [pemasukan, pengeluaran] = await Promise.all([
    prisma.transaction.aggregate({
      where: { type: "PEMASUKAN" },
      _sum: { jumlah: true },
    }),
    prisma.transaction.aggregate({
      where: { type: "PENGELUARAN" },
      _sum: { jumlah: true },
    }),
  ])
  return (pemasukan._sum.jumlah ?? 0) - (pengeluaran._sum.jumlah ?? 0)
}

export async function getLastMeetingAttendanceSummary() {
  const lastMeeting = await prisma.meeting.findFirst({
    where: { tanggal: { lt: new Date() } },
    orderBy: { tanggal: "desc" },
    include: { attendances: true },
  })

  if (!lastMeeting) return null

  const summary = {
    HADIR: 0,
    IZIN: 0,
    SAKIT: 0,
    ALFA: 0,
  }

  for (const attendance of lastMeeting.attendances) {
    summary[attendance.status]++
  }

  return { meeting: lastMeeting, summary }
}

export async function getMemberCount() {
  return prisma.member.count({ where: { statusAktif: true } })
}

export async function getAttendanceRate() {
  const [hadir, total] = await Promise.all([
    prisma.attendance.count({ where: { status: "HADIR" } }),
    prisma.attendance.count(),
  ])
  if (total === 0) return 0
  return Math.round((hadir / total) * 100)
}

// "Tasks" = petugas roles still unfilled for the next meeting — the
// concrete, actionable things someone needs to pick up before it happens.
export async function getUpcomingTasksCount() {
  const roles = ["MC", "PEMATERI", "NOTULEN", "DOKUMENTASI", "KONSUMSI"] as const

  const nextMeeting = await prisma.meeting.findFirst({
    where: { tanggal: { gte: new Date() } },
    orderBy: { tanggal: "asc" },
    include: { petugas: true },
  })

  if (!nextMeeting) return 0

  const filledRoles = new Set(nextMeeting.petugas.map((p) => p.role))
  return roles.filter((role) => !filledRoles.has(role)).length
}

type Activity = {
  id: string
  type: "kas" | "jadwal" | "absensi" | "materi"
  label: string
  detail: string
  at: Date
}

export async function getRecentActivities(limit = 6): Promise<Activity[]> {
  const [transactions, meetings, materiEntries, lastAttendancePerMeeting] =
    await Promise.all([
      prisma.transaction.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
        include: { recordedBy: { select: { nama: true } } },
      }),
      prisma.meeting.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
      prisma.materi.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
        include: { meeting: { select: { tema: true } } },
      }),
      prisma.attendance.groupBy({
        by: ["meetingId"],
        _max: { createdAt: true },
        orderBy: { _max: { createdAt: "desc" } },
        take: limit,
      }),
    ])

  const attendanceMeetings = await prisma.meeting.findMany({
    where: { id: { in: lastAttendancePerMeeting.map((a) => a.meetingId) } },
    select: { id: true, tema: true },
  })
  const meetingTemaById = new Map(attendanceMeetings.map((m) => [m.id, m.tema]))

  const activities: Activity[] = [
    ...transactions.map((tx) => ({
      id: `kas-${tx.id}`,
      type: "kas" as const,
      label:
        tx.type === "PEMASUKAN"
          ? `${tx.recordedBy.nama} mencatat pemasukan`
          : `${tx.recordedBy.nama} mencatat pengeluaran`,
      detail: tx.kategori,
      at: tx.createdAt,
    })),
    ...meetings.map((m) => ({
      id: `jadwal-${m.id}`,
      type: "jadwal" as const,
      label: "Pertemuan baru dijadwalkan",
      detail: m.tema,
      at: m.createdAt,
    })),
    ...materiEntries.map((mt) => ({
      id: `materi-${mt.id}`,
      type: "materi" as const,
      label: "Materi diunggah",
      detail: mt.meeting.tema,
      at: mt.createdAt,
    })),
    ...lastAttendancePerMeeting
      .filter((a) => a._max.createdAt)
      .map((a) => ({
        id: `absensi-${a.meetingId}`,
        type: "absensi" as const,
        label: "Absensi tercatat",
        detail: meetingTemaById.get(a.meetingId) ?? "",
        at: a._max.createdAt as Date,
      })),
  ]

  return activities
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, limit)
}

export async function getAttendanceTrend(period: Period) {
  const records = await prisma.attendance.findMany({
    select: { status: true, meeting: { select: { tanggal: true } } },
  })

  return buildBuckets(period).map((bucket) => {
    const inBucket = records.filter(
      (r) => r.meeting.tanggal >= bucket.start && r.meeting.tanggal < bucket.end
    )
    const hadir = inBucket.filter((r) => r.status === "HADIR").length
    const value = inBucket.length ? Math.round((hadir / inBucket.length) * 100) : 0
    return { label: bucket.label, value }
  })
}

export async function getCashFlowTrend(period: Period) {
  const transactions = await prisma.transaction.findMany({
    select: { tanggal: true, type: true, jumlah: true },
  })

  return buildBuckets(period).map((bucket) => {
    const inBucket = transactions.filter(
      (t) => t.tanggal >= bucket.start && t.tanggal < bucket.end
    )
    const income = inBucket
      .filter((t) => t.type === "PEMASUKAN")
      .reduce((sum, t) => sum + t.jumlah, 0)
    const expense = inBucket
      .filter((t) => t.type === "PENGELUARAN")
      .reduce((sum, t) => sum + t.jumlah, 0)
    return { label: bucket.label, income, expense }
  })
}

export async function getMemberGrowthTrend(period: Period) {
  const members = await prisma.member.findMany({ select: { createdAt: true } })

  return buildBuckets(period).map((bucket) => ({
    label: bucket.label,
    value: members.filter((m) => m.createdAt < bucket.end).length,
  }))
}

export async function getMeetingActivityTrend(period: Period) {
  const meetings = await prisma.meeting.findMany({ select: { tanggal: true } })

  return buildBuckets(period).map((bucket) => ({
    label: bucket.label,
    value: meetings.filter(
      (m) => m.tanggal >= bucket.start && m.tanggal < bucket.end
    ).length,
  }))
}

export function petugasByRole(
  petugas: { role: PetugasRole; member: { nama: string } }[],
  role: PetugasRole
) {
  return petugas.filter((p) => p.role === role).map((p) => p.member.nama)
}
