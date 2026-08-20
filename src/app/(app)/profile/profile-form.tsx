"use client"

import { useActionState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateOwnProfile } from "./actions"
import type { MemberFormState } from "../anggota/actions"

const initialState: MemberFormState = {}

export function ProfileForm({ defaultNama }: { defaultNama: string }) {
  const [state, formAction, isPending] = useActionState(
    updateOwnProfile,
    initialState
  )

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="nama">Nama</Label>
        <Input id="nama" name="nama" defaultValue={defaultNama} required />
        {state.fieldErrors?.nama && (
          <p className="text-destructive text-sm">
            {state.fieldErrors.nama[0]}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Password Baru (opsional)</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Kosongkan jika tidak diubah"
        />
        {state.fieldErrors?.password && (
          <p className="text-destructive text-sm">
            {state.fieldErrors.password[0]}
          </p>
        )}
      </div>

      {state.error && (
        <p className="text-destructive text-sm">{state.error}</p>
      )}

      <Button type="submit" disabled={isPending} className="h-11 rounded-2xl">
        {isPending ? "Menyimpan..." : "Simpan Perubahan"}
      </Button>
    </form>
  )
}
