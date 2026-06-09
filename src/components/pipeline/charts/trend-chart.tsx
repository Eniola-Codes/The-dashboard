import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
import { trendChartConfig } from "@/lib/utils/pipeline/chart"
import { formatTrendDate } from "@/lib/utils/pipeline"
import { type PipelineMetrics } from "@/types/pipeline"

export function PipelineTrendChart({ metrics }: { metrics: PipelineMetrics }) {
  const { hasDeals, trendChartData } = useChartData(metrics)

  return (
    <Card className="@container/card w-full">
      <CardHeader>
        <CardTitle>Pipeline Created Over Time</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Daily deal intake in your view
          </span>
          <span className="@[540px]/card:hidden">Daily deal intake</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {hasDeals ? (
          <ChartContainer
            config={trendChartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={trendChartData}>
              <defs>
                <linearGradient id="fillPipelineDeals" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-deals)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-deals)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={formatTrendDate}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={32}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => formatTrendDate(String(value))}
                    formatter={(value) => [`${value} `, trendChartConfig.deals.label]}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="deals"
                type="natural"
                fill="url(#fillPipelineDeals)"
                stroke="var(--color-deals)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
            No deals in this view
          </div>
        )}
      </CardContent>
    </Card>
  )
}
