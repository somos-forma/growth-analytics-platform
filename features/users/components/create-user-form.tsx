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
        <Field>
          <div className="flex justify-between items-center">
            <FieldLabel>Client IDs</FieldLabel>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                const current = form.getValues('client_id');
                form.setValue('client_id', [...current, '']);
              }}
            >
              Add Client ID
            </Button>
          </div>
          {form.watch('client_id').map((id, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                value={id}
                onChange={(e) => {
                  const current = form.getValues('client_id');
                  current[index] = e.target.value;
                  form.setValue('client_id', current);
                }}
                placeholder="Client ID"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => {
                  const current = form.getValues('client_id');
                  form.setValue('client_id', current.filter((_, i) => i !== index));
                }}
              >
                Delete
              </Button>
            </div>
          ))}
        </Field>
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
