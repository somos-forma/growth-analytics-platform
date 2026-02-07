"use client";
import { Brain } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalysisCollection } from "./components/analysis-collection";
import { AnalysisFilters } from "./components/analysis-filters";
import { AnalysisOverview } from "./components/analysis-overview";
import useAnalysis from "./hooks/useAnalysis";

export const Analysis = () => {
  const { data: analysis = [], isLoading } = useAnalysis();
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedModel, setSelectedModel] = useState("all");

  const filteredAnalysis = analysis.filter((item: any) => {
    const matchesSearch = search === "" || item.job_id.toLowerCase().includes(search.toLowerCase());
    const matchesState = selectedState === "all" || selectedState === "" || item.status === selectedState;
    const matchesModel = selectedModel === "all" || selectedModel === "";
    return matchesSearch && matchesState && matchesModel;
  });

  if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error loading analysis.</div>;

  console.log(analysis);

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
          <AnalysisFilters
            search={search}
            setSearch={setSearch}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />
          <AnalysisCollection analysis={filteredAnalysis} />
        </CardContent>
      </Card>
    </div>
  );
};
