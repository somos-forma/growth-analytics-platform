import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/utils/formatters";

type LeadsKeywords = {
  id: string;
  keywords: string;
  costs: number;
  impressions: number;
  clics: number;
  conversions: number;
  costs_conversion: number;
};

export const columns: ColumnDef<LeadsKeywords>[] = [
  {
    accessorKey: "keywords",
    header: "Palabra clave de búsqueda",
  },
  {
    accessorKey: "costs",
    header: "Coste",
    cell: ({ getValue }) => formatCurrency(getValue<number>()),
  },
  {
    accessorKey: "impressions",
    header: "Impresiones",
    cell: ({ getValue }) => formatNumber(getValue<number>()),
  },
  {
    accessorKey: "clics",
    header: "Clics",
    cell: ({ getValue }) => formatNumber(getValue<number>()),
  },
  {
    accessorKey: "conversions",
    header: "Conversiones",
    cell: ({ getValue }) => formatNumber(getValue<number>()),
  },
  {
    accessorKey: "costs_conversion",
    header: "Coste por Conversión",
    cell: ({ getValue }) => formatCurrency(getValue<number>()),
  },
];

// export const data: LeadsKeywords[] = [
//   {
//     id: "1",
//     keywords: "Keyword 1",
//     costs: 500,
//     impressions: 10000,
//     clics: 800,
//     conversions: 50,
//     costs_conversion: 10,
//   },
//   {
//     id: "2",
//     keywords: "Keyword 2",
//     costs: 700,
//     impressions: 15000,
//     clics: 1200,
//     conversions: 70,
//     costs_conversion: 10,
//   },
//   {
//     id: "3",
//     keywords: "Keyword 3",
//     costs: 600,
//     impressions: 12000,
//     clics: 900,
//     conversions: 60,
//     costs_conversion: 10,
//   },
// ];

export const LeadsKeywordsTable = ({ date }: { date: { from: string; to: string } }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["google-ads-indicators-keywords-table-leads", date.from, date.to],
    queryFn: async () => {
      const response = await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          table: "monthly_gads_top_keywords",
          filters: {
            event_date_between: [date.from, date.to],
          },
          limit: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const json = await response.json();
      const data = json.rows.map((raw: any, index: number) => ({
        id: String(index + 1),
        keywords: raw.palabra_clave,
        costs: raw.coste ?? 0,
        impressions: raw.impresiones ?? 0,
        clics: raw.clics ?? 0,
        conversions: raw.conversiones ?? 0,
        costs_conversion: raw.coste_por_conversion ?? 0,
      }));

      return data;
    },
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError) {
    return <div>Error: {(error as Error).message}</div>;
  }
  return (
    <>
      <div className="p-2">
        <h2 className="font-bold text-2xl">Desempeño de keywords </h2>
        <p className="text-muted-foreground">
          Impacto de las principales búsquedas en la generación de conversiones y en el costo asociado.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Keywords</CardTitle>
          {/* <CardDescription>
          Tabla de indicadores clave de rendimiento para keywords
        </CardDescription> */}
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </>
  );
};
