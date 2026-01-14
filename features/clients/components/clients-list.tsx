"use client";

import { DataTable } from "@/components/data-table";
import { useClients } from "../hooks/useClients";
import { Client } from "../types/client.type";
import { ColumnDef } from "@tanstack/react-table";
import { useClientStore } from "../store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const ClientsList = () => {
  const { data: clients = [], isLoading, isError } = useClients();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error loading clients.</div>;
  }

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Nombre",
    },
    {
      accessorKey: "description",
      header: "Descripción",
    },

    {
      accessorKey: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const { openDeleteClientModal, openEditClientModal } = useClientStore();
        return (
          <div className="flex gap-2">
            <Button onClick={() => openEditClientModal(row.original)}>
              Editar
            </Button>
            <Button
              onClick={() => openDeleteClientModal(row.original)}
              variant="destructive"
            >
              Eliminar
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Clientes</CardTitle>
        <CardDescription>
          Gestiona los clientes de la plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={clients} showTotals={false} />
      </CardContent>
    </Card>
  );
};
