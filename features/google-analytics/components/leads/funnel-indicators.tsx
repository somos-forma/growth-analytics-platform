import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChannelGroupMetricsTable } from "./channel-group-metrics-table";
import { ChannelGroupMetricsChangeTable } from "./channel-group-metric-change-table";

export const FunnelIndicators = () => {
  const data = [
    {
      step: 1,
      label: "viewItemList/campaign_click_step_1",
      value: 7551,
    },
    {
      step: 2,
      label: "Step 2",
      value: 6500,
      abandonmentRate: 40.41,
    },
    {
      step: 3,
      label: "Step 3",
      value: 5210,
      abandonmentRate: 66.6,
    },
    {
      step: 4,
      label: "Step 4",
      value: 4300,
      abandonmentRate: 7.92,
    },
    {
      step: 5,
      label: "Step 5",
      value: 2500,
      abandonmentRate: 0.43,
    },
    {
      step: 6,
      label: "Step 6",
      value: 1325,
      abandonmentRate: 3.85,
    },
  ];
  return (
    <Card>
      <CardHeader>
        {/* <CardTitle>Indicadores Funnel</CardTitle>
        <CardDescription>
          Descripción de los indicadores del funnel
          <p className=" italic">
            (Comparación del mes actual con el mismo mes del año anterior)
          </p>
        </CardDescription> */}
      </CardHeader>
      <CardContent className="space-y-5">
        {/* <div className="flex gap-4">
          <Select>
            <SelectTrigger className="">
              <SelectValue placeholder="Sistemas operativos" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="windows">Windows</SelectItem>
                <SelectItem value="macos">MacOS</SelectItem>
                <SelectItem value="linux">Linux</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="">
              <SelectValue placeholder="Categoría de dispositivos" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="desktop">Escritorio</SelectItem>
                <SelectItem value="mobile">Móvil</SelectItem>
                <SelectItem value="tablet">Tableta</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="">
              <SelectValue placeholder="Campaña" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="campaign1">Campaña 1</SelectItem>
                <SelectItem value="campaign2">Campaña 2</SelectItem>
                <SelectItem value="campaign3">Campaña 3</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="">
              <SelectValue placeholder="Fuente" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div> */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Funnel Steps */}
          {/* <div className="flex flex-col gap-4">
            {data.map((step, index) => {
              const width = (step.value / data[0].value) * 100;
              return (
                <div
                  key={step.step}
                  className="bg-muted rounded-lg p-4 text-center  mx-auto"
                  style={{ width: `${Math.max(width, 20)}%` }}
                >
                  <p className="text-sm text-muted-foreground mb-1">
                    {step.label}
                  </p>
                  <p className="text-lg font-semibold">
                    {step.value.toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div> */}
          {/* Abandonment Rates */}
          {/* <div className="space-y-6">
            {data.slice(1).map((step, index) => (
              <div
                key={step.step}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="text-sm text-muted-foreground">
                  Tasa de abandono ({index + 1}-{index + 2})
                </div>
                <div className="text-lg font-semibold">
                  {step.abandonmentRate}%
                </div>
              </div>
            ))}
          </div> */}
        </div>

        {/* <ChannelGroupMetricsTable />
        <ChannelGroupMetricsChangeTable /> */}
      </CardContent>
    </Card>
  );
};
