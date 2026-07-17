import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth-helpers"
import { formatTanggal } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MeetingPicker } from "@/components/shared/meeting-picker"
import { AttendanceForm } from "./attendance-form"

const statusLabel: Record<string, string> = {
  HADIR: "Hadir",
  IZIN: "Izin",
  SAKIT: "Sakit",
  ALFA: "Alfa",
}

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  HADIR: "default",
  IZIN: "secondary",
  SAKIT: "secondary",
  ALFA: "destructive",
}

export default async function AbsensiPage({
  searchParams,
}: {
  searchParams: Promise<{ meetingId?: string }>
}) {
  const user = await requireUser()
  const { meetingId } = await searchParams

  if (user.role === "ANGGOTA") {
    const history = await prisma.attendance.findMany({
      where: { memberId: user.id },
      orderBy: { meeting: { tanggal: "desc" } },
      include: { meeting: true },
    })

    return (
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-semibold">Absensi Kamu</h1>
          <p className="text-muted-foreground">
            Riwayat kehadiran liqo kamu.
          </p>
        </div>
        <div className="grid gap-3">
          {history.length === 0 && (
            <p className="text-muted-foreground py-6 text-center">
              Belum ada riwayat absensi.
            </p>
          )}
          {history.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">
                    {formatTanggal(entry.meeting.tanggal)}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {entry.meeting.tema}
                  </p>
                </div>
                <Badge variant={statusVariant[entry.status]}>
                  {statusLabel[entry.status]}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const meetings = await prisma.meeting.findMany({
    orderBy: { tanggal: "desc" },
    select: { id: true, tanggal: true, tema: true },
  })

  const activeMeetingId = meetingId ?? meetings[0]?.id

  if (!activeMeetingId) {
    return (
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-semibold">Absensi</h1>
          <p className="text-muted-foreground">
            Catat kehadiran anggota setiap pertemuan.
          </p>
        </div>
        <p className="text-muted-foreground">
          Belum ada jadwal pertemuan. Buat jadwal dulu di menu Jadwal.
        </p>
      </div>
    )
  }

  const [members, existing] = await Promise.all([
    prisma.member.findMany({
      where: { statusAktif: true },
      orderBy: { nama: "asc" },
      select: { id: true, nama: true },
    }),
    prisma.attendance.findMany({
      where: { meetingId: activeMeetingId },
      select: { memberId: true, status: true },
    }),
  ])

  const statusByMember = new Map(existing.map((e) => [e.memberId, e.status]))
  const memberList = members.map((m) => ({
    ...m,
    status: statusByMember.get(m.id) ?? null,
  }))

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Absensi</h1>
        <p className="text-muted-foreground">
          Catat kehadiran anggota setiap pertemuan.
        </p>
      </div>

      <MeetingPicker
        meetings={meetings}
        selectedId={activeMeetingId}
        basePath="/absensi"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Daftar Hadir &middot;{" "}
            {meetings.find((m) => m.id === activeMeetingId)?.tema}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {memberList.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center">
              Belum ada anggota aktif. Tambahkan dulu di menu Anggota.
            </p>
          ) : (
            <AttendanceForm meetingId={activeMeetingId} members={memberList} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
