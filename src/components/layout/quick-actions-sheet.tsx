"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ClipboardCheck,
  CalendarPlus,
  Banknote,
  BookOpen,
  BookOpenText,
  Users,
} from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

// Doubles as the mobile app's "everything else" menu, not just shortcuts
// to create something — the bottom nav only has room for 4 destinations
// (Home, Jadwal, Kas, Profile), so Absensi/Materi/Qur'an/Anggota live
// here instead of being reachable only from the dashboard's grid.
const navItems = [
  {
    href: "/absensi",
    label: "Absensi",
    description: "Lihat & catat kehadiran",
    icon: ClipboardCheck,
  },
  {
    href: "/materi",
    label: "Materi",
    description: "Baca materi kajian",
    icon: BookOpen,
  },
  {
    href: "/quran",
    label: "Al-Qur'an",
    description: "Baca & cari ayat",
    icon: BookOpenText,
  },
  {
    href: "/anggota",
    label: "Anggota",
    description: "Kelola anggota UPA",
    icon: Users,
  },
] as const

const actionItems = [
  {
    href: "/jadwal/new",
    label: "Jadwal Baru",
    description: "Jadwalkan liqo berikutnya",
    icon: CalendarPlus,
  },
  {
    href: "/kas?new=1",
    label: "Catat Transaksi",
    description: "Catat pemasukan / pengeluaran",
    icon: Banknote,
  },
] as const

function SheetLink({
  href,
  label,
  description,
  icon: Icon,
  delay,
  onNavigate,
}: {
  href: string
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  delay: number
  onNavigate: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30, delay }}
    >
      <Link
        href={href}
        onClick={onNavigate}
        className="flex min-h-[56px] items-center gap-3 rounded-2xl px-3 py-2 transition-colors active:bg-muted"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <span>
          <span className="block text-sm font-medium">{label}</span>
          <span className="block text-xs text-muted-foreground">{description}</span>
        </span>
      </Link>
    </motion.div>
  )
}

export function QuickActionsSheet({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={trigger as React.ReactElement} />
      <SheetContent side="bottom" className="rounded-t-[28px] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="grid gap-1 px-4 pb-2">
          {navItems.map((item, i) => (
            <SheetLink key={item.href} {...item} delay={i * 0.04} onNavigate={close} />
          ))}
        </div>
        <div className="mx-4 my-1 border-t border-border/60" />
        <div className="grid gap-1 px-4 pb-2">
          {actionItems.map((item, i) => (
            <SheetLink
              key={item.href}
              {...item}
              delay={(navItems.length + i) * 0.04}
              onNavigate={close}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
