"use client"

import { useTransition } from "react"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { deleteMeeting } from "../actions"

export function DeleteMeetingButton({ meetingId }: { meetingId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      type="button"
      variant="outline"
      className="text-destructive hover:text-destructive"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Hapus jadwal pertemuan ini? Data absensi, petugas, dan materi yang terkait juga akan terhapus.")) {
          return
        }
        startTransition(() => {
          deleteMeeting(meetingId)
        })
      }}
    >
      <Trash2 className="size-4" />
      Hapus
    </Button>
  )
}
