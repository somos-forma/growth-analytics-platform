"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateAssignmentForm } from "./create-assignment-form";

type AssignmentClientModalProps = {
  onClose: () => void;
};

export const CreateAssignmentModal = ({
  onClose,
}: AssignmentClientModalProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Asignar clientes al usuario</DialogTitle>
          <DialogDescription>
            Selecciona uno o más clientes para asignarlos al usuario.
          </DialogDescription>
        </DialogHeader>
        <CreateAssignmentForm />
      </DialogContent>
    </Dialog>
  );
};
