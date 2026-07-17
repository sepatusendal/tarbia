"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

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
      applyOffset(x, y, 6)
    }

    function handleTouchMove(event: TouchEvent) {
      const touch = event.touches[0]
      if (!touch) return
      const x = (touch.clientX / window.innerWidth - 0.5) * 2
      const y = (touch.clientY / window.innerHeight - 0.5) * 2
      applyOffset(x, y, 4)
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
          className="scale-110 object-cover object-[18%_42%] sm:object-center"
        />
      </div>

      {/* soft moon/sun glow, mobile hero area */}
      <div className="login-glow-pulse absolute top-[6%] right-[8%] size-56 rounded-full bg-white/50 blur-3xl sm:hidden" />

      {/* faint swirl watermark behind mobile logo */}
      <Image
        src="/logo-icon.png"
        alt=""
        width={340}
        height={372}
        aria-hidden
        unoptimized
        className="pointer-events-none absolute -top-6 -right-16 rotate-12 opacity-[0.08] sm:hidden"
      />

      <div className="absolute inset-0 bg-white/20" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#efe7d8]/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-[#1c140d]/85 via-[#2a1d13]/35 to-transparent" />
    </div>
  )
}
