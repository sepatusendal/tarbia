import { notFound } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { requireRole } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { updateMember } from "../../actions"
import { MemberForm } from "../../member-form"

export default async function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireRole(["ADMIN"])
  const { id } = await params

  const member = await prisma.member.findUnique({ where: { id } })
  if (!member) notFound()

  const updateWithId = updateMember.bind(null, id)

  return (
    <div className="mx-auto grid max-w-xl gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Ubah Anggota</h1>
        <p className="text-muted-foreground">{member.nama}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data Anggota</CardTitle>
        </CardHeader>
        <CardContent>
          <MemberForm
            action={updateWithId}
            submitLabel="Simpan Perubahan"
            passwordRequired={false}
            defaultValues={{
              nama: member.nama,
              nomorHp: member.nomorHp,
              angkatan: member.angkatan ?? "",
              role: member.role,
              statusAktif: member.statusAktif,
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
