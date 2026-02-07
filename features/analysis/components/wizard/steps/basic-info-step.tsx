import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { type BasicInfoSchemaType, basicInfoSchema } from "../wizard-schemas";
import { useWizardStore } from "../wizard-store";

export const BasicInfoStep = () => {
  const { next, data, updateData } = useWizardStore();

  const form = useForm<BasicInfoSchemaType>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: data,
  });

  const onSubmit = (values: BasicInfoSchemaType) => {
    updateData(values);
    next();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 max-w-[800px]">
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
              <FieldLabel htmlFor={field.name}>Descripción del Análisis</FieldLabel>
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
      </FieldGroup>
      <Button type="submit">Siguiente</Button>
    </form>
  );
};
