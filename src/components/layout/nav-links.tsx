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
    <nav className="grid gap-1">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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
