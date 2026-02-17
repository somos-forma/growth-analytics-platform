"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useCreateUser } from "../hooks/useCreateUser";
import { useUserStore } from "../store";

const formSchema = z
  .object({
    name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    email: z.email({ message: "Ingresa un correo válido" }),
    password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
    rol: z.enum(["admin", "user"]),
    type: z
      .object({
        leads: z.object({ check: z.boolean() }),
        ecommerce: z.object({ check: z.boolean() }),
      })
      .optional(),
    client_id: z.array(z.string()),
  })
  .refine(
    (data) => {
      if (data.rol === "admin") {
        return data.type !== undefined;
      }
      return true;
    },
    {
      message: "Debe seleccionar el tipo de administrador",
      path: ["type"],
    },
  );

export function CreateUserForm() {
  const { closeCreateUserModal } = useUserStore();
  const { mutate, isPending } = useCreateUser();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rol: "user",
      type: { leads: { check: false }, ecommerce: { check: false } },
      client_id: [],
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    mutate(
      {
        email: data.email,
        name: data.name,
        password: data.password,
        rol: data.rol,
        type: data.type,
        client_id: data.client_id,
      },
      {
        onSuccess: () => {
          closeCreateUserModal();
          toast.success("Usuario creado exitosamente");
          queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: () => {
          toast.error("Error al crear el usuario");
        },
      },
    );
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
              <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="Juan Pérez" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="example@email.com" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Contraseña</FieldLabel>
              <div className="flex">
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="rol"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Rol</FieldLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuario</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {form.watch("rol") === "admin" && (
          <Controller
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Tipo</FieldLabel>
                <div className="flex gap-8">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-medium">Leads</span>
                    <Checkbox
                      checked={field.value?.leads?.check || false}
                      onCheckedChange={(checked) =>
                        field.onChange({ ...field.value, leads: { check: Boolean(checked) } })
                      }
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-medium">Ecommerce</span>
                    <Checkbox
                      checked={field.value?.ecommerce?.check || false}
                      onCheckedChange={(checked) =>
                        field.onChange({ ...field.value, ecommerce: { check: Boolean(checked) } })
                      }
                    />
                  </div>
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        )}

        <Field>
          <Button disabled={isPending} type="submit">
            {isPending && <Spinner />}
            Crear usuario
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
