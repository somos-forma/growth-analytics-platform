import { CheckCircle, Hourglass } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { Analysis } from "../types/analysis.type";

type AnalysisCollectionProps = {
  analysis: Analysis[];
};

export const AnalysisOverview = ({ analysis }: AnalysisCollectionProps) => {
  const doneCount = analysis.filter((item: any) => item.status === "DONE").length;
  const runningCount = analysis.filter((item: any) => item.status === "RUNNING").length;
  const queuedCount = analysis.filter((item: any) => item.status === "QUEUED").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 ">
      <Card>
        <CardHeader>
          <CardDescription className="flex justify-between">
            Análisis completado <CheckCircle />
          </CardDescription>
          <CardTitle className="text-5xl font-bold">{doneCount}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription className="flex justify-between">
            Análisis en Ejecución
            <Spinner className="size-6" />
          </CardDescription>
          <CardTitle className="text-5xl font-bold">{runningCount}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription className="flex justify-between">
            Análisis en espera
            <Hourglass />
          </CardDescription>
          <CardTitle className="text-5xl font-bold">{queuedCount}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};
