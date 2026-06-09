import pipelineData from "@/lib/data/pipeline.json"
import {
  Deal,
  PipelineMetrics,
  PipelineTrendPoint,
} from "@/types/pipeline"

export * from "./chart"
export * from "./filter"
export * from "./table"

function getRawDeals(): Deal[] {
  return pipelineData as Deal[]
}

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
  return `$${value.toFixed(1)}`
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

function getTotalPipelineValue(deals: Deal[]): number {
  return deals.reduce((sum, d) => sum + d.value_usd, 0)
}

function getAverageDealValue(deals: Deal[]): number {
  return deals.length > 0 ? getTotalPipelineValue(deals) / deals.length : 0
}

function getDealValueRange(deals: Deal[]): { min: number; max: number } {
  const values = deals.map((d) => d.value_usd)
  return {
    min: values.length > 0 ? Math.min(...values) : 0,
    max: values.length > 0 ? Math.max(...values) : 0,
  }
}

function getWonDeals(deals: Deal[]): Deal[] {
  return deals.filter((d) => d.stage === "Won")
}

function getClosedWonValue(deals: Deal[]): number {
  return getWonDeals(deals).reduce((sum, d) => sum + d.value_usd, 0)
}

function getLargestWonDealValue(deals: Deal[]): number {
  const wonValues = getWonDeals(deals).map((d) => d.value_usd)
  return wonValues.length > 0 ? Math.max(...wonValues) : 0
}

function getWonShareOfPipeline(
  closedWonValue: number,
  totalPipelineValue: number
): number {
  return totalPipelineValue > 0 ? (closedWonValue / totalPipelineValue) * 100 : 0
}

function groupDealsByStage(deals: Deal[]): Record<string, number> {
  const counts: Record<string, number> = {}
  deals.forEach((d) => {
    counts[d.stage] = (counts[d.stage] || 0) + 1
  })
  return counts
}

function groupRevenueByStage(deals: Deal[]): Record<string, number> {
  const revenue: Record<string, number> = {}
  deals.forEach((d) => {
    revenue[d.stage] = (revenue[d.stage] || 0) + d.value_usd
  })
  return revenue
}

function groupRevenueByVertical(deals: Deal[]): Record<string, number> {
  const revenue: Record<string, number> = {}
  deals.forEach((d) => {
    revenue[d.vertical] = (revenue[d.vertical] || 0) + d.value_usd
  })
  return revenue
}

function groupDealsByVertical(deals: Deal[]): Record<string, number> {
  const counts: Record<string, number> = {}
  deals.forEach((d) => {
    counts[d.vertical] = (counts[d.vertical] || 0) + 1
  })
  return counts
}

function getTopPerformingVertical(
  revenueByVertical: Record<string, number>
): string {
  return Object.entries(revenueByVertical).sort(([, a], [, b]) => b - a)[0]?.[0]
}

function getWinRateByOwner(
  deals: Deal[]
): Record<string, { won: number; total: number; rate: number }> {
  const ownerStats: Record<string, { won: number; total: number }> = {}
  deals.forEach((d) => {
    if (!ownerStats[d.owner]) ownerStats[d.owner] = { won: 0, total: 0 }
    ownerStats[d.owner].total += 1
    if (d.stage === "Won") ownerStats[d.owner].won += 1
  })

  const winRateByOwner: Record<
    string,
    { won: number; total: number; rate: number }
  > = {}
  Object.entries(ownerStats).forEach(([owner, stats]) => {
    winRateByOwner[owner] = {
      ...stats,
      rate: stats.total > 0 ? (stats.won / stats.total) * 100 : 0,
    }
  })
  return winRateByOwner
}

function groupDealsBySource(deals: Deal[]): Record<string, number> {
  const counts: Record<string, number> = {}
  deals.forEach((d) => {
    counts[d.source] = (counts[d.source] || 0) + 1
  })
  return counts
}

function groupValueByOwner(deals: Deal[]): Record<string, number> {
  const values: Record<string, number> = {}
  deals.forEach((d) => {
    values[d.owner] = (values[d.owner] || 0) + d.value_usd
  })
  return values
}

