'use client';

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { DatasetEntry } from "../lib/dataset";

type DatasetContextValue = {
  entries: DatasetEntry[];
  selectedId: number | null;
  selectId: (id: number) => void;
  selectedEntry: DatasetEntry | null;
};

const DatasetContext = createContext<DatasetContextValue | undefined>(undefined);

type DatasetProviderProps = {
  entries: DatasetEntry[];
  children: React.ReactNode;
};

export function DatasetProvider({ entries, children }: DatasetProviderProps) {
  const [selectedId, setSelectedId] = useState<number | null>(entries[0]?.id ?? null);

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
    };
  }, [entries, selectedId]);

  return <DatasetContext.Provider value={value}>{children}</DatasetContext.Provider>;
}

export function useDataset() {
  const context = useContext(DatasetContext);

  if (!context) {
    throw new Error("useDataset must be used within a DatasetProvider");
  }

  return context;
}
