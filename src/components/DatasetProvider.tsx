'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { DatasetEntry } from "../lib/dataset";

type DatasetContextValue = {
  entries: DatasetEntry[];
  selectedId: number | null;
  selectId: (id: number) => void;
  selectedEntry: DatasetEntry | null;
  registerVideoElement: (element: HTMLVideoElement | null) => void;
  seekTo: (seconds: number) => void;
};

const DatasetContext = createContext<DatasetContextValue | undefined>(undefined);

type DatasetProviderProps = {
  entries: DatasetEntry[];
  children: React.ReactNode;
};

export function DatasetProvider({ entries, children }: DatasetProviderProps) {
  const [selectedId, setSelectedId] = useState<number | null>(entries[0]?.id ?? null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const pendingSeekRef = useRef<number | null>(null);
  const metadataListenerRef = useRef<((event: Event) => void) | null>(null);

  const applySeek = useCallback((video: HTMLVideoElement, seconds: number) => {
    if (Number.isNaN(seconds) || seconds < 0) {
      return;
    }

    const target = seconds;
    const wasPaused = video.paused;

    pendingSeekRef.current = null;
    video.currentTime = target;

    if (!wasPaused) {
      void video.play().catch(() => {});
    }
  }, []);

  const registerVideoElement = useCallback(
    (element: HTMLVideoElement | null) => {
      const previousListener = metadataListenerRef.current;
      if (previousListener && videoElementRef.current) {
        videoElementRef.current.removeEventListener("loadedmetadata", previousListener);
        metadataListenerRef.current = null;
      }

      videoElementRef.current = element;

      if (!element) {
        return;
      }

      if (metadataListenerRef.current) {
        element.removeEventListener("loadedmetadata", metadataListenerRef.current);
        metadataListenerRef.current = null;
      }

      const pending = pendingSeekRef.current;
      if (pending === null) {
        return;
      }

      if (element.readyState >= 1) {
        applySeek(element, pending);
        return;
      }

      const handleLoadedMetadata = () => {
        applySeek(element, pending);
        metadataListenerRef.current = null;
      };

      metadataListenerRef.current = handleLoadedMetadata;
      element.addEventListener("loadedmetadata", handleLoadedMetadata, { once: true });
    },
    [applySeek],
  );

  const seekTo = useCallback(
    (seconds: number) => {
      pendingSeekRef.current = seconds;

      const video = videoElementRef.current;

      if (!video) {
        return;
      }

      const previousListener = metadataListenerRef.current;
      if (previousListener) {
        video.removeEventListener("loadedmetadata", previousListener);
        metadataListenerRef.current = null;
      }

      if (video.readyState >= 1) {
        applySeek(video, seconds);
        return;
      }

      const handleLoadedMetadata = () => {
        applySeek(video, seconds);
        metadataListenerRef.current = null;
      };

      metadataListenerRef.current = handleLoadedMetadata;
      video.addEventListener("loadedmetadata", handleLoadedMetadata, { once: true });
    },
    [applySeek],
  );

  useEffect(() => {
    if (entries.length === 0) {
      setSelectedId(null);
      return;
    }

    if (selectedId === null || !entries.some((entry) => entry.id === selectedId)) {
      setSelectedId(entries[0].id);
    }
  }, [entries, selectedId]);

  const value = useMemo<DatasetContextValue>(() => {
    const selectedEntry = selectedId !== null ? entries.find((entry) => entry.id === selectedId) ?? null : null;

    return {
      entries,
      selectedId,
      selectId: (id: number) => setSelectedId(id),
      selectedEntry,
      registerVideoElement,
      seekTo,
    };
  }, [entries, registerVideoElement, seekTo, selectedId]);

  return <DatasetContext.Provider value={value}>{children}</DatasetContext.Provider>;
}

export function useDataset() {
  const context = useContext(DatasetContext);

  if (!context) {
    throw new Error("useDataset must be used within a DatasetProvider");
  }

  return context;
}
