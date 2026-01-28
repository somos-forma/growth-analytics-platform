"use client";
import { format, subMonths } from "date-fns";
import { ChevronDown, Download, StarsIcon } from "lucide-react";
import { useState } from "react";
import { es } from "react-day-picker/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MonthlyIndicators } from "./components/ecommerce/monthly-indicators";
import { NewUsersByChannel } from "./components/ecommerce/new-users-by-channel";
import { PerformanceByChannelTable } from "./components/ecommerce/performance-by-channel-table";
import { PerformanceByPaidTable } from "./components/ecommerce/performance-by-paid-table";
import { ResultsByPaidTable } from "./components/ecommerce/results-by-paid-table";
import { RevenueByChannel } from "./components/ecommerce/revenue-by-channel";
import { RevenueByDevices } from "./components/ecommerce/revenue-by-devices";
import { RevenueByPaidMedium } from "./components/ecommerce/revenue-by-paid-medium";
import { SessionsByChannel } from "./components/ecommerce/sessions-by-channel";
import { SessionByPaidMedium } from "./components/ecommerce/sessions-by-paid-medium";
import { TransactionsByPaidMedium } from "./components/ecommerce/transactions-by-paid-medium";
import { UserByDevice } from "./components/ecommerce/user-by-device";
import { ChannelGroupMetricsChangeTable } from "./components/leads/channel-group-metric-change-table";
import { ChannelGroupMetricsTable } from "./components/leads/channel-group-metrics-table";
import { GeneralPerformance } from "./components/leads/general-performance";
// import { UsersByAge } from "./components/leads/users-by-age";
// import { UsersBySex } from "./components/leads/users-by-sex";

export const GoogleAnalytics = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [type, _] = useState<"ecommerce" | "leads">("leads");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: subMonths(new Date(), 1), to: new Date() });

  // Formatear fecha en formato 'YYYY-MM-DD'
  // const formattedDate = useMemo(() => {
  //   if (dateRange.from) {
  //     return format(dateRange.from, "yyyy-MM-dd");
  //   }
  //   return new Date().toISOString().split("T")[0];
  // }, [dateRange.from]);

  if (type === "leads") {
    return (
      <div className="space-y-7">
        {/* header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-bold text-4xl">Google Analytics 4 </h1>
            <p className="text-muted-foreground">
              Analiza el comportamiento de usuarios y el rendimiento de tu sitio web
            </p>
          </div>
          {/* actions */}
          <div className="flex gap-3 ">
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
        {/* sections */}
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
                reverseYears
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
                  } else {
                    setDateRange({ from: undefined, to: undefined });
                  }
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-16">
          {/* section 01 */}
          <section>
            <div className="p-2 mb-4">
              <h2 className="font-bold text-2xl">Performance general del sitio web </h2>
              <p className="text-muted-foreground">
                Visión integral del rendimiento digital del sitio, que permite evaluar la capacidad real del ecosistema
                para atraer, retener y convertir usuarios.
              </p>
            </div>
            <GeneralPerformance date={{ from: "2026-01-01", to: "2026-01-31" }} />
          </section>
          {/* sections 02 */}
          <section>
            <div className="p-2 mb-4">
              <h2 className="font-bold text-2xl">Performance del sitio web por canal de adquisición</h2>
              <p className="text-muted-foreground">
                Análisis comparativo de los canales para identificar cuáles aportan mayor volumen, eficiencia y calidad
                de resultados, y dónde existen oportunidades de optimización.
              </p>
            </div>
            <ChannelGroupMetricsTable date={{ from: "2026-01-01", to: "2026-01-31" }} />
          </section>
          {/* sections 03 */}
          <section>
            <div className="p-2 mb-4">
              <h2 className="font-bold text-2xl">Performance del sitio web por fuente / medio</h2>
              <p className="text-muted-foreground">
                Profundización a nivel de origen de tráfico para entender qué combinaciones de fuente y medio generan
                impacto real en los objetivos de negocio.
              </p>
            </div>
            <ChannelGroupMetricsChangeTable date={{ from: "2026-01-01", to: "2026-01-31" }} />
          </section>
          {/* sections 04 */}
          <section>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              <UserByDevice date={{ from: "2026-01-01", to: "2026-01-31" }} />
              {/* <UsersByAge /> */}
              {/* <UsersBySex /> */}
            </div>
          </section>
        </div>
      </div>
    );
  } else {
    return (
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-bold text-4xl">Google Analytics 4 </h1>
            <p className="text-muted-foreground">
              Analiza el comportamiento de usuarios y el rendimiento de tu sitio web
              <br />
              <span className=" italic">(Comparación del mes actual con el mismo mes del año anterior)</span>
            </p>
          </div>
          {/* actions */}
          <div className="flex gap-3 ">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" id="date" className="w-48 justify-between font-semibold">
                  {date ? date.toLocaleDateString() : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setDate(date);
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
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
          {/* <GoogleAnalyticsOverview /> */}
          <PerformanceByChannelTable />
          <PerformanceByPaidTable date={{ from: "2025-11-01" }} />
          <MonthlyIndicators />
          <div className="grid md:grid-cols-2 gap-5">
            <UserByDevice date={{ from: "2025-11-01" }} />
            {/* <UserByAge /> */}
            {/* <UserBySex /> */}
            <RevenueByDevices date={{ from: "2025-11-01" }} />
            {/* <RevenueByAge /> */}
            {/* <RevenueBySex /> */}
            <RevenueByChannel date={{ from: "2025-11-01" }} />
            <SessionsByChannel date={{ from: "2025-11-01" }} />
            <NewUsersByChannel date={{ from: "2025-11-01" }} />
            <SessionByPaidMedium date={{ from: "2025-11-01" }} />
            <TransactionsByPaidMedium date={{ from: "2025-11-01" }} />
            <RevenueByPaidMedium date={{ from: "2025-11-01" }} />
          </div>
          <ResultsByPaidTable date={{ from: "2025-11-01" }} />
        </div>
      </div>
    );
  }
};
