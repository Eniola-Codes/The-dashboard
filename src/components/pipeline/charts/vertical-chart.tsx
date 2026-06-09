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
} from "@/components/ui/chart"
import { useChartData } from "@/hooks/pipeline/use-chart"
import { verticalChartConfig } from "@/lib/utils/pipeline/chart"
import { formatCurrency } from "@/lib/utils/pipeline"
import { type PipelineMetrics } from "@/types/pipeline"

export function VerticalChart({ metrics }: { metrics: PipelineMetrics }) {
  const { verticalChartData } = useChartData(metrics)

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle>Pipeline by Vertical</CardTitle>
        <CardDescription>
          Total deal value grouped by industry vertical
        </CardDescription>
      </CardHeader>
      <CardContent>
          <ChartContainer config={verticalChartConfig} className="aspect-auto h-[280px] w-full min-w-0">
            <BarChart
              data={verticalChartData}
              margin={{ left: 0, right: 8, bottom: 4 }}
              barCategoryGap="12%"
              maxBarSize={30}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={48}
                tickFormatter={(tick) => {
                  if (tick >= 1_000_000) return `$${(tick / 1_000_000).toFixed(1)}M`
                  if (tick >= 1_000) return `$${(tick / 1_000).toFixed(0)}K`
                  return `$${tick}`
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) => [`
                      ${formatCurrency(Number(value))} ${verticalChartConfig.value.label}`,
                    ]}
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
