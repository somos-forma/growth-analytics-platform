export type IntegrationStatus =
  | "connected"
  | "paused"
  | "error"
  | "disconnected";

export interface Integration {
  id: string;
  name: string;
  key: string;
  description?: string;
  status: IntegrationStatus;
  iconUrl?: string;
  lastSyncedAt?: string;
  actions: IntegrationAction[];
}

export interface IntegrationAction {
  label: string; // "Conectar", "Pausar", etc.
  action: "connect" | "pause" | "resume" | "retry" | "disconnect";
  disabled?: boolean;
}
