import Link from "next/link"
import {
  MapPin,
  CalendarClock,
  Users,
  Wallet,
  ClipboardCheck,
  ListTodo,
  Banknote,
  CalendarPlus,
  FileUp,
  ArrowRight,
} from "lucide-react"

import { requireUser } from "@/lib/auth-helpers"
import {
  getNextMeeting,
  getSaldoKas,
  getMemberCount,
  getAttendanceRate,
  getUpcomingTasksCount,
  getRecentActivities,
  getAttendanceTrend,
  getCashFlowTrend,
  getMeetingActivityTrend,
} from "@/lib/queries"
import type { Period } from "@/lib/chart-utils"
import { formatTanggalPendek, formatRupiah } from "@/lib/format"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { CountdownBadge } from "@/components/shared/countdown-badge"
import { ChartCard } from "@/components/charts/chart-card"
import { TodaysReflectionCard } from "@/components/quran/todays-reflection-card"
import { RelatedVersesCard } from "@/components/quran/related-verses-card"
import { ContinueReadingCard } from "@/components/quran/continue-reading-card"

async function allPeriods<T>(
  fn: (period: Period) => Promise<T>
): Promise<Record<Period, T>> {
  const [weekly, monthly, yearly] = await Promise.all([
    fn("weekly"),
    fn("monthly"),
    fn("yearly"),
  ])
  return { weekly, monthly, yearly }
}

function greeting() {
  const hour = new Date().getHours()
  if (hour < 11) return "Selamat Pagi"
  if (hour < 15) return "Selamat Siang"
  if (hour < 18) return "Selamat Sore"
  return "Selamat Malam"
}

const activityIcon = {
  kas: Banknote,
  jadwal: CalendarPlus,
  absensi: ClipboardCheck,
  materi: FileUp,
} as const

