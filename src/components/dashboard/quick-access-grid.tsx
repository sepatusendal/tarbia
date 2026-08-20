import Link from "next/link"
import { ClipboardCheck, BookOpen, BookOpenText, Users } from "lucide-react"

const items = [
  { href: "/absensi", label: "Absensi", icon: ClipboardCheck },
  { href: "/materi", label: "Materi", icon: BookOpen },
  { href: "/quran", label: "Al-Qur'an", icon: BookOpenText },
  { href: "/anggota", label: "Anggota", icon: Users },
] as const

export function QuickAccessGrid() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex flex-col items-center gap-2 rounded-2xl bg-card py-4 text-center ring-1 ring-foreground/[0.06] transition-colors active:bg-muted/50"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon className="size-[18px]" />
          </span>
          <span className="text-[11px] leading-tight font-medium text-foreground">
            {label}
          </span>
        </Link>
      ))}
    </div>
  )
}
