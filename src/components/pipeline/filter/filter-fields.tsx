import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DATE_RANGE_OPTIONS } from "@/lib/utils/pipeline"
import { cn } from "@/lib/utils"
import { FilterFieldsProps, DateRange } from "@/types/filter"

export function FilterFields({
  filters,
  filterOptions,
  onFilterChange,
  className,
  triggerClassName = "w-full lg:w-32 xl:w-36",
}: FilterFieldsProps) {
  return (
    <div className={cn("flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between", className)}>
      <Select
        value={filters.dateRange ?? "all"}
        onValueChange={(value) =>
          onFilterChange("dateRange", value as DateRange | "all")
        }
      >
        <SelectTrigger className={triggerClassName}>
          <SelectValue placeholder="All time" />
        </SelectTrigger>
        <SelectContent>
          {DATE_RANGE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.stage ?? "all"}
        onValueChange={(value) => onFilterChange("stage", value)}
      >
        <SelectTrigger className={triggerClassName}>
          <SelectValue placeholder="All stages" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All stages</SelectItem>
          {filterOptions.stages.map((stage) => (
            <SelectItem key={stage} value={stage}>
              {stage}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.owner ?? "all"}
        onValueChange={(value) => onFilterChange("owner", value)}
      >
        <SelectTrigger className={triggerClassName}>
          <SelectValue placeholder="All owners" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All owners</SelectItem>
          {filterOptions.owners.map((owner) => (
            <SelectItem key={owner} value={owner}>
              {owner}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.vertical ?? "all"}
        onValueChange={(value) => onFilterChange("vertical", value)}
      >
        <SelectTrigger className={triggerClassName}>
          <SelectValue placeholder="All verticals" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All verticals</SelectItem>
          {filterOptions.verticals.map((vertical) => (
            <SelectItem key={vertical} value={vertical}>
              {vertical}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.source ?? "all"}
        onValueChange={(value) => onFilterChange("source", value)}
      >
        <SelectTrigger className={triggerClassName}>
          <SelectValue placeholder="All sources" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All sources</SelectItem>
          {filterOptions.sources.map((source) => (
            <SelectItem key={source} value={source}>
              {source}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
