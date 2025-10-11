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
        href: entry.href,
      })),
    [entries],
  );

  return (
    <section className="card overflow-hidden">
      <div className="flex items-center justify-between rounded-t-[22px] bg-[#1748a6] px-5 py-3 text-white">
        <div>
          <p className="text-xs uppercase tracking-wide opacity-80">Daftar Konten</p>
          <h2 className="text-lg font-semibold">Link reel terpilih</h2>
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
              <th className="w-24 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isActive = row.id === selectedId;

              return (
                <tr
                  key={row.id}
                  className={`border-b border-slate-100 transition-colors ${isActive ? "bg-[#eef4ff]" : "bg-white"}`}
                >
                  <td className="px-4 py-2 font-semibold text-slate-600">
                    {row.id.toString().padStart(2, "0")}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => selectId(row.id)}
                      className={`truncate font-medium text-left ${isActive ? "text-[#1748a6]" : "text-slate-600"} hover:text-[#1748a6]`}
                    >
                      {row.title}
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    {row.href !== "#" ? (
                      <a
                        href={row.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-[#1748a6] hover:underline"
                        onClick={(event) => event.stopPropagation()}
                      >
                        Buka Link
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">No link</span>
                    )}
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
