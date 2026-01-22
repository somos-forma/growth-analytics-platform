"use client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useClientStore } from "../store";
import { UpdateClientForm } from "./update-client-form";

export const EditClientModal = () => {
  const { closeEditClientModal } = useClientStore();
  return (
    <Dialog open={true} onOpenChange={closeEditClientModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>Aquí va el formulario para editar un cliente existente.</DialogDescription>
        </DialogHeader>
        <UpdateClientForm />
      </DialogContent>
    </Dialog>
  );
};
