import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { getFilterOptions, getRawDeals } from "@/lib/utils/pipeline"
import {
  buildFilterUrl,
  parseFiltersFromSearchParams,
} from "@/lib/utils/pipeline/filter"
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
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchParamsKey = searchParams.toString()

  const filters = React.useMemo(
    () => parseFiltersFromSearchParams(searchParams, filterOptions),
    [searchParams, searchParamsKey]
  )

  const activeFilterCount = React.useMemo(
    () => countActiveFilters(filters),
    [filters]
  )

  const hasActiveFilters = activeFilterCount > 0

  function updateFilter<K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K] | "all"
  ) {
    const currentFilters = parseFiltersFromSearchParams(
      searchParams,
      filterOptions
    )
    const nextFilters: FilterOptions = {
      ...currentFilters,
      [key]: value === "all" ? undefined : value,
    }

    router.replace(buildFilterUrl(pathname, nextFilters), { scroll: false })
  }

  function clearFilters() {
    router.replace(buildFilterUrl(pathname, {}), { scroll: false })
  }

  return {
    filters,
    filterOptions,
    activeFilterCount,
    hasActiveFilters,
    updateFilter,
    clearFilters,
    totalCount: allDeals.length,
  }
}
