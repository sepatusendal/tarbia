"use client"

function daysLeftLabel(target: Date) {
  const now = new Date()
  const diffMs = target.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) return "Hari ini"
  if (diffDays === 1) return "Besok"
  return `${diffDays} Hari Lagi`
}

export function CountdownBadge({ target }: { target: Date | string }) {
  const targetDate = new Date(target)
  return <>{daysLeftLabel(targetDate)}</>
}
