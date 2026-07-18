"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ClipboardCheck,
  CalendarPlus,
  Banknote,
  FileUp,
  NotebookPen,
} from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const actions = [
  {
    href: "/absensi",
    label: "Attendance",
    description: "Catat kehadiran pertemuan",
    icon: ClipboardCheck,
  },
  {
    href: "/jadwal/new",
    label: "New Meeting",
    description: "Jadwalkan liqo berikutnya",
    icon: CalendarPlus,
  },
  {
    href: "/kas?new=1",
    label: "Cash Transaction",
    description: "Catat pemasukan / pengeluaran",
    icon: Banknote,
  },
  {
    href: "/materi",
    label: "Upload Material",
    description: "Bagikan materi kajian",
    icon: FileUp,
  },
  {
    href: null,
    label: "Add Note",
    description: "Segera hadir",
    icon: NotebookPen,
  },
] as const

export function QuickActionsSheet({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={trigger as React.ReactElement} />
      <SheetContent side="bottom" className="rounded-t-[28px] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <SheetHeader>
          <SheetTitle>Aksi Cepat</SheetTitle>
        </SheetHeader>
        <div className="grid gap-1 px-4 pb-2">
          {actions.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                delay: i * 0.04,
              }}
            >
              {action.href ? (
                <Link
                  href={action.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[56px] items-center gap-3 rounded-2xl px-3 py-2 transition-colors active:bg-muted"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <action.icon className="size-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium">
                      {action.label}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {action.description}
                    </span>
                  </span>
                </Link>
              ) : (
                <div className="flex min-h-[56px] items-center gap-3 rounded-2xl px-3 py-2 opacity-50">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <action.icon className="size-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium">
                      {action.label}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {action.description}
                    </span>
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
