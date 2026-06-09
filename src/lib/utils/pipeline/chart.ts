import pipelineData from "@/lib/data/pipeline.json"
import { Deal } from "@/types/pipeline"
import { type ChartConfig } from "@/components/ui/chart"

const verticalChartConfig = {
  value: {
    label: "Pipeline value",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const stageChartConfig = {
  value: {
    label: "Pipeline value",
    color: "var(--chart-1)",
  },
  deals: {
    label: "Deals",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const pipelineValueWonChartConfig = {
  pipelineValue: {
    label: "Pipeline value",
    color: "var(--chart-1)",
  },
  wonValue: {
    label: "Won value",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const trendChartConfig = {
  deals: {
    label: "Deals created",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig


function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort()
}

const allDealsForOrder = pipelineData as Deal[]

const PIPELINE_VERTICAL_ORDER = uniqueSorted(
  allDealsForOrder.map((d) => d.vertical)
)

const PIPELINE_OWNER_ORDER = uniqueSorted(
  allDealsForOrder.map((d) => d.owner)
)

const PIPELINE_SOURCE_ORDER = uniqueSorted(
  allDealsForOrder.map((d) => d.source)
)

const PIPELINE_STAGE_ORDER = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal",
  "Won",
  "Lost",
] as const

const STAGE_CHART_LEGEND_ORDER = ["value", "deals"]

const formatTrendDate = (value: string): string => {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

export { PIPELINE_VERTICAL_ORDER, PIPELINE_OWNER_ORDER, PIPELINE_SOURCE_ORDER, PIPELINE_STAGE_ORDER, STAGE_CHART_LEGEND_ORDER, formatTrendDate, trendChartConfig, verticalChartConfig, stageChartConfig, pipelineValueWonChartConfig }