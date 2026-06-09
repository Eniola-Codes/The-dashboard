import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  computeMetrics,
  filterDeals,
  getFilterOptions,
  getRawDeals,
  PIPELINE_OWNER_ORDER,
  PIPELINE_SOURCE_ORDER,
  PIPELINE_STAGE_ORDER,
  PIPELINE_VERTICAL_ORDER,
} from "@/lib/utils/pipeline"
import { buildFilterUrl, parseFiltersFromSearchParams } from "@/lib/utils/pipeline/filter"
import { FilterOptions } from "@/types/filter"
import { PipelineMetrics } from "@/types/pipeline"

const allDeals = getRawDeals()
const filterOptions = getFilterOptions(allDeals)

export function useChart() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const filters = React.useMemo(
    () => parseFiltersFromSearchParams(searchParams, filterOptions),
    [searchParams]
  )

  const filteredDeals = React.useMemo(
    () => filterDeals(allDeals, filters),
    [filters]
  )

  const metrics = React.useMemo(
    () => computeMetrics(filteredDeals),
    [filteredDeals]
  )

  function updateFilter<K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K] | "all"
  ) {
    const nextFilters: FilterOptions = {
      ...filters,
      [key]: value === "all" ? undefined : value,
    }

    router.replace(buildFilterUrl(pathname, nextFilters), { scroll: false })
  }

  function clearFilters() {
    router.replace(pathname, { scroll: false })
  }

  return {
    filters,
    filterOptions,
    filteredDeals,
    metrics,
    totalCount: allDeals.length,
    filteredCount: filteredDeals.length,
    updateFilter,
    clearFilters,
  }
}

export function useChartData(metrics: PipelineMetrics) {
  const hasWonDeals = metrics.wonDeals > 0
  const hasDeals = metrics.totalDeals > 0
  const isSingleDeal = metrics.totalDeals === 1
  const largestToAverageRatio =
    hasDeals && metrics.averageDealValue > 0
      ? metrics.maxDealValue / metrics.averageDealValue
      : 0

  const verticalChartData = React.useMemo(
    () =>
      PIPELINE_VERTICAL_ORDER.map((name) => ({
        name,
        value: metrics.revenueByVertical[name] ?? 0,
      })),
    [metrics]
  )

  const stageChartData = React.useMemo(
    () =>
      PIPELINE_STAGE_ORDER.map((stage) => ({
        stage,
        deals: metrics.dealsByStage[stage] ?? 0,
        value: metrics.revenueByStage[stage] ?? 0,
      })),
    [metrics]
  )

  const sourceChartData = React.useMemo(
    () =>
      PIPELINE_SOURCE_ORDER.map((source) => ({
        source,
        pipelineValue: metrics.valueBySource[source] ?? 0,
        wonValue: metrics.wonValueBySource[source] ?? 0,
      })),
    [metrics]
  )

  const ownerChartData = React.useMemo(
    () =>
      PIPELINE_OWNER_ORDER.map((owner) => ({
        owner,
        pipelineValue: metrics.valueByOwner[owner] ?? 0,
        wonValue: metrics.wonValueByOwner[owner] ?? 0,
      })),
    [metrics]
  )

  const trendChartData = metrics.pipelineTrendByDay

  return {
    hasWonDeals,
    hasDeals,
    isSingleDeal,
    largestToAverageRatio,
    verticalChartData,
    stageChartData,
    sourceChartData,
    ownerChartData,
    trendChartData,
  }
}
