"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateClientModal } from "./create-client-modal";
import { useClientStore } from "../store";

export const ClientsHeader = () => {
  const {
    isOpenCreateClientModal,
    openCreateClientModal,
    closeCreateClientModal,
  } = useClientStore();
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-bold">Clientes</h1>
        <p className="text-muted-foreground">
          Administra los clientes de la aplicación.
        </p>
      </div>
      <Button onClick={openCreateClientModal}>
        <Plus /> Agregar Cliente
      </Button>
      {isOpenCreateClientModal && (
        <CreateClientModal onClose={closeCreateClientModal} />
      )}
    </div>
  );
};
