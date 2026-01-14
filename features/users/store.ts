import { create } from "zustand";
import { User } from "./types/user.type";

type UserStore = {
  user: User | null;
  isOpenCreateUserModal: boolean;
  isOpenDeleteUserModal: boolean;
  isOpenEditUserModal: boolean;
  openCreateUserModal: () => void;
  closeCreateUserModal: () => void;
  openDeleteUserModal: (user: User) => void;
  closeDeleteUserModal: () => void;
  openEditUserModal: (user: User) => void;
  closeEditUserModal: () => void;
};
export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isOpenCreateUserModal: false,
  isOpenDeleteUserModal: false,
  isOpenEditUserModal: false,
  openEditUserModal: (user) =>
    set(() => ({
      isOpenEditUserModal: true,
      user,
    })),
  closeEditUserModal: () =>
    set(() => ({
      isOpenEditUserModal: false,
      user: null,
    })),
  openCreateUserModal: () =>
    set(() => ({
      isOpenCreateUserModal: true,
    })),
  closeCreateUserModal: () =>
    set(() => ({
      isOpenCreateUserModal: false,
    })),
  openDeleteUserModal: (user) =>
    set(() => ({
      isOpenDeleteUserModal: true,
      user,
    })),
  closeDeleteUserModal: () =>
    set(() => ({
      isOpenDeleteUserModal: false,
      user: null,
    })),
}));
