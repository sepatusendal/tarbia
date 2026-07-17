"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth-helpers"
import { supabaseAdmin, MATERI_BUCKET } from "@/lib/supabase"

const materiSchema = z.object({
  meetingId: z.string().min(1),
  judul: z.string().min(1, "Judul wajib diisi"),
  ringkasan: z.string().optional(),
  videoUrl: z.string().optional(),
  catatan: z.string().optional(),
})

export type MateriFormState = {
  error?: string
  fieldErrors?: Record<string, string[]>
}

export async function saveMateri(
  _prevState: MateriFormState,
  formData: FormData
): Promise<MateriFormState> {
  await requireRole(["ADMIN", "PENGURUS"])

  const parsed = materiSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const { meetingId, judul, ringkasan, videoUrl, catatan } = parsed.data

  let fileUrl: string | undefined
  const file = formData.get("file")
  if (file instanceof File && file.size > 0) {
    if (file.type !== "application/pdf") {
      return { error: "File materi harus berformat PDF." }
    }

    const path = `${meetingId}/${Date.now()}-${file.name}`
    const { error: uploadError } = await supabaseAdmin.storage
      .from(MATERI_BUCKET)
      .upload(path, file, { contentType: "application/pdf" })

    if (uploadError) {
      return { error: `Gagal upload file: ${uploadError.message}` }
    }

    const { data } = supabaseAdmin.storage
      .from(MATERI_BUCKET)
      .getPublicUrl(path)
    fileUrl = data.publicUrl
  }

  await prisma.materi.upsert({
    where: { meetingId },
    update: {
      judul,
      ringkasan: ringkasan || null,
      videoUrl: videoUrl || null,
      catatan: catatan || null,
      ...(fileUrl ? { fileUrl } : {}),
    },
    create: {
      meetingId,
      judul,
      ringkasan: ringkasan || null,
      videoUrl: videoUrl || null,
      catatan: catatan || null,
      fileUrl,
    },
  })

  revalidatePath("/materi")
  revalidatePath(`/jadwal/${meetingId}`)

  return {}
}

export async function deleteMateri(meetingId: string) {
  await requireRole(["ADMIN", "PENGURUS"])

  await prisma.materi.delete({ where: { meetingId } })

  revalidatePath("/materi")
  revalidatePath(`/jadwal/${meetingId}`)
}
