"use client"

import { Button } from "@/components/ui/button"
import { useFilters } from "@/hooks/pipeline/use-filters"
import { FilterOptions } from "@/types/filter"

type FilterResetProps = {
  filters: FilterOptions
  onClearFilters: () => void
}

export function FilterReset({ filters, onClearFilters }: FilterResetProps) {
  const { hasActiveFilters } = useFilters(filters)

  if (!hasActiveFilters) {
    return null
  }

  return (
    <Button variant="ghost" size="sm" onClick={onClearFilters} className="cursor-pointer p-0 hover:!bg-transparent">
      Clear all
    </Button>
  )
}
