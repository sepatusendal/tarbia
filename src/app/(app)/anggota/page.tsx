import Link from "next/link"
import { Plus, Pencil } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth-helpers"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DeleteMemberButton } from "./delete-member-button"

const roleLabel: Record<string, string> = {
  ADMIN: "Admin",
  PENGURUS: "Pengurus",
  ANGGOTA: "Anggota",
}

export default async function AnggotaPage() {
  const user = await requireUser()
  const isAdmin = user.role === "ADMIN"

  const members = await prisma.member.findMany({
    orderBy: { nama: "asc" },
  })

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Anggota</h1>
          <p className="text-muted-foreground">
            Semua akhi & ukhti yang tergabung di UPA ini.
          </p>
        </div>
        {isAdmin && (
          <Button
            render={
              <Link href="/anggota/new">
                <Plus className="size-4" />
                Tambah Anggota
              </Link>
            }
          />
        )}
      </div>

      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Nomor HP</TableHead>
              <TableHead>Angkatan</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              {isAdmin && <TableHead className="w-20" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.nama}</TableCell>
                <TableCell>{member.nomorHp}</TableCell>
                <TableCell>{member.angkatan ?? "-"}</TableCell>
                <TableCell>{roleLabel[member.role]}</TableCell>
                <TableCell>
                  <Badge variant={member.statusAktif ? "default" : "secondary"}>
                    {member.statusAktif ? "Aktif" : "Nonaktif"}
                  </Badge>
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        render={
                          <Link href={`/anggota/${member.id}/edit`}>
                            <Pencil className="size-3.5" />
                          </Link>
                        }
                      />
                      <DeleteMemberButton memberId={member.id} />
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
