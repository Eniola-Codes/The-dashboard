import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { tableColumnsDef } from "@/components/pipeline/table/table-columns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useResetTablePage, useTable } from "@/hooks/pipeline/use-table"
import { type DealSortOption } from "@/types/filter"
import { type Deal } from "@/types/pipeline"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  DownloadIcon,
  SearchIcon,
} from "lucide-react"

export const DealsTable = ({ deals }: { deals: Deal[] }) => {
  const {
    sortOption,
    setSortOption,
    globalFilter,
    setGlobalFilter,
    sorting,
    isSearching,
    sortOptions,
    dealMatchesSearch,
    exportDealsToCsv,
  } = useTable()

  const table = useReactTable({
    data: deals,
    columns: tableColumnsDef,
    state: { sorting, globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) =>
      dealMatchesSearch(row.original, String(filterValue)),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  })

  const visibleDealCount = table.getFilteredRowModel().rows.length

  const subtitle = isSearching
    ? `${visibleDealCount} of ${deals.length} ${visibleDealCount === 1 ? "match" : "matches"} your search`
    : "All deals in your view"

  useResetTablePage(table, globalFilter, sortOption)

  function handleExport() {
    const rowsToExport = table
      .getPrePaginationRowModel()
      .rows.map((row) => row.original)
    exportDealsToCsv(rowsToExport)
  }

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6 pb-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-base font-medium">Deals</h2>
          <p className="text-sm text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:w-auto lg:justify-end">
          <div className="relative w-full sm:min-w-36 sm:flex-1 lg:w-36 lg:flex-none">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              placeholder="Search deals..."
              className="pl-8"
              aria-label="Search deals"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <Select
              value={sortOption}
              onValueChange={(value) => setSortOption(value as DealSortOption)}
            >
              <SelectTrigger className="w-full sm:w-36" aria-label="Sort deals">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="w-full cursor-pointer sm:w-36"
              onClick={handleExport}
              disabled={visibleDealCount === 0}
            >
              <DownloadIcon className="size-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableColumnsDef.length}
                  className="h-24 text-center"
                >
                  {isSearching
                    ? "No deals match your search."
                    : "No deals in this view."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount() || 1}
          {visibleDealCount > 0 &&
            ` · ${visibleDealCount} ${visibleDealCount === 1 ? "deal" : "deals"}`}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeftIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
