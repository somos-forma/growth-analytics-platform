import { Analysis } from "../types/analysis.type";
import { AnalysisCard } from "./analysis-card";

type AnalysisCollectionProps = {
  analysis: Analysis[];
};
export const AnalysisCollection = ({ analysis }: AnalysisCollectionProps) => {
  return (
    <div className="flex flex-col gap-4">
      {analysis.map((item) => (
        <AnalysisCard key={item.id} analysis={item} />
      ))}
    </div>
  );
};
