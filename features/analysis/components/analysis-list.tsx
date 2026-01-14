import useAnalysis from "../hooks/useAnalysis";
import { AnalysisCollection } from "./analysis-collection";

export const AnalysisList = () => {
  const { data: analysis = [], isLoading, error } = useAnalysis();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading analysis.</div>;

  return <AnalysisCollection analysis={analysis} />;
};
