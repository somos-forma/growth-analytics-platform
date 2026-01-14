import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { useWizardStore } from "../wizard-store";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

type TableData = {
  id: number;
  type: string;
  name: string;
  rowCount: number;
  columnsCount: number;
  createdAt?: string;
  modifiedAt?: string;
};

const columns: ColumnDef<TableData>[] = [
  {
    accessorKey: "type",
    header: "Tipo",
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "rowCount",
    header: "Filas",
  },
  {
    accessorKey: "columnsCount",
    header: "Columnas",
  },
  {
    accessorKey: "createdAt",
    header: "Creado",
  },
  {
    accessorKey: "modifiedAt",
    header: "Modificado",
  },
];

export const DataSourcesPreviewStep = () => {
  const dataSources = useWizardStore((state) => state.data.dataSources);
  const data = useWizardStore((state) => state.data);
  const back = useWizardStore((state) => state.back);
  const next = useWizardStore((state) => state.next);

  return (
    <div className="space-y-5">
      <p className="font-medium">
        Vista previa de la fuente{" "}
        {dataSources === "integrate" ? "integrada" : "local"}
      </p>
      {dataSources === "integrate" ? <IntegrateTable /> : <LocalTable />}
      <div className="space-x-4">
        <Button onClick={back}>Anterior</Button>
        <Button onClick={next}>Siguiente</Button>
      </div>
    </div>
  );
};

const IntegrateTable = () => {
  const data = useWizardStore((state) => state.data);
  const {
    data: queryData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["fetch-sql-tables", data],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Return fake SQL tables data
      return [
        {
          id: 1,
          type: "integrada",
          name: "users",
          rowCount: 1500,
          columnsCount: 10,
          createdAt: "2023-01-01",
          modifiedAt: "2023-01-10",
        },
        {
          id: 2,
          type: "integrada",
          name: "orders",
          rowCount: 3200,
          columnsCount: 8,
          createdAt: "2023-02-01",
          modifiedAt: "2023-02-10",
        },
        {
          id: 3,
          type: "integrada",
          name: "products",
          rowCount: 450,
          columnsCount: 12,
          createdAt: "2023-03-01",
          modifiedAt: "2023-03-10",
        },
        {
          id: 4,
          type: "integrada",
          name: "customers",
          rowCount: 2750,
          columnsCount: 9,
          createdAt: "2023-04-01",
          modifiedAt: "2023-04-10",
        },
        {
          id: 5,
          type: "integrada",
          name: "invoices",
          rowCount: 980,
          columnsCount: 11,
          createdAt: "2023-05-01",
          modifiedAt: "2023-05-10",
        },
        {
          id: 6,
          type: "integrada",
          name: "payments",
          rowCount: 1340,
          columnsCount: 7,
          createdAt: "2023-06-01",
          modifiedAt: "2023-06-10",
        },
        {
          id: 7,
          type: "integrada",
          name: "shipments",
          rowCount: 760,
          columnsCount: 6,
          createdAt: "2023-07-01",
          modifiedAt: "2023-07-10",
        },
        {
          id: 8,
          type: "integrada",
          name: "suppliers",
          rowCount: 2150,
          columnsCount: 8,
          createdAt: "2023-08-01",
          modifiedAt: "2023-08-10",
        },
      ];
    },
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError) {
    return <div>Error al cargar los datos.</div>;
  }

  return <DataTable data={queryData} columns={columns} showTotals={false} />;
};

const LocalTable = () => {
  const data = [
    {
      id: 1,
      type: "local",
      name: "users",
      rowCount: 1500,
      columnsCount: 10,
      createdAt: "2023-01-01",
      modifiedAt: "2023-01-10",
    },
    {
      id: 2,
      type: "local",
      name: "orders",
      rowCount: 3200,
      columnsCount: 8,
      createdAt: "2023-02-01",
      modifiedAt: "2023-02-10",
    },
    {
      id: 3,
      type: "local",
      name: "products",
      rowCount: 450,
      columnsCount: 12,
      createdAt: "2023-03-01",
      modifiedAt: "2023-03-10",
    },
  ];
  type TableData = {
    id: number;
    type: string;
    name: string;
    rowCount: number;
    columnsCount: number;
    createdAt?: string;
    modifiedAt?: string;
  };
  const columns: ColumnDef<TableData>[] = [
    {
      accessorKey: "type",
      header: "Tipo",
    },
    {
      accessorKey: "name",
      header: "Nombre",
    },
    {
      accessorKey: "rowCount",
      header: "Filas",
    },
    {
      accessorKey: "columnsCount",
      header: "Columnas",
    },
    {
      accessorKey: "createdAt",
      header: "Creado",
    },
    {
      accessorKey: "modifiedAt",
      header: "Modificado",
    },
  ];

  return <DataTable data={data} columns={columns} showTotals={false} />;
};
