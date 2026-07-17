"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth-helpers"
import type { PetugasRole } from "@/generated/prisma/enums"

const meetingSchema = z.object({
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
  jam: z.string().min(1, "Jam wajib diisi"),
  lokasi: z.string().min(1, "Lokasi wajib diisi"),
  tema: z.string().min(1, "Tema wajib diisi"),
  catatan: z.string().optional(),
})

export type MeetingFormState = {
  error?: string
  fieldErrors?: Record<string, string[]>
}

export async function createMeeting(
  _prevState: MeetingFormState,
  formData: FormData
): Promise<MeetingFormState> {
  await requireRole(["ADMIN"])

  const parsed = meetingSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const meeting = await prisma.meeting.create({
    data: {
      tanggal: new Date(parsed.data.tanggal),
      jam: parsed.data.jam,
      lokasi: parsed.data.lokasi,
      tema: parsed.data.tema,
      catatan: parsed.data.catatan || null,
    },
  })

  revalidatePath("/jadwal")
  revalidatePath("/dashboard")
  redirect(`/jadwal/${meeting.id}`)
}

export async function updateMeeting(
  meetingId: string,
  _prevState: MeetingFormState,
  formData: FormData
): Promise<MeetingFormState> {
  await requireRole(["ADMIN"])

  const parsed = meetingSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  await prisma.meeting.update({
    where: { id: meetingId },
    data: {
      tanggal: new Date(parsed.data.tanggal),
      jam: parsed.data.jam,
      lokasi: parsed.data.lokasi,
      tema: parsed.data.tema,
      catatan: parsed.data.catatan || null,
    },
  })

  revalidatePath("/jadwal")
  revalidatePath(`/jadwal/${meetingId}`)
  revalidatePath("/dashboard")
  redirect(`/jadwal/${meetingId}`)
}

export async function deleteMeeting(meetingId: string) {
  await requireRole(["ADMIN"])

  await prisma.meeting.delete({ where: { id: meetingId } })

  revalidatePath("/jadwal")
  revalidatePath("/dashboard")
  redirect("/jadwal")
}

export async function assignPetugas(
  meetingId: string,
  role: PetugasRole,
  memberId: string
) {
  await requireRole(["ADMIN"])

  if (!memberId) {
    await prisma.petugas.deleteMany({ where: { meetingId, role } })
  } else {
    await prisma.petugas.deleteMany({ where: { meetingId, role } })
    await prisma.petugas.create({
      data: { meetingId, role, memberId },
    })
  }

  revalidatePath(`/jadwal/${meetingId}`)
  revalidatePath("/dashboard")
}
