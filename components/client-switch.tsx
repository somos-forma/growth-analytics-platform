"use client";
import { useQuery } from "@tanstack/react-query";
import { Building2, ChevronsUpDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/features/auth/store";
import { getClients } from "@/features/clients/services/client";
import { Button } from "./ui/button";

export const ClientSwitch = () => {
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const {
    authStore,
    selectedClientId: globalSelectedClientId,
    setSelectedClientId: setGlobalSelectedClientId,
  } = useAuthStore();
  const [allowedClientIds, setAllowedClientIds] = useState<string[]>([]);

  useEffect(() => {
    let ids: string[] = [];
    if (authStore?.client_id) {
      ids = authStore.client_id;
    } else {
      const stored = localStorage.getItem("clientId");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            ids = parsed;
          } else if (typeof parsed === "string") {
            ids = [parsed];
          }
        } catch (e) {
          console.error("Failed to parse clientId from localStorage", e);
        }
      }
    }
    setAllowedClientIds(ids);
  }, [authStore]);

  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  const filteredClients = clients?.filter((client) => {
    return allowedClientIds.includes(String(client.id));
  });

  useEffect(() => {
    if (filteredClients && filteredClients.length > 0 && !selectedClientId) {
      const storedSelectedClientId = globalSelectedClientId || localStorage.getItem("selectedClient");

      if (storedSelectedClientId && filteredClients.some((client) => String(client.id) === storedSelectedClientId)) {
        setSelectedClientId(storedSelectedClientId);
        setGlobalSelectedClientId(storedSelectedClientId);
        return;
      }

      const defaultId = String(filteredClients[0].id);
      setSelectedClientId(defaultId);
      setGlobalSelectedClientId(defaultId);
      localStorage.setItem("selectedClient", defaultId);
    }
  }, [filteredClients, selectedClientId, globalSelectedClientId, setGlobalSelectedClientId]);

  const handleClientChange = (value: string) => {
    setSelectedClientId(value);
    setGlobalSelectedClientId(value);
    localStorage.setItem("selectedClient", value);
  };

  const selectedClient = filteredClients?.find((c) => String(c.id) === selectedClientId);

  if (isLoading) {
    return (
      <Button variant="outline" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Building2 className="mr-2 h-4 w-4" /> {selectedClient ? selectedClient.name : "Select Client"}{" "}
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Clientes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={selectedClientId} onValueChange={handleClientChange}>
          {filteredClients?.map((client) => (
            <DropdownMenuRadioItem key={client.id} value={String(client.id)}>
              {client.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
