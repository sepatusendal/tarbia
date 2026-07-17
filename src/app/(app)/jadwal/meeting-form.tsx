"use client"

import { useActionState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { MeetingFormState } from "./actions"

type MeetingFormProps = {
  action: (
    state: MeetingFormState,
    formData: FormData
  ) => Promise<MeetingFormState>
  defaultValues?: {
    tanggal: string
    jam: string
    lokasi: string
    tema: string
    catatan: string
  }
  submitLabel: string
}

const initialState: MeetingFormState = {}

export function MeetingForm({
  action,
  defaultValues,
  submitLabel,
}: MeetingFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState)

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="tanggal">Tanggal</Label>
        <Input
          id="tanggal"
          name="tanggal"
          type="date"
          defaultValue={defaultValues?.tanggal}
          required
        />
        {state.fieldErrors?.tanggal && (
          <p className="text-destructive text-sm">
            {state.fieldErrors.tanggal[0]}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="jam">Jam</Label>
        <Input
          id="jam"
          name="jam"
          type="time"
          defaultValue={defaultValues?.jam}
          required
        />
        {state.fieldErrors?.jam && (
          <p className="text-destructive text-sm">{state.fieldErrors.jam[0]}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="lokasi">Lokasi</Label>
        <Input
          id="lokasi"
          name="lokasi"
          placeholder="Rumah Akhi Ahmad"
          defaultValue={defaultValues?.lokasi}
          required
        />
        {state.fieldErrors?.lokasi && (
          <p className="text-destructive text-sm">
            {state.fieldErrors.lokasi[0]}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="tema">Tema</Label>
        <Input
          id="tema"
          name="tema"
          placeholder="Adab Menuntut Ilmu"
          defaultValue={defaultValues?.tema}
          required
        />
        {state.fieldErrors?.tema && (
          <p className="text-destructive text-sm">
            {state.fieldErrors.tema[0]}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="catatan">Catatan (opsional)</Label>
        <Textarea
          id="catatan"
          name="catatan"
          defaultValue={defaultValues?.catatan}
        />
      </div>

      {state.error && <p className="text-destructive text-sm">{state.error}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Menyimpan..." : submitLabel}
      </Button>
    </form>
  )
}
