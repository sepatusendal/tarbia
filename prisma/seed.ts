import "dotenv/config"
import bcrypt from "bcryptjs"

import { prisma } from "../src/lib/prisma"

async function main() {
  const nomorHp = process.env.SEED_ADMIN_PHONE ?? "081234567890"
  const password = process.env.SEED_ADMIN_PASSWORD ?? "admin123"

  const existing = await prisma.member.findUnique({ where: { nomorHp } })
  if (existing) {
    console.log(`Admin dengan nomor ${nomorHp} sudah ada, dilewati.`)
    return
  }

  await prisma.member.create({
    data: {
      nama: "Admin UPA",
      nomorHp,
      role: "ADMIN",
      statusAktif: true,
      password: await bcrypt.hash(password, 10),
    },
  })

  console.log(`Admin dibuat. Nomor HP: ${nomorHp} / Password: ${password}`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => process.exit(0))
