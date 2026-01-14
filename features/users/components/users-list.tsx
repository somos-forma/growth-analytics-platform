"use client";

import { DataTable } from "@/components/data-table";
import { useUsers } from "../hooks/useUsers";
import { User } from "../types/user.type";
import { ColumnDef } from "@tanstack/react-table";
import { useUserStore } from "../store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export const UsersList = () => {
  const { data: users = [], isLoading, isError } = useUsers();
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
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const { openDeleteUserModal, openEditUserModal } = useUserStore();
        return (
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/users/${row.original.id}/clients`}>
                Ver clientes asignados
              </Link>
            </Button>
            <Button onClick={() => openEditUserModal(row.original)}>
              Edit
            </Button>

            <Button
              onClick={() => openDeleteUserModal(row.original)}
              variant="destructive"
            >
              Delete
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
        <CardDescription>
          Gestiona los usuarios de la plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={users} showTotals={false} />
      </CardContent>
    </Card>
  );
};
