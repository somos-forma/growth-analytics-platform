"use client";

import { Download, StarsIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EcommerceOverview } from "./components/ecommerce/ecommerce-overview";
import { EcommercePerformanceIndicatorsTable } from "./components/ecommerce/ecommerce-performance-indicators-table";
import { InvestmentByDayChart } from "./components/ecommerce/investment-by-day-chart";
import { CostsIndicatorsCharts } from "./components/leads/costs-indicators-charts";
import { LeadsOverview } from "./components/leads/leads-overview";
import { LeadsPerformanceIndicatorsTable } from "./components/leads/leads-performance-indicators-table";

export const MetaAds = () => {
  const [type, _] = useState<"ecommerce" | "leads">("leads");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());

  // Generar años (últimos 5 años)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => (currentYear - i).toString());

  // Meses
  const months = [
    { value: "1", label: "Enero" },
    { value: "2", label: "Febrero" },
    { value: "3", label: "Marzo" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Mayo" },
    { value: "6", label: "Junio" },
    { value: "7", label: "Julio" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ];

  // Formatear fecha en formato 'YYYY-MM-DD'
  const formattedDate = useMemo(() => {
    const month = selectedMonth.padStart(2, "0");
    return `${selectedYear}-${month}-01`;
  }, [selectedYear, selectedMonth]);

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

      <div className="flex gap-3 items-center justify-end ">
        <div className="flex items-center gap-2">
          {/* <span className="text-sm font-medium">Año:</span> */}
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32 font-bold">
              <SelectValue placeholder="Seleccionar año" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          {/* <span className="text-sm font-medium">Mes:</span> */}
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-40 font-bold">
              <SelectValue placeholder="Seleccionar mes" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {type === "leads" ? (
        <div className="space-y-5">
          {/* <MonthRangePicker initialFrom={date.from} initialTo={date.to} onChange={(range) => setDate(range)} /> */}

          <LeadsOverview date={{ from: formattedDate }} />

          <LeadsPerformanceIndicatorsTable date={{ from: formattedDate }} />
          <CostsIndicatorsCharts
            date={{
              from: formattedDate,
              to: "2026-01-01",
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
