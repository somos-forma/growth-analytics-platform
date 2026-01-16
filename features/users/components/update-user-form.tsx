"use client";
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Spinner } from "@/components/ui/spinner";
import { useUserStore } from "../store";
import { useUpdateUser } from "../hooks/useUpdateUser";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateUserAssignmentForm } from "./create-user-assignment-form";
import { Eye, EyeOff } from "lucide-react";

const clients = [
  {
    id: "a7k9x2",
    name: "Cliente A",
    description: "Descripción del Cliente A",
  },
  {
    id: "b4m3y8",
    name: "Cliente B",
    description: "Descripción del Cliente B",
  },
  {
    id: "c1n5z6",
    name: "Cliente C",
    description: "Descripción del Cliente C",
  },
  {
    id: "d3p7q4",
    name: "Cliente D",
    description: "Descripción del Cliente D",
  },
  {
    id: "e9r2s1",
    name: "Cliente E",
    description: "Descripción del Cliente E",
  },
  {
    id: "f6t8u3",
    name: "Cliente F",
    description: "Descripción del Cliente F",
  },
  {
    id: "g0v4w5",
    name: "Cliente G",
    description: "Descripción del Cliente G",
  },
];

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.email({ message: "Ingresa un correo válido" }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
  rol: z.enum(["admin", "user"]),
  client_id: z.array(z.string()).min(1, { message: "Selecciona al menos un cliente" }),
});

export function UpdateUserForm() {
  const { closeEditUserModal, user } = useUserStore();
  const { mutate, isPending } = useUpdateUser();
  const [showPassword, setShowPassword] = useState(false);
  
  // Combinar clientes disponibles con los que ya tiene el usuario
  const allClients = useMemo(() => {
    const existingClientIds = new Set(clients.map(c => c.id));
    const userClients = user?.client_id || [];
    
    // Agregar clientes del usuario que no estén en la lista
    const additionalClients = userClients
      .filter(clientId => !existingClientIds.has(clientId))
      .map(clientId => ({
        id: clientId,
        name: `Cliente ${clientId}`,
        description: `Cliente asignado al usuario`,
      }));
    
    return [...clients, ...additionalClients];
  }, [user?.client_id]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: user?.password || "",
      rol: (user?.rol as "admin" | "user") || "user",
      client_id: user?.client_id || [],
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    const newUser = { ...data, id: user?.id! };
    mutate(newUser, {
      onSuccess: () => {
        closeEditUserModal();
        toast.success("Usuario actualizado exitosamente");
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
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Juan Pérez"
              />
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
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="example@email.com"
              />
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

        <Controller
          name="client_id"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Client IDs</FieldLabel>
              <div className="space-y-2">
                {field.value.map((clientId: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={clientId}
                      onChange={(e) => {
                        const newClientIds = [...field.value];
                        newClientIds[index] = e.target.value;
                        field.onChange(newClientIds);
                      }}
                      placeholder="Ingrese Client ID"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newClientIds = field.value.filter((_: string, i: number) => i !== index);
                        field.onChange(newClientIds);
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    field.onChange([...field.value, ""]);
                  }}
                >
                  Agregar Client ID
                </Button>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

       
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