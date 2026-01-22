// biome-ignore-all lint/suspicious/noDebugger: its intentional

"use client";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/utils/formatters";
import { Button } from "./ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  showTotals?: boolean;
}

export function DataTable<TData, TValue>({ columns, data, showTotals = true }: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Función para calcular totales solo para columnas numéricas
  const calculateTotals = () => {
    if (!data.length) return {};

    const totals: Record<string, number> = {};

    columns.forEach((column) => {
      const accessorKey = (column as any).accessorKey;
      if (!accessorKey) return;

      // Verificar si la columna contiene datos numéricos
      const sampleValue = data[0]?.[accessorKey as keyof TData];
      if (typeof sampleValue === "number") {
        // Calcular la suma para columnas numéricas
        const sum = data.reduce((acc, row) => {
          const value = row[accessorKey as keyof TData] as number;
          return acc + (typeof value === "number" ? value : 0);
        }, 0);

        totals[accessorKey] = sum;
      }
    });

    return totals;
  };

  const totals = calculateTotals();

  // Función para formatear valores de totales usando la definición de la columna
  const formatTotalValue = (column: ColumnDef<TData, TValue>, value: number) => {
    const cellRenderer = (column as any).cell;
    if (cellRenderer) {
      // Crear un contexto mock para el formatter
      const mockContext = {
        getValue: () => value,
        row: { original: {} },

        column: { id: (column as any).accessorKey },
      };

      try {
        return cellRenderer(mockContext);
      } catch (error) {
        console.log(error);
        // Fallback a formato de número básico
        return formatNumber(value);
      }
    }

    return formatNumber(value);
  };

  return (
    <div>
      <div className="overflow-hidden rounded-md border contain-inline-size">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
            {showTotals && data.length > 0 && (
              <TableRow className="bg-muted font-medium">
                {columns.map((column, index) => {
                  const accessorKey = (column as any).accessorKey;
                  const totalValue = totals[accessorKey];

                  return (
                    <TableCell key={column.id}>
                      {index === 0 ? "Total" : totalValue !== undefined ? formatTotalValue(column, totalValue) : "-"}
                    </TableCell>
                  );
                })}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex w-fit items-center justify-center text-sm font-medium">
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </div>
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Anterior
        </Button>

        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Siguiente
        </Button>
      </div>
    </div>
  );
}
