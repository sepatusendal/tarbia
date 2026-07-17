"use client"

import { useTransition } from "react"
import { X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { deleteTransaction } from "./actions"

export function DeleteTransactionButton({
  transactionId,
}: {
  transactionId: string
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Hapus transaksi ini?")) return
        startTransition(async () => {
          await deleteTransaction(transactionId)
          toast.success("Transaksi dihapus")
        })
      }}
    >
      <X className="size-3.5" />
    </Button>
  )
}
