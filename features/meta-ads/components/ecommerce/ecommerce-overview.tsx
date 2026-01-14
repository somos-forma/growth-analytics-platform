import { MetricCard } from "@/components/metric-card";
import { OverviewSkeleton } from "@/components/skeletons/overview-skeleton";
import { Overview } from "@/features/google-ads/components/ecommerce/overview";
import { useQuery } from "@tanstack/react-query";

export const EcommerceOverview = () => {
  const metrics: MetricCard[] = [
    {
      id: "1",
      title: "Total de costos",
      value: 12000,
      unit: "number",
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
      title: "Link Clics",
      value: 30000,
      unit: "number",
      change: 3.2,
      isPositive: true,
    },
    {
      id: "4",
      title: "Reach",
      value: 6.7,
      unit: "number",
      change: 1.5,
      isPositive: true,
    },
    {
      id: "5",
      title: "Total de ingresos",
      value: 45000,
      unit: "currency",
      change: 4.8,
      isPositive: true,
    },
    {
      id: "6",
      title: "Links CTR",
      value: 6.7,
      unit: "percentage",
      change: 0.5,
      isPositive: true,
    },
    {
      id: "7",
      title: "CPC ",
      value: 20,
      unit: "number",
      change: 4.8,
      isPositive: true,
    },
    {
      id: "8",
      title: "CPM",
      value: 3.75,
      unit: "currency",
      change: 4.8,
      isPositive: true,
    },
    {
      id: "9",
      title: "Porcentaje de rebote",
      value: 3.75,
      unit: "percentage",
      change: 4.8,
      isPositive: true,
    },
    {
      id: "10",
      title: "CPA (Meta)",
      value: 3.5,
      unit: "currency",
      change: 2.3,
      isPositive: true,
    },
  ];

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["meta-ads-ecommerce-metrics"],
    queryFn: async () => {
      const response = await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          table: "meta_campaign_performance",
          // filters: {
          //   event_date_between: ["2025-11-01"],
          // },
          // limit: 1,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const json = await response.json();
      const overview = json.rows[0];

      const titlesMap: { [key: string]: string } = {
        total_cost: "Total de costos",
        impresiones: "Impresiones",
        clicks: "Link Clics",
        alcance: "Reach",
        // falta total de ingresos
        ctr: "Links CTR",
        cpc: "CPC",
        cpm: "CPM",
        // falta porcentaje de rebote
        cpa: "CPA (Meta)",
      };

      const unitsByKey: { [key: string]: string } = {
        total_cost: "currency",
        impresiones: "number",
        clicks: "number",
        alcance: "number",
        // falta total de ingresos
        ctr: "percentage",
        cpc: "number",
        cpm: "number",
        // falta porcentaje de rebote
        cpa: "currency",
      };

      const transformed = Object.keys(titlesMap).map((key) => {
        return {
          id: key,
          title: titlesMap[key],
          value: overview[key] ?? 0,
          unit: unitsByKey[key] || "number",
          change: 0,
          isPositive: true,
        };
      });

      return transformed;
    },
  });

  if (isPending) {
    return <OverviewSkeleton items={6} />;
  }

  if (isError) {
    return <div>Error: {(error as Error).message}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4   gap-3">
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
