import type { ReactNode } from "react";
import { cn } from "./utils";

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Array<TableColumn<T>>;
  rows: T[];
  getRowKey: (row: T, index: number) => string;
  className?: string;
}

export function Table<T>({ columns, rows, getRowKey, className }: TableProps<T>) {
  return (
    <div className={cn("overflow-hidden rounded-md border border-line bg-surface", className)}>
      <table className="hidden w-full border-collapse md:table">
        <thead className="bg-page text-left text-[13px] font-semibold text-muted">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={cn("px-4 py-3", column.className)}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line text-sm text-ink">
          {rows.map((row, index) => (
            <tr key={getRowKey(row, index)} className="h-12 transition hover:bg-page">
              {columns.map((column) => (
                <td key={column.key} className={cn("px-4 py-3", column.className)}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="divide-y divide-line md:hidden">
        {rows.map((row, index) => (
          <div key={getRowKey(row, index)} className="space-y-2 p-3">
            {columns.map((column) => (
              <div key={column.key} className="grid grid-cols-[90px_1fr] gap-3 text-sm">
                <span className="text-xs font-semibold text-muted">{column.header}</span>
                <span className="min-w-0 text-ink">{column.render(row)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

