'use client';

import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
} from "react";

export type AnalyticsFiltersState = {
  postCreatedFrom: string;
  postCreatedTo: string;
  metric: string;
};

const metricOptions = [
  { value: "view", label: "View" },
  { value: "like", label: "Persentase Like" },
  { value: "pc", label: "PC1 Scaled" },
];

function toDateTimeLocalInput(date: Date) {
  const pad = (value: number) => value.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function createDefaultFiltersState(): AnalyticsFiltersState {
  const now = new Date();
  const from = new Date(now);
  from.setFullYear(from.getFullYear() - 1);

  return {
    postCreatedFrom: toDateTimeLocalInput(from),
    postCreatedTo: toDateTimeLocalInput(now),
    metric: metricOptions[0]?.value ?? "",
  };
}

export const defaultFiltersState = createDefaultFiltersState();

type AnalyticsFiltersProps = {
  filters: AnalyticsFiltersState;
  onFiltersChange: Dispatch<SetStateAction<AnalyticsFiltersState>>;
  onApplyFilters: () => void;
};

export default function AnalyticsFilters({
  filters,
  onFiltersChange,
  onApplyFilters,
}: AnalyticsFiltersProps) {
  const handleDateChange =
    (field: "postCreatedFrom" | "postCreatedTo") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      onFiltersChange((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleMetricChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onFiltersChange((prev) => ({
      ...prev,
      metric: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onApplyFilters();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card flex flex-col gap-4 p-5"
      aria-label="Filter Sheet 2"
    >
      <p className="card-title text-[#1766ff]">Filter Analisis</p>

      <div className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-[#54608d]">
        <label htmlFor="postCreatedFrom">Post Created From</label>
        <input
          id="postCreatedFrom"
          type="datetime-local"
          value={filters.postCreatedFrom}
          onChange={handleDateChange("postCreatedFrom")}
          className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-[#1766ff] focus:outline-none focus:ring-2 focus:ring-[#1766ff]/30"
        />
      </div>

      <div className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-[#54608d]">
        <label htmlFor="postCreatedTo">Post Created To</label>
        <input
          id="postCreatedTo"
          type="datetime-local"
          value={filters.postCreatedTo}
          onChange={handleDateChange("postCreatedTo")}
          className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-[#1766ff] focus:outline-none focus:ring-2 focus:ring-[#1766ff]/30"
        />
      </div>

      <div className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-[#54608d]">
        <label htmlFor="metric">Metric</label>
        <select
          id="metric"
          value={filters.metric}
          onChange={handleMetricChange}
          className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-[#1766ff] focus:outline-none focus:ring-2 focus:ring-[#1766ff]/30"
        >
          {metricOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-[#1766ff] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0f4ad9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1766ff]"
      >
        Terapkan Filter
      </button>
    </form>
  );
}
