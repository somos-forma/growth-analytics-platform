import { Clock, DownloadIcon, FileTextIcon, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatTimeAgo } from "@/utils/formatters";
import type { Analysis } from "../types/analysis.type";

interface AnalysisCardProps {
  analysis: Analysis;
}
const statusText: Record<string, string> = {
  completed: "Completado",
  in_progress: "En Progreso",
  failed: "Fallido",
};

export const AnalysisCard = ({ analysis }: AnalysisCardProps) => {
  const { name, status, model, description, completedAgo, duration } = analysis;
  const statusValue = statusText[status];
  const statusBg: Record<string, string> = {
    completed: "bg-green-100 text-green-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between gap-4">
          <span className="font-medium">{name}</span>
          <Badge className={cn(statusBg[status])}>{statusValue}</Badge>
        </CardTitle>
        <div className="flex gap-3">
          <Badge>{model}</Badge>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock size={16} />
            {formatTimeAgo(completedAgo)}
          </p>
          <Tooltip>
            <TooltipTrigger>
              <p className="underline decoration-dashed underline-offset-2 flex items-center gap-1 text-sm text-muted-foreground">
                <Timer size={16} />
                {duration}
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
          <Button variant="outline" size="sm">
            <FileTextIcon />
            Ver Informe
          </Button>
          <Button variant="outline" size="sm">
            <DownloadIcon />
            Exportar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
