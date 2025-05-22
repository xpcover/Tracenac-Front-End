import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { TableFilters } from "./TableFilters";
import { TablePagination } from "./TablePagination";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useQuery } from "@tanstack/react-query";
import { dataTableService } from "@/services/dataTable.service";
import { setTableData } from "@/redux/slices/dataTableSlice";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  url: string;
  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
  onView?: (row: TData) => void;
  meta?: Record<string, any>;
  showFilters?: boolean;
  showDateFilter?: boolean;
  showPagination?: boolean;
  additionalFilters?: React.ReactNode;
}


export function DataTable<TData, TValue>({
  columns,
  url,
  onEdit,
  onDelete,
  onView,
  meta,
  showFilters = true,
  showDateFilter = false,
  showPagination = true,
  additionalFilters,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");


  const userRole = localStorage.getItem("userRole");

  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: tableData } = useSelector(
    (state: RootState) => state.dataTable
  );

  const dispatch = useDispatch();

  const { data: apiData, isLoading } = useQuery({
    queryKey: [url, search],
    queryFn: () => dataTableService.fetchAllData(url, { search }),
  });

  useEffect(() => {
    dispatch(setTableData(apiData));
  }, [apiData]);

  const [filteredData, setFilteredData] = useState(tableData);

  const handleSearch = (searchValue: string) => {
    setSearch(searchValue);
  };

  const handleDateChange = ({ from, to }: { from: string; to: string }) => {
    if (!from && !to) {
      setFilteredData(tableData);
      return;
    }

    const filtered = tableData.filter((item: any) => {
      const itemDate = new Date(item.created_at || item.date);
      const fromDate = from ? new Date(from) : null;
      const toDate = to ? new Date(to) : null;

      if (fromDate && toDate) {
        return itemDate >= fromDate && itemDate <= toDate;
      } else if (fromDate) {
        return itemDate >= fromDate;
      } else if (toDate) {
        return itemDate <= toDate;
      }
      return true;
    });

    setFilteredData(filtered);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const table = useReactTable({
    data: tableData || [],
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
  });

   if (isLoading) return <h4>Loading...</h4>;

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
          {[...table.getHeaderGroups()].reverse().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b bg-gray-50 transition-colors"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={cn(
                      "h-12 px-4 text-left align-middle font-medium text-gray-500",
                      header.column.getCanSort() && "cursor-pointer select-none"
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
                {(onEdit || onDelete || onView) && (
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                    Actions
                  </th>
                )}
              </tr>
            ))}
          </thead>
          <tbody>
          {[...table.getRowModel().rows].reverse().map((row) => (
  <tr key={row.id} className="border-b">
    {row.getVisibleCells().map((cell) => (
      <td key={cell.id} className="p-4">
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </td>
    ))}

    <td className="p-4">
      <div className="flex gap-2">
        {localStorage.getItem("userRole") === "tenant" || localStorage.getItem("userRole") === "admin"? (
          <>
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
          <button 
           onClick={() => onView(row.original)}
           className="text-green-600 hover:text-green-800">
            View
          </button>
          </>
        ) : (
          <button 
           onClick={() => onView(row.original)}
           className="text-green-600 hover:text-green-800">
            View
          </button>
        )}
      </div>
    </td>
  </tr>
))}

          </tbody>
        </table>
      </div>

      {showPagination && (
        <TablePagination
          currentPage={pageIndex + 1}
          pageSize={pageSize}
          totalItems={filteredData?.length}
          onPageChange={(page) =>
            setPagination((prev) => ({ ...prev, pageIndex: page - 1 }))
          }
          onPageSizeChange={(size) =>
            setPagination((prev) => ({ ...prev, pageSize: size, pageIndex: 0 }))
          }
        />
      )}
    </div>
  );
}
