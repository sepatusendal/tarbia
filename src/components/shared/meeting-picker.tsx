"use client"

import { useRouter } from "next/navigation"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatTanggalPendek } from "@/lib/format"

export function MeetingPicker({
  meetings,
  selectedId,
  basePath,
}: {
  meetings: { id: string; tanggal: Date; tema: string }[]
  selectedId: string
  basePath: string
}) {
  const router = useRouter()

  const items = Object.fromEntries(
    meetings.map((meeting) => [
      meeting.id,
      `${formatTanggalPendek(meeting.tanggal)} · ${meeting.tema}`,
    ])
  )

  return (
    <Select
      items={items}
      value={selectedId}
      onValueChange={(value) => {
        if (value) router.push(`${basePath}?meetingId=${value}`)
      }}
    >
      <SelectTrigger className="w-full sm:w-72">
        <SelectValue placeholder="Pilih pertemuan" />
      </SelectTrigger>
      <SelectContent>
        {meetings.map((meeting) => (
          <SelectItem key={meeting.id} value={meeting.id}>
            {formatTanggalPendek(meeting.tanggal)} &middot; {meeting.tema}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
