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
      variant="ghost"
      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
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
      {isPending ? "Menghapus..." : "Hapus"}
    </Button>
  )
}
