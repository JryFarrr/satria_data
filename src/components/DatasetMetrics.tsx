'use client';

import Image from "next/image";
import { useDataset } from "./DatasetProvider";
import type { DatasetEntryMetrics } from "../lib/dataset";

type MetricConfig = {
  key: "likeCount" | "commentCount" | "videoDurationSeconds" | "takenAt";
  label: string;
  icon: string;
  accentBg: string;
  accentText: string;
  value: (metrics: DatasetEntryMetrics) => string;
  hint: (metrics: DatasetEntryMetrics) => string;
};

function formatNumber(value?: number) {
  if (typeof value !== "number") {
    return "-";
  }
  return new Intl.NumberFormat("id-ID").format(value);
}

function formatDuration(seconds?: number) {
  if (typeof seconds !== "number" || Number.isNaN(seconds)) {
    return "-";
  }

  const totalSeconds = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  const minutePart = minutes.toString().padStart(2, "0");
  const secondPart = remainingSeconds.toString().padStart(2, "0");

  return `${minutePart}:${secondPart}`;
}

function formatDurationHint(seconds?: number) {
  if (typeof seconds !== "number" || Number.isNaN(seconds)) {
    return "Durasi tidak tersedia";
  }

  return `${seconds.toFixed(1)} detik`;
}

function formatDate(value?: string) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID").format(date);
}

function formatDateHint(value?: string) {
  if (!value) {
    return "Tanggal tidak tersedia";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Tanggal tidak valid";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

const METRIC_CONFIG: MetricConfig[] = [
  {
    key: "likeCount",
    label: "Like",
    icon: "/assets/Following.png",
    accentBg: "bg-[#e8f0ff]",
    accentText: "text-[#0f3fa8]",
    value: (metrics) => formatNumber(metrics.likeCount),
    hint: (metrics) => {
      if (typeof metrics.viewCount === "number") {
        return `${formatNumber(metrics.viewCount)} views`;
      }
      return "Jumlah like";
    },
  },
  {
    key: "commentCount",
    label: "Comment",
    icon: "/assets/Chat Bubble.png",
    accentBg: "bg-[#fff4e0]",
    accentText: "text-[#b45309]",
    value: (metrics) => formatNumber(metrics.commentCount),
    hint: () => "Jumlah komentar",
  },
  {
    key: "videoDurationSeconds",
    label: "Durasi Video",
    icon: "/assets/Video Call.png",
    accentBg: "bg-[#e7faf5]",
    accentText: "text-[#0f766e]",
    value: (metrics) => formatDuration(metrics.videoDurationSeconds),
    hint: (metrics) => formatDurationHint(metrics.videoDurationSeconds),
  },
  {
    key: "takenAt",
    label: "Tanggal dibuat",
    icon: "/assets/Schedule.png",
    accentBg: "bg-[#eef1ff]",
    accentText: "text-[#344173]",
    value: (metrics) => formatDate(metrics.takenAt),
    hint: (metrics) => formatDateHint(metrics.takenAt),
  },
];

export default function DatasetMetrics() {
  const { selectedEntry } = useDataset();
  const metrics: DatasetEntryMetrics = selectedEntry?.metrics ?? {};

  return (
    <section className="card px-4 py-4">
      <div className="grid gap-4 lg:grid-cols-4">
        {METRIC_CONFIG.map((metric) => (
          <div key={metric.key} className="flex items-center gap-3 rounded-2xl bg-[#f7f8ff] px-4 py-3 shadow-sm">
            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${metric.accentBg}`}>
              <Image src={metric.icon} alt={metric.label} width={22} height={22} />
            </div>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide ${metric.accentText}`}>
                {metric.label}
              </p>
              <p className="text-lg font-bold text-[#1f2a55]">{metric.value(metrics)}</p>
              <p className="text-xs text-slate-500">{metric.hint(metrics)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
