import { Clock, FileTextIcon, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatStatus, formatTimeAgo } from "@/utils/formatters";
import type { Analysis } from "../types/analysis.type";

interface AnalysisCardProps {
  analysis: Analysis;
}

export const AnalysisCard = ({ analysis }: AnalysisCardProps) => {
  const { analysis_url, created_at, description, finished_at, name, status, tiempo } = analysis;
  const statusBg: Record<string, string> = {
    DONE: "bg-green-100 text-green-800",
    QUEUED: "bg-yellow-100 text-yellow-800",
    RUNNING: "bg-blue-100 text-blue-800",
    ERROR: "bg-red-100 text-red-800",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between gap-4">
          <span className="font-medium">Analisis de Campaña {name}</span>
          <Badge className={cn(statusBg[status])}>{formatStatus(status)}</Badge>
        </CardTitle>
        <div className="flex gap-3">
          <Badge>Meridian</Badge>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock size={16} />
            {formatTimeAgo(finished_at || created_at)}
          </p>
          <Tooltip>
            <TooltipTrigger>
              <p className="underline decoration-dashed underline-offset-2 flex items-center gap-1 text-sm text-muted-foreground">
                {formatStatus(status) === "Completado" ? (
                  <>
                    <Timer size={16} /> {tiempo} minutos
                  </>
                ) : (
                  ""
                )}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tiempo de ejecución</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-muted-foreground text-sm">{description}</p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={formatStatus(status) !== "Completado"}
            onClick={() => {
              const url = analysis_url[0];
              if (url) window.open(url, "_blank");
            }}
          >
            <FileTextIcon />
            Ver Reporte 1
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={formatStatus(status) !== "Completado"}
            onClick={() => {
              const url = analysis_url[1];
              if (url) window.open(url, "_blank");
            }}
          >
            <FileTextIcon />
            Ver Reporte 2
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
