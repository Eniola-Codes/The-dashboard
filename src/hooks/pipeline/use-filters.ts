import * as React from "react"

import { FilterOptions } from "@/types/filter"  

function countActiveFilters(filters: FilterOptions): number {
  let count = 0
  if (filters.dateRange && filters.dateRange !== "all") count++
  if (filters.stage) count++
  if (filters.owner) count++
  if (filters.vertical) count++
  if (filters.source) count++
  return count
}

export function useFilters(filters: FilterOptions) {
  const activeFilterCount = React.useMemo(
    () => countActiveFilters(filters),
    [filters]
  )

  const hasActiveFilters = activeFilterCount > 0

  return {
    activeFilterCount,
    hasActiveFilters,
  }
}
