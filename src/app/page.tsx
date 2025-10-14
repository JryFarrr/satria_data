import DashboardHeader from "../components/DashboardHeader";
import DatasetLinks from "../components/DatasetLinks";
import DatasetVideoCard from "../components/DatasetVideoCard";
import DatasetMetrics from "../components/DatasetMetrics";
import DatasetHashtags from "../components/DatasetHashtags";
import DatasetCaption from "../components/DatasetCaption";
import DatasetTopics from "../components/DatasetTopics";
import DatasetSummary from "../components/DatasetSummary";
import DatasetChapters from "../components/DatasetChapters";
import {
  DatasetAnalysisProvider,
  DatasetAudioAnalysis,
  DatasetVideoAnalysis,
} from "../components/DatasetAnalysis";
import { DatasetProvider } from "../components/DatasetProvider";
import { getDatasetEntries } from "../lib/dataset";

type HomePageProps = {
  searchParams?: {
    id?: string;
  };
};

export default function Home({ searchParams }: HomePageProps) {
  const datasetEntries = getDatasetEntries();
  const parsedSelectedId =
    typeof searchParams?.id === "string"
      ? Number.parseInt(searchParams.id, 10)
      : Number.NaN;
  const initialSelectedId = Number.isFinite(parsedSelectedId) ? parsedSelectedId : null;

  return (
    <main className="min-h-screen bg-[#f1f3ff] py-10 px-10">
      <div className="mr-auto flex w-full max-w-screen-xl flex-col gap-6">
        <DatasetProvider entries={datasetEntries} initialSelectedId={initialSelectedId}>
          <div className="flex flex-col gap-6 lg:flex-row">
            <aside className="lg:w-[420px] lg:flex-shrink-0">
              <div className="flex flex-col gap-6 lg:sticky lg:top-10">
                <DashboardHeader />
                <DatasetVideoCard />
              </div>
            </aside>

            <section className="flex flex-1 flex-col gap-6">
              <div className="flex flex-col gap-4">
                <DatasetLinks />

                <DatasetMetrics />

                <div className="grid gap-4 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)]">
                  <DatasetCaption />
                  <DatasetHashtags />
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)]">
                <DatasetChapters />

                <DatasetSummary />
              </div>

              <DatasetAnalysisProvider>
                <div className="flex flex-col gap-4">
                  <DatasetVideoAnalysis />
                  <DatasetAudioAnalysis />
                </div>
              </DatasetAnalysisProvider>
            </section>
          </div>
        </DatasetProvider>
      </div>
    </main>
  );
}
