"use client"

import * as React from "react"

import { DealsTable } from "@/components/deals-table"
import { PipelineChart } from "@/components/pipeline-chart"
import { SectionCards } from "@/components/pipeline/cards"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  computeMetrics,
  DATE_RANGE_OPTIONS,
  filterDeals,
  getFilterOptions,
  getRawDeals,
} from "@/lib/utils/pipeline"
import { DateRange, FilterOptions } from "@/types/pipeline"

const allDeals = getRawDeals()
const filterOptions = getFilterOptions(allDeals)

export function PipelineDashboard() {
  const [filters, setFilters] = React.useState<FilterOptions>({})

  const filteredDeals = React.useMemo(
    () => filterDeals(allDeals, filters),
    [filters]
  )
  const metrics = React.useMemo(
    () => computeMetrics(filteredDeals),
    [filteredDeals]
  )

  const hasActiveFilters = Boolean(
    filters.vertical ||
      filters.owner ||
      filters.stage ||
      (filters.dateRange && filters.dateRange !== "all")
  )

  function updateFilter<K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K] | "all"
  ) {
    setFilters((current) => ({
      ...current,
      [key]: value === "all" ? undefined : value,
    }))
  }

  function clearFilters() {
    setFilters({})
  }

  return (
    <>
      <div className="flex flex-col gap-3 px-4 lg:flex-row lg:flex-wrap lg:items-center lg:px-6">
        <Select
          value={filters.stage ?? "all"}
          onValueChange={(value) => updateFilter("stage", value)}
        >
          <SelectTrigger className="w-full lg:w-[160px]">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stages</SelectItem>
            {filterOptions.stages.map((stage) => (
              <SelectItem key={stage} value={stage}>
                {stage}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.owner ?? "all"}
          onValueChange={(value) => updateFilter("owner", value)}
        >
          <SelectTrigger className="w-full lg:w-[160px]">
            <SelectValue placeholder="Owner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All owners</SelectItem>
            {filterOptions.owners.map((owner) => (
              <SelectItem key={owner} value={owner}>
                {owner}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.dateRange ?? "all"}
          onValueChange={(value) => updateFilter("dateRange", value as DateRange | "all")}
        >
          <SelectTrigger className="w-full lg:w-[160px]">
            <SelectValue placeholder="Created" />
          </SelectTrigger>
          <SelectContent>
            {DATE_RANGE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.vertical ?? "all"}
          onValueChange={(value) => updateFilter("vertical", value)}
        >
          <SelectTrigger className="w-full lg:w-[180px]">
            <SelectValue placeholder="Vertical" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All verticals</SelectItem>
            {filterOptions.verticals.map((vertical) => (
              <SelectItem key={vertical} value={vertical}>
                {vertical}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        )}

        <p className="text-sm text-muted-foreground lg:ml-auto">
          Showing {filteredDeals.length} of {allDeals.length} deals
        </p>
      </div>

      <SectionCards metrics={metrics} />
      <div className="px-4 lg:px-6">
        <PipelineChart metrics={metrics} />
      </div>
      <DealsTable deals={filteredDeals} />
    </>
  )
}
