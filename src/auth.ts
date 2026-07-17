import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { z } from "zod"

import { authConfig } from "@/auth.config"
import { prisma } from "@/lib/prisma"
import type { Role } from "@/generated/prisma/enums"

const credentialsSchema = z.object({
  nomorHp: z.string().min(1),
  password: z.string().min(1),
})

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        nomorHp: { label: "Nomor HP", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        const member = await prisma.member.findUnique({
          where: { nomorHp: parsed.data.nomorHp },
        })
        if (!member || !member.statusAktif) return null

        const passwordsMatch = await bcrypt.compare(
          parsed.data.password,
          member.password
        )
        if (!passwordsMatch) return null

        return {
          id: member.id,
          name: member.nama,
          nomorHp: member.nomorHp,
          role: member.role,
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = user.role as Role
        token.nomorHp = user.nomorHp as string
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
        session.user.nomorHp = token.nomorHp as string
      }
      return session
    },
  },
})
