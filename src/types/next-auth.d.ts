import type { DefaultSession } from "next-auth"
import type { Role } from "@/generated/prisma/enums"

declare module "next-auth" {
  interface User {
    role: Role
    nomorHp: string
  }

  interface Session {
    user: {
      id: string
      role: Role
      nomorHp: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: Role
    nomorHp: string
  }
}
