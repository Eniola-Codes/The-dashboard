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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useChartData } from "@/hooks/pipeline/use-chart"
import { pipelineValueWonChartConfig } from "@/lib/utils/pipeline/chart"
import { formatCurrency } from "@/lib/utils/pipeline"
import { type PipelineMetrics } from "@/types/pipeline"

export function OwnerPerformanceChart({ metrics }: { metrics: PipelineMetrics }) {
  const { hasDeals, ownerChartData } = useChartData(metrics)

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle>Owner Performance</CardTitle>
        <CardDescription>
          Total pipeline value vs won value per representative
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasDeals ? (
          <ChartContainer config={pipelineValueWonChartConfig} className="aspect-auto h-[280px] w-full min-w-0">
            <BarChart
              data={ownerChartData}
              margin={{ left: 0, right: 8, bottom: 4 }}
              barGap={4}
              barCategoryGap="12%"
              maxBarSize={30}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="owner"
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
                    labelFormatter={(label) => String(label)}
                    formatter={(value, name) => [
                      `${formatCurrency(Number(value))} ${name === "wonValue" ? pipelineValueWonChartConfig.wonValue.label : pipelineValueWonChartConfig.pipelineValue.label}`,
                    ]}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="pipelineValue"
                fill="var(--color-pipelineValue)"
                radius={4}
              />
              <Bar
                dataKey="wonValue"
                fill="var(--color-wonValue)"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
            No deals in this view
          </div>
        )}
      </CardContent>
    </Card>
  )
}
