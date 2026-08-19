"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardCheck,
  Wallet,
  BookOpen,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/jadwal", label: "Jadwal", icon: CalendarDays },
  { href: "/absensi", label: "Absensi", icon: ClipboardCheck },
  { href: "/kas", label: "Kas", icon: Wallet },
  { href: "/materi", label: "Materi", icon: BookOpen },
  { href: "/anggota", label: "Anggota", icon: Users },
]

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav className="grid gap-1.5">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
              active
                ? "bg-primary text-primary-foreground shadow-[0_4px_12px_rgb(63_87_47_/_0.16)]"
                : "text-muted-foreground hover:translate-x-0.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
