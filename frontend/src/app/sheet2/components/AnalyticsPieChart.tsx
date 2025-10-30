'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import type { AnalyticsFiltersState } from "./AnalyticsFilters";

type FetchStatus = "idle" | "loading" | "error" | "success";

type PieChartResponse = {
  plot?: {
    title?: string;
    html?: string;
  } | null;
};

type AnalyticsPieChartProps = {
  filters: AnalyticsFiltersState;
};

function normalizeDateTime(value?: string) {
  if (!value) {
    return "";
  }
  return value.length === 16 ? `${value}:00` : value;
}

function PieChartHtmlEmbed({ html }: { html?: string }) {
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

export default function AnalyticsPieChart({
  filters,
}: AnalyticsPieChartProps) {
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [plotHtml, setPlotHtml] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState<string>("Distribusi Konten");

  const memoizedFilters = useMemo(() => filters, [filters]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPieChart() {
      try {
        setStatus("loading");
        setErrorMessage(null);

        const params = new URLSearchParams();

        const normalizedFrom = normalizeDateTime(
          memoizedFilters.postCreatedFrom,
        );
        if (normalizedFrom) {
          params.set("post_created_from", normalizedFrom);
        }

        const normalizedTo = normalizeDateTime(memoizedFilters.postCreatedTo);
        if (normalizedTo) {
          params.set("post_created_to", normalizedTo);
        }

        const endpoint = `/api/analytics/piechart?${params.toString()}`;

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
              : `Gagal memuat pie chart (${response.status})`,
          );
        }

        const payload = (await response.json()) as PieChartResponse;
        const plot = payload.plot;

        setPlotHtml(plot?.html ?? undefined);
        setTitle(plot?.title?.trim() || "Distribusi Konten Berdasarkan Topik");
        setStatus("success");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Gagal memuat pie chart",
        );
      }
    }

    fetchPieChart();

    return () => controller.abort();
  }, [
    memoizedFilters.postCreatedFrom,
    memoizedFilters.postCreatedTo,
    memoizedFilters.metric,
  ]);

  if (status === "loading" || status === "idle") {
    return (
      <section className="card flex flex-col gap-4 p-5">
        <p className="card-title text-[#1766ff]">
          Distribusi Konten Berdasarkan Topik
        </p>
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-[#b7c4ff] bg-[#f6f8ff] px-6 py-16 text-sm text-[#54608d]">
          Mengambil data distribusi topik…
        </div>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="card flex flex-col gap-4 p-5">
        <p className="card-title text-[#1766ff]">
          Distribusi Konten Berdasarkan Topik
        </p>
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
          {errorMessage ?? "Gagal memuat pie chart. Coba lagi nanti."}
        </div>
      </section>
    );
  }

  if (!plotHtml) {
    return (
      <section className="card flex flex-col gap-4 p-5">
        <p className="card-title text-[#1766ff]">
          Distribusi Konten Berdasarkan Topik
        </p>
        <div className="rounded-2xl border border-slate-200 bg-[#f7f8ff] px-6 py-12 text-sm text-[#54608d]">
          Visualisasi pie chart belum tersedia untuk rentang tanggal yang
          dipilih.
        </div>
      </section>
    );
  }

  return (
    <section className="card flex flex-col gap-4 p-5">
      <p className="card-title text-[#1766ff]">{title}</p>
      <div className="overflow-hidden rounded-2xl border border-[#e1e5ff] bg-white">
        <PieChartHtmlEmbed html={plotHtml} />
      </div>
    </section>
  );
}
