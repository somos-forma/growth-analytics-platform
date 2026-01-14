"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAssignmentStore } from "../store";
import { CreateAssignmentModal } from "./create-assignment-modal";

export const AssignmentsHeader = () => {
  const openCreateAssignmentModal = useAssignmentStore(
    (state) => state.openCreateAssignmentModal
  );
  const isOpenCreateAssignmentModal = useAssignmentStore(
    (state) => state.isOpenCreateAssignmentModal
  );
  const closeCreateAssignmentModal = useAssignmentStore(
    (state) => state.closeCreateAssignmentModal
  );

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-bold">Clientes para John Doe</h1>
        <p className="text-muted-foreground">
          Administra los clientes asignados a este usuario.
        </p>
      </div>
      <Button onClick={openCreateAssignmentModal}>
        <Plus /> Asignar clientes a este usuario
      </Button>
      {isOpenCreateAssignmentModal && (
        <CreateAssignmentModal onClose={closeCreateAssignmentModal} />
      )}
    </div>
  );
};
