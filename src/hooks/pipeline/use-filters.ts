import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { getFilterOptions, getRawDeals } from "@/lib/utils/pipeline"
import {
  buildFilterSearchParams,
  buildFilterUrl,
  parseFiltersFromSearchParams,
} from "@/lib/utils/pipeline/filter"
import { SearchParamsLike } from "@/types/filter"
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

function readFiltersFromUrl(searchParams: SearchParamsLike): FilterOptions {
  return parseFiltersFromSearchParams(searchParams, filterOptions)
}

function areFiltersEqual(a: FilterOptions, b: FilterOptions): boolean {
  return buildFilterSearchParams(a).toString() === buildFilterSearchParams(b).toString()
}

function syncFilterUrl(pathname: string, filters: FilterOptions) {
  const url = buildFilterUrl(pathname, filters)

  if (typeof window !== "undefined") {
    window.history.replaceState(window.history.state, "", url)
  }

  return url
}

export function useFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [filters, setFilters] = React.useState<FilterOptions>(() =>
    readFiltersFromUrl(searchParams)
  )

  React.useEffect(() => {
    function syncFiltersFromUrl() {
      const fromUrl = readFiltersFromUrl(
        new URLSearchParams(window.location.search)
      )
      setFilters((current) => (areFiltersEqual(current, fromUrl) ? current : fromUrl))
    }

    window.addEventListener("popstate", syncFiltersFromUrl)
    return () => window.removeEventListener("popstate", syncFiltersFromUrl)
  }, [])

  const updateFilter = React.useCallback(
    <K extends keyof FilterOptions>(
      key: K,
      value: FilterOptions[K] | "all"
    ) => {
      const nextFilters: FilterOptions = {
        ...filters,
        [key]: value === "all" ? undefined : value,
      }

      setFilters(nextFilters)
      router.replace(syncFilterUrl(pathname, nextFilters), { scroll: false })
    },
    [filters, pathname, router]
  )

  const clearFilters = React.useCallback(() => {
    setFilters({})
    router.replace(syncFilterUrl(pathname, {}), { scroll: false })
  }, [pathname, router])

  const activeFilterCount = React.useMemo(
    () => countActiveFilters(filters),
    [filters]
  )

  const hasActiveFilters = activeFilterCount > 0
  const filtersKey = buildFilterSearchParams(filters).toString()

  return {
    filters,
    filtersKey,
    filterOptions,
    activeFilterCount,
    hasActiveFilters,
    updateFilter,
    clearFilters,
    totalCount: allDeals.length,
  }
}
