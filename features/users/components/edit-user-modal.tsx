"use client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUserStore } from "../store";
import { UpdateUserForm } from "./update-user-form";

export const EditUserModal = () => {
  const { closeEditUserModal } = useUserStore();
  return (
    <Dialog open={true} onOpenChange={closeEditUserModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>Aquí va el formulario para editar un usuario existente.</DialogDescription>
        </DialogHeader>
        <UpdateUserForm />
      </DialogContent>
    </Dialog>
  );
};
