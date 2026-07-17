import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { requireRole } from "@/lib/auth-helpers"
import { createMember } from "../actions"
import { MemberForm } from "../member-form"

export default async function NewMemberPage() {
  await requireRole(["ADMIN"])

  return (
    <div className="mx-auto grid max-w-xl gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Tambah Anggota</h1>
        <p className="text-muted-foreground">Daftarkan anggota baru.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data Anggota</CardTitle>
        </CardHeader>
        <CardContent>
          <MemberForm action={createMember} submitLabel="Tambah Anggota" />
        </CardContent>
      </Card>
    </div>
  )
}
