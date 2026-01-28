"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { BarChart3, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useCreateClient } from "../hooks/userLoginDashboard";
import { useAuthStore } from "../store";

const formSchema = z.object({
  email: z.email({ message: "Ingresa un correo válido" }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
});

export function LoginForm() {
  const { setAuthStore } = useAuthStore();
  const { mutate, isPending } = useCreateClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const payload = {
      email: data.email,
      password: data.password,
    };
    mutate(payload, {
      onSuccess: (result) => {
        setAuthStore(result);
        localStorage.setItem("userEmail", result.email);
        toast.success("Inicio de sesión exitoso");
        router.push("/dashboard/google-analytics");
      },
      onError: () => {
        toast.error("Error al iniciar sesión");
      },
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <div className="p-2 bg-primary rounded-lg">
            <BarChart3 className="h-8 w-8 text-primary-foreground" />
          </div>
          <TrendingUp className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-balance">Growth Analytics</h1>
        <p className="text-muted-foreground text-pretty">Analiza el rendimiento de tus campañas de marketing</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-lg font-semibold">Iniciar Sesión</CardTitle>
          <CardDescription className="text-center">Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="form-rhf-login" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
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
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      type="password"
                      placeholder="********"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex gap-2 flex-col">
          <Field orientation="horizontal">
            <Button type="submit" disabled={isPending} form="form-rhf-login" className="w-full">
              {isPending && <Spinner />}
              Iniciar Sesión
            </Button>
          </Field>
          <p className="text-xs">demo:admin@example.com | admin12345</p>
          <p className="text-xs">demo:user@example.com | user12345</p>
        </CardFooter>
      </Card>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="space-y-2">
          <div className="p-2 bg-chart-1/10 rounded-lg mx-auto w-fit">
            <BarChart3 className="h-4 w-4 text-chart-1" />
          </div>
          <p className="text-xs text-muted-foreground">GA4 Analytics</p>
        </div>
        <div className="space-y-2">
          <div className="p-2 bg-chart-2/10 rounded-lg mx-auto w-fit">
            <TrendingUp className="h-4 w-4 text-chart-2" />
          </div>
          <p className="text-xs text-muted-foreground">Google Ads</p>
        </div>
        <div className="space-y-2">
          <div className="p-2 bg-chart-3/10 rounded-lg mx-auto w-fit">
            <BarChart3 className="h-4 w-4 text-chart-3" />
          </div>
          <p className="text-xs text-muted-foreground">Meta Ads</p>
        </div>
      </div>
    </div>
  );
}
