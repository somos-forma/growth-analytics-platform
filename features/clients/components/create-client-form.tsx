"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useCreateClient } from "../hooks/useCreateClient";
import { Spinner } from "@/components/ui/spinner";
import { useClientStore } from "../store";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    website_url: z.string().url({ message: "URL inválida" }).or(z.literal("")),
    gcp_id: z.string().min(1, { message: "GCP ID requerido" }),
    description: z.string().optional(),
    ga4_check: z.boolean(),
    ga4_value: z.string().optional(),
    google_ads_check: z.boolean(),
    google_ads_value: z.string().optional(),
    meta_ads_check: z.boolean(),
    meta_ads_value: z.string().optional(),
  })
  .refine(
    (data) => !data.ga4_check || (data.ga4_value && data.ga4_value.length > 0),
    {
      message: "Valor GA4 requerido si está marcado",
      path: ["ga4_value"],
    }
  )
  .refine(
    (data) =>
      !data.google_ads_check ||
      (data.google_ads_value && data.google_ads_value.length > 0),
    {
      message: "Valor Google Ads requerido si está marcado",
      path: ["google_ads_value"],
    }
  )
  .refine(
    (data) =>
      !data.meta_ads_check ||
      (data.meta_ads_value && data.meta_ads_value.length > 0),
    {
      message: "Valor Meta Ads requerido si está marcado",
      path: ["meta_ads_value"],
    }
  );

export function CreateClientForm() {
  const { closeCreateClientModal } = useClientStore();
  const { mutate, isPending } = useCreateClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      website_url: "",
      gcp_id: "",
      description: "",
      ga4_check: false,
      ga4_value: "",
      google_ads_check: false,
      google_ads_value: "",
      meta_ads_check: false,
      meta_ads_value: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const payload = {
      name: data.name,
      website_url: data.website_url,
      source: [
        {
          sources: {
            ga4: {
              check: data.ga4_check,
              value: data.ga4_value || "",
            },
            google_ads: {
              check: data.google_ads_check,
              value: data.google_ads_value || "",
            },
            meta_ads: {
              check: data.meta_ads_check,
              value: data.meta_ads_value || "",
            },
          },
        },
      ],
      gcp_id: data.gcp_id,
      description: data.description,
    };
    mutate(payload, {
      onSuccess: () => {
        closeCreateClientModal();
        console.log("Cliente creado:", payload);
        toast.success("Cliente creado exitosamente");
      },
      onError: () => {
        toast.error("Error al crear el cliente");
      },
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="overflow-y-auto max-h-[450px]">
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Nombre</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Mi Empresa S.A."
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Descripción</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Mi Empresa dedicada a..."
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="website_url"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>URL del Sitio Web</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="https://cliente.com"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="gcp_id"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>GCP ID</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="uui-google-cloud-id"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <FieldLabel>Fuentes de Datos</FieldLabel>
          <Controller
            name="ga4_check"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ga4_check"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <label htmlFor="ga4_check">GA4</label>
              </div>
            )}
          />
          {form.watch("ga4_check") && (
            <Controller
              name="ga4_value"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    placeholder="G-24124213"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}
          <Controller
            name="google_ads_check"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="google_ads_check"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <label htmlFor="google_ads_check">Google Ads</label>
              </div>
            )}
          />
          {form.watch("google_ads_check") && (
            <Controller
              name="google_ads_value"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    placeholder="1234567890"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}
          <Controller
            name="meta_ads_check"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="meta_ads_check"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <label htmlFor="meta_ads_check">Meta Ads</label>
              </div>
            )}
          />
          {form.watch("meta_ads_check") && (
            <Controller
              name="meta_ads_value"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    placeholder="12345678900000"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}
        </Field>
        <Button disabled={isPending} type="submit">
          {isPending && <Spinner />}
          Crear cliente
        </Button>
      </FieldGroup>
    </form>
  );
}
