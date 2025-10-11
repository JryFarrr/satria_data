'use client';

import { useDataset } from "./DatasetProvider";

export default function DatasetTopics() {
  const { selectedEntry } = useDataset();
  const topics = selectedEntry?.topics ?? [];

  return (
    <section className="card flex flex-col gap-3 p-5">
      <p className="card-title text-[#1766ff]">Judul (Topic)</p>
      <div className="flex flex-col gap-2 text-sm text-slate-600">
        {topics.length > 0 ? (
          topics.map((topic) => (
            <div key={topic} className="flex items-start gap-2">
              <span className="mt-[6px] h-2 w-2 rounded-full bg-[#1766ff]" />
              <span>{topic}</span>
            </div>
          ))
        ) : (
          <span className="text-xs text-slate-400">Topik tidak tersedia</span>
        )}
      </div>
    </section>
  );
}
