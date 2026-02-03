import { zodResolver } from "@hookform/resolvers/zod";
import { BrainCircuit } from "lucide-react";
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
import { type ModelSchemaType, modelSchema } from "../wizard-schemas";
import { useWizardStore } from "../wizard-store";

const models = [
  {
    id: "meridian",
    title: "Meridian",
    description:
      "Modelo de Google para Marketing Mix Modeling con enfoque en incrementalidad y optimización de presupuesto",
  },
  {
    id: "robyn",
    title: "Robyn",
    description:
      "Modelo open-source de Meta para Marketing Mix Modeling con capacidades avanzadas de machine learning y optimización.",
  },
] as const;

export const ModelStep = () => {
  const { next, back, data, updateData } = useWizardStore();

  const form = useForm<ModelSchemaType>({
    resolver: zodResolver(modelSchema),
    defaultValues: data,
  });

  const onSubmit = (values: ModelSchemaType) => {
    updateData(values);
    next();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 max-w-[800px]">
      <FieldGroup>
        <Controller
          name="model"
          control={form.control}
          render={({ field, fieldState }) => (
            <FieldSet data-invalid={fieldState.invalid}>
              <FieldLegend>Modelo</FieldLegend>
              <FieldDescription>Selecciona el modelo que deseas utilizar para tu análisis.</FieldDescription>
              <RadioGroup
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                aria-invalid={fieldState.invalid}
                className="flex"
              >
                {models.map((model) => (
                  <FieldLabel key={model.id} htmlFor={`form-rhf-radiogroup-${model.id}`}>
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                      className={model.id === "robyn" ? "opacity-50 pointer-events-none" : undefined}
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
                        disabled={model.id === "robyn"}
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
