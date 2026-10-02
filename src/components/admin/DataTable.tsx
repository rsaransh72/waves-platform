"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  RowSelectionState,
  VisibilityState,
} from "@tanstack/react-table";
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Columns3, Download } from "lucide-react";
import { clsx } from "clsx";

export interface BulkAction<TData> {
  label: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'danger' | 'secondary';
  onClick: (selectedRows: TData[]) => void | Promise<void>;
}

export interface FilterOption {
  key: string;
  label: string;
  options: { label: string; value: string }[];
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  filters?: FilterOption[];
  hiddenColumns?: string[];
  title?: React.ReactNode;
  actions?: React.ReactNode;
  disablePagination?: boolean;
  onScrollEnd?: () => void;
  bulkActions?: BulkAction<TData>[];
  // Shown when there are no rows at all (before any search or filter).
  emptyState?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  filters,
  hiddenColumns,
  title,
  actions,
  disablePagination = false,
  onScrollEnd,
  bulkActions,
  emptyState,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  // Dynamically inject selection column if bulk actions exist
  const tableColumns = useMemo(() => {
    if (!bulkActions || bulkActions.length === 0) return columns;
    const selectCol: ColumnDef<TData, unknown> = {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    };
    return [selectCol, ...columns];
  }, [columns, bulkActions]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => (row as { id: string }).id,
    enableRowSelection: !!bulkActions,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: disablePagination ? 10000 : 10,
      },
      columnVisibility: hiddenColumns?.reduce((acc, col) => ({ ...acc, [col]: false }), {}) ?? {},
    },
  });

  const selectedRows = table.getSelectedRowModel().rows.map(r => r.original);

  const exportCsv = () => {
    const columnsToExport = table.getVisibleLeafColumns();
    const escapeCsv = (value: unknown) => {
      const text = value == null
        ? ""
        : typeof value === "object" ? JSON.stringify(value) : String(value);
      return `"${text.replaceAll('"', '""')}"`;
    };
    const lines = [
      columnsToExport.map((column) => escapeCsv(
        typeof column.columnDef.header === "string" ? column.columnDef.header : column.id,
      )).join(","),
      ...table.getFilteredRowModel().rows.map((row) => columnsToExport
        .map((column) => escapeCsv(row.getValue(column.id)))
        .join(",")),
    ];
    const url = URL.createObjectURL(new Blob([lines.join("\r\n")], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${(document.title || "admin-data").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col space-y-4 relative">
      {bulkActions && selectedRows.length > 0 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2 pr-4 border-r border-slate-700">
            <span className="flex items-center justify-center bg-blue-600 text-white text-xs font-bold h-6 min-w-[24px] px-2 rounded-full">
              {selectedRows.length}
            </span>
            <span className="text-sm font-medium">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            {bulkActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  action.onClick(selectedRows);
                  table.resetRowSelection();
                }}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                  action.variant === 'danger' ? "hover:bg-red-500/20 text-red-400 hover:text-red-300" :
                  action.variant === 'primary' ? "bg-blue-600 hover:bg-blue-500 text-white" :
                  "hover:bg-slate-800 text-slate-300 hover:text-white"
                )}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
          <button 
            onClick={() => table.resetRowSelection()}
            className="ml-2 p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-colors"
          >
            &times;
          </button>
        </div>
      )}

      {(title || searchKey || (filters && filters.length > 0) || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            {title && (
              <div className="shrink-0 mr-2">
                {title}
              </div>
            )}
            
            {searchKey && (
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                placeholder={searchPlaceholder}
                value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn(searchKey)?.setFilterValue(event.target.value)
                }
                className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
              />
            </div>
          )}
          
          {filters && filters.map(filter => (
            <select
              key={filter.key}
              value={(table.getColumn(filter.key)?.getFilterValue() as string) ?? ""}
              onChange={(e) => table.getColumn(filter.key)?.setFilterValue(e.target.value || undefined)}
              className="rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer shadow-sm"
            >
              <option value="">{filter.label}</option>
              {filter.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ))}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="whitespace-nowrap text-xs font-medium text-slate-500">
              {table.getFilteredRowModel().rows.length} / {data.length} rows
            </span>
            {actions}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowColumnMenu((visible) => !visible)}
                title="Choose visible columns"
                aria-label="Choose visible columns"
                aria-expanded={showColumnMenu}
                className="inline-flex h-9 w-9 items-center justify-center rounded border border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
              >
                <Columns3 className="h-4 w-4" />
              </button>
              {showColumnMenu && (
                <div className="absolute right-0 top-10 z-30 max-h-72 min-w-48 overflow-auto border border-slate-200 bg-white p-2 shadow-lg">
                  {table.getAllLeafColumns().filter((column) => column.getCanHide()).map((column) => (
                    <label key={column.id} className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-xs capitalize text-slate-700 hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={column.getIsVisible()}
                        onChange={column.getToggleVisibilityHandler()}
                        className="h-3.5 w-3.5 accent-blue-600"
                      />
                      {typeof column.columnDef.header === "string" ? column.columnDef.header : column.id.replaceAll("_", " ")}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={exportCsv}
              title="Export filtered rows to CSV"
              aria-label="Export filtered rows to CSV"
              className="inline-flex h-9 w-9 items-center justify-center rounded border border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      <div className="flex-1 rounded-md border border-gray-200 bg-white shadow-sm flex flex-col min-h-0 overflow-hidden">
        <div 
          className="flex-1 overflow-auto"
          onScroll={(e) => {
            if (!onScrollEnd) return;
            const target = e.target as HTMLDivElement;
            if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50) {
              onScrollEnd();
            }
          }}
        >
          <table className="w-full min-w-max text-left text-sm text-slate-600 relative">
            <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase font-bold tracking-wider text-slate-500 shadow-sm border-b border-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th key={header.id} className={clsx(
                        "px-3 py-2.5 bg-slate-50 text-[11px]",
                        ["actions", "manage"].includes(header.column.id) && "sticky right-0 z-20 min-w-32 border-l border-slate-200 shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.65)]"
                      )}>
                        {header.isPlaceholder ? null : (
                          <div
                            className={clsx(
                              "flex items-center gap-2",
                              ["actions", "manage"].includes(header.column.id) && "justify-end",
                              header.column.getCanSort() && "cursor-pointer select-none hover:text-slate-700 transition-colors"
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: <ChevronUp className="h-3.5 w-3.5 text-blue-500" />,
                              desc: <ChevronDown className="h-3.5 w-3.5 text-blue-500" />,
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className={clsx(
                        "px-3 py-2.5 align-top border-b border-slate-100 last:border-none",
                        ["actions", "manage"].includes(cell.column.id) && "sticky right-0 z-[5] bg-white group-hover:bg-slate-50 border-l border-slate-200 shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.65)]"
                      )}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="h-24 text-center text-slate-500 font-medium"
                  >
                    {data.length === 0 && emptyState ? emptyState : data.length === 0 ? "Nothing here yet." : "No rows match your search or filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {!disablePagination && (
        <div className="flex items-center justify-between px-2 py-1 shrink-0">
          <div className="text-sm text-slate-500">
            Showing {table.getRowModel().rows.length} of {data.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              className="p-1 rounded border border-gray-200 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              className="p-1 rounded border border-gray-200 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-slate-600 font-medium px-2">
              Page {table.getState().pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}
            </span>
            <button
              className="p-1 rounded border border-gray-200 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              className="p-1 rounded border border-gray-200 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
