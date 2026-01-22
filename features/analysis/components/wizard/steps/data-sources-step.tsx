import { zodResolver } from "@hookform/resolvers/zod";
import { Database, FileSpreadsheet } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { type DataSourcesSchemaType, dataSourcesSchema } from "../wizard-schemas";
import { useWizardStore } from "../wizard-store";

const types = [
  {
    id: "integrate",
    title: "Integradas",
    description:
      "Conecta tus fuentes de datos publicitarias y analíticas para un análisis automatizado y en tiempo real.",
  },
  {
    id: "local",
    title: "Local",
    description: "Sube tus propios archivos CSV con datos históricos para un análisis personalizado y control total.",
  },
] as const;

export const ConnectionTypeStep = () => {
  const { next, back, data, updateData } = useWizardStore();

  const form = useForm<DataSourcesSchemaType>({
    resolver: zodResolver(dataSourcesSchema),
    defaultValues: data,
  });

  const onSubmit = (values: DataSourcesSchemaType) => {
    updateData(values);
    next();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <FieldGroup>
        <Controller
          name="dataSources"
          control={form.control}
          render={({ field, fieldState }) => (
            <FieldSet data-invalid={fieldState.invalid}>
              <FieldLegend>Fuentes de Datos</FieldLegend>
              <FieldDescription>Selecciona la fuente de datos que deseas utilizar para tu análisis.</FieldDescription>
              <RadioGroup
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                aria-invalid={fieldState.invalid}
                className="flex"
              >
                {types.map((resource) => (
                  <FieldLabel key={resource.id} htmlFor={`form-rhf-radiogroup-${resource.id}`}>
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                      className={resource.id === "local" ? "opacity-50 pointer-events-none" : undefined}
                    >
                      <FieldContent>
                        <FieldTitle>
                          <div className="w-10 h-10  flex items-center justify-center rounded-full bg-primary/10 text-primary">
                            {resource.id === "integrate" ? <Database /> : <FileSpreadsheet />}
                          </div>
                          {resource.title}
                        </FieldTitle>
                        <FieldDescription>{resource.description}</FieldDescription>
                      </FieldContent>
                      <RadioGroupItem
                        value={resource.id}
                        id={`form-rhf-radiogroup-${resource.id}`}
                        aria-invalid={fieldState.invalid}
                        disabled={resource.id === "local"}
                      />
                    </Field>
                  </FieldLabel>
                ))}
              </RadioGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldSet>
          )}
        />
      </FieldGroup>
      <div className="space-x-4">
        <Button onClick={back}>Anterior</Button>
        <Button type="submit">Siguiente</Button>
      </div>
    </form>
  );
};
