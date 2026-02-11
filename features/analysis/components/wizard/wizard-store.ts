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

    method: {
      fecha: {
        to: string;
        from: string;
        check: boolean;
      };
      proporcional: {
        check: boolean;
        pruebas: number;
        entrenamiento: number;
      };
    };
    connectionsSelected: {
      ga4: { check: boolean };
      meta_ads: { check: boolean };
      google_ads: { check: boolean };
    };
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
      method: {
        fecha: {
          to: new Date().toISOString().split("T")[0],
          from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          check: false,
        },
        proporcional: {
          check: true,
          pruebas: 20,
          entrenamiento: 80,
        },
      },
      connectionsSelected: {
        ga4: { check: true },
        meta_ads: { check: true },
        google_ads: { check: true },
      },
      channelSelected: [
        { id: "impressions_google", label: "impressions_google" },
        { id: "impressions_meta", label: "impressions_meta" },
        { id: "cost_google", label: "cost_google" },
        { id: "cost_meta", label: "cost_meta" },
      ],
      contextualSelected: [],
      controlSelected: [
        { id: "usuarios", label: "usuarios" },
        { id: "sesiones", label: "sesiones" },
      ],
      kpiSelected: [{ id: "conversiones_paid", label: "conversiones_paid" }],
      organicSelected: [],

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
          method: {
            fecha: {
              to: new Date().toISOString().split("T")[0],
              from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              check: false,
            },
            proporcional: {
              check: true,
              pruebas: 20,
              entrenamiento: 80,
            },
          },
          integratedConnections: ["google_ads", "ga4", "meta_ads"],
          connectionsSelected: {
            ga4: { check: true },
            meta_ads: { check: true },
            google_ads: { check: true },
          },
          channelSelected: [
            { id: "impressions_google", label: "impressions_google" },
            { id: "impressions_meta", label: "impressions_meta" },
            { id: "cost_google", label: "cost_google" },
            { id: "cost_meta", label: "cost_meta" },
          ],
          contextualSelected: [],
          controlSelected: [
            { id: "usuarios", label: "usuarios" },
            { id: "sesiones", label: "sesiones" },
          ],
          kpiSelected: [{ id: "conversiones_paid", label: "conversiones_paid" }],
          organicSelected: [],

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
