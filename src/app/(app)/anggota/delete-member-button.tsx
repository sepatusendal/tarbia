"use client"

import { useTransition } from "react"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { deleteMember } from "./actions"

export function DeleteMemberButton({ memberId }: { memberId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Hapus anggota ini?")) return
        startTransition(async () => {
          try {
            await deleteMember(memberId)
            toast.success("Anggota dihapus")
          } catch (err) {
            toast.error(
              err instanceof Error ? err.message : "Gagal menghapus anggota"
            )
          }
        })
      }}
    >
      <Trash2 className="size-3.5" />
    </Button>
  )
}
