"use client";

import { DataTable } from "@/components/data-table";
import { useAssignments } from "../hooks/useAssignments";
import { useCreateAssignment } from "../hooks/useCreateAssignment";
import { ColumnDef } from "@tanstack/react-table";
import { useAssignmentStore } from "../store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const AssignmentsList = () => {
  const { data: assignments = [], isLoading, isError } = useAssignments();
  const user = useAssignmentStore((state) => state.user);
  const { mutate } = useCreateAssignment();

  const filteredClients = assignments.filter((assignment) =>
    user?.client_id?.includes(String(assignment.id))
  );


  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error loading clients.</div>;
  }

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "Id",
    },
    {
      accessorKey: "name",
      header: "Nombre",
    },
    {
      accessorKey: "description",
      header: "Descripción",
    },
    // {
    //   accessorKey: "createdAt",
    //   header: "Fecha de Asignación",
    // },
    {
      accessorKey: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const { openDeleteAssignmentModal } = useAssignmentStore();
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => openDeleteAssignmentModal(row.original)}
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
        <CardTitle>Lista de Clientes Asignados</CardTitle>
        <CardDescription>
          Gestiona los clientes asignados del usuario
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={filteredClients} showTotals={false} />
      </CardContent>
    </Card>
  );
};
