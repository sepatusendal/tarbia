import Link from "next/link"
import { CalendarPlus, BookOpen, FileX } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth-helpers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MeetingPicker } from "@/components/shared/meeting-picker"
import { EmptyState } from "@/components/shared/empty-state"
import { MateriForm } from "./materi-form"
import { MateriViewer } from "./materi-viewer"

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
        <EmptyState
          icon={BookOpen}
          title="Belum ada jadwal pertemuan"
          description="Materi kajian baru bisa ditambahkan setelah ada jadwal liqo."
          action={
            <Button
              nativeButton={false}
              className="rounded-2xl"
              render={
                <Link href="/jadwal/new">
                  <CalendarPlus className="size-4" />
                  Buat Jadwal Baru
                </Link>
              }
            />
          }
        />
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
            <MateriViewer
              judul={materi.judul}
              ringkasan={materi.ringkasan}
              fileUrl={materi.fileUrl}
              videoUrl={materi.videoUrl}
              catatan={materi.catatan}
            />
          ) : (
            <div className="grid justify-items-center gap-2 py-8 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <FileX className="size-5" />
              </span>
              <p className="font-medium">Belum ada materi</p>
              <p className="text-sm text-muted-foreground">
                Materi untuk pertemuan ini belum diunggah pengurus.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
