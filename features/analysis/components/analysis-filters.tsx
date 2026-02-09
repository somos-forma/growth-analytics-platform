import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type AnalysisFiltersProps = {
  search: string;
  setSearch: (value: string) => void;
  selectedState: string;
  setSelectedState: (value: string) => void;
  selectedModel: string;
  setSelectedModel: (value: string) => void;
};

export const AnalysisFilters = ({
  search,
  setSearch,
  selectedState,
  setSelectedState,
  selectedModel,
  setSelectedModel,
}: AnalysisFiltersProps) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleStateChange = (value: string) => {
    setSelectedState(value);
  };

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
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
        <Select onValueChange={handleStateChange} value={selectedState}>
          <SelectTrigger className="w-full lg:w-1/4">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="Completado">Completado</SelectItem>
            <SelectItem value="en espera">En espera</SelectItem>
            <SelectItem value="En ejecución">En ejecución</SelectItem>
            <SelectItem value="Error">Error</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={handleModelChange} value={selectedModel}>
          <SelectTrigger className="w-full lg:w-1/4">
            <SelectValue placeholder="Todos los modelos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los modelos</SelectItem>
            <SelectItem value="meridiam">Meridiam</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
