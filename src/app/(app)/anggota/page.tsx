import Link from "next/link"
import { Plus, Pencil, Phone } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth-helpers"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

      {/* Mobile: stacked cards */}
      <div className="grid gap-3 md:hidden">
        {members.map((member) => {
          const initials = member.nama
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()

          return (
            <Card key={member.id} className="rounded-2xl">
              <CardContent className="flex items-center gap-3 py-1">
                <Avatar className="size-11 shrink-0">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{member.nama}</p>
                  <p className="text-muted-foreground flex items-center gap-1 text-sm">
                    <Phone className="size-3 shrink-0" />
                    {member.nomorHp}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <Badge variant="secondary">{roleLabel[member.role]}</Badge>
                    <Badge variant={member.statusAktif ? "default" : "secondary"}>
                      {member.statusAktif ? "Aktif" : "Nonaktif"}
                    </Badge>
                    {member.angkatan && (
                      <Badge variant="secondary">{member.angkatan}</Badge>
                    )}
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex shrink-0 flex-col items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      nativeButton={false}
                      render={
                        <Link href={`/anggota/${member.id}/edit`}>
                          <Pencil className="size-3.5" />
                        </Link>
                      }
                    />
                    <DeleteMemberButton memberId={member.id} />
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-hidden rounded-xl border md:block">
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
                        nativeButton={false}
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
