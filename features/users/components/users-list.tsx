"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAssignmentStore } from "@/features/asignments/store";
import { useUsers } from "../hooks/useUsers";
import { useUserStore } from "../store";
import type { User } from "../types/user.type";

export const UsersList = () => {
  const { data: users = [], isLoading, isError } = useUsers();
  const { openDeleteUserModal, openEditUserModal } = useUserStore();
  const { setSelectedUser } = useAssignmentStore();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error loading users.</div>;
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "rol",
      header: "Rol",
    },
    {
      accessorKey: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              {row.original.rol === "admin" && (
                <Link
                  href={`/dashboard/users/${row.original.id}/clients`}
                  onClick={() => setSelectedUser(row.original)}
                >
                  Ver clientes asignados
                </Link>
              )}
            </Button>
            <Button onClick={() => openEditUserModal(row.original)}>Editar</Button>

            <Button onClick={() => openDeleteUserModal(row.original)} variant="destructive">
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
        <CardTitle>Lista de Usuarios</CardTitle>
        <CardDescription>Gestiona los usuarios de la plataforma</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={users} showTotals={false} />
      </CardContent>
    </Card>
  );
};
