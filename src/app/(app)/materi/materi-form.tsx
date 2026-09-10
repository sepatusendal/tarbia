"use client"

import { useActionState, useState } from "react"
import { FileUp, FileCheck2 } from "lucide-react"

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
  const [fileName, setFileName] = useState<string | null>(null)

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
        <div className="relative">
          <input
            id="file"
            name="file"
            type="file"
            accept="application/pdf"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            className="absolute inset-0 h-14 w-full cursor-pointer opacity-0"
          />
          <div className="flex h-14 items-center gap-3 rounded-2xl border border-dashed border-input bg-background/60 px-4 text-sm">
            <FileUp className="size-4.5 shrink-0 text-muted-foreground" />
            <span
              className={
                fileName ? "truncate text-foreground" : "text-muted-foreground"
              }
            >
              {fileName ?? "Ketuk untuk pilih file PDF"}
            </span>
          </div>
        </div>
        {defaultValues?.fileUrl && !fileName && (
          <a
            href={defaultValues.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <FileCheck2 className="size-3.5" />
            Lihat file yang tersimpan &middot; upload baru untuk mengganti
          </a>
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

      <Button type="submit" disabled={isPending} className="h-11 rounded-2xl">
        {isPending ? "Menyimpan..." : "Simpan Materi"}
      </Button>
    </form>
  )
}
