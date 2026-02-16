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
import { useUpdateUser } from "../hooks/useUpdateUser";
import { useUserStore } from "../store";

const formSchema = z
  .object({
    name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    email: z.email({ message: "Ingresa un correo válido" }),
    password: z.union([
      z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
      z.literal(""),
    ]),
    rol: z.enum(["admin", "user"]),
    client_id: z.array(z.string()).optional(),
    type: z
      .object({
        leads: z.object({ check: z.boolean() }),
        ecommerce: z.object({ check: z.boolean() }),
      })
      .optional(),
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

export function UpdateUserForm() {
  const { closeEditUserModal, user } = useUserStore();
  const { mutate, isPending } = useUpdateUser();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: user?.password || "",
      rol: (user?.rol as "admin" | "user") || "user",
      client_id: user?.client_id || [],
      type: user?.type || { leads: { check: false }, ecommerce: { check: false } },
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    const client_id = data.client_id ?? user?.client_id ?? [];
    const newUser = { ...data, id: user?.id ?? "id-undefined", client_id };
    mutate(newUser, {
      onSuccess: () => {
        closeEditUserModal();
        toast.success("Usuario actualizado exitosamente");
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
      onError: () => {
        toast.error("Error al actualizar el usuario");
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
            Guardar usuario
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
