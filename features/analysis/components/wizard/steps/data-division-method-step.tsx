import { zodResolver } from "@hookform/resolvers/zod";
import { BrainCircuit } from "lucide-react";
import { es } from "react-day-picker/locale";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Slider } from "@/components/ui/slider";

import { type DataDivisionMethodSchemaType, dataDivisionMethodSchema } from "../wizard-schemas";
import { useWizardStore } from "../wizard-store";

const methods = [
  {
    id: "proportion",
    title: "Proporcional",
    description: "División proporcional de los datos en entrenamiento y prueba.",
  },
  {
    id: "date",
    title: "Por fecha",
    description: "División por fecha de los datos en entrenamiento y prueba.",
  },
] as const;

export const DataDivisionMethodStep = () => {
  const { next, back, data, updateData } = useWizardStore();

  const form = useForm<DataDivisionMethodSchemaType>({
    resolver: zodResolver(dataDivisionMethodSchema),
    defaultValues: {
      method: data.method,
    },
  });

  const onSubmit = (values: DataDivisionMethodSchemaType) => {
    console.log(values);
    next();
    updateData(values);
  };

  const selectedMethod = form.watch("method.fecha.check") ? "date" : "proportion";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 max-w-[800px]">
      <FieldGroup>
        <Controller
          name="method"
          control={form.control}
          render={({ fieldState }) => (
            <FieldSet data-invalid={fieldState.invalid}>
              <FieldLegend>Metodo de divisió́n de datos</FieldLegend>
              <FieldDescription>
                Selecciona el metodo de divisió́n de datos que deseas para el entrenamiento del modelo.
              </FieldDescription>
              <RadioGroup
                value={selectedMethod}
                onValueChange={(value) => {
                  form.setValue("method.fecha.check", value === "date");
                  form.setValue("method.proporcional.check", value === "proportion");
                }}
                className="flex"
              >
                {methods.map((method) => (
                  <FieldLabel key={method.id} htmlFor={`form-rhf-radiogroup-${method.id}`}>
                    <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldTitle>
                          <div className="w-10 h-10  flex items-center justify-center rounded-full bg-primary/10 text-primary">
                            <BrainCircuit />
                          </div>
                          {method.title}
                        </FieldTitle>
                        <FieldDescription>{method.description}</FieldDescription>
                      </FieldContent>
                      <RadioGroupItem value={method.id} id={`form-rhf-radiogroup-${method.id}`} />
                    </Field>
                  </FieldLabel>
                ))}
              </RadioGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldSet>
          )}
        />
        {selectedMethod === "proportion" && (
          <Controller
            name="method.proporcional.entrenamiento"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet data-invalid={fieldState.invalid}>
                <FieldLegend>Proporción de datos para entrenamiento</FieldLegend>
                <FieldDescription>
                  Selecciona el porcentaje de datos que deseas usar para entrenar el modelo.
                </FieldDescription>
                <Slider
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                  max={100}
                  step={1}
                  min={0}
                  aria-invalid={fieldState.invalid}
                />
                <div className="flex justify-between">
                  <p className="text-xs">
                    Datos usados para el entrenamiento: <strong>{field.value}%</strong>
                  </p>
                  <p className="text-xs">
                    Datos usados para las pruebas: <strong>{100 - field.value}%</strong>
                  </p>
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldSet>
            )}
          />
        )}
        {selectedMethod === "date" && (
          <Controller
            name="method.fecha"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet data-invalid={fieldState.invalid}>
                <FieldLegend>Rango de fechas para división</FieldLegend>
                <FieldDescription>
                  Selecciona el rango de fechas que dividirá los datos de entrenamiento y prueba.
                </FieldDescription>
                <Calendar
                  className="border"
                  mode="range"
                  numberOfMonths={2}
                  ISOWeek
                  captionLayout="dropdown"
                  locale={es}
                  selected={
                    field.value?.from && field.value?.to
                      ? {
                          from: new Date(field.value.from),
                          to: new Date(field.value.to),
                        }
                      : undefined
                  }
                  onSelect={(date) => {
                    if (date?.from) {
                      field.onChange({
                        ...field.value,
                        from: date.from.toISOString().split("T")[0],
                        to: date.to?.toISOString().split("T")[0] || "",
                      });
                    }
                  }}
                />
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
