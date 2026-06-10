import * as React from "react"

import { getFilterOptions, getRawDeals } from "@/lib/utils/pipeline"
import { FilterOptions } from "@/types/filter"

const allDeals = getRawDeals()
const filterOptions = getFilterOptions(allDeals)

function countActiveFilters(filters: FilterOptions): number {
  let count = 0
  if (filters.dateRange && filters.dateRange !== "all") count++
  if (filters.stage) count++
  if (filters.owner) count++
  if (filters.vertical) count++
  if (filters.source) count++
  return count
}

export function useFilters() {
  const [filters, setFilters] = React.useState<FilterOptions>({})

  const updateFilter = React.useCallback(
    <K extends keyof FilterOptions>(
      key: K,
      value: FilterOptions[K] | "all"
    ) => {
      setFilters((current) => ({
        ...current,
        [key]: value === "all" ? undefined : value,
      }))
    },
    []
  )

  const clearFilters = React.useCallback(() => {
    setFilters({})
  }, [])

  const activeFilterCount = countActiveFilters(filters)

  return {
    filters,
    filterOptions,
    activeFilterCount,
    updateFilter,
    clearFilters,
    totalCount: allDeals.length,
  }
}
