import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@/generated/prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// `pg` re-parses `connectionString` last, which overwrites any explicit
// `ssl` option we pass alongside it — so the URL's own sslmode is the only
// way to control this. Supabase's cert chain fails default `sslmode=require`
// verification, so downgrade to `no-verify` (still encrypted, no chain check).
const connectionString = process.env.DATABASE_URL?.replace(
  /([?&])sslmode=require\b/,
  "$1sslmode=no-verify"
)

const adapter = new PrismaPg({ connectionString })

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