export default async function DashboardPage() {
  const user = await requireUser()
  const [
    nextMeeting,
    saldo,
    memberCount,
    attendanceRate,
    taskCount,
    activities,
    attendanceTrend,
    cashFlowTrend,
    meetingActivityTrend,
  ] = await Promise.all([
    getNextMeeting(),
    getSaldoKas(),
    getMemberCount(),
    getAttendanceRate(),
    getUpcomingTasksCount(),
    getRecentActivities(),
    allPeriods(getAttendanceTrend),
    allPeriods(getCashFlowTrend),
    allPeriods(getMeetingActivityTrend),
  ])

  const firstName = (user.name ?? "").split(" ")[0] || "Akhi/Ukhti"

  return (
    <div className="grid gap-8 pb-6">
      <section className="animate-fade-up">
        <p className="text-muted-foreground text-sm">{greeting()} 👋</p>
        <h1 className="text-2xl font-semibold">{firstName}</h1>
      </section>

      <section
        className="animate-fade-up"
        style={{ animationDelay: "60ms" }}
      >
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          Liqo Berikutnya
        </p>
        {nextMeeting ? (
          <Card className="overflow-hidden rounded-3xl ring-primary/15">
            <CardContent className="grid gap-4 py-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold">
                    {formatTanggalPendek(nextMeeting.tanggal)} · {nextMeeting.jam} WIB
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="size-3.5" />
                    {nextMeeting.lokasi}
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                  <CalendarClock className="size-3.5" />
                  <CountdownBadge target={nextMeeting.tanggal} />
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tema</p>
                <p className="font-medium">{nextMeeting.tema}</p>
              </div>
              <Button
                variant="outline"
                nativeButton={false}
                className="h-11 w-full rounded-2xl"
                render={
                  <Link href={`/jadwal/${nextMeeting.id}`}>
                    Lihat Detail
                    <ArrowRight className="size-4" />
                  </Link>
                }
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="rounded-3xl">
            <CardContent className="grid gap-3 py-2 text-center">
              <p className="text-muted-foreground">
                Belum ada jadwal pertemuan mendatang.
              </p>
              <Button
                nativeButton={false}
                className="h-11 w-full rounded-2xl"
                render={<Link href="/jadwal/new">Buat Jadwal Baru</Link>}
              />
            </CardContent>
          </Card>
        )}
      </section>

      <section
        className="animate-fade-up"
        style={{ animationDelay: "70ms" }}
      >
        <ContinueReadingCard memberId={user.id} />
      </section>

      <section
        className="grid gap-3 animate-fade-up"
        style={{ animationDelay: "80ms" }}
      >
        <TodaysReflectionCard />
        {nextMeeting?.tema && <RelatedVersesCard theme={nextMeeting.tema} />}
      </section>

      {nextMeeting?.catatan && (
        <section
          className="animate-fade-up"
          style={{ animationDelay: "100ms" }}
        >
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            Pengingat Hari Ini
          </p>
          <Card className="rounded-2xl bg-primary/5 ring-primary/10">
            <CardContent className="py-1">
              <p className="text-sm italic">&ldquo;{nextMeeting.catatan}&rdquo;</p>
            </CardContent>
          </Card>
        </section>
      )}

      <section
        className="animate-fade-up"
        style={{ animationDelay: "140ms" }}
      >
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          Statistik Singkat
        </p>
        <div className="grid grid-cols-2 gap-3">
          <StatTile
            icon={ClipboardCheck}
            label="Kehadiran"
            value={attendanceRate}
            suffix="%"
          />
          <StatTile
            icon={Wallet}
            label="Kas Saat Ini"
            value={saldo}
            format="rupiah"
          />
          <StatTile icon={Users} label="Anggota" value={memberCount} />
          <StatTile icon={ListTodo} label="Tugas Terbuka" value={taskCount} />
        </div>
      </section>

      <section
        className="grid gap-3"
        style={{ animationDelay: "180ms" }}
      >
        <p className="text-sm font-medium text-muted-foreground">Insight</p>

        <ChartCard
          title="Kehadiran"
          summary={`Minggu ini rata-rata ${
            attendanceTrend.weekly.at(-1)?.value ?? 0
          }% hadir`}
          linkHref="/absensi"
          linkLabel="Buka Absensi"
          variant={{ kind: "sparkline", dataByPeriod: attendanceTrend, valueSuffix: "%" }}
        />

        <ChartCard
          title="Arus Kas"
          summary={`Saldo saat ini ${formatRupiah(saldo)}`}
          linkHref="/kas"
          linkLabel="Buka Kas"
          variant={{ kind: "area", dataByPeriod: cashFlowTrend }}
        />

        <ChartCard
          title="Aktivitas Pertemuan"
          summary="Frekuensi liqo dari waktu ke waktu"
          linkHref="/jadwal"
          linkLabel="Lihat Jadwal"
          variant={{ kind: "heatmap", dataByPeriod: meetingActivityTrend }}
        />
      </section>

      <section
        className="animate-fade-up"
        style={{ animationDelay: "180ms" }}
      >
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          Aktivitas Terbaru
        </p>
        <Card className="rounded-2xl">
          <CardContent className="grid gap-1 py-1">
            {activities.length === 0 && (
              <p className="text-muted-foreground py-6 text-center text-sm">
                Belum ada aktivitas.
              </p>
            )}
            {activities.map((activity, i) => {
              const Icon = activityIcon[activity.type]
              return (
                <div
                  key={activity.id}
                  className={`flex items-center gap-3 py-3 ${
                    i !== activities.length - 1 ? "border-b border-border/60" : ""
                  }`}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {activity.label}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {activity.detail}
                    </p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

function StatTile({
  icon: Icon,
  label,
  value,
  suffix,
  format,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number
  suffix?: string
  format?: "rupiah"
}) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="grid gap-2 py-1">
        <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
        {format === "rupiah" ? (
          <p className="text-lg font-semibold leading-tight">
            <AnimatedCounter value={value} prefix="Rp " />
          </p>
        ) : (
          <p className="text-2xl font-semibold leading-tight">
            <AnimatedCounter value={value} suffix={suffix} />
          </p>
        )}
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  )
}
