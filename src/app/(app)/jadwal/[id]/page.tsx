import Link from "next/link"
import { notFound } from "next/navigation"
import { MapPin, Pencil, ClipboardCheck, BookOpen } from "lucide-react"

import { requireUser } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { formatTanggal } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PetugasSelect } from "./petugas-select"
import { DeleteMeetingButton } from "./delete-meeting-button"
import type { PetugasRole } from "@/generated/prisma/enums"

const petugasRoles: { role: PetugasRole; label: string }[] = [
  { role: "MC", label: "MC" },
  { role: "PEMATERI", label: "Pemateri" },
  { role: "NOTULEN", label: "Notulen" },
  { role: "DOKUMENTASI", label: "Dokumentasi" },
  { role: "KONSUMSI", label: "Konsumsi" },
]

export default async function MeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireUser()
  const { id } = await params

  const [meeting, members] = await Promise.all([
    prisma.meeting.findUnique({
      where: { id },
      include: { petugas: true, materi: true },
    }),
    prisma.member.findMany({
      where: { statusAktif: true },
      orderBy: { nama: "asc" },
      select: { id: true, nama: true },
    }),
  ])

  if (!meeting) notFound()

  const isAdmin = user.role === "ADMIN"

  return (
    <div className="mx-auto grid max-w-2xl gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {formatTanggal(meeting.tanggal)}
          </h1>
          <p className="text-muted-foreground">
            {meeting.jam} WIB &middot; {meeting.lokasi}
          </p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              render={
                <Link href={`/jadwal/${meeting.id}/edit`}>
                  <Pencil className="size-4" />
                  Ubah
                </Link>
              }
            />
            <DeleteMeetingButton meetingId={meeting.id} />
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tema</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-lg font-medium">{meeting.tema}</p>
          <div className="text-muted-foreground flex items-center gap-1 text-sm">
            <MapPin className="size-3.5" />
            {meeting.lokasi}
          </div>
          {meeting.catatan && (
            <div>
              <p className="text-muted-foreground text-sm">Catatan</p>
              <p>{meeting.catatan}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Petugas</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {petugasRoles.map(({ role, label }) => {
            const current = meeting.petugas.find((p) => p.role === role)
            return (
              <div key={role} className="grid gap-2">
                <p className="text-sm font-medium">{label}</p>
                {isAdmin ? (
                  <PetugasSelect
                    meetingId={meeting.id}
                    role={role}
                    members={members}
                    currentMemberId={current?.memberId}
                  />
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {members.find((m) => m.id === current?.memberId)?.nama ??
                      "Belum ditentukan"}
                  </p>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href={`/absensi?meetingId=${meeting.id}`}>
          <Card className="transition-colors hover:bg-muted/50">
            <CardContent className="flex items-center gap-3 py-4">
              <ClipboardCheck className="size-5" />
              <div>
                <p className="font-medium">Absensi</p>
                <p className="text-muted-foreground text-sm">
                  Catat kehadiran pertemuan ini
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href={`/materi?meetingId=${meeting.id}`}>
          <Card className="transition-colors hover:bg-muted/50">
            <CardContent className="flex items-center gap-3 py-4">
              <BookOpen className="size-5" />
              <div>
                <p className="font-medium">Materi</p>
                <p className="text-muted-foreground text-sm">
                  {meeting.materi ? "Lihat materi" : "Belum ada materi"}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
