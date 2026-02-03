import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Rocket } from "lucide-react";
import type React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWizardStore } from "../wizard-store";

export const DataPreviewStep = () => {
  const back = useWizardStore((state) => state.back);
  const allData = useWizardStore((state) => state.data);

  const onSubmit = () => {
    toast("Enviaste los siguientes valores:", {
      description: (
        <pre className="bg-code text-code-foreground rounded-md p-4 h-[400px] overflow-x-hidden overflow-y-auto">
          <code>{JSON.stringify(allData, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2 ",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
        width: "420px",
      } as React.CSSProperties,
    });
  };

  const {
    data: eda,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["eda"],
    queryFn: async () => {
      const mode = allData.dataDivisionMethod === "proportion" ? "percent" : "dates";

      const payload = {
        mode: mode,
        percent: allData.dataDivisionProportion,
        start_date: allData?.dataDivisionDate
          ? format(allData?.dataDivisionDate?.startDate ?? "", "yyyy-MM-dd")
          : undefined,
        end_date: allData?.dataDivisionDate
          ? format(allData?.dataDivisionDate?.endDate ?? "", "yyyy-MM-dd")
          : undefined,
        media_fields: allData.channelSelected.map((item) => item.id),
        control_fields: allData.controlSelected
          .map((item) => item.id)
          .concat(allData.organicSelected.map((item) => item.id)),
        contextual_fields: allData.contextualSelected.map((item) => item.id),
        kpi_fields: allData.kpiSelected.map((item) => item.id),
        include_correlation: true,
        include_contextual: true,
        include_kpi: true,
        correlation_fields_extra: [],
      };

      const response = await fetch("/api/analytics/eda", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  if (isPending) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader>
              <div className="h-6 bg-muted animate-pulse rounded w-1/3" />
            </CardHeader>
            <CardContent>
              <div className="h-[500px] bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    console.log(error);
    return <div>Error al cargar el análisis exploratorio de datos.</div>;
  }

  return (
    <div>
      <div className="space-y-6">
        <div className="flex justify-end">
          <div className="space-x-4">
            <Button onClick={back}>Anterior</Button>
            <Button onClick={onSubmit}>
              Empezar entrenamiento <Rocket />
            </Button>
          </div>
        </div>
        <div>
          <p className="text-muted-foreground hidden">
            Run: {eda.run_name} | Folder: {eda.gcs_folder}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Costos */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Costos</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <iframe src={eda.files.costos} className="w-full h-[500px] border-0" title="Costos" />
            </CardContent>
          </Card>

          {/* Impresiones */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Impresiones</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <iframe src={eda.files.impresiones} className="w-full h-[500px] border-0" title="Impresiones" />
            </CardContent>
          </Card>

          {/* Clicks */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Clicks</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <iframe src={eda.files.clicks} className="w-full h-[500px] border-0" title="Clicks" />
            </CardContent>
          </Card>

          {/* KPIs */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>KPIs</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <iframe src={eda.files.kpis} className="w-full h-[500px] border-0" title="KPIs" />
            </CardContent>
          </Card>

          {/* Correlación A */}
          <Card className="overflow-hidden col-span-2">
            <CardHeader>
              <CardTitle>Correlación A</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <iframe src={eda.files.correlacion_A} className="w-full h-[800px] border-0" title="Correlación A" />
            </CardContent>
          </Card>

          {/* Correlación B */}
          <Card className="overflow-hidden col-span-2">
            <CardHeader>
              <CardTitle>Correlación B</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <iframe src={eda.files.correlacion_B} className="w-full h-[800px] border-0" title="Correlación B" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