function groupWonValueByOwner(deals: Deal[]): Record<string, number> {
  const values: Record<string, number> = {}
  deals.forEach((d) => {
    if (d.stage === "Won") {
      values[d.owner] = (values[d.owner] || 0) + d.value_usd
    }
  })
  return values
}

function groupValueBySource(deals: Deal[]): Record<string, number> {
  const values: Record<string, number> = {}
  deals.forEach((d) => {
    values[d.source] = (values[d.source] || 0) + d.value_usd
  })
  return values
}

function groupWonValueBySource(deals: Deal[]): Record<string, number> {
  const values: Record<string, number> = {}
  deals.forEach((d) => {
    if (d.stage === "Won") {
      values[d.source] = (values[d.source] || 0) + d.value_usd
    }
  })
  return values
}

function getTopOwnerByDeals(
  deals: Deal[]
): { owner: string; dealCount: number } | null {
  const counts: Record<string, number> = {}
  deals.forEach((d) => {
    counts[d.owner] = (counts[d.owner] || 0) + 1
  })

  const topOwner = Object.entries(counts).sort(([, a], [, b]) => b - a)[0]
  return topOwner ? { owner: topOwner[0], dealCount: topOwner[1] } : null
}

function addDays(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split("-").map(Number)
  const date = new Date(year, month - 1, day + days)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function groupPipelineByDay(deals: Deal[]): PipelineTrendPoint[] {
  if (deals.length === 0) return []

  const buckets: Record<string, { deals: number; value: number }> = {}
  deals.forEach((d) => {
    if (!buckets[d.created_date]) {
      buckets[d.created_date] = { deals: 0, value: 0 }
    }
    buckets[d.created_date].deals += 1
    buckets[d.created_date].value += d.value_usd
  })

  const sortedDates = Object.keys(buckets).sort()
  const result: PipelineTrendPoint[] = []

  for (
    let date = sortedDates[0];
    date <= sortedDates[sortedDates.length - 1];
    date = addDays(date, 1)
  ) {
    const bucket = buckets[date] ?? { deals: 0, value: 0 }
    result.push({
      date,
      deals: bucket.deals,
      value: bucket.value,
    })
  }

  return result
}

function computeMetrics(deals: Deal[]): PipelineMetrics {
  const totalPipelineValue = getTotalPipelineValue(deals)
  const closedWonValue = getClosedWonValue(deals)
  const { min, max } = getDealValueRange(deals)
  const revenueByVertical = groupRevenueByVertical(deals)

  return {
    totalPipelineValue,
    totalDeals: deals.length,
    wonDeals: getWonDeals(deals).length,
    closedWonValue,
    wonShareOfPipeline: getWonShareOfPipeline(
      closedWonValue,
      totalPipelineValue
    ),
    largestWonDealValue: getLargestWonDealValue(deals),
    averageDealValue: getAverageDealValue(deals),
    minDealValue: min,
    maxDealValue: max,
    dealsByStage: groupDealsByStage(deals),
    revenueByStage: groupRevenueByStage(deals),
    revenueByVertical,
    dealsByVertical: groupDealsByVertical(deals),
    winRateByOwner: getWinRateByOwner(deals),
    dealsBySource: groupDealsBySource(deals),
    topPerformingVertical: getTopPerformingVertical(revenueByVertical),
    topOwnerByDeals: getTopOwnerByDeals(deals),
    valueByOwner: groupValueByOwner(deals),
    wonValueByOwner: groupWonValueByOwner(deals),
    valueBySource: groupValueBySource(deals),
    wonValueBySource: groupWonValueBySource(deals),
    pipelineTrendByDay: groupPipelineByDay(deals),
  }
}

export {
  computeMetrics,
  formatCurrency,
  formatPercent,
  getAverageDealValue,
  getClosedWonValue,
  getDealValueRange,
  getLargestWonDealValue,
  getRawDeals,
  getTopOwnerByDeals,
  getTopPerformingVertical,
  getTotalPipelineValue,
  getWinRateByOwner,
  getWonDeals,
  getWonShareOfPipeline,
  groupDealsBySource,
  groupDealsByStage,
  groupDealsByVertical,
  groupPipelineByDay,
  groupRevenueByStage,
  groupRevenueByVertical,
  groupValueByOwner,
  groupValueBySource,
  groupWonValueByOwner,
  groupWonValueBySource,
}
