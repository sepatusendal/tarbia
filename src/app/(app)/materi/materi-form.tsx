"use client"

import { useActionState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { saveMateri, type MateriFormState } from "./actions"

const initialState: MateriFormState = {}

export function MateriForm({
  meetingId,
  defaultValues,
}: {
  meetingId: string
  defaultValues?: {
    judul: string
    ringkasan: string
    videoUrl: string
    catatan: string
    fileUrl: string | null
  }
}) {
  const [state, formAction, isPending] = useActionState(
    saveMateri,
    initialState
  )

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="meetingId" value={meetingId} />

      <div className="grid gap-2">
        <Label htmlFor="judul">Judul</Label>
        <Input
          id="judul"
          name="judul"
          placeholder="Adab Menuntut Ilmu"
          defaultValue={defaultValues?.judul}
          required
        />
        {state.fieldErrors?.judul && (
          <p className="text-destructive text-sm">
            {state.fieldErrors.judul[0]}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="ringkasan">Ringkasan (opsional)</Label>
        <Textarea
          id="ringkasan"
          name="ringkasan"
          defaultValue={defaultValues?.ringkasan}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="file">File PDF (opsional)</Label>
        <Input id="file" name="file" type="file" accept="application/pdf" />
        {defaultValues?.fileUrl && (
          <p className="text-muted-foreground text-sm">
            Sudah ada file tersimpan. Upload file baru untuk mengganti.
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="videoUrl">Link Video (opsional)</Label>
        <Input
          id="videoUrl"
          name="videoUrl"
          type="url"
          placeholder="https://youtube.com/..."
          defaultValue={defaultValues?.videoUrl}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="catatan">Catatan (opsional)</Label>
        <Textarea
          id="catatan"
          name="catatan"
          defaultValue={defaultValues?.catatan}
        />
      </div>

      {state.error && (
        <p className="text-destructive text-sm">{state.error}</p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Menyimpan..." : "Simpan Materi"}
      </Button>
    </form>
  )
}
