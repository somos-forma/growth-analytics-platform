import { create } from "zustand";

export type MeridianJobStatus = "DONE" | "QUEUED" | "ERROR" | "RUNNING";

type MeridianStatusStore = {
  statuses: MeridianJobStatus[];
  setStatuses: (statuses: MeridianJobStatus[]) => void;
  items: any[];
  setItems: (items: any[]) => void;
};

export const useMeridianStatusStore = create<MeridianStatusStore>((set) => ({
  statuses: [],
  setStatuses: (statuses) => set({ statuses }),
  items: [],
  setItems: (items) => set({ items }),
}));
