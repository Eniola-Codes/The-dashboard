"use client"

import { Button } from "@/components/ui/button"

type FilterResetProps = {
  hasActiveFilters: boolean
  onClearFilters: () => void
}

export function FilterReset({
  hasActiveFilters,
  onClearFilters,
}: FilterResetProps) {
  if (!hasActiveFilters) {
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
