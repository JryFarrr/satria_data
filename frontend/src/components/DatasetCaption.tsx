'use client';

import { useDataset } from "./DatasetProvider";

export default function DatasetCaption() {
  const { selectedEntry } = useDataset();
  const caption = selectedEntry?.caption ?? "Caption tidak tersedia untuk konten ini.";

  return (
    <section className="card overflow-hidden">
      <div className="bg-[#f5ba45] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#1f2a55]">
        Caption
      </div>
      <p className="px-4 pb-4 pt-3 text-sm text-slate-700 whitespace-pre-line">{caption}</p>
    </section>
  );
}
