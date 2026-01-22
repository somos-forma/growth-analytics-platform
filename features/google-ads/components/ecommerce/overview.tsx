import { useQuery } from "@tanstack/react-query";
import { MetricCard } from "@/components/metric-card";
import { OverviewSkeleton } from "@/components/skeletons/overview-skeleton";

export function adaptGoogleMonthlyPerformance(rows: any[]) {
  if (!rows || rows.length === 0) {
    return {
      current_period: null,
      previous_period: null,
      metrics: {},
    };
  }

  // Ordenamos por fecha (más reciente primero)
  const sorted = [...rows].sort((a, b) => new Date(b.month_date).getTime() - new Date(a.month_date).getTime());

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
