import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatNumber, formatPercentage } from "@/utils/formatters";

type ChannelGroupMetrics = {
  id: string;
  medium: string;
  new_users: number;
  sessions: number;
  key_events: number;
  key_events_rate: number;
};

export const fake: ChannelGroupMetrics[] = [
  {
    id: "1",
    medium: "google / cpc",
    new_users: 1200,
    sessions: 0.05,
    key_events: 0.25,
    key_events_rate: 0.15,
  },
  {
    id: "2",
    medium: "(direct) / (none)",
    new_users: 900,
    sessions: 0.03,
    key_events: 0.2,
    key_events_rate: 0.1,
  },
];

export const columns: ColumnDef<ChannelGroupMetrics>[] = [
  {
    accessorKey: "medium",
    header: "Canal",
  },
  {
    accessorKey: "new_users",
    header: "Usuarios nuevos",
    cell: (data) => {
      return formatNumber(data.getValue() as number);
    },
  },
  {
    accessorKey: "sessions",
    header: "Sesiones",
    cell: (data) => {
      return formatNumber(data.getValue() as number);
    },
  },
  {
    accessorKey: "key_events",
    header: "Eventos Clave",
    cell: (data) => {
      return formatNumber(data.getValue() as number);
    },
  },
  {
    accessorKey: "key_events_rate",
    header: "Tasa evento clave",
    cell: (data) => {
      return formatPercentage(data.getValue() as number);
    },
  },
];

export const ChannelGroupMetricsChangeTable = ({ date }: { date: { from: string; to?: string } }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["ga4_traffic_source_medium_monthly_kpis", date.from, date.to],
    queryFn: async () => {
      const response = await fetch("/api/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: "daily_ga4_traffic_source_medium_kpis",
          filters: {
            event_date_between: [date.from, date.to || date.from],
          },
          limit: 1000,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  const transformedData: ChannelGroupMetrics[] = data.rows?.map((item: unknown, index: number) => ({
    id: index.toString(),
    medium: item?.session_source_medium,
    new_users: item?.usuarios_nuevos,
    sessions: item?.sesiones,
    key_events: item?.eventos_clave,
    key_events_rate: item?.tasa_eventos_clave,
  }));

  return (
    <Card>
      <CardHeader className="">
        <div className="flex justify-between">
          <div>
            {/* <CardTitle> Performance del sitio web por fuente / medio</CardTitle>
            <CardDescription>
              Profundización a nivel de origen de tráfico para entender qué
              combinaciones de fuente y medio generan impacto real en los
              objetivos de negocio.
            </CardDescription> */}
          </div>
          {/* <Select value={selectedMedium} onValueChange={setSelectedMedium}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Fuente/medio de la sesión" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Fuente/medio de la sesión</SelectItem>
                {uniqueMediums.map((medium) => (
                  <SelectItem key={medium} value={medium}>
                    {medium}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select> */}
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={transformedData} />
      </CardContent>
    </Card>
  );
};
