import { MetricCard } from "@/components/metric-card";
import { OverviewSkeleton } from "@/components/skeletons/overview-skeleton";
import { useQuery } from "@tanstack/react-query";

export function adaptGoogleMonthlyPerformance(rows: any[]) {
  if (!rows || rows.length === 0) {
    return {
      current_period: null,
      previous_period: null,
      metrics: {},
    };
  }

  // Ordenamos por fecha (más reciente primero)
  const sorted = [...rows].sort(
    (a, b) =>
      new Date(b.month_date).getTime() - new Date(a.month_date).getTime()
  );

  const current = sorted[0];

  const currentDate = new Date(current.month_date);
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Buscar mismo mes del año pasado
  const previous = sorted.find((r) => {
    const d = new Date(r.month_date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear - 1;
  });

  // Función para calcular % de cambio
  function calcChange(curr: number, prev: number) {
    if (!prev || prev === 0) return 0;
    return ((curr - prev) / prev) * 100;
  }

  // Lista de métricas de Google Ads
  const metricKeys = [
    "inversion",
    "ingreso_neto",
    "impresiones",
    "sesiones",
    "cps",
    "transacciones",
    "roas",
    "ctr",
    "pct_clics_sesiones",
    "clics",
    "cpc_medio",
  ];

  const metrics: any = {};

  for (const key of metricKeys) {
    const currValue = current[key] ?? 0;
    const prevValue = previous?.[key] ?? 0;

    metrics[key] = {
      value: currValue,
      previous: prevValue,
      change: calcChange(currValue, prevValue),
    };
  }

  return {
    current_period: current.month_date.slice(0, 7), // YYYY-MM
    previous_period: previous ? previous.month_date.slice(0, 7) : null,
    metrics,
  };
}

export const Overview = ({ date }: { date: { from: string; to: string } }) => {
  const metrics: MetricCard[] = [
    {
      id: "1",
      title: "Inversión",
      value: 12000,
      unit: "currency",
      change: 5.4,
      isPositive: false,
    },
    {
      id: "2",
      title: "Ingresos Neto",
      value: 93134,
      unit: "currency",
      change: -2.1,
      isPositive: false,
    },
    {
      id: "3",
      title: "Impresiones",
      value: 15000,
      unit: "number",
      change: 8.3,
      isPositive: true,
    },
    {
      id: "4",
      title: "Conversiones",
      value: 300,
      unit: "currency",
      change: 3.5,
      isPositive: true,
    },
    {
      id: "5",
      title: "Sesiones",
      value: 300,
      unit: "number",
      change: 3.5,
      isPositive: true,
    },
    {
      id: "6",
      title: "CPS",
      value: 5449967,
      unit: "currency",
      change: 3.5,
      isPositive: true,
    },
    {
      id: "7",
      title: "Transacciones",
      value: 1234567,
      unit: "number",
      change: 4.2,
      isPositive: true,
    },
    {
      id: "8",
      title: "ROAS",
      value: 4937,
      unit: "number",
      change: 2.1,
      isPositive: false,
    },
    {
      id: "9",
      title: "CTR",
      value: 27,
      unit: "percentage",
      change: 6.3,
      isPositive: true,
    },
    {
      id: "10",
      title: "Conversiónes clics",
      value: 80,
      unit: "percentage",
      change: 5.0,
      isPositive: true,
    },
    {
      id: "11",
      title: "Clics",
      value: 4500,
      unit: "number",
      change: 4.5,
      isPositive: true,
    },
    {
      id: "12",
      title: "CPC promedio",
      value: 1500,
      unit: "currency",
      change: 3.2,
      isPositive: true,
    },
  ];

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["fetch-metrics-google-ads"],
    queryFn: async () => {
      const response = await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          table: "monthly_google_ads_performance",
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
      // Convertimos la respuesta actual → contrato ideal
      const adapted = adaptGoogleMonthlyPerformance(json.rows);

      const titlesMap: Record<string, string> = {
        inversion: "Inversión",
        ingreso_neto: "Ingresos Neto",
        impresiones: "Impresiones",
        sesiones: "Sesiones",
        cps: "CPS",
        transacciones: "Transacciones",
        roas: "ROAS",
        ctr: "CTR",
        pct_clics_sesiones: "Conversiónes clics",
        clics: "Clics",
        cpc_medio: "CPC promedio",
      };

      const unitsByKey: Record<string, string> = {
        inversion: "currency",
        ingreso_neto: "currency",
        impresiones: "number",
        sesiones: "number",
        cps: "currency",
        transacciones: "number",
        roas: "number",
        ctr: "percentage",
        pct_clics_sesiones: "percentage",
        clics: "number",
        cpc_medio: "currency",
        cpm: "currency",
      };

      return Object.keys(adapted.metrics).map((key) => ({
        id: key,
        title: titlesMap[key],
        value: adapted.metrics[key].value,
        unit: unitsByKey[key] || "number",
        change: adapted.metrics[key].change,
        isPositive: adapted.metrics[key].change > 0,
      }));
      // const overview = json.rows[0];

      // const titlesMap: { [key: string]: string } = {
      //   inversion: "Inversión",
      //   ingreso_neto: "Ingresos Neto",
      //   impresiones: "Impresiones",
      //   sesiones: "Sesiones",
      //   cps: "CPS",
      //   transacciones: "Transacciones",
      //   roas: "ROAS",
      //   ctr: "CTR",
      //   pct_clics_sesiones: "Conversiónes clics",
      //   clics: "Clics",
      //   cpc_medio: "CPC promedio",
      // };

      // const unitsByKey: { [key: string]: string } = {
      //   inversion: "currency",
      //   ingreso_neto: "currency",
      //   impresiones: "number",
      //   sesiones: "number",
      //   cps: "currency",
      //   transacciones: "number",
      //   roas: "number",
      //   ctr: "percentage",
      //   pct_clics_sesiones: "percentage",
      //   clics: "number",
      //   cpc_medio: "currency",
      // };

      // const transformed = Object.keys(titlesMap).map((key) => {
      //   return {
      //     id: key,
      //     title: titlesMap[key],
      //     value: overview[key] ?? 0,
      //     unit: unitsByKey[key] || "number",
      //     change: 0,
      //     isPositive: true,
      //   };
      // });

      // return transformed;
    },
  });

  if (isPending) {
    return <OverviewSkeleton items={6} />;
  }

  if (isError) {
    return <div>Error: {(error as Error).message}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-3">
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
