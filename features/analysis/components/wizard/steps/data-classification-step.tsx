import { Box } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DndTransfer, type TransferItem } from "@/components/dnd-transfer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useWizardStore } from "../wizard-store";

export const DataClassificationStep = () => {
  const back = useWizardStore((state) => state.back);
  const next = useWizardStore((state) => state.next);
  const updateData = useWizardStore((state) => state.updateData);

  const channelSelected = useWizardStore((state) => state.data.channelSelected);
  const controlSelected = useWizardStore((state) => state.data.controlSelected);
  const kpiSelected = useWizardStore((state) => state.data.kpiSelected);
  const organicSelected = useWizardStore((state) => state.data.organicSelected);
  const contextualSelected = useWizardStore((state) => state.data.contextualSelected);

  const handleNext = () => {
    // Validar Canales de Medios: mínimo 2 impresiones y 2 costos (clicks opcionales)
    const costSelected = channelSelected.filter((item) => item.id.startsWith("cost_")).length;
    const impressionsSelected = channelSelected.filter((item) => item.id.startsWith("impressions_")).length;
    if (costSelected < 2 || impressionsSelected < 2) {
      toast.error("Selección de canales incompleta", {
        description: "Debe seleccionar al menos 2 variables de costo y 2 de impresiones en Canales de Medios.",
      });
      return;
    }

    // Validar Variables de Control: ambas obligatorias (usuarios y sesiones)
    const hasUsuarios = controlSelected.some((item) => item.id === "usuarios");
    const hasSesiones = controlSelected.some((item) => item.id === "sesiones");
    if (!hasUsuarios || !hasSesiones) {
      toast.error("Variables de control incompletas", {
        description: "Debe seleccionar ambas variables: usuarios y sesiones.",
      });
      return;
    }

    // Validar Variables de KPI: al menos una obligatoria
    if (!kpiSelected.length) {
      toast.error("Selección incompleta", {
        description: "Debe seleccionar al menos una variable de KPI.",
      });
      return;
    }

    next();
  };

  const [channelAvailable, setChannelAvailable] = useState<TransferItem[]>(
    [
      { id: "cost_google", label: "cost_google" },
      { id: "impressions_google", label: "impressions_google" },
      { id: "clicks_google", label: "clicks_google" },
      {
        id: "cost_meta",
        label: "cost_meta",
      },
      {
        id: "impressions_meta",
        label: "impressions_meta",
      },
      {
        id: "clicks_meta",
        label: "clicks_meta",
      },
    ].filter((item) => !channelSelected.some((selected) => selected.id === item.id)),
  );

  const [controlAvailable, setControlAvailable] = useState<TransferItem[]>(
    [
      { id: "usuarios", label: "usuarios" },
      { id: "sesiones", label: "sesiones" },
    ].filter((item) => !controlSelected.some((selected) => selected.id === item.id)),
  );

  const [kpiAvailable, setKpiAvailable] = useState<TransferItem[]>(
    [{ id: "conversiones_paid", label: "conversiones_paid" }].filter(
      (item) => !kpiSelected.some((selected) => selected.id === item.id),
    ),
  );

  const [organicAvailable, setOrganicAvailable] = useState<TransferItem[]>([
    { id: "users_organic", label: "users_organic" },
    { id: "sessions_organic", label: "sessions_organic" },
  ]);

  const [contextualAvailable, setContextualAvailable] = useState<TransferItem[]>([
    { id: "CPA_paid", label: "CPA_paid" },
  ]);

  const handleTransferChannel = (newAvailable: TransferItem[], newSelected: TransferItem[]) => {
    setChannelAvailable(newAvailable);
    updateData({ channelSelected: newSelected });
  };

  const handleTransferControl = (newAvailable: TransferItem[], newSelected: TransferItem[]) => {
    setControlAvailable(newAvailable);
    updateData({ controlSelected: newSelected });
  };

  const handleTransferKpi = (newAvailable: TransferItem[], newSelected: TransferItem[]) => {
    setKpiAvailable(newAvailable);
    updateData({ kpiSelected: newSelected });
  };

  const handleTransferOrganic = (newAvailable: TransferItem[], newSelected: TransferItem[]) => {
    setOrganicAvailable(newAvailable);
    updateData({ organicSelected: newSelected });
  };

  const handleTransferContextual = (newAvailable: TransferItem[], newSelected: TransferItem[]) => {
    setContextualAvailable(newAvailable);
    updateData({ contextualSelected: newSelected });
  };

  return (
    <div className="space-y-5 max-w-[800px]">
      <p className="font-medium">Clasificación de datos</p>
      <div className="grid grid-cols-2 gap-4">
        <Dialog>
          <DialogTrigger>
            <Card>
              <CardHeader>
                <div className="flex gap-2 items-center text-start">
                  <Box className="h-6 w-6" />
                  <div>
                    <CardTitle>Canales de medios</CardTitle>
                    <CardDescription>{channelSelected.length} variable seleccionadas</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex items-start flex-wrap gap-1">
                {channelSelected.map((item) => (
                  <Badge key={item.id} variant="secondary">
                    {item.label}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="md:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Canales de medios</DialogTitle>
              <DialogDescription>
                Son las variables de entrada de marketing pagado, que reflejan la inversión directa en cada canal.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5">
              <DndTransfer
                availableItems={channelAvailable}
                selectedItems={channelSelected}
                onTransfer={handleTransferChannel}
                availableTitle="Disponibles"
                selectedTitle="Seleccionadas"
              />
              <div className="text-sm">
                <p className="mb-2 text-muted-foreground">Canales digitales principales:</p>
                <div className="flex flex-wrap gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge>Google Ads</Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Search, Display, YouTube</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge>Meta Ads</Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Facebook, Instagram</p>
                    </TooltipContent>
                  </Tooltip>
                  <Badge>TikTok Ads</Badge>
                  <Badge>Otros</Badge>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger>
            <Card className="h-full">
              <CardHeader>
                <div className="flex gap-2 items-center text-start">
                  <Box className="h-6 w-6" />
                  <div>
                    <CardTitle>Variables contextuales</CardTitle>
                    <CardDescription>{contextualSelected.length} variable seleccionadas</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex items-start flex-wrap gap-1">
                {contextualSelected.map((item) => (
                  <Badge key={item.id} variant="secondary">
                    {item.label}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="md:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Variables contextuales</DialogTitle>
              <DialogDescription>
                Son variables que no dependen del marketing, pero que afectan el comportamiento de la demanda.
              </DialogDescription>
            </DialogHeader>
            <div>
              <DndTransfer
                availableItems={contextualAvailable}
                selectedItems={contextualSelected}
                onTransfer={handleTransferContextual}
                availableTitle="Disponibles"
                selectedTitle="Seleccionadas"
              />
              <div className="text-sm">
                <p className="mb-2 text-muted-foreground">Variables contextuales principales:</p>
                <div className="flex flex-wrap gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge>Eventos comerciales</Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cyber, Black Friday, Hot Sale, campañas estacionales</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge>Clima</Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Temperatura, LLuvias, Calor, Frio (si impactan en la categoría)</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge>Calendario</Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Feriados, Vacaciones escolares, Fines de semana largos</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge>Entorno macroeconómico</Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Inflación, Tipo de cambio, Poder adquisitivo (si se quiere enriquecer).</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger>
            <Card className="h-full">
              <CardHeader>
                <div className="flex gap-2 items-center text-start">
                  <Box className="h-6 w-6" />
                  <div>
                    <CardTitle>Variables de control</CardTitle>
                    <CardDescription>{controlSelected.length} variable seleccionadas</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex items-start flex-wrap gap-1">
                {controlSelected.map((item) => (
                  <Badge key={item.id} variant="secondary">
                    {item.label}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Variables de control</DialogTitle>
              <DialogDescription>
                Son variables internas que sirven para capturar el comportamiento base del sitio o negocio.
              </DialogDescription>
            </DialogHeader>
            <div>
              <DndTransfer
                availableItems={controlAvailable}
                selectedItems={controlSelected}
                onTransfer={handleTransferControl}
                availableTitle="Disponibles"
                selectedTitle="Seleccionadas"
              />
              <div className="text-sm">
                <p className="mb-2 text-muted-foreground">Variables de control principales:</p>
                <div className="flex flex-wrap gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge>Sesiones</Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Sesiones totales en el sitio</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge>Usuarios</Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Usuarios únicos</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge>Tasa</Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Tasa de conversión</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge>Stock</Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Stock / disponibilidad de producto (si aplica)</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge>Promociones propias</Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Descuentos, Bundles</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger>
            <Card className="h-full">
              <CardHeader>
                <div className="flex gap-2 items-center text-start">
                  <Box className="h-6 w-6" />
                  <div>
                    <CardTitle>Variables de KPI</CardTitle>
                    <CardDescription>{kpiSelected.length} variable seleccionadas</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex items-start flex-wrap gap-1">
                {kpiSelected.map((item) => (
                  <Badge key={item.id} variant="secondary">
                    {item.label}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Variables de KPI</DialogTitle>
              <DialogDescription>
                Es la variable de salida principal que el modelo busca explicar y descomponer.
              </DialogDescription>
            </DialogHeader>
            <div>
              <DndTransfer
                availableItems={kpiAvailable}
                selectedItems={kpiSelected}
                onTransfer={handleTransferKpi}
                availableTitle="Disponibles"
                selectedTitle="Seleccionadas"
              />
              <div className="text-sm">
                <p className="mb-2 text-muted-foreground">Variables de KPI principales:</p>
                <div className="flex flex-wrap gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge>Conversiones totales</Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ventas, Leads, Agendamientos</p>
                    </TooltipContent>
                  </Tooltip>
                  <Badge>Revenue / Ingresos</Badge>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge>Otro KPI </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Otro KPI central definido por negocio (ej. compras confirmadas).</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger>
            <Card className="h-full">
              <CardHeader>
                <div className="flex gap-2 items-center text-start">
                  <Box className="h-6 w-6" />
                  <div>
                    <CardTitle>Variables Orgánicas</CardTitle>
                    <CardDescription>{organicSelected.length} variable seleccionadas</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex items-start flex-wrap gap-1">
                {organicSelected.map((item) => (
                  <Badge key={item.id} variant="secondary">
                    {item.label}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Variables Orgánicas</DialogTitle>
              <DialogDescription>
                Reflejan la actividad no pagada de la marca, que también contribuye al resultado.
              </DialogDescription>
            </DialogHeader>
            <div>
              <DndTransfer
                availableItems={organicAvailable}
                selectedItems={organicSelected}
                onTransfer={handleTransferOrganic}
                availableTitle="Disponibles"
                selectedTitle="Seleccionadas"
              />
              <div className="text-sm">
                <p className="mb-2 text-muted-foreground">Variables de orgánicas principales:</p>
                <div className="flex flex-wrap gap-1">
                  <Badge>Tráfico orgánico al sitio web</Badge>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge>Impresiones orgánicas </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>SEO, social, email orgánico</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge>Volumen de búsqueda de marca </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>branded search</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge>Comunicaciones propias </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>newsletter, CRM orgánico</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-x-4">
        <Button onClick={back}>Anterior</Button>
        <Button onClick={handleNext}>Siguiente</Button>
      </div>
    </div>
  );
};
