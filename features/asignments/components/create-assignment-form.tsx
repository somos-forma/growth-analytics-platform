"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useCreateAssignment } from "../hooks/useCreateAssignment";
import { Spinner } from "@/components/ui/spinner";
import { useAssignmentStore } from "../store";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
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
  clientsId: z
    .array(z.string())
    .min(1, { message: "Selecciona al menos un cliente" }),
});

export function CreateAssignmentForm() {
  const { closeCreateAssignmentModal } = useAssignmentStore();
  const { mutate, isPending } = useCreateAssignment();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientsId: [],
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    mutate(data, {
      onSuccess: () => {
        closeCreateAssignmentModal();
        toast.success("Cliente asignado exitosamente");
      },
      onError: () => {
        toast.error("Error al asignar el cliente");
      },
    });
  }

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const clientWatch = form.watch("clientsId");
  return (
    <>
      <Input
        type="text"
        placeholder="Buscar clientes disponibles..."
        className="border p-2"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="flex items-center justify-between">
        <p className="text-sm">
          <strong>{filteredClients.length} </strong>clientes encontrados
        </p>
        {clientWatch.length > 0 && (
          <p className="text-sm">
            <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums me-1">
              {clientWatch.length}
            </Badge>
            clientes seleccionados
          </p>
        )}
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="clientsId"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet data-invalid={fieldState.invalid}>
                <FieldLegend className="sr-only">Clientes</FieldLegend>
                <FieldDescription className="sr-only">
                  Selecciona uno o más clientes para asignarlos al usuario.
                </FieldDescription>
                <ScrollArea className="h-80 ">
                  <FieldGroup data-slot="checkbox-group">
                    {filteredClients.length > 0 ? (
                      filteredClients.map((client) => (
                        <FieldLabel
                          key={client.id}
                          htmlFor={`client-${client.id}`}
                        >
                          <Field
                            orientation="horizontal"
                            data-invalid={fieldState.invalid}
                          >
                            <FieldContent>
                              <FieldTitle>
                                <div className="w-10 h-10  flex items-center justify-center rounded-xl bg-primary/10 text-primary">
                                  <p>{client.name.at(0)}</p>
                                </div>
                                <div>
                                  <p className="font-medium">{client.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    ID:#CM-8832
                                  </p>
                                </div>
                              </FieldTitle>
                            </FieldContent>
                            <Checkbox
                              id={`client-${client.id}`}
                              value={client.id}
                              checked={
                                field.value?.includes(client.id) || false
                              }
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || [];
                                if (checked) {
                                  field.onChange([...currentValue, client.id]);
                                } else {
                                  field.onChange(
                                    currentValue.filter(
                                      (id) => id !== client.id
                                    )
                                  );
                                }
                              }}
                            />
                          </Field>
                        </FieldLabel>
                      ))
                    ) : (
                      <p className="p-4 text-center text-sm text-muted-foreground">
                        No se encontraron clientes.
                      </p>
                    )}
                  </FieldGroup>
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldSet>
            )}
          />

          <Field>
            <div className="flex gap-4 justify-end ">
              <Button variant="outline" onClick={closeCreateAssignmentModal}>
                Cancelar
              </Button>
              <Button disabled={isPending} type="submit">
                {isPending && <Spinner />}
                Asignar clientes seleccionados
              </Button>
            </div>
          </Field>
        </FieldGroup>
      </form>
    </>
  );
}
