"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAssignmentStore } from "../store";
import { Button } from "@/components/ui/button";
import { useDeleteAssignment } from "../hooks/useDeleteAssignment";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export const DeleteAssignmentModal = () => {
  const { client, closeDeleteAssignmentModal } = useAssignmentStore();
  const { mutate, isPending } = useDeleteAssignment();
  const handleDelete = () => {
    if (!client) return;
    mutate(client.id, {
      onSuccess: () => {
        closeDeleteAssignmentModal();
      },
      onError: () => {
        toast.error("Error al eliminar el cliente asignado");
      },
    });
  };
  return (
    <Dialog open={true} onOpenChange={closeDeleteAssignmentModal}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Eliminar Asignación</DialogTitle>
          <DialogDescription>
            ¿Seguro que quieres eliminar este cliente asignado? <br /> Esta
            acción no se puede revertir.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4 justify-end">
          <Button onClick={() => closeDeleteAssignmentModal()}>Cancelar</Button>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending && <Spinner />}
            Eliminar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
