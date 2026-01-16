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
import { useCreateUser } from "../hooks/useCreateUser";
import { Spinner } from "@/components/ui/spinner";
import { useUserStore } from "../store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { CreateUserAssignmentForm } from "./create-user-assignment-form";

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
  client_id: z.array(z.string()),
});

export function CreateUserForm() {
  const { closeCreateUserModal } = useUserStore();
  const { mutate, isPending } = useCreateUser();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rol: "user",
      client_id: [],
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    mutate({
      email: data.email,
      name: data.name,
      password: data.password,
      rol: data.rol,
      client_id: data.client_id
    }, {
      onSuccess: () => {
        closeCreateUserModal();
        toast.success("Usuario creado exitosamente");
      },
      onError: () => {
        toast.error("Error al crear el usuario");
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
            Crear usuario
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}