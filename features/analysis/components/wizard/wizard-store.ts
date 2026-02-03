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
        },
      })),
  })),
);
