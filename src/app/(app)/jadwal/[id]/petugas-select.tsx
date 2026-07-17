"use client"

import { useTransition } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { assignPetugas } from "../actions"
import type { PetugasRole } from "@/generated/prisma/enums"

export function PetugasSelect({
  meetingId,
  role,
  members,
  currentMemberId,
}: {
  meetingId: string
  role: PetugasRole
  members: { id: string; nama: string }[]
  currentMemberId?: string
}) {
  const [isPending, startTransition] = useTransition()

  const items = {
    none: "- Belum ditentukan -",
    ...Object.fromEntries(members.map((m) => [m.id, m.nama])),
  }

  return (
    <Select
      items={items}
      value={currentMemberId ?? "none"}
      disabled={isPending}
      onValueChange={(value) => {
        startTransition(() => {
          assignPetugas(meetingId, role, !value || value === "none" ? "" : value)
        })
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Pilih anggota" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">- Belum ditentukan -</SelectItem>
        {members.map((member) => (
          <SelectItem key={member.id} value={member.id}>
            {member.nama}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
