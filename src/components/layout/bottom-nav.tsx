"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, CalendarDays, Wallet, User, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { QuickActionsSheet } from "@/components/layout/quick-actions-sheet"

// Trimmed to the 4 most-reached destinations — everything else (Absensi,
// Materi, Al-Qur'an, Anggota) moved to the dashboard's quick-access grid,
// matching a typical prayer-app bottom bar (few tabs, rest surfaced on
// Home). 2-and-2 around the center action keeps it symmetric — see the
// comment below on why that matters for the raised button's position.
const links = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/jadwal", label: "Meetings", icon: CalendarDays },
  { href: "/kas", label: "Treasury", icon: Wallet },
  { href: "/profile", label: "Profile", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
      aria-label="Navigasi utama"
    >
      <div className="glass-surface relative flex h-16 w-[min(400px,calc(100%-1.5rem))] items-center rounded-[26px] border border-border/80 px-1 shadow-xl shadow-black/10">
        {links.slice(0, 2).map((link) => (
          <NavItem key={link.href} {...link} active={isActive(pathname, link.href)} />
        ))}

        {/* Reserves the width the raised button sits over. With exactly
            2 links on each side this slot's center lands on the bar's
            true horizontal center (50%), which is where the absolutely
            positioned button below is anchored — an uneven split (e.g.
            2 vs 3) would push that center into a neighboring link's tap
            target instead of this empty gap. */}
        <div className="flex-1" aria-hidden="true" />

        {links.slice(2).map((link) => (
          <NavItem key={link.href} {...link} active={isActive(pathname, link.href)} />
        ))}

        <QuickActionsSheet
          trigger={
            <button
              type="button"
              aria-label="Aksi cepat"
              className="absolute -top-5 left-1/2 flex size-13 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/35 transition-transform active:scale-95"
            >
              <Plus className="size-6" />
            </button>
          }
        />
      </div>
    </nav>
  )
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

function NavItem({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  active: boolean
}) {
  return (
    <Link
      href={href}
      className="relative flex min-w-9 flex-1 flex-col items-center justify-center gap-0.5 py-1.5 text-muted-foreground"
    >
      {active && (
        <motion.span
          layoutId="bottom-nav-active"
          className="absolute inset-x-3 top-0 h-1 rounded-full bg-primary"
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      )}
      <Icon className={cn("size-[18px]", active && "text-foreground")} />
      <span className={cn("text-[9px] font-medium", active && "text-foreground")}>
        {label}
      </span>
    </Link>
  )
}
