import * as React from "react"
import type { Table } from "@tanstack/react-table"

import {
  DEAL_SORT_OPTIONS,
  dealMatchesSearch,
  exportDealsToCsv,
  sortOptionToSorting,
} from "@/lib/utils/pipeline"
import { type DealSortOption } from "@/types/filter"

export function useResetTablePage<TData>(
  table: Table<TData>,
  globalFilter: string,
  sortOption: DealSortOption
) {
  React.useEffect(() => {
    table.setPageIndex(0)
  }, [globalFilter, sortOption, table])
}

export const useTable = () => {
  const [sortOption, setSortOption] =
    React.useState<DealSortOption>("company_asc")
  const [globalFilter, setGlobalFilter] = React.useState("")

  const sorting = React.useMemo(
    () => sortOptionToSorting(sortOption),
    [sortOption]
  )
  const isSearching = Boolean(globalFilter.trim())

  return {
    sortOption,
    setSortOption,
    globalFilter,
    setGlobalFilter,
    sorting,
    isSearching,
    sortOptions: DEAL_SORT_OPTIONS,
    dealMatchesSearch,
    exportDealsToCsv,
  }
}
