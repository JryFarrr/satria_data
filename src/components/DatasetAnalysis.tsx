'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useDataset } from "./DatasetProvider";
import type { DatasetEntry } from "../lib/dataset";

type VisualAnalysis = {
  analysis_id?: string;
  average_brightness?: number;
  std_dev_brightness?: number;
  scene_cut_timestamps?: number[];
  brightness_plot_html?: string;
  stats_path?: string;
} | null;

type AudioAnalysis = {
  analysis_id?: string;
  average_pitch_hz?: number;
  std_dev_pitch_hz?: number;
  spectrogram_plot_html?: string;
  stats_path?: string;
} | null;

type FullAnalysis = {
  analysis_id?: string;
  visual?: VisualAnalysis;
  audio?: AudioAnalysis;
  stats_path?: string;
} | null;

type AnalysisState = {
  analysis: FullAnalysis;
  loading: boolean;
  error: string | null;
};

type AnalysisContextValue = AnalysisState & {
  selectedEntry: DatasetEntry | null;
};

const DatasetAnalysisContext = createContext<AnalysisContextValue | undefined>(undefined);

type DatasetAnalysisProviderProps = {
  children: React.ReactNode;
};

const INITIAL_STATE: AnalysisState = {
  analysis: null,
  loading: false,
  error: null,
};

