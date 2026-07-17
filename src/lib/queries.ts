import "server-only"

import { prisma } from "@/lib/prisma"
import type { PetugasRole } from "@/generated/prisma/enums"

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

export function petugasByRole(
  petugas: { role: PetugasRole; member: { nama: string } }[],
  role: PetugasRole
) {
  return petugas.filter((p) => p.role === role).map((p) => p.member.nama)
}
