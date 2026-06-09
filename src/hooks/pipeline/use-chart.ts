import * as React from "react"

import {
  computeMetrics,
  filterDeals,
  getRawDeals,
  PIPELINE_OWNER_ORDER,
  PIPELINE_SOURCE_ORDER,
  PIPELINE_STAGE_ORDER,
  PIPELINE_VERTICAL_ORDER,
} from "@/lib/utils/pipeline"
import { useFilters } from "@/hooks/pipeline/use-filters"
import { PipelineMetrics } from "@/types/pipeline"

const allDeals = getRawDeals()

export function useChart() {
  const {
    filters,
    filtersKey,
    filterOptions,
    activeFilterCount,
    hasActiveFilters,
    updateFilter,
    clearFilters,
    totalCount,
  } = useFilters()

  const filteredDeals = React.useMemo(
    () => filterDeals(allDeals, filters),
    [filters]
  )

  const metrics = React.useMemo(
    () => computeMetrics(filteredDeals),
    [filteredDeals]
  )

  return {
    filters,
    filtersKey,
    filterOptions,
    activeFilterCount,
    hasActiveFilters,
    filteredDeals,
    metrics,
    totalCount,
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
