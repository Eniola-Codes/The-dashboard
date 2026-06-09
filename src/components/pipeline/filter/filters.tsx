"use client"

import * as React from "react"
import { SlidersHorizontalIcon } from "lucide-react"

import { FilterFields } from "@/components/pipeline/filter/filter-fields"
import { FilterReset } from "@/components/pipeline/filter/filter-reset"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { PipelineFiltersProps } from "@/types/filter"

export function PipelineFilters({
  filters,
  filtersKey,
  filterOptions,
  activeFilterCount,
  hasActiveFilters,
  filteredCount,
  totalCount,
  onFilterChange,
  onClearFilters,
}: PipelineFiltersProps) {
  const [drawerOpen, setDrawerOpen] = React.useState(false)

  function handleClearFilters() {
    onClearFilters()
    setDrawerOpen(false)
  }

  return (
    <div className="sticky top-0 z-20 border-b bg-background px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between gap-3 lg:hidden">
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm" className="shrink-0">
              <SlidersHorizontalIcon className="size-4" />
              Filters
              {activeFilterCount > 0 ? (
                <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5">
                  {activeFilterCount}
                </Badge>
              ) : null}
            </Button>
          </DrawerTrigger>
          {drawerOpen ? (
            <DrawerContent>
              <DrawerHeader className="text-left">
                <DrawerTitle>Filters</DrawerTitle>
              </DrawerHeader>
              <div className="flex flex-col gap-4 px-4 pb-6">
                <FilterFields
                  key={filtersKey}
                  filters={filters}
                  filterOptions={filterOptions}
                  onFilterChange={onFilterChange}
                />
                <FilterReset
                  hasActiveFilters={hasActiveFilters}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </DrawerContent>
          ) : null}
        </Drawer>
        <p className="text-sm text-muted-foreground">
          Showing {filteredCount} of {totalCount} deals
        </p>
      </div>

      <div className="hidden flex-col gap-3 lg:flex xl:flex-row xl:items-center xl:gap-5">
        <FilterFields
          key={filtersKey}
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={onFilterChange}
        />
        <div className="flex items-center justify-between xl:flex-1">
          <FilterReset
            hasActiveFilters={hasActiveFilters}
            onClearFilters={onClearFilters}
          />
          <p className="text-sm text-muted-foreground lg:ml-auto py-1">
            Showing {filteredCount} of {totalCount} deals
          </p>
        </div>
      </div>
    </div>
  )
}