export function DatasetAnalysisProvider({ children }: DatasetAnalysisProviderProps) {
  const { selectedEntry } = useDataset();
  const [state, setState] = useState<AnalysisState>(INITIAL_STATE);
  const cacheRef = useRef<Map<string, FullAnalysis>>(new Map());

  useEffect(() => {
    if (!selectedEntry) {
      setState(INITIAL_STATE);
      return;
    }

    const cacheKey = selectedEntry.folder;
    const cached = cacheRef.current.get(cacheKey);

    if (cached) {
      setState({
        analysis: cached,
        loading: false,
        error: null,
      });
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    setState({
      analysis: null,
      loading: true,
      error: null,
    });

    fetch(`/api/analysis/${cacheKey}`, {
      signal: controller.signal,
      headers: {
        accept: "application/json",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          const text = await response.text();
          const fallbackMessage =
            response.status === 504
              ? "Layanan analisis kehabisan waktu. Coba lagi nanti."
              : response.status === 502
                ? "Layanan analisis tidak tersedia."
                : "Gagal memuat analisis";
          const message =
            text && !/^</.test(text.trim()) ? text : fallbackMessage;
          throw new Error(message);
        }
        return response.json() as Promise<FullAnalysis>;
      })
      .then((data) => {
        if (cancelled) {
          return;
        }
        cacheRef.current.set(cacheKey, data);
        setState({
          analysis: data,
          loading: false,
          error: null,
        });
      })
      .catch((error) => {
        if (cancelled || error.name === "AbortError") {
          return;
        }
        console.error("Failed to fetch analysis:", error);
        setState({
          analysis: null,
          loading: false,
          error: error instanceof Error ? error.message : "Tidak dapat memuat analisis",
        });
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [selectedEntry]);

  const value = useMemo<AnalysisContextValue>(
    () => ({
      ...state,
      selectedEntry: selectedEntry ?? null,
    }),
    [state, selectedEntry],
  );

  return <DatasetAnalysisContext.Provider value={value}>{children}</DatasetAnalysisContext.Provider>;
}

function useDatasetAnalysis() {
  const context = useContext(DatasetAnalysisContext);
  if (!context) {
    throw new Error("DatasetAnalysisContext belum diinisialisasi. Bungkus komponen dengan DatasetAnalysisProvider.");
  }
  return context;
}

function formatDecimal(value?: number | null, fractionDigits = 2) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "-";
  }
  return value.toFixed(fractionDigits);
}

function formatSceneCutCount(value?: number[] | null) {
  if (!Array.isArray(value) || value.length === 0) {
    return "0";
  }
  return new Intl.NumberFormat("id-ID").format(value.length);
}

function AnalysisLoadingState({ label }: { label: string }) {
  return <p className="text-sm text-slate-500">Memuat {label}...</p>;
}

function AnalysisErrorState({ message }: { message: string }) {
  return <p className="text-sm text-red-600">{message}</p>;
}

function EmptyAnalysisState({ label }: { label: string }) {
  return <p className="text-sm text-slate-500">{label} belum tersedia.</p>;
}

type AnalysisHtmlEmbedProps = {
  html?: string | null;
  className?: string;
};

function AnalysisHtmlEmbed({ html, className }: AnalysisHtmlEmbedProps) {
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
    template.innerHTML = html;

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

  return <div ref={containerRef} className={className} />;
}

export function DatasetVideoAnalysis() {
  const { analysis, loading, error, selectedEntry } = useDatasetAnalysis();
  const visual = analysis?.visual;

  return (
    <section className="card flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <p className="card-title text-[#1766ff]">Fluktuasi Kecerahan</p>
      </div>

      {!selectedEntry ? (
        <EmptyAnalysisState label="Analisis visual" />
      ) : loading ? (
        <AnalysisLoadingState label="analisis visual" />
      ) : error ? (
        <AnalysisErrorState message={error} />
      ) : !visual ? (
        <EmptyAnalysisState label="Analisis visual" />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 text-sm text-slate-600">
            <div className="rounded-2xl bg-[#f8f9ff] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#7a84b5]">Rata-rata Kecerahan</p>
              <p className="text-lg font-bold text-[#1f2a55]">{formatDecimal(visual.average_brightness)}</p>
            </div>
            <div className="rounded-2xl bg-[#f8f9ff] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#7a84b5]">Standar Deviasi Kecerahan</p>
              <p className="text-lg font-bold text-[#1f2a55]">{formatDecimal(visual.std_dev_brightness)}</p>
            </div>
            <div className="rounded-2xl bg-[#f8f9ff] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#7a84b5]">Scene Cut</p>
              <p className="text-lg font-bold text-[#1f2a55]">{formatSceneCutCount(visual.scene_cut_timestamps)}</p>
            </div>
          </div>

          {visual.brightness_plot_html ? (
            <div className="overflow-hidden rounded-2xl border border-[#e1e5ff] bg-white">
              <AnalysisHtmlEmbed
                html={visual.brightness_plot_html}
                className="[&_*]:max-w-full [&_*]:max-h-[480px]"
              />
            </div>
          ) : (
            <EmptyAnalysisState label="Visualisasi kecerahan" />
          )}
        </>
      )}
    </section>
  );
}

export function DatasetAudioAnalysis() {
  const { analysis, loading, error, selectedEntry } = useDatasetAnalysis();
  const audio = analysis?.audio;

  return (
    <section className="card flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <p className="card-title text-[#1766ff]">Audio Spectrogram</p>
      </div>

      {!selectedEntry ? (
        <EmptyAnalysisState label="Analisis audio" />
      ) : loading ? (
        <AnalysisLoadingState label="analisis audio" />
      ) : error ? (
        <AnalysisErrorState message={error} />
      ) : !audio ? (
        <EmptyAnalysisState label="Analisis audio" />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
            <div className="rounded-2xl bg-[#f8f9ff] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#7a84b5]">Pitch Rata-rata (Hz)</p>
              <p className="text-lg font-bold text-[#1f2a55]">{formatDecimal(audio.average_pitch_hz)}</p>
            </div>
            <div className="rounded-2xl bg-[#f8f9ff] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#7a84b5]">Standar Deviasi Pitch (Hz)</p>
              <p className="text-lg font-bold text-[#1f2a55]">{formatDecimal(audio.std_dev_pitch_hz)}</p>
            </div>
          </div>

          {audio.spectrogram_plot_html ? (
            <div className="overflow-hidden rounded-2xl border border-[#e1e5ff] bg-white">
              <AnalysisHtmlEmbed
                html={audio.spectrogram_plot_html}
                className="[&_*]:max-w-full [&_*]:max-h-[480px]"
              />
            </div>
          ) : (
            <EmptyAnalysisState label="Visualisasi spektrogram" />
          )}
        </>
      )}
    </section>
  );
}
