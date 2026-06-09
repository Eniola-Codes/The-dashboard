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

function parseFiltersFromQuery(query: string): FilterOptions {
  return parseFiltersFromSearchParams(new URLSearchParams(query), filterOptions)
}

export function useFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchParamsKey = searchParams.toString()

  const filters = React.useMemo(
    () => parseFiltersFromQuery(searchParamsKey),
    [searchParamsKey]
  )

  const updateFilter = React.useCallback(
    <K extends keyof FilterOptions>(
      key: K,
      value: FilterOptions[K] | "all"
    ) => {
      const currentFilters = parseFiltersFromQuery(searchParamsKey)
      const nextFilters: FilterOptions = {
        ...currentFilters,
        [key]: value === "all" ? undefined : value,
      }

      router.replace(buildFilterUrl(pathname, nextFilters), { scroll: false })
    },
    [pathname, router, searchParamsKey]
  )

  const clearFilters = React.useCallback(() => {
    router.replace(buildFilterUrl(pathname, {}), { scroll: false })
  }, [pathname, router])

  const activeFilterCount = React.useMemo(
    () => countActiveFilters(filters),
    [filters]
  )

  return {
    filters,
    filtersKey: searchParamsKey,
    filterOptions,
    activeFilterCount,
    hasActiveFilters: activeFilterCount > 0,
    updateFilter,
    clearFilters,
    totalCount: allDeals.length,
  }
}
