"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

const particles = [
  { left: "12%", size: 6, duration: 14, delay: 0 },
  { left: "28%", size: 4, duration: 18, delay: 2 },
  { left: "45%", size: 5, duration: 16, delay: 4 },
  { left: "62%", size: 4, duration: 20, delay: 1 },
  { left: "78%", size: 6, duration: 15, delay: 3 },
  { left: "90%", size: 4, duration: 19, delay: 5 },
]

export function LoginBackground() {
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = parallaxRef.current
    if (!el) return

    let frame: number | null = null

    function applyOffset(x: number, y: number, amplitude: number) {
      if (frame) return
      frame = requestAnimationFrame(() => {
        el!.style.setProperty("--parallax-x", `${x * amplitude}px`)
        el!.style.setProperty("--parallax-y", `${y * amplitude}px`)
        frame = null
      })
    }

    function handleMouseMove(event: MouseEvent) {
      const x = (event.clientX / window.innerWidth - 0.5) * 2
      const y = (event.clientY / window.innerHeight - 0.5) * 2
      applyOffset(x, y, 5)
    }

    function handleTouchMove(event: TouchEvent) {
      const touch = event.touches[0]
      if (!touch) return
      const x = (touch.clientX / window.innerWidth - 0.5) * 2
      const y = (touch.clientY / window.innerHeight - 0.5) * 2
      applyOffset(x, y, 3)
    }

    const hoverCapable = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches

    if (hoverCapable) {
      window.addEventListener("mousemove", handleMouseMove)
    } else {
      window.addEventListener("touchmove", handleTouchMove, { passive: true })
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouchMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#efe7d8]">
      <div
        ref={parallaxRef}
        className="login-animate-bg absolute -inset-4 transition-transform duration-500 ease-out"
        style={{
          transform: "translate(var(--parallax-x, 0), var(--parallax-y, 0))",
        }}
      >
        <Image
          src="/login-bg.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-100 object-cover object-[8%_36%] sm:scale-110 sm:object-[50%_78%]"
        />
      </div>

      {/* tiny birds drifting slowly across the sky */}
      <svg
        viewBox="0 0 24 24"
        className="login-bird-1 absolute top-[14%] left-0 size-3 text-black/25"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      >
        <path d="M2 12c3-4 7-4 10 0 3-4 7-4 10 0" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        className="login-bird-2 absolute top-[9%] left-0 size-2.5 text-black/20"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      >
        <path d="M2 12c3-4 7-4 10 0 3-4 7-4 10 0" />
      </svg>

      {/* gentle floating particles, warm dust motes drifting upward */}
      {particles.map((p, i) => (
        <span
          key={i}
          className="login-particle absolute bottom-0 rounded-full bg-white/70 blur-[1px]"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* soft warm glow, slowly pulsing behind the tree */}
      <div className="login-glow-pulse absolute top-[24%] left-[40%] size-72 rounded-full bg-white/50 blur-3xl sm:top-[18%] sm:left-[8%] sm:size-96" />

      <div className="absolute inset-0 bg-white/20" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#efe7d8]/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[30%] sm:h-[16%] bg-gradient-to-t from-[#1c140d]/55 sm:from-[#1c140d]/35 via-[#2a1d13]/15 to-transparent" />
    </div>
  )
}
