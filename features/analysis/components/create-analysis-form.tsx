import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";

import z from "zod";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BrainCircuit, Database, FileSpreadsheet } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";

const models = [
  {
    id: "robyn",
    title: "Robyn",
    description:
      "Modelo open-source de Meta para Marketing Mix Modeling con capacidades avanzadas de machine learning y optimización.",
  },
  {
    id: "meridian",
    title: "Meridian",
    description:
      "Modelo de Google para Marketing Mix Modeling con enfoque en incrementalidad y optimización de presupuesto",
  },
] as const;

const resources = [
  {
    id: "integrate",
    title: "Integradas",
    description:
      "Conecta tus fuentes de datos publicitarias y analíticas para un análisis automatizado y en tiempo real.",
  },
  {
    id: "local",
    title: "Local",
    description:
      "Sube tus propios archivos CSV con datos históricos para un análisis personalizado y control total.",
  },
] as const;

const connections = [
  {
    id: "google_ads",
    title: "Google Ads",
    description:
      "Gestión y seguimiento de campañas publicitarias en Google Ads.",
    icon: "/ga2.svg",
  },
  {
    id: "ga4",
    title: "Google Analytics 4",
    description:
      "Análisis de datos de tráfico web y comportamiento de usuarios.",
    icon: "/ga4.svg",
  },
  {
    id: "meta_ads",
    title: "Meta Ads",
    description: "Gestión y seguimiento de campañas publicitarias en Meta Ads.",
    icon: "/meta.svg",
  },
] as const;

export const CreateAnalysisForm = () => {
  const formSchema = z
    .object({
      analysisName: z.string().min(2, "El nombre del análisis es obligatorio"),
      analysisDescription: z.string().optional(),
      model: z.string().min(1, "Debes seleccionar un modelo"),
      resources: z.string().min(1, "Debes seleccionar una fuente de datos"),
      connections: z
        .array(z.string())
        .min(2, "Selecciona al menos 2 conexiones"),
      file: z
        .instanceof(File, { message: "Debes subir un archivo CSV" })
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (data.resources === "integrate") {
        if (!data.connections || data.connections.length < 2) {
          ctx.addIssue({
            code: "custom",
            path: ["connections"],
            message: "Selecciona al menos 2 conexiones",
          });
        }
      }

      if (data.resources === "local") {
        if (!data.file) {
          ctx.addIssue({
            code: "custom",
            path: ["file"],
            message: "Debes subir un archivo local ",
          });
        }
      }
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      analysisName: "",
      analysisDescription: "",
      model: "",
      resources: "",
      connections: [],
      file: undefined,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast("You submitted the following values:", {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    });
  }

  const selectResources = form.watch("resources");
  return;
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="analysisName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Nombre del Análisis</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Análisis de rendimiento mensual"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="analysisDescription"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Descripción del Análisis
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Descripción del análisis"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="model"
          control={form.control}
          render={({ field, fieldState }) => (
            <FieldSet data-invalid={fieldState.invalid}>
              <FieldLegend>Modelo</FieldLegend>
              <FieldDescription>
                Selecciona el modelo que deseas utilizar para tu análisis.
              </FieldDescription>
              <RadioGroup
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                aria-invalid={fieldState.invalid}
                className="flex"
              >
                {models.map((model) => (
                  <FieldLabel
                    key={model.id}
                    htmlFor={`form-rhf-radiogroup-${model.id}`}
                  >
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldContent>
                        <FieldTitle>
                          <div className="w-10 h-10  flex items-center justify-center rounded-full bg-primary/10 text-primary">
                            <BrainCircuit />
                          </div>
                          {model.title}
                        </FieldTitle>
                        <FieldDescription>{model.description}</FieldDescription>
                      </FieldContent>
                      <RadioGroupItem
                        value={model.id}
                        id={`form-rhf-radiogroup-${model.id}`}
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  </FieldLabel>
                ))}
              </RadioGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldSet>
          )}
        />
        <Controller
          name="resources"
          control={form.control}
          render={({ field, fieldState }) => (
            <FieldSet data-invalid={fieldState.invalid}>
              <FieldLegend>Fuentes de Datos</FieldLegend>
              <FieldDescription>
                Selecciona la fuente de datos que deseas utilizar para tu
                análisis.
              </FieldDescription>
              <RadioGroup
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                aria-invalid={fieldState.invalid}
                className="flex"
              >
                {resources.map((resource) => (
                  <FieldLabel
                    key={resource.id}
                    htmlFor={`form-rhf-radiogroup-${resource.id}`}
                  >
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldContent>
                        <FieldTitle>
                          <div className="w-10 h-10  flex items-center justify-center rounded-full bg-primary/10 text-primary">
                            {resource.id === "integrate" ? (
                              <Database />
                            ) : (
                              <FileSpreadsheet />
                            )}
                          </div>
                          {resource.title}
                        </FieldTitle>
                        <FieldDescription>
                          {resource.description}
                        </FieldDescription>
                      </FieldContent>
                      <RadioGroupItem
                        value={resource.id}
                        id={`form-rhf-radiogroup-${resource.id}`}
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  </FieldLabel>
                ))}
              </RadioGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldSet>
          )}
        />

        {selectResources === "integrate" && (
          <Controller
            name="connections"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet data-invalid={fieldState.invalid}>
                <FieldLegend>Conexiones</FieldLegend>
                <FieldDescription>
                  Selecciona al menos dos conexiones para integrar tus datos.
                </FieldDescription>
                <FieldGroup data-slot="checkbox-group">
                  {connections.map((connection) => (
                    <FieldLabel
                      key={connection.id}
                      htmlFor={`connection-${connection.id}`}
                    >
                      <Field
                        orientation="horizontal"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldContent>
                          <FieldTitle>
                            <div className="w-10 h-10  flex items-center justify-center rounded-full bg-primary/10 text-primary">
                              <img
                                src={connection.icon}
                                alt={connection.title}
                                className="w-6 h-6"
                              />
                            </div>
                            {connection.title}
                          </FieldTitle>
                          <FieldDescription>
                            {connection.description}
                          </FieldDescription>
                        </FieldContent>
                        <Checkbox
                          id={`connection-${connection.id}`}
                          value={connection.id}
                          checked={field.value.includes(connection.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange([...field.value, connection.id]);
                            } else {
                              field.onChange(
                                field.value.filter((id) => id !== connection.id)
                              );
                            }
                          }}
                        />
                      </Field>
                    </FieldLabel>
                  ))}
                </FieldGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldSet>
            )}
          />
        )}

        {selectResources === "local" && (
          <Controller
            name="file"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet data-invalid={fieldState.invalid}>
                <FieldLegend> Archivo CSV </FieldLegend>
                <FieldDescription>
                  Selecciona un archivo CSV para cargar tus datos.
                </FieldDescription>
                <CSVUploader
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldSet>
            )}
          />
        )}
        <Field>
          <Button type="submit">Crear Análisis</Button>
        </Field>
      </FieldGroup>
    </form>
  );
};
