import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const AnalysisFilters = () => {
  const [search, setSearch] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [model, setModel] = useState<string>("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleStateChange = (value: string) => {
    setState(value);
  };

  const handleModelChange = (value: string) => {
    setModel(value);
  };

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row">
        <Input
          type="search"
          placeholder="Buscar Análisis"
          value={search}
          onChange={handleSearchChange}
          className="lg:w-1/2"
        />
        <Select onValueChange={handleStateChange} value={state}>
          <SelectTrigger className="w-full lg:w-1/4">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="completed">Completado</SelectItem>
            <SelectItem value="in-progress">En Progreso</SelectItem>
            <SelectItem value="pending">Pendiente</SelectItem>
            <SelectItem value="failed">Fallido</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={handleModelChange} value={model}>
          <SelectTrigger className="w-full lg:w-1/4">
            <SelectValue placeholder="Todos los modelos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="robyn">Robyn</SelectItem>
            <SelectItem value="meridiam">Meridiam</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
