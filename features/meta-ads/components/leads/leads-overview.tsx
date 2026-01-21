import { MetricCard } from "@/components/metric-card";
import { OverviewSkeleton } from "@/components/skeletons/overview-skeleton";
import { useQuery } from "@tanstack/react-query";

function adaptMetaMonthlyKpis(rows: any[]) {
  if (!rows || rows.length === 0) {
    return {
      current_period: null,
      previous_period: null,
      metrics: {},
    };
  }

  // Ordenar para garantizar consistencia
  const sorted = [...rows].sort(
    (a, b) =>
      new Date(b.mes_inicio).getTime() - new Date(a.mes_inicio).getTime(),
  );

  const current = sorted[0];

  const currentDate = new Date(current.mes_inicio);
  const currentMonth = currentDate.getMonth(); // 0–11
  const currentYear = currentDate.getFullYear();

  // Encontrar el mismo mes del año anterior
  const previous = sorted.find((r) => {
    const d = new Date(r.mes_inicio);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear - 1;
  });

  function calcChange(curr: number, prev: number) {
    if (!prev || prev === 0) return 0;
    return ((curr - prev) / prev) * 100;
  }

  const metricKeys = [
    "costos",
    "impresiones",
    "clicks",
    "alcance",
    "frecuencia",
    "ctr",
    "cpc",
    "cpm",
  ];

  const metrics: any = {};

  // Construcción del contrato ideal
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
    current_period: current.mes_inicio.slice(0, 7), // YYYY-MM
    previous_period: previous ? previous.mes_inicio.slice(0, 7) : null,
    metrics,
  };
}

export const LeadsOverview = ({
  date,
}: {
  date: { from: string; to: string };
}) => {
  const metrics: MetricCard[] = [
    {
      id: "1",
      title: "Costos",
      value: 12000,
      unit: "currency",
      change: 5.4,
      isPositive: true,
    },
    {
      id: "2",
      title: "Impresiones",
      value: 450000,
      unit: "number",
      change: -2.1,
      isPositive: false,
    },
    {
      id: "3",
      title: "Clicks",
      value: 30000,
      unit: "number",
      change: 3.2,
      isPositive: true,
    },
    {
      id: "4",
      title: "Alcance",
      value: 38200,
      unit: "number",
      change: 1.5,
      isPositive: true,
    },
    {
      id: "5",
      title: "Frecuencia",
      value: 1500,
      unit: "number",
      change: 4.8,
      isPositive: true,
    },
    {
      id: "6",
      title: "CTR (all)",
      value: 132,
      unit: "percentage",
      change: 2.1,
      isPositive: false,
    },
    {
      id: "7",
      title: "CPC",
      value: 20,
      unit: "number",
      change: 4.8,
      isPositive: true,
    },
    {
      id: "8",
      title: "CPM",
      value: 33,
      unit: "number",
      change: 1.2,
      isPositive: true,
    },
  ];

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["meta-ads-leads-metrics"],
    queryFn: async () => {
      const response = await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          table: "monthly_meta_ads_kpis",
          filters: {
            event_date_between: [date.from, date.to],
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const json = await response.json();
      const adapted = adaptMetaMonthlyKpis(json.rows);

      const titlesMap: Record<string, string> = {
        costos: "Costos",
        impresiones: "Impresiones",
        clicks: "Clicks",
        alcance: "Alcance",
        frecuencia: "Frecuencia",
        ctr: "CTR (all)",
        cpc: "CPC",
        cpm: "CPM",
      };

      const units: Record<string, string> = {
        costos: "currency",
        impresiones: "number",
        clicks: "number",
        alcance: "number",
        frecuencia: "number",
        ctr: "percentage",
        cpc: "number",
        cpm: "number",
      };

      // const currentMonth = json.rows[0];
      // const previousMonth = json.rows[1];

      // const titlesMap: { [key: string]: string } = {
      //   costos: "Costos",
      //   impresiones: "Impresiones",
      //   clicks: "Clicks",
      //   alcance: "Alcance",
      //   frecuencia: "Frecuencia",
      //   ctr: "CTR (all)",
      //   cpc: "CPC",
      //   cpm: "CPM",
      // };

      // const unitsByKey: { [key: string]: string } = {
      //   costos: "currency",
      //   impresiones: "number",
      //   clicks: "number",
      //   alcance: "number",
      //   frecuencia: "number",
      //   ctr: "percentage",
      //   cpc: "number",
      //   cpm: "number",
      // };

      // function calcVariation(current: number, prev: number) {
      //   if (!prev || prev === 0) return 0;
      //   return ((current - prev) / prev) * 100;
      // }

      // const transformed = Object.keys(titlesMap).map((key) => {
      //   const delta = calcVariation(
      //     currentMonth[key] ?? 0,
      //     previousMonth[key] ?? 0
      //   );
      //   return {
      //     id: key,
      //     title: titlesMap[key],
      //     value: currentMonth[key] ?? 0,
      //     unit: unitsByKey[key] || "number",
      //     change: delta,
      //     isPositive: delta > 0,
      //   };
      // });
      const x = Object.keys(adapted.metrics).map((key) => ({
        id: key,
        title: titlesMap[key],
        value: adapted.metrics[key].value,
        unit: units[key],
        change: adapted.metrics[key].change,
        isPositive: adapted.metrics[key].change > 0,
      }));
      console.log(x);
      return x;
    },
  });

  if (isPending) {
    return <OverviewSkeleton items={6} />;
  }

  if (isError) {
    return <div>Error: {(error as Error).message}</div>;
  }
  return (
    <div className="space-y-5">
      <div className="p-2 ">
        <h2 className="font-bold text-2xl">
          Resultados generales 
        </h2>
        <p className="text-muted-foreground">
         Visión consolidada del alcance, la interacción y la eficiencia de la inversión en el período analizado.
        </p>
      </div>
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
    </div>
  );
};
