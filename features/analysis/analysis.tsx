"use client";
import { Brain } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
  const [jobIds, setJobIds] = useState<string[]>([]);
  const hasUpdatedStatusRef = useRef(new Set<string>());
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ids = JSON.parse(localStorage.getItem("job_ids") || "[]");
      setJobIds(ids);
    }
  }, []);

  useEffect(() => {
    if (jobIds.length === 0) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    console.log("Polling for jobIds:", jobIds);
    hasUpdatedStatusRef.current = new Set();

    const pollJobStatus = async () => {
      try {
        const response = await fetch(`/api/meridian`);
        if (!response.ok) throw new Error("Failed to fetch job status");
        const data = await response.json();
        console.log("esta es la data", data);
        const jobs = data.items || [];
        console.log("jobs array", jobs);

        let updatedJobIds = [...jobIds];
        let hasChanges = false;

        if (Array.isArray(jobs)) {
          for (const job of jobs) {
            if (!job || !jobIds.includes(job.job_id)) continue;

            if (job.status === "RUNNING" && !hasUpdatedStatusRef.current.has(job.job_id)) {
              hasUpdatedStatusRef.current.add(job.job_id);
              await fetch(`/api/analysis/${job.job_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "En ejecución" }),
              });
            } else if (job.status === "DONE") {
              await fetch(`/api/analysis/${job.job_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  status: "Completado",
                  tiempo: job.duration_minutes,
                  finished_at: job.finished_at,
                  analysis_url: [
                    job.result.reports.budget_optimization.signed_url,
                    job.result.reports.model_fit.signed_url,
                  ],
                }),
              });
              updatedJobIds = updatedJobIds.filter((id) => id !== job.job_id);
              hasUpdatedStatusRef.current.delete(job.job_id);
              hasChanges = true;
              // toast.success("Análisis completado", {
              //   description: `Tu análisis ${job.job_id} de Marketing Mix Modeling ha finalizado.`,
              // });
            } else if (job.status === "ERROR") {
              await fetch(`/api/analysis/${job.job_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "Error" }),
              });
              updatedJobIds = updatedJobIds.filter((id) => id !== job.job_id);
              hasUpdatedStatusRef.current.delete(job.job_id);
              hasChanges = true;
              // toast.error("Análisis fallido", {
              //   description: `Ha ocurrido un error en el análisis ${job.job_id} de Marketing Mix Modeling.`,
              // });
            }
          }

          // Remove jobIds not in the response (assume completed)
          const responseJobIds = jobs.map((j: any) => j.job_id);
          const jobsToRemove = jobIds.filter((id) => !responseJobIds.includes(id));
          if (jobsToRemove.length > 0) {
            updatedJobIds = updatedJobIds.filter((id) => responseJobIds.includes(id));
            jobsToRemove.forEach((id) => hasUpdatedStatusRef.current.delete(id));
            hasChanges = true;
            console.log(`Jobs not found in response, removing:`, jobsToRemove);
          }
        }

        if (hasChanges) {
          setJobIds(updatedJobIds);
          localStorage.setItem("job_ids", JSON.stringify(updatedJobIds));
        }

        if (updatedJobIds.length === 0) {
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
        }
      } catch (error) {
        console.error("Error polling job status:", error);
        // Continue polling on error
      }
    };

    // Start polling immediately
    pollJobStatus();

    // Set interval for subsequent polls
    pollingIntervalRef.current = setInterval(pollJobStatus, 5000);

    // Cleanup on unmount or when jobIds changes
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [jobIds]);

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
