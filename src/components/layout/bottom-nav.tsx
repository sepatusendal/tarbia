"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, CalendarDays, BookOpen, Wallet, User, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { QuickActionsSheet } from "@/components/layout/quick-actions-sheet"

const links = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/jadwal", label: "Meetings", icon: CalendarDays },
  { href: "/quran", label: "Quran", icon: BookOpen },
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
      <div className="glass-surface flex h-14 w-[min(420px,calc(100%-1.5rem))] items-center rounded-[22px] border border-border/80 px-1 shadow-xl shadow-black/10">
        {links.slice(0, 2).map((link) => (
          <NavItem key={link.href} {...link} active={isActive(pathname, link.href)} />
        ))}

        {/* Inline, not raised — an absolutely-positioned center button
            drifted off-center whenever the nav items on either side were
            an uneven count (2 left vs 3 right), overlapping the first
            right-side link's tap target. */}
        <QuickActionsSheet
          trigger={
            <button
              type="button"
              aria-label="Aksi cepat"
              className="flex min-w-9 flex-1 flex-col items-center justify-center gap-0.5 py-1.5 text-muted-foreground"
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Plus className="size-4" />
              </span>
            </button>
          }
        />

        {links.slice(2).map((link) => (
          <NavItem key={link.href} {...link} active={isActive(pathname, link.href)} />
        ))}
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
