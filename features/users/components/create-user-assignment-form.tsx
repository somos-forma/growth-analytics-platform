"use client";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface Client {
  id: string;
  name: string;
  description: string;
}

interface CreateUserAssignmentFormProps {
  selectedClientIds: string[];
  onChange: (clientIds: string[]) => void;
  clients: Client[];
}

export function CreateUserAssignmentForm({
  selectedClientIds,
  onChange,
  clients,
}: CreateUserAssignmentFormProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        {selectedClientIds.length > 0 && (
          <p className="text-sm">
            <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums me-1">
              {selectedClientIds.length}
            </Badge>
            clientes seleccionados
          </p>
        )}
      </div>
      <FieldGroup>
        <FieldSet>
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
                        checked={selectedClientIds.includes(client.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            onChange([...selectedClientIds, client.id]);
                          } else {
                            onChange(
                              selectedClientIds.filter(
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
        </FieldSet>
      </FieldGroup>
    </>
  );
}
