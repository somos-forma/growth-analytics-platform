import { create } from "zustand";
import { devtools } from "zustand/middleware";

type Variable = {
  id: string;
  label: string;
};
interface WizardState {
  step: number;
  next: () => void;
  back: () => void;
  data: {
    analysisName: string;
    analysisDescription: string;
    model: "meridian" | "robyn";
    dataSources: "integrate" | "locale";
    connections: {
      ga4: { check: boolean };
      meta_ads: { check: boolean };
      google_ads: { check: boolean };
    };

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
    estado?: string;
    user_id?: number;
    client_id?: number;
    id_run_gcp?: string;
    analysis_url?: string[];
    tiempo?: number;
    finished_at?: string;
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
      analysisName: "",
      analysisDescription: "",
      model: "meridian",
      dataSources: "integrate",
      dataDivisionMethod: "proportion",
      dataDivisionProportion: 80,
      channelSelected: [],
      contextualSelected: [],
      controlSelected: [],
      kpiSelected: [],
      organicSelected: [],
      connections: {
        ga4: { check: true },
        meta_ads: { check: true },
        google_ads: { check: true },
      },
      estado: "",
      user_id: undefined,
      client_id: undefined,
      id_run_gcp: "",
      analysis_url: [],
      tiempo: undefined,
      finished_at: "",
    },
    updateData: (partial) => set((state) => ({ data: { ...state.data, ...partial } })),
    resetAll: () =>
      set(() => ({
        step: 1,
        data: {
          analysisName: "",
          analysisDescription: "",
          model: "meridian",
          dataSources: "integrate",
          dataDivisionMethod: "proportion",
          channelSelected: [],
          contextualSelected: [],
          controlSelected: [],
          kpiSelected: [],
          organicSelected: [],
          connections: {
            ga4: { check: true },
            meta_ads: { check: true },
            google_ads: { check: true },
          },
          estado: "",
          user_id: undefined,
          client_id: undefined,
          id_run_gcp: "",
          analysis_url: [],
          tiempo: undefined,
          finished_at: "",
        },
      })),
  })),
);
