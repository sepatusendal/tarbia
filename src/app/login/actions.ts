"use server"

import { AuthError } from "next-auth"
import { signIn } from "@/auth"

export async function loginAction(nomorHp: string, password: string) {
  try {
    await signIn("credentials", {
      nomorHp,
      password,
      redirectTo: "/dashboard",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Nomor HP atau password salah." }
    }
    throw error
  }
}
