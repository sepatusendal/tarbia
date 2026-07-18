"use client"

import { useState } from "react"

export type ChartPoint = { label: string; value: number }

const primaryColor = "var(--color-primary)"

function useHoverIndex() {
  const [index, setIndex] = useState<number | null>(null)
  return {
    index,
    handlers: (i: number) => ({
      onMouseEnter: () => setIndex(i),
      onMouseLeave: () => setIndex(null),
      onClick: () => setIndex((cur) => (cur === i ? null : i)),
    }),
  }
}

function Tooltip({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  return (
    <g transform={`translate(${x}, ${y})`} className="pointer-events-none">
      <rect
        x={-24}
        y={-28}
        width={48}
        height={20}
        rx={6}
        fill="var(--popover)"
        stroke="var(--border)"
      />
      <text
        x={0}
        y={-14}
        textAnchor="middle"
        fontSize={10}
        fill="var(--popover-foreground)"
        fontWeight={600}
      >
        {children}
      </text>
    </g>
  )
}

export function Sparkline({
  data,
  height = 64,
  showLabels = false,
  valueSuffix = "",
}: {
  data: ChartPoint[]
  height?: number
  showLabels?: boolean
  valueSuffix?: string
}) {
  const { index, handlers } = useHoverIndex()
  const max = Math.max(...data.map((d) => d.value), 1)
  const barWidth = 100 / data.length

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        className="w-full overflow-visible"
        style={{ height }}
      >
        {data.map((d, i) => {
          const barHeight = Math.max((d.value / max) * (height - 4), 2)
          const x = i * barWidth
          return (
            <g key={i} {...handlers(i)} className="cursor-pointer">
              <rect
                x={x + barWidth * 0.2}
                y={0}
                width={barWidth * 0.6}
                height={height}
                fill="transparent"
              />
              <rect
                x={x + barWidth * 0.2}
                y={height - barHeight}
                width={barWidth * 0.6}
                height={barHeight}
                rx={2}
                fill={primaryColor}
                opacity={index === null || index === i ? 1 : 0.35}
                className="animate-grow-y transition-opacity"
                style={{ animationDelay: `${i * 40}ms` }}
              />
              {index === i && (
                <Tooltip x={x + barWidth / 2} y={height - barHeight}>
                  {d.value}
                  {valueSuffix}
                </Tooltip>
              )}
            </g>
          )
        })}
      </svg>
      {showLabels && (
        <div className="mt-1 flex text-[10px] text-muted-foreground">
          {data.map((d, i) => (
            <span key={i} className="flex-1 text-center">
              {d.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export function AreaSpark({
  data,
  height = 64,
  showLabels = false,
  showLegend = false,
}: {
  data: { label: string; income: number; expense: number }[]
  height?: number
  showLabels?: boolean
  showLegend?: boolean
}) {
  const { index, handlers } = useHoverIndex()
  const max = Math.max(...data.map((d) => Math.max(d.income, d.expense)), 1)
  const stepX = 100 / (data.length - 1 || 1)

  function pathFor(key: "income" | "expense") {
    return data
      .map((d, i) => {
        const x = i * stepX
        const y = height - (d[key] / max) * (height - 4) - 2
        return `${i === 0 ? "M" : "L"}${x},${y}`
      })
      .join(" ")
  }

  const incomeArea = `${pathFor("income")} L100,${height} L0,${height} Z`

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        className="w-full overflow-visible"
        style={{ height }}
      >
        <path d={incomeArea} fill={primaryColor} opacity={0.15} />
        <path
          d={pathFor("income")}
          fill="none"
          stroke={primaryColor}
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={pathFor("expense")}
          fill="none"
          stroke="var(--destructive)"
          strokeWidth={1.5}
          strokeDasharray="3 2"
          vectorEffect="non-scaling-stroke"
        />
        {data.map((d, i) => {
          const x = i * stepX
          const yIncome = height - (d.income / max) * (height - 4) - 2
          return (
            <g key={i} {...handlers(i)} className="cursor-pointer">
              <rect x={x - stepX / 2} y={0} width={stepX} height={height} fill="transparent" />
              {index === i && (
                <>
                  <line x1={x} y1={0} x2={x} y2={height} stroke="var(--border)" strokeWidth={1} />
                  <circle cx={x} cy={yIncome} r={2.5} fill={primaryColor} />
                  <Tooltip x={x} y={yIncome}>
                    +{Math.round(d.income / 1000)}k
                  </Tooltip>
                </>
              )}
            </g>
          )
        })}
      </svg>
      {showLegend && (
        <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full" style={{ background: primaryColor }} />
            Pemasukan
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-destructive" />
            Pengeluaran
          </span>
        </div>
      )}
      {showLabels && (
        <div className="mt-1 flex text-[10px] text-muted-foreground">
          {data.map((d, i) => (
            <span key={i} className="flex-1 text-center">
              {d.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export function BarsSpark({
  data,
  height = 64,
  showLabels = false,
}: {
  data: ChartPoint[]
  height?: number
  showLabels?: boolean
}) {
  const { index, handlers } = useHoverIndex()
  const max = Math.max(...data.map((d) => d.value), 1)
  const barWidth = 100 / data.length

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        className="w-full overflow-visible"
        style={{ height }}
      >
        {data.map((d, i) => {
          const barHeight = Math.max((d.value / max) * (height - 4), 2)
          const x = i * barWidth
          return (
            <g key={i} {...handlers(i)} className="cursor-pointer">
              <rect
                x={x + barWidth * 0.15}
                y={0}
                width={barWidth * 0.7}
                height={height}
                fill="transparent"
              />
              <rect
                x={x + barWidth * 0.15}
                y={height - barHeight}
                width={barWidth * 0.7}
                height={barHeight}
                rx={3}
                fill={primaryColor}
                opacity={index === null || index === i ? 0.85 : 0.3}
                className="animate-grow-y transition-opacity"
                style={{ animationDelay: `${i * 40}ms` }}
              />
              {index === i && (
                <Tooltip x={x + barWidth / 2} y={height - barHeight}>
                  {d.value}
                </Tooltip>
              )}
            </g>
          )
        })}
      </svg>
      {showLabels && (
        <div className="mt-1 flex text-[10px] text-muted-foreground">
          {data.map((d, i) => (
            <span key={i} className="flex-1 text-center">
              {d.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export function HeatmapStrip({
  data,
  showLabels = false,
}: {
  data: ChartPoint[]
  showLabels?: boolean
}) {
  const { index, handlers } = useHoverIndex()
  const max = Math.max(...data.map((d) => d.value), 1)

  function intensity(value: number) {
    if (value === 0) return 0.08
    return 0.25 + (value / max) * 0.75
  }

  return (
    <div className="w-full">
      <div className="flex gap-1.5">
        {data.map((d, i) => (
          <div
            key={i}
            {...handlers(i)}
            className="relative flex-1 cursor-pointer"
          >
            <div
              className="animate-pop-in aspect-square w-full rounded-md"
              style={{
                background: primaryColor,
                opacity: intensity(d.value),
                animationDelay: `${i * 35}ms`,
              }}
            />
            {index === i && (
              <div className="absolute -top-7 left-1/2 z-10 -translate-x-1/2 rounded-md border border-border bg-popover px-1.5 py-0.5 text-[10px] font-semibold whitespace-nowrap text-popover-foreground shadow-sm">
                {d.value} pertemuan
              </div>
            )}
          </div>
        ))}
      </div>
      {showLabels && (
        <div className="mt-1 flex text-[10px] text-muted-foreground">
          {data.map((d, i) => (
            <span key={i} className="flex-1 text-center">
              {d.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
