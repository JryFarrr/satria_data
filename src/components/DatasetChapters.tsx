'use client';

import Image from "next/image";
import { useDataset } from "./DatasetProvider";

function formatTimeLabel(value: string) {
  if (!value) {
    return "-";
  }

  const parts = value.split(":");
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    if (hours === "00") {
      return `${minutes}:${seconds}`;
    }
  }
  return value;
}

export default function DatasetChapters() {
  const { selectedEntry } = useDataset();
  const chapters = selectedEntry?.chapters ?? [];

  return (
    <section className="card p-5">
      <div className="flex items-center justify-between">
        <p className="card-title text-[#1766ff]">Time Stamps</p>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef3ff]">
          <Image src="/assets/Schedule.png" alt="Clock icon" width={22} height={22} />
        </div>
      </div>
      <div className="mt-3 overflow-hidden rounded-2xl border border-slate-100">
        <table className="min-w-full text-sm">
          <thead className="bg-[#eff4ff] text-[#4b587c]">
            <tr>
              <th className="w-24 px-4 py-2 text-left">Time</th>
              <th className="px-4 py-2 text-left">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {chapters.length > 0 ? (
              chapters.map((chapter, idx) => (
                <tr key={`${chapter.startTime}-${chapter.title}`} className={idx % 2 === 0 ? "bg-white" : "bg-[#f6f8ff]"}>
                  <td className="px-4 py-2 font-semibold text-slate-700">{formatTimeLabel(chapter.startTime)}</td>
                  <td className="px-4 py-2 text-slate-600">{chapter.title}</td>
                </tr>
              ))
            ) : (
              <tr className="bg-white">
                <td colSpan={2} className="px-4 py-3 text-center text-xs text-slate-400">
                  Time stamp tidak tersedia
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
