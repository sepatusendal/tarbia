import Link from "next/link"
import {
  CalendarDays,
  ClipboardCheck,
  Wallet,
  BookOpen,
  Users,
  MapPin,
} from "lucide-react"

import { requireUser } from "@/lib/auth-helpers"
import {
  getNextMeeting,
  getSaldoKas,
  getLastMeetingAttendanceSummary,
  petugasByRole,
} from "@/lib/queries"
import { formatRupiah, formatTanggal } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const menu = [
  { href: "/jadwal", label: "Jadwal", icon: CalendarDays },
  { href: "/absensi", label: "Absensi", icon: ClipboardCheck },
  { href: "/kas", label: "Kas", icon: Wallet },
  { href: "/materi", label: "Materi", icon: BookOpen },
  { href: "/anggota", label: "Anggota", icon: Users },
]

export default async function DashboardPage() {
  const user = await requireUser()
  const [nextMeeting, saldo, lastAttendance] = await Promise.all([
    getNextMeeting(),
    getSaldoKas(),
    getLastMeetingAttendanceSummary(),
  ])

  const firstName = (user.name ?? "").split(" ")[0] || "Akhi/Ukhti"

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Assalamu&apos;alaikum, {firstName} 👋
        </h1>
        <p className="text-muted-foreground">
          Ini progress liqo kamu minggu ini.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-muted-foreground">
            Pertemuan Berikutnya
          </CardTitle>
        </CardHeader>
        <CardContent>
          {nextMeeting ? (
            <div className="grid gap-4">
              <div>
                <p className="text-xl font-semibold">
                  {formatTanggal(nextMeeting.tanggal)}, {nextMeeting.jam} WIB
                </p>
                <p className="text-muted-foreground flex items-center gap-1 text-sm">
                  <MapPin className="size-3.5" />
                  {nextMeeting.lokasi}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Tema</p>
                <p className="font-medium">{nextMeeting.tema}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t pt-4 sm:grid-cols-4">
                <div>
                  <p className="text-muted-foreground text-sm">MC</p>
                  <p className="font-medium">
                    {petugasByRole(nextMeeting.petugas, "MC").join(", ") || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Pemateri</p>
                  <p className="font-medium">
                    {petugasByRole(nextMeeting.petugas, "PEMATERI").join(", ") ||
                      "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Notulen</p>
                  <p className="font-medium">
                    {petugasByRole(nextMeeting.petugas, "NOTULEN").join(", ") ||
                      "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Dokumentasi</p>
                  <p className="font-medium">
                    {petugasByRole(
                      nextMeeting.petugas,
                      "DOKUMENTASI"
                    ).join(", ") || "-"}
                  </p>
                </div>
              </div>
              <Link
                href={`/jadwal/${nextMeeting.id}`}
                className="text-primary text-sm font-medium hover:underline"
              >
                Lihat detail pertemuan →
              </Link>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Belum ada jadwal pertemuan mendatang.{" "}
              <Link href="/jadwal/new" className="text-primary hover:underline">
                Buat jadwal baru
              </Link>
              .
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-muted-foreground">
              Saldo Kas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{formatRupiah(saldo)}</p>
            <Link
              href="/kas"
              className="text-primary text-sm font-medium hover:underline"
            >
              Lihat riwayat kas →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-muted-foreground">
              Kehadiran Terakhir
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lastAttendance ? (
              <div className="grid gap-2">
                <p className="text-muted-foreground text-sm">
                  {formatTanggal(lastAttendance.meeting.tanggal)}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    Hadir {lastAttendance.summary.HADIR}
                  </Badge>
                  <Badge variant="secondary">
                    Izin {lastAttendance.summary.IZIN}
                  </Badge>
                  <Badge variant="secondary">
                    Sakit {lastAttendance.summary.SAKIT}
                  </Badge>
                  <Badge variant="secondary">
                    Alfa {lastAttendance.summary.ALFA}
                  </Badge>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Belum ada data absensi.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">
          Menu
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {menu.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardContent className="flex flex-col items-center gap-2 py-6">
                  <Icon className="size-6" />
                  <span className="text-sm font-medium">{label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
