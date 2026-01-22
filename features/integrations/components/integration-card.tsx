import { Pause, Play, PlugZap, RotateCcw, Unplug } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatTimeAgo } from "@/utils/formatters";
import { useIntegrationAction } from "../hooks/useIntegrationAction";
import type { Integration } from "../types/integration.type";

interface IntegrationCardProps {
  integration: Integration;
}
export const IntegrationCard = ({ integration }: IntegrationCardProps) => {
  const { mutate } = useIntegrationAction();
  const actionIcon: Record<string, React.ReactNode> = {
    connect: <PlugZap className="" />,
    pause: <Pause className="" />,
    resume: <Play className="" />,
    retry: <RotateCcw className="" />,
    disconnect: <Unplug className="" />,
  };

  const status: Record<string, string> = {
    connected: "Conectado",
    paused: "Pausado",
    error: "Error",
    disconnected: "Desconectado",
  };

  const statusColors: Record<string, string> = {
    connected: "bg-green-300 text-black",
    paused: "bg-yellow-200 text-black",
    error: "bg-red-200 text-black",
    disconnected: "bg-gray-200 text-black",
  };

  return (
    <Card key={integration.id}>
      <CardHeader>
        <div className="flex  justify-between items-center">
          <CardTitle className="flex gap-3 items-center">
            <Image
              src={integration.iconUrl || ""}
              alt={integration.name}
              width={40}
              height={40}
              className=" w-11 h-11"
            />
            {integration.name}
          </CardTitle>
          <Badge className={cn(statusColors[integration.status])}>{status[integration.status]}</Badge>
        </div>
        <CardDescription>{integration.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{formatTimeAgo(integration.lastSyncedAt)}</p>
        <div className="flex gap-2">
          {integration.actions.map((action) => (
            <Button
              key={action.action}
              disabled={action.disabled}
              variant="outline"
              className="mt-4"
              onClick={() => mutate({ integrationId: integration.id, action: action.action })}
            >
              {actionIcon[action.action]}
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
