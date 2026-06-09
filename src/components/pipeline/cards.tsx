import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useChartData } from "@/hooks/pipeline/use-chart"
import { formatCurrency, formatPercent } from "@/lib/utils/pipeline"
import { PipelineMetrics } from "@/types/pipeline"

export function SectionCards({ metrics }: { metrics: PipelineMetrics }) {
  const { hasWonDeals, hasDeals, isSingleDeal, largestToAverageRatio } =
    useChartData(metrics)

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Pipeline Value</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(metrics.totalPipelineValue)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {metrics.totalDeals}{" "}
              {metrics.totalDeals === 1 ? "deal" : "deals"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            {hasDeals
              ? `Top vertical: ${metrics.topPerformingVertical}`
              : "No pipeline value in this view"}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Deals</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.totalDeals.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {hasWonDeals ? `${metrics.wonDeals} won` : "No won deals"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            {hasDeals && metrics.topOwnerByDeals
              ? `Top owner: ${metrics.topOwnerByDeals.owner}`
              : "No deals in this view"}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Won Value</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(metrics.closedWonValue)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {hasWonDeals
                ? `${formatPercent(metrics.wonShareOfPipeline)} won value`
                : "-"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            {hasWonDeals
              ? `Largest won deal: ${formatCurrency(metrics.largestWonDealValue)}`
              : "No won deals in this view"}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Average Deal Value</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {hasDeals ? formatCurrency(metrics.averageDealValue) : "N/A"}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {hasDeals
                ? isSingleDeal
                  ? "Single deal"
                  : `${formatCurrency(metrics.minDealValue)} – ${formatCurrency(metrics.maxDealValue)}`
                : "-"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            {hasDeals
              ? `Largest deal is ${largestToAverageRatio.toFixed(1)}× the average`
              : "No deals in this view"}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
