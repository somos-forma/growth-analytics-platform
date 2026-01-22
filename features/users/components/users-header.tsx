"use client";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "../store";
import { CreateUserModal } from "./create-user-modal";

export const UsersHeader = () => {
  const { isOpenCreateUserModal, openCreateUserModal, closeCreateUserModal } = useUserStore();
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-bold">Usuarios</h1>
        <p className="text-muted-foreground">Administra los usuarios de la aplicación.</p>
      </div>
      <Button onClick={openCreateUserModal}>
        <Plus /> Agregar Usuario
      </Button>
      {isOpenCreateUserModal && <CreateUserModal onClose={closeCreateUserModal} />}
    </div>
  );
};
