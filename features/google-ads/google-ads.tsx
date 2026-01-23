"use client";

import { Download, StarsIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConversionAndRateByDay } from "./components/ecommerce/conversion-and-rate-by-day";
import { CostAndConversionByDay } from "./components/ecommerce/cost-and-convertion-by-day";
import { IndicatorsKeywordsTable } from "./components/ecommerce/indicators-keywords-table";
import { Overview } from "./components/ecommerce/overview";
import { PerformanceIndicatorsGenTable } from "./components/ecommerce/performance-indicators-gen";
import { PerformanceIndicatorsPmaxTable } from "./components/ecommerce/performance-indicators-pmax-table";
import { PerformanceIndicatorsSearchTable } from "./components/ecommerce/performance-indicators-search-table";
import { PerformanceIndicatorsTable } from "./components/ecommerce/performance-indicators-table";
import { LeadsCharts } from "./components/leads/leads-charts";
import { LeadsKeywordsTable } from "./components/leads/leads-keywords-table";
import { LeadsTable } from "./components/leads/leads-table";
import { OverviewLeads } from "./components/leads/overview-leads";

export const GoogleAds = () => {
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

  if (type === "leads") {
    return (
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-bold text-4xl">Google Ads </h1>
            <p className="text-muted-foreground">Análisis detallado de tus campañas de Google Ads</p>
          </div>
          {/* actions */}
          <div className="flex gap-3 ">
            {/* <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" id="date" className="w-48 justify-between font-semibold">
                  {format(date || new Date(), "MMMM yyyy", { locale: es })}
                  <ChevronDown />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => {
                    setDate(date);
                    setOpen(false);
                  }}
                  locale={es}
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
        <div className="space-y-5">
          {/* <MonthRangePicker initialFrom={date.from} initialTo={date.to} onChange={(range) => setDate(range)} /> */}
          <OverviewLeads date={{ from: formattedDate }} />
          <LeadsCharts
            date={{
              from: formattedDate,
              to: "2026-01-01",
            }}
          />
          <LeadsTable date={{ from: formattedDate }} />

          <LeadsKeywordsTable date={{ from: formattedDate }} />
        </div>
      </div>
    );
  } else {
    return (
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-bold text-4xl">Google Ads </h1>
            <p className="text-muted-foreground">
              Análisis detallado de tus campañas de Google Ads
              <br />
              <span className=" italic">(Comparación del mes actual con el mismo mes del año anterior)</span>
            </p>
          </div>
          {/* actions */}
          <div className="flex gap-3 ">
            {/* <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-48 justify-between font-semibold"
                >
                  {format(date || new Date(), "MMMM yyyy", { locale: es })}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => {
                    setDate(date);
                    setOpen(false);
                  }}
                  locale={es}
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
        <div className="space-y-5">
          <Overview date={{ from: "2024-11-01", to: "2025-11-01" }} />
          <PerformanceIndicatorsTable date={{ from: "2025-11-01", to: "2025-11-30" }} />
          <PerformanceIndicatorsSearchTable date={{ from: "2025-11-01", to: "2025-11-30" }} />
          <PerformanceIndicatorsPmaxTable date={{ from: "2025-11-01", to: "2025-11-30" }} />
          <PerformanceIndicatorsGenTable date={{ from: "2025-11-01", to: "2025-11-30" }} />
          <div>
            <p className="font-bold text-xl">Indicadores de Costos</p>
            <span className=" italic">(Este mes)</span>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <CostAndConversionByDay date={{ from: "2025-11-01", to: "2025-11-30" }} />
            {/* <CostAndConversionByHour /> */}
            <ConversionAndRateByDay date={{ from: "2025-11-01", to: "2025-11-30" }} />
            {/* <ConversionAndRateByHour /> */}
          </div>
          <IndicatorsKeywordsTable date={{ from: "2025-11-01", to: "2025-11-30" }} />
        </div>
      </div>
    );
  }
};
