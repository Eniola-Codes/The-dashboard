"use client"

import { Button } from "@/components/ui/button"
import { FilterResetProps } from "@/types/filter"

export function FilterReset({
  activeFilterCount,
  onClearFilters,
}: FilterResetProps) {
  if (activeFilterCount === 0) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClearFilters}
      className="cursor-pointer p-0 hover:!bg-transparent"
    >
      Clear all
    </Button>
  )
}
