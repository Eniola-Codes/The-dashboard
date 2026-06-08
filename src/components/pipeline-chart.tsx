"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  type PipelineMetrics
} from "@/types/pipeline"
import {
  formatCurrency
} from "@/lib/utils/pipeline"


const chartConfig = {
  value: {
    label: "Value",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

type ChartView = "revenue" | "deals"

function toChartData(
  metrics: PipelineMetrics,
  view: ChartView
): { name: string; value: number }[] {
  const source =
    view === "revenue" ? metrics.revenueByVertical : metrics.dealsByVertical

  return Object.entries(source)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

export function PipelineChart({ metrics }: { metrics: PipelineMetrics }) {
  const [view, setView] = React.useState<ChartView>("revenue")
  const chartData = React.useMemo(() => toChartData(metrics, view), [metrics, view])

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <CardTitle>Pipeline by Vertical</CardTitle>
          <CardDescription>
            {view === "revenue"
              ? "Total deal value grouped by industry vertical"
              : "Deal count grouped by industry vertical"}
          </CardDescription>
        </div>
        <Select
          value={view}
          onValueChange={(value) => setView(value as ChartView)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="revenue">Revenue</SelectItem>
            <SelectItem value="deals">Deal count</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-2 sm:px-6 sm:pt-4">
        <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
          <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid horizontal={false} />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                view === "revenue" ? formatCurrency(value) : String(value)
              }
            />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              width={100}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    view === "revenue"
                      ? formatCurrency(Number(value))
                      : `${value} deals`
                  }
                />
              }
            />
            <Bar dataKey="value" fill="var(--color-value)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
