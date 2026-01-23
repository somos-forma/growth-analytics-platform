"use client";

import { Download, StarsIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { EcommerceOverview } from "./components/ecommerce/ecommerce-overview";
import { EcommercePerformanceIndicatorsTable } from "./components/ecommerce/ecommerce-performance-indicators-table";
import { InvestmentByDayChart } from "./components/ecommerce/investment-by-day-chart";
import { CostsIndicatorsCharts } from "./components/leads/costs-indicators-charts";
import { LeadsOverview } from "./components/leads/leads-overview";
import { LeadsPerformanceIndicatorsTable } from "./components/leads/leads-performance-indicators-table";
import { MonthRangePicker } from "@/components/ui/month-range-picker";
import { format } from "date-fns";

export const MetaAds = () => {
  const [type, _] = useState<"ecommerce" | "leads">("leads");

  const [date, setDate] = useState<{
    from?: Date | undefined;
    to?: Date | undefined;
  }>({
    from: new Date(2025, 0, 1),
    to: new Date(),
  });
  const fromStr = format(date.from || new Date(), "yyyy-MM-dd");
  const toStr = format(date.to || new Date(), "yyyy-MM-dd");
  const dateKey = `${fromStr}-${toStr}`;
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-4xl">Meta Ads </h1>
          <p className="text-muted-foreground">
            Análisis detallado de tus campañas de Meta Ads
            <br />
            {/* <span className=" italic">
              (Comparación del mes actual con el mismo mes del año anterior)
            </span> */}
          </p>
        </div>
        {/* actions */}
        <div className="flex gap-3 ">
          {/* <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className=" justify-between font-semibold"
              >
                {date.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "dd MMM, yyyy", { locale: es })} –{" "}
                      {format(date.to, "dd MMM, yyyy", { locale: es })}
                    </>
                  ) : (
                    format(date.from, "dd MMM, yyyy", { locale: es })
                  )
                ) : (
                  <span>Seleccionar rango</span>
                )}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                hideWeekdays={true}
                ISOWeek={true}
                mode="single"
                navLayout="after"
                numberOfMonths={1}
                showOutsideDays={true}
             
              />
            </PopoverContent>
          </Popover> */}
          <Button variant="outline">
            <StarsIcon />
            Resumen con AI
          </Button>
          <Button variant="outline">
            <Download />
            Exportar
          </Button>
        </div>
      </div>
      {type === "leads" ? (
        <div className="space-y-5">
          <MonthRangePicker initialFrom={date.from} initialTo={date.to} onChange={(range) => setDate(range)} />
          <LeadsOverview
            key={`overview-${dateKey}`}
            date={{
              from: fromStr,
              to: toStr,
            }}
          />
          <LeadsPerformanceIndicatorsTable
            key={`table-${dateKey}`}
            date={{
              from: fromStr,
              to: toStr,
            }}
          />
          <CostsIndicatorsCharts
            key={`charts-${dateKey}`}
            date={{
              from: fromStr,
              to: toStr,
            }}
          />
        </div>
      ) : (
        <div className="space-y-5">
          <EcommerceOverview />
          <EcommercePerformanceIndicatorsTable
            date={{
              from: "2025-11-01",
            }}
          />
          <InvestmentByDayChart
            date={{
              from: "2025-11-01",
              to: "2025-11-30",
            }}
          />
        </div>
      )}
    </div>
  );
};
