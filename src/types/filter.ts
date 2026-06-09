type DateRange =
    | "all"
    | "last_week"
    | "last_month"
    | "last_3_months"
    | "last_6_months";

type FilterOptions = {
    vertical?: string;
    owner?: string;
    stage?: string;
    source?: string;
    dateRange?: DateRange;
  }

  type FilterFieldsProps = {
    filters: FilterOptions
    filterOptions: PipelineFilterOptions
    onFilterChange: <K extends keyof FilterOptions>(
      key: K,
      value: FilterOptions[K] | "all"
    ) => void
    className?: string
    triggerClassName?: string
  }
  

  type PipelineFilterOptions = {
  verticals: string[]
  owners: string[]
  stages: string[]
  sources: string[]
}

type PipelineFiltersProps = {
  filters: FilterOptions
  filtersKey: string
  filterOptions: PipelineFilterOptions
  activeFilterCount: number
  hasActiveFilters: boolean
  filteredCount: number
  totalCount: number
  onFilterChange: <K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K] | "all"
  ) => void
  onClearFilters: () => void
}

type DealSortOption =
  | "value_desc"
  | "value_asc"
  | "company_asc"
  | "company_desc"
  | "date_desc"
  | "date_asc"

  type SearchParamsLike = {
    get(name: string): string | null
  }  

  export type { FilterOptions, SearchParamsLike, DateRange, PipelineFilterOptions, PipelineFiltersProps, DealSortOption, FilterFieldsProps };