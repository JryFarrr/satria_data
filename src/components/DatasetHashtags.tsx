'use client';

import { useDataset } from "./DatasetProvider";

export default function DatasetHashtags() {
  const { selectedEntry } = useDataset();
  const hashtags = selectedEntry?.hashtags ?? [];

  return (
    <section className="card flex flex-wrap items-start gap-2 p-4">
      <div className="w-full text-xs font-semibold uppercase tracking-wide text-[#1766ff]">Hashtag</div>
      {hashtags.length > 0 ? (
        hashtags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-2xl border border-[#1766ff]/30 bg-[#eef3ff] px-3 py-1 text-xs font-semibold leading-tight text-[#1766ff] whitespace-nowrap"
          >
            {tag}
          </span>
        ))
      ) : (
        <span className="text-xs text-slate-400">Tidak ada hashtag</span>
      )}
    </section>
  );
}
