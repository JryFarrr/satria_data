'use client';
import { useCallback, useEffect, useRef } from "react";
import { useDataset } from "./DatasetProvider";

export default function DatasetVideoCard() {
  const { selectedEntry, registerVideoElement } = useDataset();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoRef = useCallback(
    (node: HTMLVideoElement | null) => {
      videoRef.current = node;
      registerVideoElement(node);
    },
    [registerVideoElement],
  );

  useEffect(() => {
    if (!selectedEntry?.hasVideo) {
      videoRef.current = null;
      registerVideoElement(null);
    }
  }, [registerVideoElement, selectedEntry]);

  return (
    <section className="card flex flex-col gap-4">
      {/* <div className="flex w-full items-center justify-between">
        <p className="card-title text-[#54608d]">Mockup Video</p>
        <span className="tag px-4 py-1 text-xs uppercase">
          {selectedEntry ? `ID ${selectedEntry.id}` : "Pilih konten"}
        </span>
      </div> */}
      <div className="relative flex justify-center bg-[#f1f3ff]">
        <div className="relative w-[320px]">
          <div className="relative aspect-[388/791]">
            <div className="absolute inset-0 rounded-[46px] bg-gradient-to-b from-[#0f172a] via-[#111827] to-[#1f2937] shadow-[0_20px_50px_rgba(15,23,42,0.35)]" />
            <div className="absolute inset-[10px] rounded-[40px] border border-white/10 bg-white/5 shadow-[0_6px_14px_rgba(15,23,42,0.35)]" />
            <div className="pointer-events-none absolute inset-[6px] rounded-[42px] border border-white/5" />

            <div className="pointer-events-none absolute left-1/2 top-[6%] z-30 h-[30px] w-[40%] -translate-x-1/2 rounded-[20px] bg-[#05070b]" />
            <div className="pointer-events-none absolute left-[18%] top-[6%] z-30 h-[10px] w-[10px] rounded-full bg-[#0f172a]" />
            <div className="pointer-events-none absolute right-[18%] top-[6%] z-30 h-[10px] w-[10px] rounded-full bg-[#0f172a]" />

            <div className="pointer-events-none absolute left-[-3%] top-[28%] z-20 h-[12%] w-[4px] rounded-full bg-[#1f2937]" />
            <div className="pointer-events-none absolute left-[-3%] top-[42%] z-20 h-[8%] w-[4px] rounded-full bg-[#1f2937]" />
            <div className="pointer-events-none absolute left-[-3%] top-[54%] z-20 h-[8%] w-[4px] rounded-full bg-[#1f2937]" />
            <div className="pointer-events-none absolute right-[-3%] top-[35%] z-20 h-[16%] w-[4px] rounded-full bg-[#1f2937]" />

            <div className="absolute inset-[24px] z-10 flex items-center justify-center overflow-hidden rounded-[32px] bg-black shadow-inner shadow-black/60">
              {selectedEntry?.hasVideo ? (
                <video
                  key={selectedEntry.id}
                  src={`/api/videos/${selectedEntry.folder}`}
                  controls
                  className="h-full w-full object-cover"
                  playsInline
                  ref={handleVideoRef}
                />
              ) : (
                <span className="px-4 text-center text-sm font-semibold uppercase text-white">
                  {selectedEntry ? "Video tidak tersedia" : "Pilih konten"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
