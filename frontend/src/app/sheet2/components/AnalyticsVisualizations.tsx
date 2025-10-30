'use client';

import { memo, useEffect, useMemo, useRef, useState } from "react";
import type { AnalyticsFiltersState } from "./AnalyticsFilters";

type FetchStatus = "idle" | "loading" | "error" | "success";

type PlotEntry = {
  title?: string;
  html?: string;
};

type VisualizationsPayload = {
  plots?: Record<string, PlotEntry | null | undefined>;
};

type AnalyticsVisualizationsProps = {
  filters: AnalyticsFiltersState;
};

function normalizeDateTime(value?: string) {
  if (!value) {
    return "";
  }
  return value.length === 16 ? `${value}:00` : value;
}

function PlotHtmlEmbed({ html }: { html?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    container.innerHTML = "";

    if (!html) {
      return;
    }

    const template = document.createElement("template");
    template.innerHTML = html.trim();

    const scripts = Array.from(template.content.querySelectorAll("script"));
    scripts.forEach((script) => script.remove());

    container.appendChild(template.content);

    const evaluateScriptsSequentially = (index: number) => {
      if (index >= scripts.length) {
        return;
      }

      const sourceScript = scripts[index];
      const script = document.createElement("script");

      for (const { name, value } of Array.from(sourceScript.attributes)) {
        script.setAttribute(name, value);
      }

      const next = () => evaluateScriptsSequentially(index + 1);

      if (sourceScript.src) {
        script.onload = next;
        script.onerror = next;
        container.appendChild(script);
      } else {
        script.textContent = sourceScript.textContent;
        container.appendChild(script);
        next();
      }
    };

    evaluateScriptsSequentially(0);
  }, [html]);

  return <div ref={containerRef} className="w-full" />;
}

type PlotCardProps = {
  plotKey: string;
  entry: PlotEntry;
};

const PlotCard = memo(function PlotCard({ plotKey, entry }: PlotCardProps) {
  const heading = entry.title?.trim() || plotKey.replace(/_/g, " ");

  return (
    <section className="card flex flex-col gap-4 p-5">
      <p className="card-title text-[#1766ff]">{heading}</p>
      <div className="overflow-hidden rounded-2xl border border-[#e1e5ff] bg-white">
        <PlotHtmlEmbed html={entry.html} />
      </div>
    </section>
  );
});

export default function AnalyticsVisualizations({
  filters,
}: AnalyticsVisualizationsProps) {
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [plots, setPlots] = useState<Array<{ key: string; entry: PlotEntry }>>(
    [],
  );

  const metricType = useMemo(() => {
    if (!filters.metric) {
      return "view";
    }
    switch (filters.metric) {
      case "like":
        return "like";
      case "pc":
        return "pc";
      default:
        return "view";
    }
  }, [filters.metric]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchVisualizations() {
      try {
        setStatus("loading");
        setErrorMessage(null);

        const params = new URLSearchParams();
        params.set("type", metricType);

        const normalizedFrom = normalizeDateTime(filters.postCreatedFrom);
        if (normalizedFrom) {
          params.set("post_created_from", normalizedFrom);
        }

        const normalizedTo = normalizeDateTime(filters.postCreatedTo);
        if (normalizedTo) {
          params.set("post_created_to", normalizedTo);
        }

        const endpoint = `/api/analytics/visualizations?${params.toString()}`;

        const response = await fetch(endpoint, {
          headers: {
            accept: "application/json",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(
            text && !/^</.test(text.trim())
              ? text
              : `Gagal memuat visualisasi (${response.status})`,
          );
        }

        const payload = (await response.json()) as VisualizationsPayload;
        const normalizedPlots =
          payload && payload.plots
            ? Object.entries(payload.plots)
                .filter(
                  (entry): entry is [string, PlotEntry] =>
                    Boolean(entry[0] && entry[1]?.html),
                )
                .map(([key, entry]) => ({
                  key,
                  entry: entry as PlotEntry,
                }))
            : [];

        setPlots(normalizedPlots);
        setStatus("success");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Gagal memuat visualisasi.",
        );
      }
    }

    fetchVisualizations();

    return () => controller.abort();
  }, [filters.postCreatedFrom, filters.postCreatedTo, metricType]);

  if (status === "loading" || status === "idle") {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <section className="card flex flex-col gap-4 p-6">
          <p className="card-title text-[#1766ff]">Visualisasi Analitik</p>
          <div className="flex items-center justify-center rounded-2xl border border-dashed border-[#b7c4ff] bg-[#f6f8ff] px-6 py-16 text-sm text-[#54608d]">
            Mengambil visualisasi terbaru dari layanan analitik…
          </div>
        </section>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <section className="card flex flex-col gap-4 p-6">
          <p className="card-title text-[#1766ff]">Visualisasi Analitik</p>
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
            {errorMessage ??
              "Terjadi kesalahan saat memuat visualisasi. Coba lagi nanti."}
          </div>
        </section>
      </div>
    );
  }

  if (plots.length === 0) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <section className="card flex flex-col gap-4 p-6">
          <p className="card-title text-[#1766ff]">Visualisasi Analitik</p>
          <div className="rounded-2xl border border-slate-200 bg-[#f7f8ff] px-6 py-12 text-sm text-[#54608d]">
            Layanan analitik belum mengembalikan visualisasi untuk filter yang
            dipilih. Sesuaikan rentang tanggal atau metric, lalu coba lagi.
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {plots.map(({ key, entry }) => (
        <PlotCard key={key} plotKey={key} entry={entry} />
      ))}
    </div>
  );
}
