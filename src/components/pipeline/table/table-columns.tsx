import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { DEAL_STAGE_STYLES } from "@/lib/utils/pipeline"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils/pipeline"
import { type Deal } from "@/types/pipeline"

export const tableColumnsDef: ColumnDef<Deal>[] = [
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.company}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.deal_id}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "vertical",
    header: "Vertical",
  },
  {
    accessorKey: "stage",
    header: "Stage",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn(DEAL_STAGE_STYLES[row.original.stage])}
      >
        {row.original.stage}
      </Badge>
    ),
  },
  {
    accessorKey: "owner",
    header: "Owner",
  },
  {
    accessorKey: "source",
    header: "Source",
  },
  {
    accessorKey: "value_usd",
    header: () => <div className="text-right">Value</div>,
    cell: ({ row }) => (
      <div className="text-right font-mono tabular-nums">
        {formatCurrency(row.original.value_usd)}
      </div>
    ),
  },
  {
    accessorKey: "created_date",
    header: "Created",
    cell: ({ row }) =>
      new Date(row.original.created_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
  },
]
