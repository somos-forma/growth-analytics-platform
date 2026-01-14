"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateClientForm } from "./create-client-form";

type CreateClientModalProps = {
  onClose: () => void;
};

export const CreateClientModal = ({ onClose }: CreateClientModalProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Cliente</DialogTitle>
          <DialogDescription>
            Aquí va el formulario para crear un nuevo cliente.
          </DialogDescription>
        </DialogHeader>
        <CreateClientForm />
      </DialogContent>
    </Dialog>
  );
};
