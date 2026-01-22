"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateClient } from "../hooks/useUpdateClient";
import { useClientStore } from "../store";

const formSchema = z
  .object({
    name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    description: z.string().optional(),
    website_url: z.string().url({ message: "URL inválida" }).or(z.literal("")),
    gcp_id: z.string().min(1, { message: "GCP ID requerido" }),
    ga4_check: z.boolean(),
    ga4_value: z.string().optional(),
    google_ads_check: z.boolean(),
    google_ads_value: z.string().optional(),
    meta_ads_check: z.boolean(),
    meta_ads_value: z.string().optional(),
  })
  .refine((data) => !data.ga4_check || (data.ga4_value && data.ga4_value.length > 0), {
    message: "Valor GA4 requerido si está marcado",
    path: ["ga4_value"],
  })
  .refine((data) => !data.google_ads_check || (data.google_ads_value && data.google_ads_value.length > 0), {
    message: "Valor Google Ads requerido si está marcado",
    path: ["google_ads_value"],
  })
  .refine((data) => !data.meta_ads_check || (data.meta_ads_value && data.meta_ads_value.length > 0), {
    message: "Valor Meta Ads requerido si está marcado",
    path: ["meta_ads_value"],
  });

export function UpdateClientForm() {
  const { closeEditClientModal, client } = useClientStore();
  const { mutate, isPending } = useUpdateClient();

  const sources = client?.source[0]?.sources;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: client?.name || "",
      description: client?.description || "",
      website_url: client?.website_url || "",
      gcp_id: client?.gcp_id || "",
      ga4_check: sources?.ga4.check || false,
      ga4_value: sources?.ga4.value || "",
      google_ads_check: sources?.google_ads.check || false,
      google_ads_value: sources?.google_ads.value || "",
      meta_ads_check: sources?.meta_ads.check || false,
      meta_ads_value: sources?.meta_ads.value || "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const payload = {
      id: client?.id ?? "",
      name: data.name,
      description: data.description || "",
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
    };

    mutate(payload, {
      onSuccess: () => {
        closeEditClientModal();
        toast.success("Cliente actualizado exitosamente");
      },
      onError: () => {
        toast.error("Error al actualizar el cliente");
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
              <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="Mi Empresa S.A." />
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
              <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="https://cliente.com" />
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
              <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="uui-google-cloud-id" />
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
                <Checkbox id="ga4_check" checked={field.value} onCheckedChange={field.onChange} />
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
                  <Input {...field} placeholder="G-24124213" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          )}
          <Controller
            name="google_ads_check"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox id="google_ads_check" checked={field.value} onCheckedChange={field.onChange} />
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
                  <Input {...field} placeholder="1234567890" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          )}
          <Controller
            name="meta_ads_check"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox id="meta_ads_check" checked={field.value} onCheckedChange={field.onChange} />
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
                  <Input {...field} placeholder="12345678900000" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          )}
        </Field>
        <Button disabled={isPending} type="submit">
          {isPending && <Spinner />}
          Actualizar cliente
        </Button>
      </FieldGroup>
    </form>
  );
}
