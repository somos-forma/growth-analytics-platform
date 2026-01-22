import { create } from "zustand";
import type { Client } from "../clients/types/client.type";
import type { User } from "../users/types/user.type";

type AsignmentStore = {
  user: User | null;
  client: Client | null;
  clientsId: string[];
  isOpenCreateAssignmentModal: boolean;
  isOpenDeleteAssignmentModal: boolean;
  openCreateAssignmentModal: () => void;
  closeCreateAssignmentModal: () => void;
  openDeleteAssignmentModal: (client: Client) => void;
  closeDeleteAssignmentModal: () => void;
  setSelectedUser: (user: User) => void;
};
export const useAssignmentStore = create<AsignmentStore>((set) => ({
  user: null,
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
  setSelectedUser: (user) =>
    set(() => ({
      user: user,
    })),
}));
