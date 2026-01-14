"use client";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import Link from "next/link";
import { AnalysisList } from "./components/analysis-list";
import { AnalysisOverview } from "./components/analysis-overview";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnalysisFilters } from "./components/analysis-filters";

export const Analysis = () => {
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Marketing Mix Modeling</h1>
          <p className="text-muted-foreground">
            Modelos avanzados para optimizar la asignación de presupuesto de
            marketing
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/marketing-mix-modeling/new">
            <Brain /> Crear un nuevo análisis
          </Link>
        </Button>
      </div>
      <AnalysisOverview />
      <Card>
        <CardHeader>
          <CardTitle>Análisis Recientes</CardTitle>
          <CardDescription>
            Historial de modelos de Marketing Mix ejecutados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <AnalysisFilters />
          <AnalysisList />
        </CardContent>
      </Card>
    </div>
  );
};
