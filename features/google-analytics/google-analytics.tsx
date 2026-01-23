"use client";
import { ChevronDownIcon, Download, StarsIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
            <GeneralPerformance date={{ from: formattedDate }} />
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
            <ChannelGroupMetricsTable date={{ from: formattedDate }} />
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
            <ChannelGroupMetricsChangeTable date={{ from: formattedDate }} />
          </section>
          {/* sections 04 */}
          <section>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              <UserByDevice date={{ from: formattedDate }} />
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
                  <ChevronDownIcon />
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
