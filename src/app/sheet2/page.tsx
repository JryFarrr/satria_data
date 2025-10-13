import SheetTwoContent from "./SheetTwoContent";
import { getDatasetEntries } from "../../lib/dataset";

export default function SheetTwoPage() {
  const datasetEntries = getDatasetEntries();
  return <SheetTwoContent entries={datasetEntries} />;
}
