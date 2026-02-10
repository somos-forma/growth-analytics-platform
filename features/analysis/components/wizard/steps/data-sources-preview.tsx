import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/utils/formatters";
import { useWizardStore } from "../wizard-store";

export const DataSourcesPreviewStep = () => {
  const dataSources = useWizardStore((state) => state.data.dataSources);

  const back = useWizardStore((state) => state.back);
  const next = useWizardStore((state) => state.next);

  return (
    <div className="space-y-5 max-w-[800px]">
      <p className="font-medium">Vista previa de la fuente {dataSources === "integrate" ? "integrada" : "local"}</p>
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
    data: queryData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["preview-data", data.method],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (data.method.proporcional.check) {
        params.set("mode", "percent");
        params.set("percent", data.method.proporcional.entrenamiento.toString());
      } else if (data.method.fecha.check) {
        params.set("mode", "dates");
        params.set("start_date", data.method.fecha.from);
        params.set("end_date", data.method.fecha.to);
      } else {
        throw new Error("Invalid method");
      }

      const response = await fetch(`/api/sources?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch preview data");
      }
      return response.json();
    },
    enabled: !!data.method,
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError) {
    return <div>Error al cargar los datos de vista previa.</div>;
  }

  if (!queryData) {
    return <div>No hay datos disponibles.</div>;
  }

  const dynamicColumns: ColumnDef<any>[] = queryData.columns.map((col: string) => ({
    accessorKey: col,
    header: col.charAt(0).toUpperCase() + col.slice(1),
    cell: ({ getValue }) => {
      const value = getValue();
      return typeof value === "number" ? formatNumber(value) : value;
    },
  }));

  return (
    <div>
      {/* <p className="mb-4">Tabla: {queryData.table}</p> */}
      <DataTable data={queryData.rows} columns={dynamicColumns} showTotals={false} />
    </div>
  );
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

  return (
    <div className="space-y-6 max-w-[800px]">
      <DataTable data={data} columns={columns} showTotals={false} />
    </div>
  );
};
