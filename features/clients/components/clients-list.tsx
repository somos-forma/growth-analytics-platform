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
      accessorKey: "website_url",
      header: "URL del Sitio Web",
      cell: ({ row }) => row.original.website_url || "N/A",
    },
    {
      accessorKey: "gcp_id",
      header: "GCP ID",
    },
    {
      id: "sources",
      header: "Fuentes",
      cell: ({ row }) => {
        const sources = row.original.source[0]?.sources;
        if (!sources) return <span>N/A</span>;
        const activeSources = [];
        if (sources.ga4.check) activeSources.push(`GA4: ${sources.ga4.value}`);
        if (sources.google_ads.check) activeSources.push(`Google Ads: ${sources.google_ads.value}`);
        if (sources.meta_ads.check) activeSources.push(`Meta Ads: ${sources.meta_ads.value}`);
        return <span>{activeSources.join(", ") || "Ninguna"}</span>;
      },
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
