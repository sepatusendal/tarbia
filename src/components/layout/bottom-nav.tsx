"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, CalendarDays, BookOpen, Wallet, User } from "lucide-react"

import { cn } from "@/lib/utils"

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
      <div className="glass-surface flex h-16 w-[min(400px,calc(100%-1.5rem))] items-center justify-between rounded-[26px] border border-border/60 px-1 shadow-lg shadow-black/10">
        {links.map((link) => (
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
      className="relative flex min-w-11 flex-1 flex-col items-center justify-center gap-0.5 py-2 text-muted-foreground"
    >
      {active && (
        <motion.span
          layoutId="bottom-nav-active"
          className="absolute inset-x-2.5 top-0.5 h-1 rounded-full bg-primary"
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      )}
      <Icon className={cn("size-5", active && "text-foreground")} />
      <span className={cn("text-[9.5px] font-medium", active && "text-foreground")}>
        {label}
      </span>
    </Link>
  )
}
