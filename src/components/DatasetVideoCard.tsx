'use client';

import Image from "next/image";
import { useDataset } from "./DatasetProvider";

export default function DatasetVideoCard() {
  const { selectedEntry } = useDataset();

  return (
    <section className="card flex flex-col gap-4 p-6">
      <div className="flex w-full items-center justify-between">
        <p className="card-title text-[#54608d]">Mockup Video</p>
        <span className="tag px-4 py-1 text-xs uppercase">
          {selectedEntry ? `ID ${selectedEntry.id}` : "Pilih konten"}
        </span>
      </div>
      <div className="relative flex justify-center rounded-[32px] bg-[rgba(233,239,255,0.9)] p-6">
        <div className="relative w-[320px]">
          <Image src="/assets/iphone-mockup.png" alt="Mockup iPhone" width={620} height={1240} priority />
          <div className="absolute left-[14%] right-[14%] top-[8%] bottom-[9%] flex items-center justify-center overflow-hidden rounded-[34px] bg-black">
            {selectedEntry?.hasVideo ? (
              <video
                key={selectedEntry.id}
                src={`/api/videos/${selectedEntry.folder}`}
                controls
                className="h-full w-full object-cover"
                playsInline
              />
            ) : (
              <span className="px-4 text-center text-sm font-semibold uppercase text-white">
                {selectedEntry ? "Video tidak tersedia" : "Pilih konten"}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
