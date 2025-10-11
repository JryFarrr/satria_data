'use client';

import { useDataset } from "./DatasetProvider";

export default function DatasetSummary() {
  const { selectedEntry } = useDataset();
  const summary = selectedEntry?.summary ?? "Ringkasan tidak tersedia untuk konten ini.";

  return (
    <section className="card flex flex-col gap-3 p-5">
      <p className="card-title text-[#1766ff]">Summarize</p>
      <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">{summary}</p>
    </section>
  );
}
