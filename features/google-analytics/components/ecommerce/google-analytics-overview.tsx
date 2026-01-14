import { MetricCard } from "@/components/metric-card";
import { useQuery } from "@tanstack/react-query";
import { Unit } from "@/components/metric-card";
import { OverviewSkeleton } from "@/components/skeletons/overview-skeleton";
export const GoogleAnalyticsOverview = () => {
  const metrics: MetricCard[] = [
    {
      id: "1",
      title: "Usuarios",
      value: 12000,
      unit: "number",
      change: 5.4,
      isPositive: true,
    },
    {
      id: "2",
      title: "Usuarios nuevos",
      value: 93134,
      unit: "number",
      change: -2.1,
      isPositive: false,
    },
    {
      id: "3",
      title: "Sesiones",
      value: 15000,
      unit: "number",
      change: 8.3,
      isPositive: true,
    },
    {
      id: "4",
      title: "Sesiones con interacción",
      value: 300,
      unit: "number",
      change: 3.5,
      isPositive: true,
    },
    {
      id: "5",
      title: "Vistas",
      value: 300,
      unit: "number",
      change: 3.5,
      isPositive: true,
    },
    {
      id: "6",
      title: "Coste",
      value: 5449967,
      unit: "currency",
      change: 3.5,
      isPositive: true,
    },
    {
      id: "7",
      title: "Ingreso Neto",
      value: 1234567,
      unit: "currency",
      change: 4.2,
      isPositive: true,
    },
    {
      id: "8",
      title: "CPA",
      value: 4937,
      unit: "currency",
      change: 2.1,
      isPositive: false,
    },
    {
      id: "9",
      title: "ROAS",
      value: 27,
      unit: "number",
      change: 6.3,
      isPositive: true,
    },
    {
      id: "10",
      title: "Artículos comprados",
      value: 8500,
      unit: "number",
      change: 5.0,
      isPositive: true,
    },
  ];

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["fetch-metrics"],
    queryFn: async () => {
      const response = await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          table: "daily_marketing_performance",
          filters: {
            event_date_between: ["2025-10-03"],
          },
          limit: 1,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const json = await response.json();
      const overview = json.rows[0];

      // Diccionario de títulos personalizados
      const titlesMap: { [key: string]: string } = {
        usuarios: "Usuarios",
        usuarios_nuevos: "Usuarios nuevos",
        sesiones: "Sesiones",
        sesiones_con_interaccion: "Sesiones con interacción",
        vistas: "Vistas",
        coste: "Coste",
        ingreso_neto: "Ingreso Neto",
        CPA: "CPA",
        ROAS_paid: "ROAS",
      };

      const unitsByKey: { [key: string]: string } = {
        ingreso_neto: "currency",
        coste: "currency",
        CPA: "currency",
        ROAS_paid: "percentage",
      };

      const transformed = Object.entries(overview)
        .filter(([key]) => key !== "event_date")
        .filter(([key]) => key !== "conversiones_paid")
        .filter(([key]) => key !== "transacciones")
        .map(([key, value], index) => ({
          id: String(index + 1),
          title: titlesMap[key] || key, // usa el nombre personalizado si existe
          value: Number(value),
          unit: unitsByKey[key] || "number",
          change: 0,
          isPositive: Number(value) >= 0,
        }));

      return transformed;
    },
  });

  if (isPending) {
    return <OverviewSkeleton />;
  }

  if (isError) {
    return <div>Error: {(error as Error).message}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {data.map((metric) => (
        <MetricCard
          key={metric.id}
          id={metric.id}
          title={metric.title}
          value={metric.value}
          unit={metric.unit}
          change={metric.change}
          isPositive={metric.isPositive}
        />
      ))}
    </div>
  );
};
