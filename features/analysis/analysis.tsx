"use client";
import { Brain } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalysisFilters } from "./components/analysis-filters";
import { AnalysisList } from "./components/analysis-list";
import { AnalysisOverview } from "./components/analysis-overview";
import useAnalysis from "./hooks/useAnalysis";

export const Analysis = () => {
  const { data: analysis = [], isLoading, error } = useAnalysis();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading analysis.</div>;

  // const meridianQuery = useQuery({
  //   queryKey: ["meridian"],
  //   queryFn: async () => {
  //     const response = await fetch("/api/meridian", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     const data = await response.json();
  //     return data;
  //   },
  // });

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Marketing Mix Modeling</h1>
          <p className="text-muted-foreground">
            Modelos avanzados para optimizar la asignación de presupuesto de marketing
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/marketing-mix-modeling/new">
            <Brain /> Crear un nuevo análisis
          </Link>
        </Button>
      </div>
      <AnalysisOverview analysis={analysis} />
      <Card>
        <CardHeader>
          <CardTitle>Análisis Recientes</CardTitle>
          <CardDescription>Historial de modelos de Marketing Mix ejecutados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <AnalysisFilters />
          <AnalysisList />
        </CardContent>
      </Card>
    </div>
  );
};
