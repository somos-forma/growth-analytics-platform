"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

interface EdaResponse {
  run_name: string;
  gcs_folder: string;
  files: {
    costos: string;
    impresiones: string;
    clicks: string;
    kpis: string;
    correlacion_A: string;
    correlacion_B: string;
  };
}

export default function ExamplePage() {
  const [data, setData] = useState<EdaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/analytics/eda", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mode: "percent",
            percent: 50,
            media_fields: [
              "cost_google",
              "impressions_google",
              "clicks_google",
              "cost_meta",
              "impressions_meta",
              "clicks_meta",
            ],
            control_fields: ["usuarios", "sesiones", "users_organic", "sessions_organic"],
            include_correlation: true,
            include_contextual: true,
            include_kpi: true,
            correlation_fields_extra: [],
          }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>No Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Example - EDA Analysis</h1>
        <p className="text-muted-foreground mt-2">
          Run: {data.run_name} | Folder: {data.gcs_folder}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Costos */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Costos</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <iframe src={data.files.costos} className="w-full h-[500px] border-0" title="Costos" />
          </CardContent>
        </Card>

        {/* Impresiones */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Impresiones</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <iframe src={data.files.impresiones} className="w-full h-[500px] border-0" title="Impresiones" />
          </CardContent>
        </Card>

        {/* Clicks */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Clicks</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <iframe src={data.files.clicks} className="w-full h-[500px] border-0" title="Clicks" />
          </CardContent>
        </Card>

        {/* KPIs */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>KPIs</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <iframe src={data.files.kpis} className="w-full h-[500px] border-0" title="KPIs" />
          </CardContent>
        </Card>

        {/* Correlación A */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Correlación A</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <iframe src={data.files.correlacion_A} className="w-full h-[500px] border-0" title="Correlación A" />
          </CardContent>
        </Card>

        {/* Correlación B */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Correlación B</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <iframe src={data.files.correlacion_B} className="w-full h-[500px] border-0" title="Correlación B" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
