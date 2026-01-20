import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { format, subYears, startOfMonth } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatPercentage } from "@/utils/formatters";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

type ChannelGroupMetrics = {
  id: string;
  medium: string;
  new_users: number;
  new_users_delta: number;
  session_interaction: number;
  session_interaction_delta: number;
  step: number;
  step_delta: number;
};

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
    accessorKey: "new_users_delta",
    header: "Sesiones",
    cell: (data) => {
      return formatPercentage(data.getValue() as number);
    },
  },
  {
    accessorKey: "session_interaction",
    header: "Eventos Clave",
    cell: (data) => {
      return formatNumber(data.getValue() as number);
    },
  },
  {
    accessorKey: "session_interaction_delta",
    header: "tasa evento clave",
    cell: (data) => {
      return formatPercentage(data.getValue() as number);
    },
  },
  // {
  //   accessorKey: "step",
  //   header: "Step 1",
  //   cell: (data) => {
  //     return formatNumber(data.getValue() as number);
  //   },
  // },
  // {
  //   accessorKey: "step_delta",
  //   header: " % Δ",
  //   cell: (data) => {
  //     return formatPercentage(data.getValue() as number);
  //   },
  // },
];

export const data: ChannelGroupMetrics[] = [
  {
    id: "1",
    medium: "google / cpc",
    new_users: 1200,
    new_users_delta: 0.05,
    session_interaction: 0.25,
    session_interaction_delta: 0.02,
    step: 0.15,
    step_delta: 0.01,
  },
  {
    id: "2",
    medium: "(direct) / (none)",
    new_users: 900,
    new_users_delta: -0.03,
    session_interaction: 0.2,
    session_interaction_delta: -0.01,
    step: 0.1,
    step_delta: -0.005,
  },
];

export const ChannelGroupMetricsChangeTable = () => {
  const [selectedMedium, setSelectedMedium] = React.useState<string>("all");

  const currentDate = new Date();
  const previousYearDate = subYears(currentDate, 1);

  const currentMonthStart = format(startOfMonth(currentDate), "yyyy-MM-dd");
  const previousYearMonthStart = format(
    startOfMonth(previousYearDate),
    "yyyy-MM-dd"
  );

  const currentMonthKey = format(currentDate, "yyyy-MM");
  const previousYearMonthKey = format(previousYearDate, "yyyy-MM");

  const { data: apiData, isLoading } = useQuery({
    queryKey: ["google-organic-monthly", currentMonthKey, previousYearMonthKey],
    queryFn: async () => {
      const response = await fetch("/api/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: "google_organic_monthly",
          filters: {
            event_date_between: [previousYearMonthStart, currentMonthStart],
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

  const processedData: ChannelGroupMetrics[] = React.useMemo(() => {
    if (!apiData || !apiData.rows) return [];

    // Group data by medium (session_source_medium)
    const groupedData: Record<string, any[]> = {};
    apiData.rows.forEach((item: any) => {
      const group = item.session_source_medium;
      if (!groupedData[group]) {
        groupedData[group] = [];
      }
      groupedData[group].push(item);
    });

    return Object.keys(groupedData).map((group, index) => {
      const items = groupedData[group];

      // Find current month and previous year month dynamically
      const currentMonthItem =
        items.find((item: any) => item.anio_mes === currentMonthKey) || {};
      const prevYearItem =
        items.find((item: any) => item.anio_mes === previousYearMonthKey) || {};

      const currentNewUsers = Number(currentMonthItem.usuarios_nuevos || 0);
      const prevNewUsers = Number(prevYearItem.usuarios_nuevos || 0);

      const currentSessions = Number(
        currentMonthItem.sesiones_con_interaccion || 0
      );
      const prevSessions = Number(prevYearItem.sesiones_con_interaccion || 0);

      const calculateDelta = (current: number, previous: number) => {
        if (previous === 0) return 0; // Avoid division by zero
        return (current - previous) / previous;
      };

      return {
        id: index.toString(),
        medium: group,
        new_users: currentNewUsers,
        new_users_delta: calculateDelta(currentNewUsers, prevNewUsers),
        session_interaction: currentSessions,
        session_interaction_delta: calculateDelta(
          currentSessions,
          prevSessions
        ),
        step: 0,
        step_delta: 0,
      };
    });
  }, [apiData, currentMonthKey, previousYearMonthKey]);

  // Filter data based on selected medium
  const filteredData = React.useMemo(() => {
    if (selectedMedium === "all") {
      return processedData;
    }
    return processedData.filter((item) => item.medium === selectedMedium);
  }, [processedData, selectedMedium]);

  // Get unique mediums for the select options
  const uniqueMediums = React.useMemo(() => {
    return Array.from(new Set(processedData.map((item) => item.medium)));
  }, [processedData]);

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <Card>
      <CardHeader className="">
        <div className="flex justify-between">
          <div>
            <CardTitle> Tabla 2 Leads</CardTitle>
            {/* <CardDescription>
              Analiza el rendimiento de tus canales de adquisición de leads
            </CardDescription> */}
          </div>
          <Select value={selectedMedium} onValueChange={setSelectedMedium}>
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
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={filteredData} />
      </CardContent>
    </Card>
  );
};
