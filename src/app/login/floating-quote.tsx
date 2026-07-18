"use client"

import { motion } from "framer-motion"
import { Info } from "lucide-react"

export function FloatingQuote({ className = "" }: { className?: string }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`login-animate-item relative w-[200px] max-w-[70vw] rounded-xl border border-white/50 bg-white/55 p-2.5 shadow-lg backdrop-blur-md ${className}`}
      style={{ animationDelay: "350ms" }}
    >
      <button
        type="button"
        aria-label="Sumber hadits"
        className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full text-black/30 transition-colors hover:bg-black/5 hover:text-black/60"
      >
        <Info className="size-2.5" />
      </button>
      <p className="text-base leading-none text-black/25">&ldquo;</p>
      <p className="-mt-0.5 text-[10px] leading-snug text-black/80 opacity-90">
        The most beloved deeds to Allah are those that are consistent, even
        if they are small.
      </p>
      <p className="mt-1 text-[9px] text-black/45">
        — Prophet Muhammad ﷺ
        <span className="block text-black/35">(HR. Bukhari &amp; Muslim)</span>
      </p>
    </motion.div>
  )
}
