"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import type { Period } from "@/lib/chart-utils"
import {
  Sparkline,
  AreaSpark,
  BarsSpark,
  HeatmapStrip,
  type ChartPoint,
} from "@/components/charts/chart-primitives"

const periodLabel: Record<Period, string> = {
  weekly: "Mingguan",
  monthly: "Bulanan",
  yearly: "Tahunan",
}

type CashFlowPoint = { label: string; income: number; expense: number }

type ChartVariant =
  | { kind: "sparkline"; dataByPeriod: Record<Period, ChartPoint[]>; valueSuffix?: string }
  | { kind: "area"; dataByPeriod: Record<Period, CashFlowPoint[]> }
  | { kind: "bars"; dataByPeriod: Record<Period, ChartPoint[]> }
  | { kind: "heatmap"; dataByPeriod: Record<Period, ChartPoint[]> }

export function ChartCard({
  title,
  summary,
  linkHref,
  linkLabel,
  variant,
}: {
  title: string
  summary: string
  linkHref: string
  linkLabel: string
  variant: ChartVariant
}) {
  const [open, setOpen] = useState(false)
  const [period, setPeriod] = useState<Period>("weekly")

  function renderMini() {
    switch (variant.kind) {
      case "sparkline":
        return <Sparkline data={variant.dataByPeriod.weekly} valueSuffix={variant.valueSuffix} />
      case "area":
        return <AreaSpark data={variant.dataByPeriod.weekly} />
      case "bars":
        return <BarsSpark data={variant.dataByPeriod.weekly} />
      case "heatmap":
        return <HeatmapStrip data={variant.dataByPeriod.weekly} />
    }
  }

  function renderFull(p: Period) {
    switch (variant.kind) {
      case "sparkline":
        return (
          <Sparkline
            data={variant.dataByPeriod[p]}
            height={140}
            showLabels
            valueSuffix={variant.valueSuffix}
          />
        )
      case "area":
        return (
          <AreaSpark data={variant.dataByPeriod[p]} height={140} showLabels showLegend />
        )
      case "bars":
        return <BarsSpark data={variant.dataByPeriod[p]} height={140} showLabels />
      case "heatmap":
        return <HeatmapStrip data={variant.dataByPeriod[p]} showLabels />
    }
  }

  return (
    <>
      <Card
        className="animate-fade-up cursor-pointer rounded-2xl transition-colors active:bg-muted/50"
        onClick={() => setOpen(true)}
      >
        <CardContent className="grid gap-2 py-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{title}</p>
            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
              Tap
              <ChevronRight className="size-3.5" />
            </span>
          </div>
          {renderMini()}
          <p className="text-xs text-muted-foreground">{summary}</p>
        </CardContent>
      </Card>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="h-[88vh] rounded-t-[28px] pb-[max(1.5rem,env(safe-area-inset-bottom))]"
        >
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
          <div className="grid gap-4 overflow-y-auto px-4 pb-4">
            <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
              <TabsList className="w-full">
                {(["weekly", "monthly", "yearly"] as Period[]).map((p) => (
                  <TabsTrigger key={p} value={p} className="flex-1">
                    {periodLabel[p]}
                  </TabsTrigger>
                ))}
              </TabsList>
              {(["weekly", "monthly", "yearly"] as Period[]).map((p) => (
                <TabsContent key={p} value={p} className="pt-4">
                  {renderFull(p)}
                </TabsContent>
              ))}
            </Tabs>

            <Link
              href={linkHref}
              onClick={() => setOpen(false)}
              className="flex min-h-12 items-center justify-center gap-1.5 rounded-2xl bg-primary text-sm font-medium text-primary-foreground active:opacity-90"
            >
              {linkLabel}
              <ChevronRight className="size-4" />
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
