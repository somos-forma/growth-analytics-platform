"use client";

import { DeleteUserModal } from "./components/delete-user-modal";
import { EditUserModal } from "./components/edit-user-modal";
import { UsersHeader } from "./components/users-header";
import { UsersList } from "./components/users-list";
import { useUserStore } from "./store";

export const Users = () => {
  const { isOpenDeleteUserModal, user, isOpenEditUserModal } = useUserStore();
  return (
    <div className="space-y-5">
      <UsersHeader />
      <UsersList />
      {isOpenDeleteUserModal && user && <DeleteUserModal />}
      {isOpenEditUserModal && user && <EditUserModal />}
    </div>
  );
};
