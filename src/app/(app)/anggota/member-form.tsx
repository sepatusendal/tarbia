"use client"

import { useActionState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { MemberFormState } from "./actions"

type MemberFormProps = {
  action: (
    state: MemberFormState,
    formData: FormData
  ) => Promise<MemberFormState>
  defaultValues?: {
    nama: string
    nomorHp: string
    angkatan: string
    role: string
    statusAktif: boolean
  }
  submitLabel: string
  passwordRequired?: boolean
}

const initialState: MemberFormState = {}

export function MemberForm({
  action,
  defaultValues,
  submitLabel,
  passwordRequired = true,
}: MemberFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState)

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="nama">Nama</Label>
        <Input
          id="nama"
          name="nama"
          defaultValue={defaultValues?.nama}
          required
        />
        {state.fieldErrors?.nama && (
          <p className="text-destructive text-sm">
            {state.fieldErrors.nama[0]}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="nomorHp">Nomor HP</Label>
        <Input
          id="nomorHp"
          name="nomorHp"
          placeholder="08xxxxxxxxxx"
          defaultValue={defaultValues?.nomorHp}
          required
        />
        {state.fieldErrors?.nomorHp && (
          <p className="text-destructive text-sm">
            {state.fieldErrors.nomorHp[0]}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="angkatan">Angkatan (opsional)</Label>
        <Input
          id="angkatan"
          name="angkatan"
          defaultValue={defaultValues?.angkatan}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="role">Role</Label>
        <Select
          name="role"
          items={{ ADMIN: "Admin", PENGURUS: "Pengurus", ANGGOTA: "Anggota" }}
          defaultValue={defaultValues?.role ?? "ANGGOTA"}
        >
          <SelectTrigger className="w-full" id="role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="PENGURUS">Pengurus</SelectItem>
            <SelectItem value="ANGGOTA">Anggota</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">
          {passwordRequired ? "Password" : "Password Baru (opsional)"}
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder={passwordRequired ? "" : "Kosongkan jika tidak diubah"}
          required={passwordRequired}
        />
        {state.fieldErrors?.password && (
          <p className="text-destructive text-sm">
            {state.fieldErrors.password[0]}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="statusAktif"
          name="statusAktif"
          type="checkbox"
          defaultChecked={defaultValues?.statusAktif ?? true}
          className="size-4 rounded border-input"
        />
        <Label htmlFor="statusAktif">Anggota aktif</Label>
      </div>

      {state.error && (
        <p className="text-destructive text-sm">{state.error}</p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Menyimpan..." : submitLabel}
      </Button>
    </form>
  )
}
