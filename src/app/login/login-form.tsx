"use client"

import { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Phone, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { loginAction } from "./actions"

const loginSchema = z.object({
  nomorHp: z.string().min(8, "Nomor HP tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
})

type LoginValues = z.infer<typeof loginSchema>

// The `!` (important) overrides are needed because Input/Button are shared
// with the rest of the app and ship their own `dark:` classes for the app's
// theme — this login screen is a fixed light/warm glass treatment that must
// win regardless of the visitor's system/app theme preference.
const inputClassName =
  "h-11 sm:h-12 rounded-2xl !border-black/10 !bg-white/70 pl-11 pr-4 text-[15px] !text-black shadow-sm placeholder:!text-black/35 focus-visible:!border-[#4B5320]/40 focus-visible:!bg-white focus-visible:!ring-4 focus-visible:!ring-[#4B5320]/10"

export function LoginForm() {
  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // The form posts to a server action, which requires JS to have attached
  // the submit handler. On a slow connection, tapping submit before that
  // happens falls back to a native form submit that just reloads the page
  // with no error shown. Disabling until hydrated prevents that dead end.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional mount-flag guard, not state sync
    setIsHydrated(true)
  }, [])

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { nomorHp: "", password: "" },
  })

  function onSubmit(values: LoginValues) {
    setFormError(null)
    startTransition(async () => {
      const result = await loginAction(values.nomorHp, values.password)
      if (result?.error) {
        setFormError(result.error)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3 sm:gap-4">
        <FormField
          control={form.control}
          name="nomorHp"
          render={({ field }) => (
            <FormItem>
              <div className="relative">
                <Phone className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-black/40" />
                <FormControl>
                  <Input
                    placeholder="Nomor HP"
                    autoComplete="username"
                    className={inputClassName}
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-black/40" />
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="current-password"
                    className={`${inputClassName} pr-11`}
                    {...field}
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 text-black/40 transition-colors hover:text-black/70"
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {formError && (
          <p className="text-sm text-destructive">{formError}</p>
        )}
        <Button
          type="submit"
          disabled={isPending || !isHydrated}
          className="group h-11 sm:h-12 w-full rounded-2xl !bg-[#4B5320] text-[15px] font-medium !text-white shadow-lg transition-all hover:-translate-y-0.5 hover:!bg-[#5C6B2E] hover:shadow-xl hover:shadow-[#4B5320]/20 disabled:opacity-60"
        >
          {isPending ? "Masuk..." : isHydrated ? "Masuk" : "Memuat..."}
          {!isPending && isHydrated && (
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          )}
        </Button>
      </form>
    </Form>
  )
}
