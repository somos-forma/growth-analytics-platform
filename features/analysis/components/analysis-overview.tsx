import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle, Hourglass } from "lucide-react";

export const AnalysisOverview = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 ">
      <Card>
        <CardHeader>
          <CardDescription className="flex justify-between">
            Análisis completado <CheckCircle />
          </CardDescription>
          <CardTitle className="text-5xl font-bold">12</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription className="flex justify-between">
            Análisis en Ejecución
            <Spinner className="size-6" />
          </CardDescription>
          <CardTitle className="text-5xl font-bold">4</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription className="flex justify-between">
            Análisis en espera
            <Hourglass />
          </CardDescription>
          <CardTitle className="text-5xl font-bold">2</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};
