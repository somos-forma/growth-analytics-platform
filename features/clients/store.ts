import { create } from "zustand";
import type { Client } from "./types/client.type";

type ClientStore = {
  client: Client | null;
  isOpenCreateClientModal: boolean;
  isOpenDeleteClientModal: boolean;
  isOpenEditClientModal: boolean;
  openCreateClientModal: () => void;
  closeCreateClientModal: () => void;
  openDeleteClientModal: (client: Client) => void;
  closeDeleteClientModal: () => void;
  openEditClientModal: (client: Client) => void;
  closeEditClientModal: () => void;
};
export const useClientStore = create<ClientStore>((set) => ({
  client: null,
  isOpenCreateClientModal: false,
  isOpenDeleteClientModal: false,
  isOpenEditClientModal: false,
  openEditClientModal: (client) =>
    set(() => ({
      isOpenEditClientModal: true,
      client,
    })),
  closeEditClientModal: () =>
    set(() => ({
      isOpenEditClientModal: false,
      client: null,
    })),
  openCreateClientModal: () =>
    set(() => ({
      isOpenCreateClientModal: true,
    })),
  closeCreateClientModal: () =>
    set(() => ({
      isOpenCreateClientModal: false,
    })),
  openDeleteClientModal: (client) =>
    set(() => ({
      isOpenDeleteClientModal: true,
      client,
    })),
  closeDeleteClientModal: () =>
    set(() => ({
      isOpenDeleteClientModal: false,
      client: null,
    })),
}));
