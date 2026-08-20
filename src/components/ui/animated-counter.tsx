"use client"

import { useEffect, useRef, useState } from "react"

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 800,
  className,
}: {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}) {
  // Renders `value` immediately (correct even with no JS / before mount).
  // The count-up is a post-mount enhancement layered on top.
  const [display, setDisplay] = useState(value)
  const ranRef = useRef(false)

  useEffect(() => {
    if (ranRef.current) return
    ranRef.current = true

    // requestAnimationFrame is throttled to ~0fps for a hidden/background
    // tab (e.g. mounted while backgrounded, or the screen locked mid-load).
    // The old version called setDisplay(0) unconditionally and relied on
    // rAF ticks to climb back up — if those never fire, a real balance
    // stays stuck showing "Rp 0" indefinitely. Skip the animation and
    // show the real value immediately when the page isn't visible.
    if (document.visibilityState !== "visible") {
      setDisplay(value)
      return
    }

    const start = performance.now()
    let frame: number

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(value * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    setDisplay(0)
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, duration])

  return (
    <span className={className}>
      {prefix}
      {display.toLocaleString("id-ID")}
      {suffix}
    </span>
  )
}
