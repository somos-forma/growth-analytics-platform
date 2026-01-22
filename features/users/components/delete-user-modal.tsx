"use client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteUser } from "../hooks/useDeleteUser";
import { useUserStore } from "../store";

export const DeleteUserModal = () => {
  const { user, closeDeleteUserModal } = useUserStore();
  const { mutate, isPending } = useDeleteUser();
  const queryClient = useQueryClient();
  const handleDelete = () => {
    if (!user) return;
    mutate(user.id, {
      onSuccess: () => {
        closeDeleteUserModal();
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    });
  };
  return (
    <Dialog open={true} onOpenChange={closeDeleteUserModal}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Eliminar Usuario</DialogTitle>
          <DialogDescription>
            ¿Seguro que quieres eliminar este usuario? <br /> Esta acción no se puede revertir.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4 justify-end">
          <Button onClick={() => closeDeleteUserModal()}>Cancelar</Button>
          <Button variant="destructive" disabled={isPending} onClick={handleDelete}>
            {isPending && <Spinner />}
            Eliminar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
