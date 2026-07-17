"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { saveAttendance } from "./actions"
import type { AttendanceStatus } from "@/generated/prisma/enums"

const statusOptions: { value: AttendanceStatus; label: string }[] = [
  { value: "HADIR", label: "Hadir" },
  { value: "IZIN", label: "Izin" },
  { value: "SAKIT", label: "Sakit" },
  { value: "ALFA", label: "Alfa" },
]

export function AttendanceForm({
  meetingId,
  members,
}: {
  meetingId: string
  members: { id: string; nama: string; status: AttendanceStatus | null }[]
}) {
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>(
    Object.fromEntries(members.map((m) => [m.id, m.status ?? "HADIR"]))
  )
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    const entries = members.map((m) => ({
      memberId: m.id,
      status: statuses[m.id],
    }))
    startTransition(async () => {
      await saveAttendance(meetingId, entries)
      toast.success("Absensi tersimpan 🎉")
    })
  }

  return (
    <div className="grid gap-3">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center justify-between gap-4 rounded-xl border bg-card px-4 py-3"
        >
          <p className="font-medium">{member.nama}</p>
          <Select
            items={Object.fromEntries(
              statusOptions.map((opt) => [opt.value, opt.label])
            )}
            value={statuses[member.id]}
            onValueChange={(value) =>
              setStatuses((prev) => ({
                ...prev,
                [member.id]: value as AttendanceStatus,
              }))
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
      <Button onClick={handleSave} disabled={isPending} className="mt-2">
        {isPending ? "Menyimpan..." : "Simpan Absensi"}
      </Button>
    </div>
  )
}
