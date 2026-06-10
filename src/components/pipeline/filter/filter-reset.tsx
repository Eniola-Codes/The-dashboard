"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { FilterResetProps } from "@/types/filter"

export function FilterReset({
  hasActiveFilters,
  clearHref,
  onClear,
}: FilterResetProps) {
  if (!hasActiveFilters) {
    return null
  }

  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
      className="cursor-pointer p-0 hover:!bg-transparent"
    >
      <Link href={clearHref} replace scroll={false} onClick={onClear}>
        Clear all
      </Link>
    </Button>
  )
}
