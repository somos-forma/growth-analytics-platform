"use client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useCreateAssignment } from "../hooks/useCreateAssignment";
import { useAssignmentStore } from "../store";

export const DeleteAssignmentModal = () => {
  const { client, closeDeleteAssignmentModal, user, setSelectedUser } = useAssignmentStore();
  const { mutate, isPending } = useCreateAssignment();
  const queryClient = useQueryClient();
  const handleDelete = () => {
    if (!client || !user || !user.id) return;
    const newClientIds = user.client_id?.filter((id) => id !== String(client.id)) || [];
    mutate(
      { id: user.id, clientsId: newClientIds },
      {
        onSuccess: () => {
          closeDeleteAssignmentModal();
          toast.success("Cliente eliminado exitosamente");
          setSelectedUser({ ...user, client_id: newClientIds });
          queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: () => {
          toast.error("Error al eliminar el cliente asignado");
        },
      },
    );
  };
  return (
    <Dialog open={true} onOpenChange={closeDeleteAssignmentModal}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Eliminar Asignación</DialogTitle>
          <DialogDescription>
            ¿Seguro que quieres eliminar este cliente asignado? <br /> Esta acción no se puede revertir.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4 justify-end">
          <Button onClick={() => closeDeleteAssignmentModal()}>Cancelar</Button>
          <Button variant="destructive" disabled={isPending} onClick={handleDelete}>
            {isPending && <Spinner />}
            Eliminar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
