import { CheckCircle, Hourglass } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useMeridianStatusStore } from "../store";

export const AnalysisOverview = () => {
  const { statuses } = useMeridianStatusStore();

  const doneCount = statuses.filter((status) => status === "DONE").length;
  const runningCount = statuses.filter((status) => status === "RUNNING").length;
  const queuedCount = statuses.filter((status) => status === "QUEUED").length;

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
