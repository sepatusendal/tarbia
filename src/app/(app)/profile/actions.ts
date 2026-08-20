"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth-helpers"
import type { MemberFormState } from "../anggota/actions"

const schema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  password: z.union([z.string().min(6), z.literal("")]).optional(),
})

// Self-service profile edit — deliberately narrower than the admin
// updateMember action: only the signed-in user's own nama/password,
// never role, status, or nomorHp.
export async function updateOwnProfile(
  _prevState: MemberFormState,
  formData: FormData
): Promise<MemberFormState> {
  const user = await requireUser()

  const parsed = schema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  await prisma.member.update({
    where: { id: user.id },
    data: {
      nama: parsed.data.nama,
      ...(parsed.data.password
        ? { password: await bcrypt.hash(parsed.data.password, 10) }
        : {}),
    },
  })

  revalidatePath("/profile")
  redirect("/profile")
}
