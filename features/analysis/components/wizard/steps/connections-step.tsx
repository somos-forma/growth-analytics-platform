import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { CsvUploader } from "../../csv-uploader";
import { type ConnectionsSchemaType, connectionsSchema } from "../wizard-schemas";
import { useWizardStore } from "../wizard-store";

const connections = [
  {
    id: "google_ads",
    title: "Google Ads",
    description: "Gestión y seguimiento de campañas publicitarias en Google Ads.",
    icon: "/ga2.svg",
  },
  {
    id: "ga4",
    title: "Google Analytics 4",
    description: "Análisis de datos de tráfico web y comportamiento de usuarios.",
    icon: "/ga4.svg",
  },
  {
    id: "meta_ads",
    title: "Meta Ads",
    description: "Gestión y seguimiento de campañas publicitarias en Meta Ads.",
    icon: "/meta.svg",
  },
] as const;

export const ConnectionsStep = () => {
  const { back, next, data, updateData } = useWizardStore();
  const dataSources = data.dataSources;

  const form = useForm<ConnectionsSchemaType>({
    resolver: zodResolver(connectionsSchema),
    defaultValues: {
      integratedConnections: data.integratedConnections || [],
      localConnections: data.localConnections || undefined,
    },
  });

  const onSubmit = (values: ConnectionsSchemaType) => {
    console.log(values);
    updateData(values);
    next();
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <FieldGroup>
        {dataSources == "integrate" ? (
          <Controller
            name="integratedConnections"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet data-invalid={fieldState.invalid}>
                <FieldLegend>Conexiones</FieldLegend>
                <FieldDescription>Selecciona al menos dos conexiones para integrar tus datos.</FieldDescription>
                <FieldGroup data-slot="checkbox-group">
                  {connections.map((connection) => (
                    <FieldLabel key={connection.id} htmlFor={`connection-${connection.id}`}>
                      <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                        <FieldContent>
                          <FieldTitle>
                            <div className="w-10 h-10  flex items-center justify-center rounded-full bg-primary/10 text-primary">
                              <Image
                                src={connection.icon}
                                alt={connection.title}
                                className="w-6 h-6"
                                width={24}
                                height={24}
                              />
                            </div>
                            {connection.title}
                          </FieldTitle>
                          <FieldDescription>{connection.description}</FieldDescription>
                        </FieldContent>
                        <Checkbox
                          id={`connection-${connection.id}`}
                          value={connection.id}
                          checked={field.value?.includes(connection.id) || false}
                          onCheckedChange={(checked) => {
                            const currentValue = field.value || [];
                            if (checked) {
                              field.onChange([...currentValue, connection.id]);
                            } else {
                              field.onChange(currentValue.filter((id) => id !== connection.id));
                            }
                          }}
                        />
                      </Field>
                    </FieldLabel>
                  ))}
                </FieldGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldSet>
            )}
          />
        ) : (
          <Controller
            name="localConnections"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet data-invalid={fieldState.invalid}>
                <FieldLegend> Archivo CSV </FieldLegend>
                <FieldDescription>Selecciona un archivo CSV para cargar tus datos.</FieldDescription>
                <CsvUploader value={field.value} onChange={field.onChange} error={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldSet>
            )}
          />
        )}
      </FieldGroup>
      <div className="space-x-4">
        <Button onClick={back}>Anterior</Button>
        <Button type="submit">Siguiente</Button>
      </div>
    </form>
  );
};
