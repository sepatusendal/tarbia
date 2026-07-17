"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth-helpers"

const baseSchema = {
  nama: z.string().min(1, "Nama wajib diisi"),
  nomorHp: z.string().min(8, "Nomor HP tidak valid"),
  angkatan: z.string().optional(),
  role: z.enum(["ADMIN", "PENGURUS", "ANGGOTA"]),
  statusAktif: z.enum(["on"]).optional(),
}

const createSchema = z.object({
  ...baseSchema,
  password: z.string().min(6, "Password minimal 6 karakter"),
})

const updateSchema = z.object({
  ...baseSchema,
  password: z.union([z.string().min(6), z.literal("")]).optional(),
})

export type MemberFormState = {
  error?: string
  fieldErrors?: Record<string, string[]>
}

export async function createMember(
  _prevState: MemberFormState,
  formData: FormData
): Promise<MemberFormState> {
  await requireRole(["ADMIN"])

  const parsed = createSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const existing = await prisma.member.findUnique({
    where: { nomorHp: parsed.data.nomorHp },
  })
  if (existing) {
    return { fieldErrors: { nomorHp: ["Nomor HP sudah terdaftar"] } }
  }

  const hashed = await bcrypt.hash(parsed.data.password, 10)

  await prisma.member.create({
    data: {
      nama: parsed.data.nama,
      nomorHp: parsed.data.nomorHp,
      angkatan: parsed.data.angkatan || null,
      role: parsed.data.role,
      statusAktif: parsed.data.statusAktif === "on",
      password: hashed,
    },
  })

  revalidatePath("/anggota")
  redirect("/anggota")
}

export async function updateMember(
  memberId: string,
  _prevState: MemberFormState,
  formData: FormData
): Promise<MemberFormState> {
  await requireRole(["ADMIN"])

  const parsed = updateSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const duplicate = await prisma.member.findFirst({
    where: { nomorHp: parsed.data.nomorHp, NOT: { id: memberId } },
  })
  if (duplicate) {
    return { fieldErrors: { nomorHp: ["Nomor HP sudah terdaftar"] } }
  }

  await prisma.member.update({
    where: { id: memberId },
    data: {
      nama: parsed.data.nama,
      nomorHp: parsed.data.nomorHp,
      angkatan: parsed.data.angkatan || null,
      role: parsed.data.role,
      statusAktif: parsed.data.statusAktif === "on",
      ...(parsed.data.password
        ? { password: await bcrypt.hash(parsed.data.password, 10) }
        : {}),
    },
  })

  revalidatePath("/anggota")
  redirect("/anggota")
}

export async function deleteMember(memberId: string) {
  await requireRole(["ADMIN"])

  try {
    await prisma.member.delete({ where: { id: memberId } })
  } catch {
    throw new Error(
      "Anggota ini masih punya riwayat kas/absensi/petugas dan tidak bisa dihapus. Nonaktifkan saja."
    )
  }

  revalidatePath("/anggota")
}
