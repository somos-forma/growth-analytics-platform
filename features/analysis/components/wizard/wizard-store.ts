import { create } from "zustand";
import { devtools } from "zustand/middleware";

type Variable = {
  id: string;
  label: string;
};

type Connection = {
  check: boolean;
};

type Connections = {
  ga4: Connection;
  meta_ads: Connection;
  google_ads: Connection;
};
interface WizardState {
  step: number;
  next: () => void;
  back: () => void;
  data: {
    name: string;
    description: string;
    model: "meridian" | "robyn";
    source: "integradas" | "local";
    connections: Connections;
    dataDivisionMethod: "proportion" | "date";
    dataDivisionProportion?: number;
    dataDivisionDate?: {
      startDate: string;
      endDate: string;
    };
    integratedConnections?: string[];
    localConnections?: File | null;

    channelSelected: Variable[];
    contextualSelected: Variable[];
    controlSelected: Variable[];
    kpiSelected: Variable[];
    organicSelected: Variable[];
  };
  updateData: (partial: Partial<WizardState["data"]>) => void;
  resetAll: () => void;
}

export const useWizardStore = create<WizardState>()(
  devtools((set) => ({
    step: 1,
    next: () => set((state) => ({ step: state.step + 1 })),
    back: () => set((state) => ({ step: state.step - 1 })),
    data: {
      name: "",
      description: "",
      model: "meridian",
      source: "integradas",
      dataDivisionMethod: "proportion",
      dataDivisionProportion: 80,
      channelSelected: [],
      contextualSelected: [],
      controlSelected: [],
      kpiSelected: [],
      organicSelected: [],
      connections: {
        ga4: {
          check: true,
        },
        meta_ads: {
          check: false,
        },
        google_ads: {
          check: false,
        },
      },
    },
    updateData: (partial) => set((state) => ({ data: { ...state.data, ...partial } })),
    resetAll: () =>
      set(() => ({
        step: 1,
        data: {
          name: "",
          description: "",
          model: "meridian",
          source: "integradas",
          dataDivisionMethod: "proportion",
          channelSelected: [],
          contextualSelected: [],
          controlSelected: [],
          kpiSelected: [],
          organicSelected: [],
          connections: {
            ga4: {
              check: true,
            },
            meta_ads: {
              check: false,
            },
            google_ads: {
              check: false,
            },
          },
        },
      })),
  })),
);
