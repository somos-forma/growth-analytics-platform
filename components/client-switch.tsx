"use client";
import { Building2, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";

const clients: Record<string, string> = {
  integramedica: "Integramédica",
  // entel: "Entel",
  // claro: "Claro",
};
export const ClientSwitch = () => {
  const [position, setPosition] = useState("integramedica");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Building2 /> {clients[position]} <ChevronsUpDown className=" size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Clientes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value="integramedica">Integramédica</DropdownMenuRadioItem>
          {/* <DropdownMenuRadioItem value="entel">Entel</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="claro">Claro</DropdownMenuRadioItem> */}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
