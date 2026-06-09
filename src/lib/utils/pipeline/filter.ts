import { Deal } from "@/types/pipeline"
import { DateRange, FilterOptions, PipelineFilterOptions, SearchParamsLike } from "@/types/filter"

import { PIPELINE_SOURCE_ORDER } from "./chart"

const DATE_RANGE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: "all", label: "All time" },
  { value: "last_week", label: "Last week" },
  { value: "last_month", label: "Last month" },
  { value: "last_3_months", label: "Last 3 months" },
  { value: "last_6_months", label: "Last 6 months" },
]

const VALID_DATE_RANGES = new Set<DateRange>(
  DATE_RANGE_OPTIONS.map((option) => option.value)
)

function startOfDay(date: Date): Date {
  const normalizedDate = new Date(date)
  normalizedDate.setHours(0, 0, 0, 0)
  return normalizedDate
}

function getDateRangeBounds(
  dateRange: DateRange
): { start: Date; end: Date } | null {
  const now = new Date()
  const today = startOfDay(now)

  switch (dateRange) {
    case "last_week": {
      const dayOfWeek = now.getDay()
      const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
      const thisWeekMonday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - daysFromMonday
      )
      const lastWeekSunday = new Date(
        thisWeekMonday.getFullYear(),
        thisWeekMonday.getMonth(),
        thisWeekMonday.getDate() - 1
      )
      const lastWeekMonday = new Date(
        lastWeekSunday.getFullYear(),
        lastWeekSunday.getMonth(),
        lastWeekSunday.getDate() - 6
      )
      return { start: startOfDay(lastWeekMonday), end: startOfDay(lastWeekSunday) }
    }
    case "last_month": {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const end = new Date(now.getFullYear(), now.getMonth(), 0)
      return { start: startOfDay(start), end: startOfDay(end) }
    }
    case "last_3_months": {
      const start = new Date(now.getFullYear(), now.getMonth() - 3, 1)
      return { start: startOfDay(start), end: today }
    }
    case "last_6_months": {
      const start = new Date(now.getFullYear(), now.getMonth() - 6, 1)
      return { start: startOfDay(start), end: today }
    }
    default:
      return null
  }
}

function isWithinDateRange(createdDate: string, dateRange?: DateRange): boolean {
  if (!dateRange || dateRange === "all") return true

  const bounds = getDateRangeBounds(dateRange)
  if (!bounds) return true

  const created = startOfDay(new Date(createdDate))
  return created >= bounds.start && created <= bounds.end
}

function filterDeals(deals: Deal[], filters: FilterOptions): Deal[] {
  return deals.filter((deal) => {
    if (filters.vertical && deal.vertical !== filters.vertical) return false
    if (filters.owner && deal.owner !== filters.owner) return false
    if (filters.stage && deal.stage !== filters.stage) return false
    if (filters.source && deal.source !== filters.source) return false
    if (!isWithinDateRange(deal.created_date, filters.dateRange)) return false
    return true
  })
}

function getFilterOptions(deals: Deal[]): PipelineFilterOptions {
  return {
    verticals: [...new Set(deals.map((d) => d.vertical))].sort(),
    owners: [...new Set(deals.map((d) => d.owner))].sort(),
    stages: [...new Set(deals.map((d) => d.stage))].sort(),
    sources: PIPELINE_SOURCE_ORDER,
  }
}

function parseDateRange(value: string | null): DateRange | undefined {
  if (!value || value === "all" || !VALID_DATE_RANGES.has(value as DateRange)) {
    return undefined
  }

  return value as DateRange
}

function parseOptionValue(
  value: string | null,
  allowedValues: string[]
): string | undefined {
  if (!value || value === "all" || !allowedValues.includes(value)) {
    return undefined
  }

  return value
}

function parseFiltersFromSearchParams(
  searchParams: SearchParamsLike,
  filterOptions: PipelineFilterOptions
): FilterOptions {
  const filters: FilterOptions = {}

  const dateRange = parseDateRange(searchParams.get("dateRange"))
  if (dateRange) {
    filters.dateRange = dateRange
  }

  const stage = parseOptionValue(searchParams.get("stage"), filterOptions.stages)
  if (stage) {
    filters.stage = stage
  }

  const owner = parseOptionValue(searchParams.get("owner"), filterOptions.owners)
  if (owner) {
    filters.owner = owner
  }

  const vertical = parseOptionValue(
    searchParams.get("vertical"),
    filterOptions.verticals
  )
  if (vertical) {
    filters.vertical = vertical
  }

  const source = parseOptionValue(searchParams.get("source"), filterOptions.sources)
  if (source) {
    filters.source = source
  }

  return filters
}

function buildFilterSearchParams(filters: FilterOptions): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.dateRange && filters.dateRange !== "all") {
    params.set("dateRange", filters.dateRange)
  }

  if (filters.stage) {
    params.set("stage", filters.stage)
  }

  if (filters.owner) {
    params.set("owner", filters.owner)
  }

  if (filters.vertical) {
    params.set("vertical", filters.vertical)
  }

  if (filters.source) {
    params.set("source", filters.source)
  }

  return params
}

function buildFilterUrl(pathname: string, filters: FilterOptions): string {
  const query = buildFilterSearchParams(filters).toString()
  return query ? `${pathname}?${query}` : pathname
}

export {
  DATE_RANGE_OPTIONS,
  buildFilterSearchParams,
  buildFilterUrl,
  filterDeals,
  getFilterOptions,
  parseFiltersFromSearchParams,
}
