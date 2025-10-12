'use client';

import { useMemo } from "react";
import { useDataset } from "./DatasetProvider";

export default function DatasetLinks() {
  const { entries, selectedId, selectId } = useDataset();

  const total = entries.length;

  const rows = useMemo(
    () =>
      entries.map((entry) => ({
        id: entry.id,
        title: entry.title,
        topics: entry.topics ?? [],
        username: entry.username ?? null,
      })),
    [entries],
  );

  const handleSelect = (id: number) => {
    selectId(id);
  };

  return (
    <section className="card overflow-hidden">
      <div className="flex items-center justify-between rounded-t-[22px] bg-[#1748a6] px-5 py-3 text-white">
        <div>
          <p className="text-xs uppercase tracking-wide opacity-80">Daftar Konten</p>
          <h2 className="text-lg font-semibold">Konten terpilih</h2>
        </div>
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
          {total} tautan
        </span>
      </div>
      <div className="max-h-[236px] overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-[#2754c4] text-white">
            <tr>
              <th className="w-20 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide">Id</th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide">Judul</th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide">Topik</th>
              <th className="w-40 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide">Nama Pengguna</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isActive = row.id === selectedId;
              const displayedTopics = row.topics.slice(0, 3);
              const remainingTopics = row.topics.length - displayedTopics.length;

              return (
                <tr
                  key={row.id}
                  className={`border-b border-slate-100 transition-colors ${isActive ? "bg-[#eef4ff]" : "bg-white"} cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1748a6] focus-visible:ring-offset-2`}
                  onClick={() => handleSelect(row.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleSelect(row.id);
                    }
                  }}
                >
                  <td className="px-4 py-3 font-semibold text-slate-600">
                    {row.id.toString().padStart(2, "0")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`block truncate font-medium ${isActive ? "text-[#1748a6]" : "text-slate-600"}`}
                    >
                      {row.title}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {displayedTopics.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {displayedTopics.map((topic) => (
                          <span
                            key={`${row.id}-${topic}`}
                            className="rounded-full bg-[#eef1ff] px-2 py-[3px] text-[11px] font-semibold uppercase tracking-wide text-[#3f4a7a]"
                          >
                            {topic}
                          </span>
                        ))}
                        {remainingTopics > 0 ? (
                          <span className="rounded-full bg-[#dce4ff] px-2 py-[3px] text-[11px] font-semibold uppercase tracking-wide text-[#23316c]">
                            +{remainingTopics}
                          </span>
                        ) : null}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {row.username ? `@${row.username}` : <span className="text-xs text-slate-400">-</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
