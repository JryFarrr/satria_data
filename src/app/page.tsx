import DatasetLinks from "../components/DatasetLinks";
import DatasetVideoCard from "../components/DatasetVideoCard";
import DatasetMetrics from "../components/DatasetMetrics";
import DatasetHashtags from "../components/DatasetHashtags";
import DatasetCaption from "../components/DatasetCaption";
import DatasetTopics from "../components/DatasetTopics";
import DatasetSummary from "../components/DatasetSummary";
import DatasetChapters from "../components/DatasetChapters";
import { DatasetProvider } from "../components/DatasetProvider";
import { getDatasetEntries } from "../lib/dataset";

export default function Home() {
  const datasetEntries = getDatasetEntries();
  return (
    <main className="min-h-screen bg-[#f1f3ff] px-6 py-10 md:px-10 lg:px-16">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6">
        <div className="flex h-[14px] w-60 overflow-hidden rounded-full">
          <div className="w-1/3 bg-[#f4b400]" />
          <div className="w-1/3 bg-[#1766ff]" />
          <div className="w-1/3 bg-[#1f2c6d]" />
        </div>
        <header className="space-y-1 text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1766ff]">
            Analitik Sosial
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-[2.45rem] font-semibold text-[#1f2355]">
              Content Engagement Dashboard
            </h1>
            <span className="rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-lg">
              Update 30/09/2025
            </span>
          </div>
        </header>

        <DatasetProvider entries={datasetEntries}>
          <div className="flex flex-col gap-6 lg:flex-row">
            <aside className="lg:w-[420px] lg:flex-shrink-0">
              <div className="lg:sticky lg:top-20">
                <DatasetVideoCard />
              </div>
            </aside>

            <section className="flex flex-1 flex-col gap-6 lg:pl-8">
              <div className="flex flex-col gap-4">
                <DatasetLinks />

                <DatasetMetrics />

                <DatasetTopics />

                <div className="grid gap-4 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)]">
                  <DatasetCaption />
                  <DatasetHashtags />
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)]">
                <DatasetChapters />

                <DatasetSummary />
              </div>
            </section>
          </div>
        </DatasetProvider>
      </div>
    </main>
  );
}
