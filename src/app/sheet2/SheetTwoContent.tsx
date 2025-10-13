'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardHeader from "../../components/DashboardHeader";
import { DatasetProvider } from "../../components/DatasetProvider";
import type { DatasetEntry } from "../../lib/dataset";
import AnalyticsFilters, {
  AnalyticsFiltersState,
  defaultFiltersState,
} from "./components/AnalyticsFilters";
import AnalyticsTable, {
  AnalyticsSortConfig,
  AnalyticsTableRow,
} from "./components/AnalyticsTable";
import AnalyticsVisualizations from "./components/AnalyticsVisualizations";

type FetchStatus = "idle" | "loading" | "error" | "success";

type SheetTwoContentProps = {
  entries: DatasetEntry[];
};

function normalizeDateTime(value: string) {
  if (!value) return "";
  return value.length === 16 ? `${value}:00` : value;
}

export default function SheetTwoContent({ entries }: SheetTwoContentProps) {
  const [filters, setFilters] = useState<AnalyticsFiltersState>(
    () => ({ ...defaultFiltersState })
  );
  const [appliedFilters, setAppliedFilters] = useState<AnalyticsFiltersState>(
    () => ({ ...defaultFiltersState })
  );
  const [rows, setRows] = useState<AnalyticsTableRow[]>([]);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<AnalyticsSortConfig>({
    key: "view",
    direction: "desc",
  });

  const applyFilters = useCallback(() => {
    setAppliedFilters(filters);
  }, [filters]);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchRows() {
      try {
        setStatus("loading");
        setErrorMessage(null);

        const params = new URLSearchParams();
        if (appliedFilters.postCreatedFrom) {
          params.set(
            "post_created_from",
            normalizeDateTime(appliedFilters.postCreatedFrom)
          );
        }
        if (appliedFilters.postCreatedTo) {
          params.set(
            "post_created_to",
            normalizeDateTime(appliedFilters.postCreatedTo)
          );
        }
        if (appliedFilters.metric) {
          params.set("metric", appliedFilters.metric);
        }

        const query = params.toString();
        const endpoint = query
          ? `/api/analytics/table?${query}`
          : "/api/analytics/table";

        const response = await fetch(endpoint, {
          headers: { accept: "application/json" },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Gagal memuat data (${response.status})`);
        }
        const payload = (await response.json()) as {
          rows?: AnalyticsTableRow[];
        };

        const normalizedRows = Array.isArray(payload.rows)
          ? payload.rows
          : [];

        setRows(normalizedRows);
        setStatus("success");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Gagal memuat data."
        );
      }
    }

    fetchRows();

    return () => controller.abort();
  }, [appliedFilters]);

  const sortedRows = useMemo(() => {
    if (rows.length === 0) {
      return [];
    }

    const sorted = [...rows];
    sorted.sort((a, b) => {
      const { key, direction } = sortConfig;
      const first = a[key];
      const second = b[key];

      if (typeof first === "number" && typeof second === "number") {
        return direction === "asc" ? first - second : second - first;
      }

      const firstValue = String(first).toLowerCase();
      const secondValue = String(second).toLowerCase();

      if (firstValue < secondValue) return direction === "asc" ? -1 : 1;
      if (firstValue > secondValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [rows, sortConfig]);

  return (
    <main className="min-h-screen bg-[#f1f3ff] py-10 px-2 lg:px-1">
      <div className="mx-auto flex w-full max-w-[1720px] flex-col gap-6">
        <DatasetProvider entries={entries}>
          <div className="flex flex-col gap-6 lg:flex-row">
            <aside className="lg:w-[420px] lg:flex-shrink-0">
              <div className="flex flex-col gap-6 lg:sticky lg:top-10">
                <DashboardHeader />
                <AnalyticsFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  onApplyFilters={applyFilters}
                />
              </div>
            </aside>

            <section className="flex flex-1 flex-col gap-6 lg:-mr-6 xl:-mr-12">
              <AnalyticsTable
                rows={sortedRows}
                rawRows={rows}
                sortConfig={sortConfig}
                onSortChange={setSortConfig}
                status={status}
                errorMessage={errorMessage}
              />

              <AnalyticsVisualizations filters={appliedFilters} />

            </section>
          </div>
        </DatasetProvider>
      </div>
    </main>
  );
}
