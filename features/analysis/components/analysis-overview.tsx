import { AlertTriangle, CheckCircle, Hourglass } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { Analysis } from "../types/analysis.type";

type AnalysisCollectionProps = {
  analysis: Analysis[];
};

export const AnalysisOverview = ({ analysis }: AnalysisCollectionProps) => {
  const doneCount = analysis.filter((item: any) => item.status === "Completado" || item.status === "completado").length;
  const runningCount = analysis.filter(
    (item: any) => item.status === "En ejecución" || item.status === "en ejecución",
  ).length;
  const queuedCount = analysis.filter(
    (item: any) =>
      item.status &&
      item.status !== "En ejecución" &&
      item.status !== "Completado" &&
      item.status !== "en ejecución" &&
      item.status !== "completado" &&
      item.status !== "Error" &&
      item.status !== "error",
  ).length;
  const errorCount = analysis.filter((item: any) => item.status === "Error" || item.status === "error").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 ">
      <Card>
        <CardHeader>
          <CardDescription className="flex justify-between">
            Análisis completado <CheckCircle color="rgba(128, 239, 128, 1)" />
          </CardDescription>
          <CardTitle className="text-5xl font-bold">{doneCount}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription className="flex justify-between">
            Análisis en Ejecución
            <Spinner className="size-6" color="rgba(146, 199, 240, 1)" />
          </CardDescription>
          <CardTitle className="text-5xl font-bold">{runningCount}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription className="flex justify-between">
            Análisis en espera
            <Hourglass color="rgba(255, 227, 122, 1)" />
          </CardDescription>
          <CardTitle className="text-5xl font-bold">{queuedCount}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription className="flex justify-between">
            Análisis con Error
            <AlertTriangle color="rgba(255, 127, 127, 1.0)" />
          </CardDescription>
          <CardTitle className="text-5xl font-bold">{errorCount}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};
