"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth-helpers"

const transactionSchema = z.object({
  type: z.enum(["PEMASUKAN", "PENGELUARAN"]),
  kategori: z.string().min(1, "Kategori wajib diisi"),
  jumlah: z.coerce.number().int().positive("Jumlah harus lebih dari 0"),
  keterangan: z.string().optional(),
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
})

export type TransactionFormState = {
  error?: string
  fieldErrors?: Record<string, string[]>
}

export async function createTransaction(
  _prevState: TransactionFormState,
  formData: FormData
): Promise<TransactionFormState> {
  const user = await requireRole(["ADMIN", "PENGURUS"])

  const parsed = transactionSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  await prisma.transaction.create({
    data: {
      type: parsed.data.type,
      kategori: parsed.data.kategori,
      jumlah: parsed.data.jumlah,
      keterangan: parsed.data.keterangan || null,
      tanggal: new Date(parsed.data.tanggal),
      recordedById: user.id,
    },
  })

  revalidatePath("/kas")
  revalidatePath("/dashboard")

  return {}
}

export async function deleteTransaction(transactionId: string) {
  await requireRole(["ADMIN", "PENGURUS"])

  await prisma.transaction.delete({ where: { id: transactionId } })

  revalidatePath("/kas")
  revalidatePath("/dashboard")
}
