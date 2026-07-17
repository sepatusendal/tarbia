import { notFound } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { requireRole } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { updateMeeting } from "../../actions"
import { MeetingForm } from "../../meeting-form"

export default async function EditMeetingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireRole(["ADMIN"])
  const { id } = await params

  const meeting = await prisma.meeting.findUnique({ where: { id } })
  if (!meeting) notFound()

  const updateWithId = updateMeeting.bind(null, id)

  return (
    <div className="mx-auto grid max-w-xl gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Ubah Jadwal</h1>
        <p className="text-muted-foreground">{meeting.tema}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detail Pertemuan</CardTitle>
        </CardHeader>
        <CardContent>
          <MeetingForm
            action={updateWithId}
            submitLabel="Simpan Perubahan"
            defaultValues={{
              tanggal: meeting.tanggal.toISOString().slice(0, 10),
              jam: meeting.jam,
              lokasi: meeting.lokasi,
              tema: meeting.tema,
              catatan: meeting.catatan ?? "",
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
