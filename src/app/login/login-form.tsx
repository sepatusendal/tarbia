"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Phone, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import { toast } from "sonner"

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

const inputClassName =
  "h-12 rounded-2xl border-black/10 bg-white/70 pl-11 pr-4 text-[15px] shadow-sm placeholder:text-black/35 focus-visible:border-black/20 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-black/5"

export function LoginForm() {
  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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
          disabled={isPending}
          className="group h-12 w-full rounded-2xl bg-black text-[15px] font-medium text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-black hover:shadow-xl"
        >
          {isPending ? "Masuk..." : "Masuk"}
          {!isPending && (
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          )}
        </Button>

        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-black/10" />
          <span className="text-xs text-black/40">atau lanjut dengan</span>
          <div className="h-px flex-1 bg-black/10" />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => toast.info("Login Google belum tersedia")}
          className="h-12 w-full rounded-2xl border-black/10 bg-white/70 text-[15px] font-medium text-black/80 shadow-sm hover:bg-white"
        >
          <GoogleIcon className="size-4" />
          Lanjut dengan Google
        </Button>
      </form>
    </Form>
  )
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.83-.07-1.63-.2-2.4H12v4.55h6.47c-.28 1.48-1.13 2.74-2.4 3.58v2.98h3.88c2.27-2.09 3.55-5.17 3.55-8.71Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.92l-3.88-2.98c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.95H1.27v3.07C3.25 21.3 7.31 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.3a7.2 7.2 0 0 1 0-4.6V6.63H1.27a12 12 0 0 0 0 10.74l4-3.07Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.63l4 3.07C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  )
}
