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
import { stageChartConfig } from "@/lib/utils/pipeline/chart"
import { formatCurrency, STAGE_CHART_LEGEND_ORDER } from "@/lib/utils/pipeline"
import { type PipelineMetrics } from "@/types/pipeline"

export function PipelineStageChart({ metrics }: { metrics: PipelineMetrics }) {
  const { hasDeals, stageChartData } = useChartData(metrics)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pipeline by Stage</CardTitle>
        <CardDescription>
          Deal count and pipeline value at each stage of the sales funnel
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasDeals ? (
          <ChartContainer config={stageChartConfig} className="aspect-auto h-[350px] w-full">
            <BarChart
              data={stageChartData}
              layout="vertical"
              margin={{ left: -15, right: 20 }}
              barGap={4}
              barCategoryGap="20%"
            >
              <CartesianGrid horizontal={false} />
              <XAxis
                xAxisId="value"
                type="number"
                orientation="top"
                tickLine={false}
                axisLine={false}
                tickFormatter={(tick) => {
                  if (tick >= 1_000_000) return `$${(tick / 1_000_000).toFixed(1)}M`
                  if (tick >= 1_000) return `$${(tick / 1_000).toFixed(0)}K`
                  return `$${tick}`
                }}
              />
              <XAxis
                xAxisId="deals"
                type="number"
                orientation="bottom"
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                type="category"
                dataKey="stage"
                tickLine={false}
                axisLine={false}
                width={88}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => String(label)}
                    formatter={(value, name) => {
                      if (name === "value") {
                        return [`${formatCurrency(Number(value))} ${stageChartConfig.value.label}`]
                      }
                      return [`${value} ${stageChartConfig.deals.label}`]
                    }}
                  />
                }
              />
              <ChartLegend
                content={({ payload, verticalAlign }) => (
                  <ChartLegendContent
                    payload={
                      payload
                        ? [...payload].sort(
                          (a, b) =>
                            STAGE_CHART_LEGEND_ORDER.indexOf(String(a.dataKey)) -
                            STAGE_CHART_LEGEND_ORDER.indexOf(String(b.dataKey))
                        )
                        : payload
                    }
                    verticalAlign={verticalAlign}
                  />
                )}
              />
              <Bar
                xAxisId="value"
                dataKey="value"
                fill="var(--color-value)"
                radius={4}
                barSize={14}
              />
              <Bar
                xAxisId="deals"
                dataKey="deals"
                fill="var(--color-deals)"
                radius={4}
                barSize={14}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[350px] items-center justify-center text-sm text-muted-foreground">
            No deals in this view
          </div>
        )}
      </CardContent>
    </Card>
  )
}
