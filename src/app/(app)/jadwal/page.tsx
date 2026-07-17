import Link from "next/link"
import { Plus, MapPin } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth-helpers"
import { formatTanggal } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default async function JadwalPage() {
  const user = await requireUser()

  const [upcoming, history] = await Promise.all([
    prisma.meeting.findMany({
      where: { tanggal: { gte: new Date() } },
      orderBy: { tanggal: "asc" },
    }),
    prisma.meeting.findMany({
      where: { tanggal: { lt: new Date() } },
      orderBy: { tanggal: "desc" },
    }),
  ])

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Jadwal Liqo</h1>
          <p className="text-muted-foreground">
            Semua jadwal pertemuan, rapi di satu tempat.
          </p>
        </div>
        {user.role === "ADMIN" && (
          <Button
            render={
              <Link href="/jadwal/new">
                <Plus className="size-4" />
                Jadwal Baru
              </Link>
            }
          />
        )}
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Akan Datang</TabsTrigger>
          <TabsTrigger value="history">Riwayat</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="grid gap-3">
          {upcoming.length === 0 && (
            <p className="text-muted-foreground py-6 text-center">
              Belum ada jadwal mendatang.
            </p>
          )}
          {upcoming.map((meeting) => (
            <Link key={meeting.id} href={`/jadwal/${meeting.id}`}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium">{formatTanggal(meeting.tanggal)}, {meeting.jam} WIB</p>
                    <p className="text-muted-foreground text-sm">{meeting.tema}</p>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-1 text-sm">
                    <MapPin className="size-3.5" />
                    {meeting.lokasi}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </TabsContent>
        <TabsContent value="history" className="grid gap-3">
          {history.length === 0 && (
            <p className="text-muted-foreground py-6 text-center">
              Belum ada riwayat pertemuan.
            </p>
          )}
          {history.map((meeting) => (
            <Link key={meeting.id} href={`/jadwal/${meeting.id}`}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium">{formatTanggal(meeting.tanggal)}, {meeting.jam} WIB</p>
                    <p className="text-muted-foreground text-sm">{meeting.tema}</p>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-1 text-sm">
                    <MapPin className="size-3.5" />
                    {meeting.lokasi}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
