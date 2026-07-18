"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Network, Target, Link2, TrendingUp } from "lucide-react"

const chips = [
  {
    icon: Network,
    label: "Organized",
    detail: "Keep your schedule and materials in one place",
  },
  {
    icon: Target,
    label: "Focused",
    detail: "Stay present in every session",
  },
  {
    icon: Link2,
    label: "Connected",
    detail: "Stay connected with your halaqah",
  },
  {
    icon: TrendingUp,
    label: "Growing",
    detail: "Track progress, together",
  },
]

export function HeroSection() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="max-w-[440px]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-4 h-px w-8 bg-black/25"
      />
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
        className="text-4xl leading-tight font-bold tracking-tight text-black/85 lg:text-[2.75rem]"
      >
        Grow together.
        <br />
        Every <span className="text-[#54622F]">step</span> matters.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="mt-4 max-w-[380px] text-base leading-relaxed text-black/50"
      >
        A platform to manage, organize, and strengthen your community with
        ease.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 flex items-center gap-3"
      >
        {chips.map(({ icon: Icon, label, detail }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.26 + i * 0.05 }}
            whileHover={{ y: -3 }}
            onHoverStart={() => setHovered(label)}
            onHoverEnd={() => setHovered(null)}
            className="relative flex flex-col items-center gap-2 rounded-2xl border border-black/5 bg-white/40 px-4 py-3 backdrop-blur-sm transition-colors hover:bg-white/60"
          >
            <Icon className="size-4 text-[#54622F]" />
            <span className="text-[11px] font-medium text-black/55">
              {label}
            </span>

            <AnimatePresence>
              {hovered === label && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-max max-w-[170px] -translate-x-1/2 rounded-lg bg-black/85 px-2.5 py-1.5 text-center text-[11px] leading-snug text-white shadow-lg backdrop-blur-sm"
                >
                  {detail}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/85" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
