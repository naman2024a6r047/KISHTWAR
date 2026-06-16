"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, Search, ChevronLeft, ChevronRight } from "lucide-react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => any);
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  pageSize?: number;
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder = "Search...",
  searchKey,
  pageSize = 10,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting logic
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort data
  const processedData = useMemo(() => {
    let result = [...data];

    // Search filter
    if (searchQuery && searchKey) {
      result = result.filter((item) => {
        const value = item[searchKey];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Sorting
    if (sortConfig) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // Resolve accessor if it's a function
        const column = columns.find((col) => {
          if (typeof col.accessor === "string") {
            return col.accessor === sortConfig.key;
          }
          return false;
        });

        if (column && typeof column.accessor === "function") {
          aVal = column.accessor(a);
          bVal = column.accessor(b);
        }

        if (aVal === undefined || aVal === null) return 1;
        if (bVal === undefined || bVal === null) return -1;

        if (aVal < bVal) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, searchKey, sortConfig, columns]);

  // Pagination logic
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage, pageSize]);

  return (
    <div className="space-y-4">
      {/* Table controls */}
      {searchKey && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 pr-4 py-2 w-full rounded-xl border border-kishtwar-cream-200 bg-white/50 backdrop-blur-xs text-sm text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-kishtwar-green-500 focus:border-transparent transition-all"
          />
        </div>
      )}

      {/* Table grid */}
      <div className="bg-white border border-kishtwar-cream-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-kishtwar-cream/35 border-b border-kishtwar-cream-200 text-kishtwar-green-950 font-bold">
                {columns.map((col, idx) => {
                  const accessorStr = typeof col.accessor === "string" ? col.accessor : `col-${idx}`;
                  return (
                    <th
                      key={accessorStr}
                      className="px-6 py-4 font-semibold select-none cursor-pointer"
                      onClick={() => col.sortable && handleSort(accessorStr)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{col.header}</span>
                        {col.sortable && sortConfig?.key === accessorStr && (
                          sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-3.5 w-3.5 text-kishtwar-emerald" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 text-kishtwar-emerald" />
                          )
                        )}
                        {col.sortable && sortConfig?.key !== accessorStr && (
                          <ChevronUp className="h-3.5 w-3.5 text-gray-300 opacity-50" />
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-kishtwar-cream-100/50">
              {paginatedData.length > 0 ? (
                paginatedData.map((row, rowIdx) => (
                  <tr
                    key={row.id || `row-${rowIdx}`}
                    className="hover:bg-kishtwar-cream/10 transition-colors text-gray-600"
                  >
                    {columns.map((col, colIdx) => {
                      const accessorStr = typeof col.accessor === "string" ? col.accessor : `col-${colIdx}`;
                      return (
                        <td key={accessorStr} className="px-6 py-4 truncate max-w-xs font-light">
                          {col.render ? (
                            col.render(row)
                          ) : typeof col.accessor === "function" ? (
                            col.accessor(row)
                          ) : (
                            row[col.accessor as string] ?? "-"
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-400 font-light">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-kishtwar-cream/10 border-t border-kishtwar-cream-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              Page {currentPage} of {totalPages} ({processedData.length} total entries)
            </span>
            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-kishtwar-cream-200 bg-white hover:bg-kishtwar-cream/10 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-kishtwar-cream-200 bg-white hover:bg-kishtwar-cream/10 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
