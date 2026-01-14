import { create } from "zustand";
import { Client } from "../clients/types/client.type";

type AsignmentStore = {
  client: Client | null;
  clientsId: string[];
  isOpenCreateAssignmentModal: boolean;
  isOpenDeleteAssignmentModal: boolean;
  openCreateAssignmentModal: () => void;
  closeCreateAssignmentModal: () => void;
  openDeleteAssignmentModal: (client: Client) => void;
  closeDeleteAssignmentModal: () => void;
};
export const useAssignmentStore = create<AsignmentStore>((set) => ({
  client: null,
  clientsId: [],
  isOpenCreateAssignmentModal: false,
  isOpenDeleteAssignmentModal: false,
  openCreateAssignmentModal: () =>
    set(() => ({
      isOpenCreateAssignmentModal: true,
    })),
  closeCreateAssignmentModal: () =>
    set(() => ({
      isOpenCreateAssignmentModal: false,
    })),
  openDeleteAssignmentModal: (client) =>
    set(() => ({
      isOpenDeleteAssignmentModal: true,
      client: client,
    })),
  closeDeleteAssignmentModal: () =>
    set(() => ({
      isOpenDeleteAssignmentModal: false,
    })),
}));
