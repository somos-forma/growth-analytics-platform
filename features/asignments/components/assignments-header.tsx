"use client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAssignmentStore } from "../store";
import { CreateAssignmentModal } from "./create-assignment-modal";

export const AssignmentsHeader = () => {
  const openCreateAssignmentModal = useAssignmentStore((state) => state.openCreateAssignmentModal);
  const isOpenCreateAssignmentModal = useAssignmentStore((state) => state.isOpenCreateAssignmentModal);
  const closeCreateAssignmentModal = useAssignmentStore((state) => state.closeCreateAssignmentModal);
  const user = useAssignmentStore((state) => state.user);

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-bold">Clientes para {user?.name}</h1>
        <p className="text-muted-foreground">Administra los clientes asignados a este usuario.</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link href="/dashboard/users">Volver</Link>
        </Button>
        <Button onClick={openCreateAssignmentModal}>
          <Plus /> Asignar clientes a este usuario
        </Button>
      </div>
      {isOpenCreateAssignmentModal && <CreateAssignmentModal onClose={closeCreateAssignmentModal} />}
    </div>
  );
};
