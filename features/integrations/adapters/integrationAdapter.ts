import type { Integration, IntegrationStatus } from "../types/integration.type";

export function getActionsByStatus(status: IntegrationStatus) {
  switch (status) {
    case "connected":
      return [
        { label: "Pausar", action: "pause" },
        { label: "Desconectar", action: "disconnect" },
      ];
    case "paused":
      return [
        { label: "Reanudar", action: "resume" },
        { label: "Desconectar", action: "disconnect" },
      ];
    case "error":
      return [
        { label: "Reintentar", action: "retry" },
        { label: "Desconectar", action: "disconnect" },
      ];
    default:
      return [{ label: "Conectar", action: "connect" }];
  }
}

export function integrationsAdapter(rawIntegrations: any): Integration[] {
  return rawIntegrations.map((raw: any) => ({
    id: raw.id,
    name: raw.name,
    key: raw.key,
    description: raw.description,
    status: raw.status,
    iconUrl: raw.iconUrl || "",
    lastSyncedAt: raw.lastSyncedAt,
    actions: getActionsByStatus(raw.status),
  }));
}
