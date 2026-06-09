import type { SortingState } from "@tanstack/react-table"
import { type Deal } from "@/types/pipeline"
import { DealSortOption } from "@/types/filter"

const DEAL_SORT_OPTIONS: { value: DealSortOption; label: string }[] = [
  { value: "company_asc", label: "Alphabetical (A–Z)" },
  { value: "company_desc", label: "Alphabetical (Z–A)" },
  { value: "value_desc", label: "Value (high to low)" },
  { value: "value_asc", label: "Value (low to high)" },
  { value: "date_desc", label: "Date (newest)" },
  { value: "date_asc", label: "Date (oldest)" },
]

const DEAL_STAGE_STYLES: Record<string, string> = {
  New: "border-transparent bg-muted text-white",
  Contacted:
    "border-transparent bg-sky-500/15 text-sky-700 dark:text-sky-400",
  Qualified:
    "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Proposal:
    "border-transparent bg-violet-500/15 text-violet-700 dark:text-violet-400",
  Won: "border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Lost: "border-transparent bg-destructive/10 text-destructive",
}

const sortOptionToSorting = (option: DealSortOption): SortingState => {
  switch (option) {
    case "value_desc":
      return [{ id: "value_usd", desc: true }]
    case "value_asc":
      return [{ id: "value_usd", desc: false }]
    case "company_asc":
      return [{ id: "company", desc: false }]
    case "company_desc":
      return [{ id: "company", desc: true }]
    case "date_desc":
      return [{ id: "created_date", desc: true }]
    case "date_asc":
      return [{ id: "created_date", desc: false }]
  }
}

const dealMatchesSearch = (deal: Deal, query: string): boolean => {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true

  return [
    deal.company,
    deal.deal_id,
    deal.vertical,
    deal.stage,
    deal.owner,
    deal.source,
    String(deal.value_usd),
    deal.created_date,
    deal.last_activity,
  ].some((field) => field.toLowerCase().includes(normalized))
}

function escapeCsvCell(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

const exportDealsToCsv = (deals: Deal[]) => {
  const headers = [
    "Deal ID",
    "Company",
    "Vertical",
    "Stage",
    "Owner",
    "Source",
    "Value (USD)",
    "Created",
    "Last Activity",
  ]

  const lines = [
    headers.join(","),
    ...deals.map((deal) =>
      [
        deal.deal_id,
        deal.company,
        deal.vertical,
        deal.stage,
        deal.owner,
        deal.source,
        deal.value_usd,
        deal.created_date,
        deal.last_activity,
      ]
        .map((value) => escapeCsvCell(String(value)))
        .join(",")
    ),
  ]

  const blob = new Blob([lines.join("\n")], {
    type: "text/csv;charset=utf-8;",
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `pipeline-deals-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export { DEAL_SORT_OPTIONS, DEAL_STAGE_STYLES, exportDealsToCsv, sortOptionToSorting, dealMatchesSearch }