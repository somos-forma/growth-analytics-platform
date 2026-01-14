import { useWizardStore } from "../wizard-store";
import { Controller, useForm } from "react-hook-form";
import { es } from "react-day-picker/locale";

import {
  dataDivisionMethodSchema,
  DataDivisionMethodSchemaType,
} from "../wizard-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { BrainCircuit, CalendarIcon, ChevronDownIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

const methods = [
  {
    id: "proportion",
    title: "Proporcional",
    description:
      "División proporcional de los datos en entrenamiento y prueba.",
  },
  {
    id: "date",
    title: "Por fecha",
    description: "División por fecha de los datos en entrenamiento y prueba.",
  },
] as const;

export const DataDivisionMethodStep = () => {
  const { next, back, data, updateData } = useWizardStore();
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  const form = useForm<DataDivisionMethodSchemaType>({
    resolver: zodResolver(dataDivisionMethodSchema),
    defaultValues: {
      dataDivisionMethod: data.dataDivisionMethod,
      dataDivisionProportion: data.dataDivisionProportion,
      dataDivisionDate: data.dataDivisionDate,
    },
  });

  const onSubmit = (values: DataDivisionMethodSchemaType) => {
    next();
    updateData(values);
  };

  const selectedMethod = form.watch("dataDivisionMethod");

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <FieldGroup>
        <Controller
          name="dataDivisionMethod"
          control={form.control}
          render={({ field, fieldState }) => (
            <FieldSet data-invalid={fieldState.invalid}>
              <FieldLegend>Metodo de divisió́n de datos</FieldLegend>
              <FieldDescription>
                Selecciona el metodo de divisió́n de datos que deseas para el
                entrenamiento del modelo.
              </FieldDescription>
              <RadioGroup
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                aria-invalid={fieldState.invalid}
                className="flex"
              >
                {methods.map((method) => (
                  <FieldLabel
                    key={method.id}
                    htmlFor={`form-rhf-radiogroup-${method.id}`}
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
                          {method.title}
                        </FieldTitle>
                        <FieldDescription>
                          {method.description}
                        </FieldDescription>
                      </FieldContent>
                      <RadioGroupItem
                        value={method.id}
                        id={`form-rhf-radiogroup-${method.id}`}
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
        {selectedMethod === "proportion" && (
          <Controller
            name="dataDivisionProportion"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet data-invalid={fieldState.invalid}>
                <FieldLegend>
                  Proporción de datos para entrenamiento
                </FieldLegend>
                <FieldDescription>
                  Selecciona el porcentaje de datos que deseas usar para
                  entrenar el modelo.
                </FieldDescription>
                <Slider
                  value={[field.value || 80]}
                  onValueChange={(value) => field.onChange(value[0])}
                  max={100}
                  step={1}
                  min={0}
                  aria-invalid={fieldState.invalid}
                />
                <div className="flex justify-between">
                  <p className="text-xs">
                    Datos usados para el entrenamiento:{" "}
                    <strong>{field.value || 80}%</strong>
                  </p>
                  <p className="text-xs">
                    Datos usados para las pruebas:{" "}
                    <strong>{100 - (field.value || 80)}%</strong>
                  </p>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldSet>
            )}
          />
        )}
        {selectedMethod === "date" && (
          <Controller
            name="dataDivisionDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet data-invalid={fieldState.invalid}>
                <FieldLegend>Rango de fechas para división</FieldLegend>
                <FieldDescription>
                  Selecciona el rango de fechas que dividirá los datos de
                  entrenamiento y prueba.
                </FieldDescription>
                <Calendar
                  className="border"
                  mode="range"
                  numberOfMonths={2}
                  ISOWeek
                  captionLayout="dropdown"
                  locale={es}
                  selected={
                    field.value?.startDate && field.value?.endDate
                      ? {
                          from: new Date(field.value.startDate),
                          to: new Date(field.value.endDate),
                        }
                      : undefined
                  }
                  onSelect={(date) => {
                    if (date?.from) {
                      field.onChange({
                        ...field.value,
                        startDate: date.from.toISOString(),
                        endDate: date.to?.toISOString() || "",
                      });
                    }
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
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
