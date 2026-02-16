"use client";

import { format, subMonths } from "date-fns";
import { ChevronDown, Download, StarsIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { es } from "react-day-picker/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
import { exportGoogleAdsPdf } from "./pdf/export-google-ads";

export const GoogleAds = () => {
  const [type, _] = useState<"ecommerce" | "leads">("leads");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: subMonths(new Date(), 1), to: new Date() });

  const [hasSelectedDate, setHasSelectedDate] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Formatear fecha en formato 'YYYY-MM-DD'
  const formattedDate = useMemo(() => {
    if (dateRange.from) {
      return format(dateRange.from, "yyyy-MM-dd");
    }
    return new Date().toISOString().split("T")[0];
  }, [dateRange.from]);

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      await exportGoogleAdsPdf({
        type,
        dateRange,
        date: undefined,
        formattedDate,
      });
    } catch (error) {
      console.error("Error al exportar PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (type === "leads") {
    return (
      <div className="space-y-7">
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
            <Button variant="outline" onClick={handleDownload} disabled={isDownloading}>
              <Download />
              {isDownloading ? "Exportando..." : "Exportar"}
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
                showOutsideDays={false}
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
                    setHasSelectedDate(true);
                  } else {
                    setDateRange({ from: undefined, to: undefined });
                    setHasSelectedDate(false);
                  }
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-5">
          {/* <MonthRangePicker initialFrom={date.from} initialTo={date.to} onChange={(range) => setDate(range)} /> */}
          <OverviewLeads
            date={{
              from: formattedDate,
              to: dateRange.to && format(dateRange.to, "yyyy-MM-dd"),
            }}
          />
          <LeadsCharts
            date={{
              from: hasSelectedDate ? formattedDate : "2025-01-01",
              to: hasSelectedDate ? (dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : "2026-01-01") : "2026-01-01",
            }}
          />
          <LeadsTable
            date={{
              from: formattedDate,
              to: dateRange.to && format(dateRange.to, "yyyy-MM-dd"),
            }}
          />

          <LeadsKeywordsTable
            date={{
              from: formattedDate,
              to: dateRange.to && format(dateRange.to, "yyyy-MM-dd"),
            }}
          />
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
            <Button variant="outline" onClick={handleDownload} disabled={isDownloading}>
              <Download />
              {isDownloading ? "Exportando..." : "Exportar"}
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
