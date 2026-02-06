import type { Analysis } from "../types/analysis.type";
import { AnalysisCard } from "./analysis-card";

type AnalysisCollectionProps = {
  analysis: Analysis[];
};
export const AnalysisCollection = ({ analysis }: AnalysisCollectionProps) => {
  return (
    <div className="flex flex-col gap-4">
      {analysis.map((item: Analysis, index: number) => (
        <AnalysisCard key={index} analysis={item} />
      ))}
    </div>
  );
};
