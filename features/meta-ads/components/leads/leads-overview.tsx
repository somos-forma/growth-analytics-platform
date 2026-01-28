import { useQuery } from "@tanstack/react-query";
import { MetricCard } from "@/components/metric-card";
import { OverviewSkeleton } from "@/components/skeletons/overview-skeleton";

export const LeadsOverview = ({ date }: { date: { from: string; to?: string } }) => {
  const formatDate = (d: Date) => d.toISOString().slice(0, 10); // YYYY-MM-DD

  const fromDate = new Date(date.from);
  const previousYearFrom = new Date(fromDate);
  previousYearFrom.setFullYear(previousYearFrom.getFullYear() - 1);

  // Extend the window so the query also brings the same month of the previous year.
  // This prevents change/isPositive from becoming 0 when the user changes the date.
  const effectiveFrom = formatDate(previousYearFrom) < date.from ? formatDate(previousYearFrom) : date.from;

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["meta-ads-leads-metrics", effectiveFrom, date.from, date.to],
    queryFn: async () => {
      // Fetch current period data
      const currentResponse = await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          table: "daily_meta_ads_kpis",
          filters: {
            event_date_between: [date.from, date.to],
          },
          limit: 1000,
        }),
      });
      if (!currentResponse.ok) {
        throw new Error("Network response was not ok for current data");
      }
      const currentJson = await currentResponse.json();
      const currentRows = currentJson.rows || [];
      const currentOverview = currentRows.reduce(
        (acc: any, row: any) => {
          acc.costos += row.costos || 0;
          acc.impresiones += row.impresiones || 0;
          acc.clicks += row.clicks || 0;
          acc.alcance += row.alcance || 0;
          acc.frecuencia = acc.frecuencia || row.frecuencia; // assuming same
          acc.ctr = acc.ctr || row.ctr; // assuming same
          acc.cpc = acc.cpc || row.cpc; // assuming same
          acc.cpm = acc.cpm || row.cpm; // assuming same
          return acc;
        },
        { costos: 0, impresiones: 0, clicks: 0, alcance: 0, frecuencia: 0, ctr: 0, cpc: 0, cpm: 0 },
      );

      // Fetch previous period data
      const currentDate = new Date(date.from);
      const previousDate = new Date(currentDate);
      previousDate.setFullYear(previousDate.getFullYear() - 1);
      const previousFrom = previousDate.toISOString().split("T")[0];
      const previousTo = date.to ? new Date(date.to) : new Date(date.from);
      previousTo.setFullYear(previousTo.getFullYear() - 1);
      const previousToStr = previousTo.toISOString().split("T")[0];

      const previousResponse = await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          table: "daily_meta_ads_kpis",
          filters: {
            event_date_between: [previousFrom, previousToStr],
          },
          limit: 1000,
        }),
      });
      if (!previousResponse.ok) {
        throw new Error("Network response was not ok for previous data");
      }
      const previousJson = await previousResponse.json();
      const previousRows = previousJson.rows || [];
      const previousOverview = previousRows.reduce(
        (acc: any, row: any) => {
          acc.costos += row.costos || 0;
          acc.impresiones += row.impresiones || 0;
          acc.clicks += row.clicks || 0;
          acc.alcance += row.alcance || 0;
          acc.frecuencia = acc.frecuencia || row.frecuencia;
          acc.ctr = acc.ctr || row.ctr;
          acc.cpc = acc.cpc || row.cpc;
          acc.cpm = acc.cpm || row.cpm;
          return acc;
        },
        { costos: 0, impresiones: 0, clicks: 0, alcance: 0, frecuencia: 0, ctr: 0, cpc: 0, cpm: 0 },
      );

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

      function calcChange(curr: number, prev: number) {
        if (!prev || prev === 0) return 0;
        return ((curr - prev) / prev) * 100;
      }

      const transformed = Object.keys(titlesMap).map((key) => {
        const currValue = currentOverview[key] ?? 0;
        const prevValue = previousOverview[key] ?? 0;
        const change = calcChange(currValue, prevValue);
        return {
          id: key,
          title: titlesMap[key],
          value: currValue,
          unit: units[key],
          change,
          isPositive: change > 0,
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
    <div className="space-y-5">
      <div className="p-2 ">
        <h2 className="font-bold text-2xl">Resultados generales</h2>
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
            unit={metric.unit as any}
            change={metric.change}
            isPositive={metric.isPositive}
          />
        ))}
      </div>
    </div>
  );
};
