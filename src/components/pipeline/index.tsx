"use client"

import { DealsTable } from "@/components/pipeline/table/deals-table"
import { VerticalChart } from "@/components/pipeline/charts/vertical-chart"
import { PipelineStageChart } from "@/components/pipeline/charts/stage-chart"
import { PipelineTrendChart } from "@/components/pipeline/charts/trend-chart"
import { OwnerPerformanceChart } from "@/components/pipeline/charts/owner-chart"
import { SourceChart } from "@/components/pipeline/charts/source-chart"
import { SectionCards } from "@/components/pipeline/cards"
import { PipelineFilters } from "@/components/pipeline/filter/filters"
import { useChart } from "@/hooks/pipeline/use-chart"

export const PipelineDashboard = () => {
  const {
    filters,
    filtersKey,
    filterOptions,
    activeFilterCount,
    hasActiveFilters,
    filteredDeals,
    metrics,
    totalCount,
    filteredCount,
    updateFilter,
    clearFiltersHref,
  } = useChart()

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PipelineFilters
        filters={filters}
        filtersKey={filtersKey}
        filterOptions={filterOptions}
        activeFilterCount={activeFilterCount}
        hasActiveFilters={hasActiveFilters}
        filteredCount={filteredCount}
        totalCount={totalCount}
        onFilterChange={updateFilter}
        clearFiltersHref={clearFiltersHref}
      />
      <SectionCards metrics={metrics} />
      <div className="flex w-full flex-col gap-4 px-4 md:gap-6 lg:px-6">
        <PipelineStageChart metrics={metrics} />
        <div className="grid w-full grid-cols-1 gap-4 md:gap-6 xl:grid-cols-[6fr_3fr]">
          <VerticalChart metrics={metrics} />
          <OwnerPerformanceChart metrics={metrics} />
        </div>
        <div className="grid w-full grid-cols-1 gap-4 md:gap-6 xl:grid-cols-[2fr_3fr]">
          <SourceChart metrics={metrics} />
          <PipelineTrendChart metrics={metrics} />
        </div>
      </div>
      <DealsTable deals={filteredDeals} />
    </div>
  )
}
