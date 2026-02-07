import { useMutation, useQuery } from "@tanstack/react-query";
import { Rocket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useWizardStore } from "../wizard-store";

export const DataPreviewStep = () => {
  const router = useRouter();
  const back = useWizardStore((state) => state.back);
  const allData = useWizardStore((state) => state.data);
  const reset = useWizardStore((state) => state.resetAll);
  const [payload, setPayload] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const meridianMutation = useMutation({
    mutationFn: async (payload_gcs_uri: string) => {
      const response = await fetch("/api/meridian", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload_gcs_uri,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const error: any = new Error(errorData.message || "Error al iniciar el entrenamiento");
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Entrenamiento iniciado correctamente", {
        description: "Tu análisis está siendo procesado. Serás redirigido al dashboard.",
        duration: 4000,
      });
      reset();
      router.push("/dashboard/marketing-mix-modeling");
    },
    onError: (error: any) => {
      if (error.status === 429) {
        setErrorMessage(error.message || "Límite de entrenamientos alcanzado. Intenta más tarde.");
        setIsDialogOpen(true);
      } else {
        toast.error("Error al iniciar el entrenamiento");
      }
      console.error(error);
    },
  });

  const onSubmit = () => {
    meridianMutation.mutate(payload);
  };

  const {
    data: eda,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["eda"],
    queryFn: async () => {
      const mode =
        allData.method.proporcional.check === true
          ? "percent"
          : allData.method.fecha.check === true
            ? "dates"
            : undefined;

      const payload = {
        mode: mode,
        percent: allData.method.proporcional.pruebas,
        start_date: allData.method.fecha.from,
        end_date: allData.method.fecha.to,
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
      const data = await response.json();
      setPayload(data.meridian_payload_path);
      return data;
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
            <Button onClick={back} disabled={meridianMutation.isPending}>
              Anterior
            </Button>
            <Button onClick={onSubmit} disabled={meridianMutation.isPending || !payload}>
              {meridianMutation.isPending && <Spinner />}
              Empezar entrenamiento
              <Rocket />
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Límite de entrenamientos alcanzado</DialogTitle>
            <DialogDescription>{errorMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
