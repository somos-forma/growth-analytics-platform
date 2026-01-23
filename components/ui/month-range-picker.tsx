"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type MonthRange = { from?: Date; to?: Date };

interface MonthRangePickerProps {
  initialFrom?: Date;
  initialTo?: Date;
  onChange?: (range: MonthRange) => void;
  className?: string;
}

export function MonthRangePicker({ initialFrom, initialTo, onChange, className }: MonthRangePickerProps) {
  const [date, setDate] = useState<MonthRange>({ from: initialFrom, to: initialTo });
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  const updateRange = (next: MonthRange) => {
    setDate(next);
    onChange?.(next);
  };

  return (
    <div className={className ? className : "w-full flex justify-end"}>
      <div className="flex flex-row items-end gap-2">
        {/* <p className="text-sm text-muted-foreground m-auto">Seleccione rango de fechas: </p> */}
        <div className="flex gap-2">
          <Popover open={openFrom} onOpenChange={setOpenFrom}>
            <PopoverTrigger asChild>
              <Button variant="outline" className=" justify-between font-semibold">
                Desde: {format(date.from || new Date(), "MMMM yyyy", { locale: es })}
                <ChevronDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={date.from}
                defaultMonth={date.from || new Date()}
                onSelect={(selectedDate) => {
                  const next = { ...date, from: selectedDate };
                  updateRange(next);
                  setOpenFrom(false);
                }}
                locale={es}
              />
            </PopoverContent>
          </Popover>
          <Popover open={openTo} onOpenChange={setOpenTo}>
            <PopoverTrigger asChild>
              <Button variant="outline" className=" justify-between font-semibold">
                Hasta: {format(date.to || new Date(), "MMMM yyyy", { locale: es })}
                <ChevronDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={date.to}
                defaultMonth={date.to || new Date()}
                onSelect={(selectedDate) => {
                  const next = { ...date, to: selectedDate };
                  updateRange(next);
                  setOpenTo(false);
                }}
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
