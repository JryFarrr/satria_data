'use client';

import { useMemo } from "react";

export type AnalyticsTableRow = {
  id: number;
  summary_judul: string;
  view: number;
  persentase_like: number;
  pc1_scaled: number;
  [key: string]: number | string;
};

export type AnalyticsSortConfig = {
  key: keyof AnalyticsTableRow;
  direction: "asc" | "desc";
};

const MAX_VISIBLE_ROWS = 10;
const HEADER_HEIGHT_PX = 44;
const ROW_HEIGHT_PX = 56;

type AnalyticsTableProps = {
  rows: AnalyticsTableRow[];
  rawRows: AnalyticsTableRow[];
  sortConfig: AnalyticsSortConfig;
  onSortChange: (config: AnalyticsSortConfig) => void;
  status: "idle" | "loading" | "error" | "success";
  errorMessage: string | null;
};

const columns: Array<{
  key: keyof AnalyticsTableRow;
  label: string;
  align?: "left" | "right";
  format?: (value: number | string) => string;
  className?: string;
}> = [
  {
    key: "id",
    label: "ID",
    align: "left",
    className: "min-w-[68px]",
    format: (value) =>
      typeof value === "number" ? value.toString().padStart(2, "0") : String(value),
  },
  { key: "summary_judul", label: "Judul", align: "left", className: "min-w-[280px]" },
  {
    key: "view",
    label: "View",
    align: "right",
    className: "min-w-[120px]",
    format: (value) =>
      typeof value === "number" ? value.toLocaleString("id-ID") : String(value),
  },
  {
    key: "persentase_like",
    label: "Persentase Like",
    align: "right",
    className: "min-w-[140px]",
    format: (value) =>
      typeof value === "number"
        ? `${value.toFixed(2).replace(".", ",")} %`
        : String(value),
  },
  {
    key: "pc1_scaled",
    label: "PC1 Scaled",
    align: "right",
    format: (value) =>
      typeof value === "number" ? value.toFixed(2).replace(".", ",") : String(value),
  },
];

function getNextDirection(
  current: AnalyticsSortConfig,
  key: keyof AnalyticsTableRow
): "asc" | "desc" {
  if (current.key !== key) {
    return key === "summary_judul" ? "asc" : "desc";
  }
  return current.direction === "asc" ? "desc" : "asc";
}

export default function AnalyticsTable({
  rows,
  rawRows,
  sortConfig,
  onSortChange,
  status,
  errorMessage,
}: AnalyticsTableProps) {
  const hasData = rawRows.length > 0;
  const scrollHeight =
    hasData && rows.length > MAX_VISIBLE_ROWS
      ? HEADER_HEIGHT_PX + ROW_HEIGHT_PX * MAX_VISIBLE_ROWS
      : null;

  const sortIndicator = useMemo(() => {
    return sortConfig.direction === "asc" ? "↑" : "↓";
  }, [sortConfig.direction]);

  if (status === "error") {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {errorMessage ?? "Terjadi kesalahan saat memuat data."}
      </div>
    );
  }

  if (status === "loading" || status === "idle") {
    return (
      <div className="flex items-center justify-center rounded-lg border border-slate-200 bg-white/90 p-10 text-sm text-slate-500">
        Memuat data tabel…
      </div>
    );
  }

  if (!hasData) {
    return (
      <section className="card flex flex-col gap-4 p-6">
        <p className="card-title text-[#1766ff]">Konten Terpilih</p>
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-[#f7f8ff] px-6 py-12 text-sm text-[#54608d]">
          Data tidak tersedia untuk rentang tanggal dan metric yang dipilih.
        </div>
      </section>
    );
  }

  return (
    <section className="card overflow-hidden">
      <div className="flex items-center justify-between bg-[#1748a6] px-6 py-5 text-white">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
            Daftar Konten
          </p>
        </div>
        <span className="rounded-full bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          {rawRows.length.toLocaleString("id-ID")} konten
        </span>
      </div>
      <div className="overflow-x-auto">
        <div
          className={scrollHeight ? "overflow-y-auto" : ""}
          style={scrollHeight ? { maxHeight: `${scrollHeight}px` } : undefined}
        >
          <table className="min-w-full text-sm text-[#202b55]">
            <thead className="sticky top-0 z-10 bg-[#f1f6ff] text-xs font-semibold uppercase tracking-[0.12em] text-[#1d3fa8]">
              <tr>
                {columns.map((column) => {
                  const isActive = sortConfig.key === column.key;
                  const ariaSort = isActive ? sortConfig.direction : "none";
                  const alignment =
                    column.align === "right" ? "text-right" : "text-left";

                  return (
                    <th
                      key={column.key as string}
                      scope="col"
                      className={`cursor-pointer border-b border-[#d6e1ff] px-4 py-3 ${alignment} ${column.className ?? ""}`}
                      aria-sort={ariaSort}
                      onClick={() =>
                        onSortChange({
                          key: column.key,
                          direction: getNextDirection(sortConfig, column.key),
                        })
                      }
                    >
                      <span className="inline-flex items-center gap-2">
                        {column.label}
                        {isActive && (
                          <span className="text-xs font-normal text-[#1766ff]">
                            {sortIndicator}
                          </span>
                        )}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="bg-white">
              {rows.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  className={`border-b border-[#edf1ff] ${rowIndex % 2 === 0 ? "bg-white" : "bg-[#f7faff]"} hover:bg-[#eef3ff]`}
                >
                  {columns.map((column) => {
                    const alignment =
                      column.align === "right" ? "text-right" : "text-left";
                    const rawValue = row[column.key];
                    const displayValue = column.format
                      ? column.format(rawValue)
                      : String(rawValue);
                    return (
                      <td
                        key={`${row.id}-${String(column.key)}`}
                        className={`px-4 py-3 ${alignment} ${column.className ?? ""} text-sm font-medium text-[#1e2e6b]`}
                      >
                        {displayValue}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
