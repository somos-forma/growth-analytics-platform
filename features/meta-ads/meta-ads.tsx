"use client";

import { format, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronDown, Download, StarsIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EcommerceOverview } from "./components/ecommerce/ecommerce-overview";
import { EcommercePerformanceIndicatorsTable } from "./components/ecommerce/ecommerce-performance-indicators-table";
import { InvestmentByDayChart } from "./components/ecommerce/investment-by-day-chart";
import { CostsIndicatorsCharts } from "./components/leads/costs-indicators-charts";
import { LeadsOverview } from "./components/leads/leads-overview";
import { LeadsPerformanceIndicatorsTable } from "./components/leads/leads-performance-indicators-table";

export const MetaAds = () => {
  const [type, _] = useState<"ecommerce" | "leads">("leads");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: subMonths(new Date(), 1), to: new Date() });

  // Formatear fecha en formato 'YYYY-MM-DD'
  const formattedDate = useMemo(() => {
    if (dateRange.from) {
      return format(dateRange.from, "yyyy-MM-dd");
    }
    return new Date().toISOString().split("T")[0];
  }, [dateRange.from]);

  return (
    <div className="space-y-7">
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

      <div className="flex gap-3 items-center justify-end ">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-between font-semibold">
              {dateRange.from ? format(dateRange.from, "MMMM yyyy", { locale: es }) : "Seleccionar rango"}{" "}
              {dateRange.to ? ` - ${format(dateRange.to, "MMMM yyyy", { locale: es })}` : ""}
              <ChevronDown />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-1" align="start">
            <Calendar
              className="border"
              mode="range"
              numberOfMonths={2}
              ISOWeek
              captionLayout="dropdown"
              locale={es}
              selected={
                dateRange.from || dateRange.to
                  ? {
                      from: dateRange.from,
                      to: dateRange.to,
                    }
                  : undefined
              }
              onSelect={(date) => {
                if (date?.from) {
                  setDateRange({
                    from: date.from,
                    to: date.to ?? undefined,
                  });
                } else {
                  setDateRange({ from: undefined, to: undefined });
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {type === "leads" ? (
        <div className="space-y-5">
          {/* <MonthRangePicker initialFrom={date.from} initialTo={date.to} onChange={(range) => setDate(range)} /> */}

          <LeadsOverview
            date={{
              from: formattedDate,
              to: dateRange.to && format(dateRange.to, "yyyy-MM-dd"),
            }}
          />

          <LeadsPerformanceIndicatorsTable
            date={{
              from: formattedDate,
              to: dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : "2026-01-01",
            }}
          />
          <CostsIndicatorsCharts
            date={{
              from: formattedDate,
              to: dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : "2026-01-01",
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
