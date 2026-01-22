"use client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteClient } from "../hooks/useDeleteClient";
import { useClientStore } from "../store";

export const DeleteClientModal = () => {
  const { client, closeDeleteClientModal } = useClientStore();
  const { mutate, isPending } = useDeleteClient();
  const handleDelete = () => {
    if (!client) return;
    mutate(client.id, {
      onSuccess: () => {
        closeDeleteClientModal();
        toast.success("Cliente eliminado exitosamente");
      },
      onError: () => {
        toast.error("Error ");
        toast.error("Error al eliminar el cliente");
      },
    });
  };
  return (
    <Dialog open={true} onOpenChange={closeDeleteClientModal}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Eliminar Cliente</DialogTitle>
          <DialogDescription>
            ¿Seguro que quieres eliminar este cliente? <br /> Esta acción no se puede revertir.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4 justify-end">
          <Button onClick={() => closeDeleteClientModal()}>Cancelar</Button>
          <Button variant="destructive" disabled={isPending} onClick={handleDelete}>
            {isPending && <Spinner />}
            Eliminar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
