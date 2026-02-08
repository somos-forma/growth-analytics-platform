"use client";
import { Brain } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalysisCollection } from "./components/analysis-collection";
import { AnalysisFilters } from "./components/analysis-filters";
import { AnalysisOverview } from "./components/analysis-overview";
import useAnalysis from "./hooks/useAnalysis";

export const Analysis = () => {
  const { data: analysis = [], isLoading, refetch } = useAnalysis();
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedModel, setSelectedModel] = useState("all");
  const [jobId, setJobId] = useState<string | null>(null);
  const hasUpdatedStatusRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setJobId(localStorage.getItem("job_id"));
    }
  }, []);

  useEffect(() => {
    if (!jobId) return;
    hasUpdatedStatusRef.current = false;

    const pollJobStatus = async () => {
      try {
        const response = await fetch(`/api/meridian/${jobId}`);
        if (!response.ok) throw new Error("Failed to fetch job status");
        const data = await response.json();
        console.log("esta es la data", data);
        console.log("status", data.status);

        if (data.status === "RUNNING" && !hasUpdatedStatusRef.current) {
          hasUpdatedStatusRef.current = true;
          await fetch(`/api/analysis/${jobId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "En ejecución" }),
          });
        }

        if (data.status === "DONE") {
          await fetch(`/api/analysis/${jobId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              status: "Completado",
              tiempo: data.duration_minutes,
              finished_at: data.finished_at,
              analysis_url: [
                data.result.reports.budget_optimization.signed_url,
                data.result.reports.model_fit.signed_url,
              ],
            }),
          });
          localStorage.removeItem("job_id");
          setJobId(null);
          refetch();
          toast.success("Análisis completado", {
            description: "Tu análisis de Marketing Mix Modeling ha finalizado.",
          });
          hasUpdatedStatusRef.current = false;
        } else {
          setTimeout(pollJobStatus, 5000);
        }
      } catch (error) {
        console.error("Error polling job status:", error);
        setTimeout(pollJobStatus, 5000); // Retry on error
      }
    };

    pollJobStatus();
  }, [jobId, refetch]);

  const filteredAnalysis = analysis.filter((item: any) => {
    const matchesSearch = search === "" || item.name.toLowerCase().includes(search.toLowerCase());
    const matchesState =
      selectedState === "all" ||
      selectedState === "" ||
      (selectedState === "en espera" && item.status?.toLowerCase().includes("espera")) ||
      item.status?.toLowerCase() === selectedState.toLowerCase();
    const matchesModel = selectedModel === "all" || selectedModel === "";
    return matchesSearch && matchesState && matchesModel;
  });

  if (isLoading) return <div>Loading...</div>;

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
