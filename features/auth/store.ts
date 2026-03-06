import { create } from "zustand";
import type { Auth } from "./types/auth.type";

type AuthStore = {
  authStore: Auth | null;
  setAuthStore: (auth: Auth) => void;
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  authStore: null,
  setAuthStore: (auth: Auth) => set({ authStore: auth }),
  selectedClientId: "",
  setSelectedClientId: (id: string) => set({ selectedClientId: id }),
}));
