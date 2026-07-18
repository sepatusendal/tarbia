"use client"

import Image from "next/image"
import { motion } from "framer-motion"

import { GithubIcon, InstagramIcon } from "@/components/icons/brand-icons"
import { LoginForm } from "./login-form"

export function LoginCard() {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="login-animate-item w-full max-w-[420px] overflow-hidden rounded-[32px] border border-white/50 bg-white/65 shadow-2xl shadow-black/10 backdrop-blur-xl transition-shadow hover:shadow-black/15"
      style={{ animationDelay: "150ms" }}
    >
      <div className="p-6 sm:p-10">
        <div
          className="login-animate-item mb-8 flex justify-center"
          style={{ animationDelay: "250ms" }}
        >
          <Image
            src="/logo-full.png"
            alt="Tarbia — Every step matters."
            width={190}
            height={65}
            unoptimized
            priority
            className="h-auto w-[170px] sm:w-[190px]"
          />
        </div>
        <div className="login-animate-item" style={{ animationDelay: "320ms" }}>
          <LoginForm />
        </div>
      </div>

      {/* Footer credit, inside the card */}
      <div className="flex flex-col items-center gap-1.5 border-t border-black/5 bg-black/[0.02] px-6 py-3 text-center sm:gap-2 sm:px-8 sm:py-4">
        <p className="text-[10.5px] leading-tight text-black/45 sm:text-[11px]">
          Dibuat untuk UPA Ash-Habul Kahfi · Cibitung, Kab. Bekasi
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[10.5px] text-black/40 sm:text-[11px]">
            built with ❤️ by wira
          </span>
          <div className="flex items-center gap-0.5">
            <a
              href="https://github.com/sepatusendal"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub wira"
              className="flex size-6 items-center justify-center rounded-full text-black/40 transition-colors hover:bg-black/5 hover:text-black/70"
            >
              <GithubIcon className="size-3.5" />
            </a>
            <a
              href="https://instagram.com/wirarajaofficial"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram @wirarajaofficial"
              className="flex size-6 items-center justify-center rounded-full text-black/40 transition-colors hover:bg-black/5 hover:text-black/70"
            >
              <InstagramIcon className="size-3.5" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
