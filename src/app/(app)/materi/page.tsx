import { FileText, PlayCircle } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth-helpers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MeetingPicker } from "@/components/shared/meeting-picker"
import { MateriForm } from "./materi-form"

export default async function MateriPage({
  searchParams,
}: {
  searchParams: Promise<{ meetingId?: string }>
}) {
  const user = await requireUser()
  const { meetingId } = await searchParams
  const canManage = user.role === "ADMIN" || user.role === "PENGURUS"

  const meetings = await prisma.meeting.findMany({
    orderBy: { tanggal: "desc" },
    select: { id: true, tanggal: true, tema: true },
  })

  const activeMeetingId = meetingId ?? meetings[0]?.id

  if (!activeMeetingId) {
    return (
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-semibold">Materi</h1>
          <p className="text-muted-foreground">
            Semua materi kajian, tersimpan rapi.
          </p>
        </div>
        <p className="text-muted-foreground">
          Belum ada jadwal pertemuan. Buat jadwal dulu di menu Jadwal.
        </p>
      </div>
    )
  }

  const materi = await prisma.materi.findUnique({
    where: { meetingId: activeMeetingId },
  })

  const activeMeeting = meetings.find((m) => m.id === activeMeetingId)

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Materi</h1>
        <p className="text-muted-foreground">
          Semua materi kajian, tersimpan rapi.
        </p>
      </div>

      <MeetingPicker
        meetings={meetings}
        selectedId={activeMeetingId}
        basePath="/materi"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{activeMeeting?.tema}</CardTitle>
        </CardHeader>
        <CardContent>
          {canManage ? (
            <MateriForm
              meetingId={activeMeetingId}
              defaultValues={
                materi
                  ? {
                      judul: materi.judul,
                      ringkasan: materi.ringkasan ?? "",
                      videoUrl: materi.videoUrl ?? "",
                      catatan: materi.catatan ?? "",
                      fileUrl: materi.fileUrl,
                    }
                  : undefined
              }
            />
          ) : materi ? (
            <div className="grid gap-4">
              <div>
                <p className="text-lg font-medium">{materi.judul}</p>
                {materi.ringkasan && (
                  <p className="text-muted-foreground mt-1 text-sm">
                    {materi.ringkasan}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {materi.fileUrl && (
                  <a
                    href={materi.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary flex items-center gap-1.5 text-sm font-medium hover:underline"
                  >
                    <FileText className="size-4" />
                    Buka PDF
                  </a>
                )}
                {materi.videoUrl && (
                  <a
                    href={materi.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary flex items-center gap-1.5 text-sm font-medium hover:underline"
                  >
                    <PlayCircle className="size-4" />
                    Tonton Video
                  </a>
                )}
              </div>
              {materi.catatan && (
                <div>
                  <p className="text-muted-foreground text-sm">Catatan</p>
                  <p>{materi.catatan}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground py-6 text-center">
              Belum ada materi untuk pertemuan ini.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
