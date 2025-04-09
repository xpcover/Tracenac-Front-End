import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { TableFilters } from './TableFilters'
import { TablePagination } from './TablePagination'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onEdit?: (row: TData) => void
  onDelete?: (row: TData) => void
  meta?: Record<string, any>
  showFilters?: boolean
  showDateFilter?: boolean
  showPagination?: boolean
  additionalFilters?: React.ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onEdit,
  onDelete,
  meta,
  showFilters = true,
  showDateFilter = false,
  showPagination = true,
  additionalFilters,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [filteredData, setFilteredData] = useState(data)
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    meta,
  })

  const handleSearch = (searchValue: string) => {
    const filtered = data.filter((item) =>
      Object.values(item as any).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchValue.toLowerCase())
      )
    )
    setFilteredData(filtered)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const handleDateChange = ({ from, to }: { from: string; to: string }) => {
    if (!from && !to) {
      setFilteredData(data)
      return
    }

    const filtered = data.filter((item: any) => {
      const itemDate = new Date(item.created_at || item.date)
      const fromDate = from ? new Date(from) : null
      const toDate = to ? new Date(to) : null

      if (fromDate && toDate) {
        return itemDate >= fromDate && itemDate <= toDate
      } else if (fromDate) {
        return itemDate >= fromDate
      } else if (toDate) {
        return itemDate <= toDate
      }
      return true
    })

    setFilteredData(filtered)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  return (
    <div className="space-y-4">
      {showFilters && (
        <TableFilters
          onSearch={handleSearch}
          onDateChange={showDateFilter ? handleDateChange : undefined}
          showDateFilter={showDateFilter}
          additionalFilters={additionalFilters}
        />
      )}

      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b bg-gray-50 transition-colors"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={cn(
                      'h-12 px-4 text-left align-middle font-medium text-gray-500',
                      header.column.getCanSort() && 'cursor-pointer select-none'
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                    Actions
                  </th>
                )}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="p-4">
                    <div className="flex gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row.original)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row.original)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <TablePagination
          currentPage={pageIndex + 1}
          pageSize={pageSize}
          totalItems={filteredData.length}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, pageIndex: page - 1 }))}
          onPageSizeChange={(size) =>
            setPagination((prev) => ({ ...prev, pageSize: size, pageIndex: 0 }))
          }
        />
      )}
    </div>
  )
}