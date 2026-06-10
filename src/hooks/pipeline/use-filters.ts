import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { getFilterOptions, getRawDeals } from "@/lib/utils/pipeline"
import {
  buildFilterHref,
  clearFiltersHref,
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
  const query = searchParams.toString()

  const filters = React.useMemo(
    () => parseFiltersFromSearchParams(new URLSearchParams(query), filterOptions),
    [query]
  )

  const updateFilter = React.useCallback(
    <K extends keyof FilterOptions>(
      key: K,
      value: FilterOptions[K] | "all"
    ) => {
      const href = buildFilterHref(pathname, new URLSearchParams(query), {
        [key]: value === "all" ? undefined : String(value),
      })

      router.replace(href, { scroll: false })
    },
    [pathname, query, router]
  )

  const activeFilterCount = React.useMemo(
    () => countActiveFilters(filters),
    [filters]
  )

  return {
    filters,
    filtersKey: query,
    filterOptions,
    activeFilterCount,
    hasActiveFilters: activeFilterCount > 0,
    updateFilter,
    clearFiltersHref: clearFiltersHref(pathname),
    totalCount: allDeals.length,
  }
}
