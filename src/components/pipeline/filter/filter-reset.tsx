"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { FilterResetProps } from "@/types/filter"

export function FilterReset({
  hasActiveFilters,
  clearFiltersHref,
  onClear,
}: FilterResetProps) {
  if (!hasActiveFilters) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className="cursor-pointer p-0 hover:!bg-transparent"
    >
      <Link href={clearFiltersHref} replace scroll={false} onClick={onClear}>
        Clear all
      </Link>
    </Button>
  )
}
