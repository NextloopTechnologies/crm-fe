import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getFilteredRowModel, getPaginationRowModel,
  flexRender, type ColumnDef, type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LoadingSpinner } from './LoadingSpinner'
import { EmptyState } from './EmptyState'

interface Props<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  isLoading?: boolean
  onRowClick?: (row: TData) => void
  pageSize?: number
}

export function DataTable<TData>({ columns, data, isLoading, onRowClick, pageSize = 20 }: Props<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  })

  if (isLoading) return <LoadingSpinner className="py-20" />

  if (!data.length)
    return <EmptyState title="No results found" description="Try adjusting your filters." />

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                  >
                    {h.isPlaceholder ? null : (
                      <div
                        className={cn('flex items-center gap-1', h.column.getCanSort() && 'cursor-pointer select-none')}
                        onClick={h.column.getToggleSortingHandler()}
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {h.column.getCanSort() && (
                          h.column.getIsSorted() === 'asc' ? <ChevronUp size={14} /> :
                          h.column.getIsSorted() === 'desc' ? <ChevronDown size={14} /> :
                          <ChevronsUpDown size={14} className="text-gray-300" />
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row.original)}
                className={cn(
                  'transition-colors hover:bg-gray-50',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-gray-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
        <p className="text-xs text-gray-500">
          Showing {table.getState().pagination.pageIndex * pageSize + 1}–
          {Math.min((table.getState().pagination.pageIndex + 1) * pageSize, data.length)} of {data.length}
        </p>
        <div className="flex gap-1">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
