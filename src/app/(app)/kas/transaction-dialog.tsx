"use client"

import { useState, useTransition } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createTransaction, type TransactionFormState } from "./actions"

const kategoriPemasukan = ["Iuran Anggota", "Donasi", "Lainnya"]
const kategoriPengeluaran = ["Konsumsi", "Operasional", "Kegiatan Lainnya"]

const initialState: TransactionFormState = {}

export function TransactionDialog() {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<"PEMASUKAN" | "PENGELUARAN">("PEMASUKAN")
  const [state, setState] = useState<TransactionFormState>(initialState)
  const [isPending, startTransition] = useTransition()

  function formAction(formData: FormData) {
    startTransition(async () => {
      const result = await createTransaction(initialState, formData)
      if (result.error || result.fieldErrors) {
        setState(result)
        return
      }
      setState(initialState)
      toast.success("Transaksi tersimpan ✨")
      setOpen(false)
    })
  }

  const kategoriOptions =
    type === "PEMASUKAN" ? kategoriPemasukan : kategoriPengeluaran

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) setState(initialState)
      }}
    >
      <DialogTrigger
        render={
          <Button>
            <Plus className="size-4" />
            Catat Transaksi
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Catat Transaksi</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label>Jenis</Label>
            <Select
              items={{ PEMASUKAN: "Pemasukan", PENGELUARAN: "Pengeluaran" }}
              value={type}
              onValueChange={(value) =>
                setType(value as "PEMASUKAN" | "PENGELUARAN")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PEMASUKAN">Pemasukan</SelectItem>
                <SelectItem value="PENGELUARAN">Pengeluaran</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" name="type" value={type} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="kategori">Kategori</Label>
            <Input
              id="kategori"
              name="kategori"
              list="kategori-options"
              placeholder="Pilih atau ketik kategori"
              required
            />
            <datalist id="kategori-options">
              {kategoriOptions.map((k) => (
                <option key={k} value={k} />
              ))}
            </datalist>
            {state.fieldErrors?.kategori && (
              <p className="text-destructive text-sm">
                {state.fieldErrors.kategori[0]}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="jumlah">Jumlah (Rp)</Label>
            <Input
              id="jumlah"
              name="jumlah"
              type="number"
              min={1}
              placeholder="50000"
              required
            />
            {state.fieldErrors?.jumlah && (
              <p className="text-destructive text-sm">
                {state.fieldErrors.jumlah[0]}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tanggal">Tanggal</Label>
            <Input
              id="tanggal"
              name="tanggal"
              type="date"
              defaultValue={new Date().toISOString().slice(0, 10)}
              required
            />
            {state.fieldErrors?.tanggal && (
              <p className="text-destructive text-sm">
                {state.fieldErrors.tanggal[0]}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="keterangan">Keterangan (opsional)</Label>
            <Textarea id="keterangan" name="keterangan" />
          </div>

          {state.error && (
            <p className="text-destructive text-sm">{state.error}</p>
          )}

          <Button type="submit" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
